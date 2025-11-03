"use client";
import { useRandomWords } from '@/hooks/useWords';
import { useTransitionRouter } from '@/lib/next-view-transitions';
import { useDialog } from '@/providers/DialogProvider';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Button,
    Card,
    Preloader
} from 'konsta/react';
import { Check, ChevronRight, Pause, Play, Settings, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import { scrambleWord } from '@/utils/game';
import 'swiper/css';

interface Question {
    id: string;
    image: string;
    description: string;
    answer: string;
    scrambled: string;
    titleVoice: string;
    pronunciation: string;
    examples: string[];
}

function GameContent() {
    const router = useTransitionRouter();
    const searchParams = useSearchParams();
    const { showAlert, showConfirm } = useDialog();

    // Get params from URL
    const pin = searchParams.get('pin') || '000000';
    const exerciseId = searchParams.get('exerciseId') || '';
    const exerciseName = searchParams.get('exerciseName') || 'Unknown Exercise';
    const isHost = searchParams.get('isHost') === 'true';

    // Fetch random words
    const { data: words, isLoading, error } = useRandomWords(exerciseId, 10);

    // State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [showWrongAnimation, setShowWrongAnimation] = useState(false);
    const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
    const [showWordDetails, setShowWordDetails] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(10);
    const audioRef = useRef<HTMLAudioElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Convert words to questions
    const questions: Question[] = useMemo(() => {
        return words?.map((word) => ({
            id: word.id,
            image: word.photo,
            description: word.translation,
            answer: word.title.toLowerCase().trim(),
            scrambled: scrambleWord(word.title),
            titleVoice: word.titleVoice,
            pronunciation: word.pronunciation,
            examples: word.examples || [],
        })) || [];
    }, [words]);

    useEffect(() => {
        if (error) {
            showAlert({
                content: 'Failed to load game questions. Please try again.',
                onConfirm: () => router.reset('/?source=pwa'),
                title: 'Error',
                disableBackdropClick: true,
            });
        }
    }, [error]);

    // Auto-trigger timer for next question
    useEffect(() => {
        if (showWordDetails) {
            setTimeRemaining(10);

            // Start countdown
            const interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        // Auto-trigger next question when timer reaches 0
                        handleNextQuestion();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            timerRef.current = interval;

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [showWordDetails]);

    const handleAnswerChange = (value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: value,
        }));
    };

    const handleTryAnswer = () => {
        const currentAnswer = answers[currentQuestionIndex]?.toLowerCase().trim() || '';
        const correctAnswer = questions[currentQuestionIndex].answer;

        if (currentAnswer === correctAnswer) {
            // Correct answer - trigger green background animation
            setScore((prev) => prev + 1);
            setShowCorrectAnimation(true);

            // Show word details slider after a short delay
            setTimeout(() => {
                setShowWordDetails(true);
                // Auto-play the audio
                if (audioRef.current) {
                    audioRef.current.play().catch(err => console.log('Audio play failed:', err));
                }
            }, 500);
        } else {
            // Wrong answer - trigger red background animation
            setShowWrongAnimation(true);

            // Clear the input after wrong answer
            setAnswers((prev) => ({
                ...prev,
                [currentQuestionIndex]: '',
            }));

            // Reset animation after 2 seconds for smoother fade back
            setTimeout(() => {
                setShowWrongAnimation(false);
            }, 2000);
        }
    };

    const handleNextQuestion = () => {
        // Clear timer if manually triggered
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setShowWordDetails(false);
        setShowCorrectAnimation(false);

        if (currentQuestionIndex < questions.length - 1) {
            // Move to next question
            swiperInstance?.slideNext();
        } else {
            // Game finished
            handleGameFinish();
        }
    };

    const handleGameFinish = () => {
        showConfirm({
            content: `You scored ${score + 1} out of ${questions.length}! Would you like to play again?`,
            title: '🎮 Game Over',
            onConfirm: () => {
                // Restart game
                router.refresh();
            },
            onCancel: () => {
                // Go back to lobby
                router.reset('/?source=pwa');
            },
            cancelText: 'Exit',
            confirmText: 'Play Again',
        });
    };

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Preloader className="mb-4" />
            </div>
        );
    }

    if (!words || questions.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Card className="p-6 text-center backdrop-blur-xl bg-white/30 border border-white/40 shadow-xl">
                    <p className="text-lg mb-4 text-gray-700 font-medium">No questions available</p>
                    <Button onClick={() => router.reset('/?source=pwa')}>Go Back</Button>
                </Card>
            </div>
        );
    }

    const currentAnswer = answers[currentQuestionIndex] || '';

    // Get word count for current question
    const getWordCount = (text: string): number => {
        const trimmed = text.trim();
        if (!trimmed) return 0;
        return trimmed.split(' ').length;
    };

    const currentWordCount = getWordCount(questions[currentQuestionIndex].answer);
    const wordCountText = currentWordCount === 1 ? '1 word' : `${currentWordCount} words`;

    return (
        <motion.div
            className="h-screen flex flex-col overflow-hidden"
            animate={{
                backgroundColor: showWrongAnimation
                    ? '#ef4444' // red-500
                    : showCorrectAnimation
                        ? '#22c55e' // green-500
                        : '#f0f9ff', // closest solid color to gradient
                scale: showWrongAnimation || showCorrectAnimation ? 1.02 : 1,
            }}
            transition={{
                backgroundColor: {
                    duration: showWrongAnimation || showCorrectAnimation ? 0.2 : 1.5,
                    ease: showWrongAnimation || showCorrectAnimation ? "easeOut" : "easeInOut",
                },
                scale: {
                    duration: 0.3,
                    ease: "easeOut",
                }
            }}
            style={{
                background: !showWrongAnimation && !showCorrectAnimation
                    ? 'linear-gradient(to bottom right, #dbeafe, #e0e7ff, #f3e8ff)'
                    : undefined
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-md">
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-bold text-base">PIN {pin}</span>
                    {/* <span className="text-gray-600 text-sm">👥 0 (1)</span> */}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-gray-800 font-bold text-base">
                        {currentQuestionIndex + 1}/{questions.length}
                    </span>
                    <Button
                        onClick={handlePause}
                        rounded
                        clear
                        className="text-gray-700"
                        inline
                        small
                    >
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                    </Button>
                    <Button
                        onClick={() => router.reset('/?source=pwa')}
                        rounded
                        clear
                        className="text-gray-700"
                        inline
                        small
                    >
                        <Settings size={20} />
                    </Button>
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-hidden">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    onSwiper={setSwiperInstance}
                    onSlideChange={(swiper) => setCurrentQuestionIndex(swiper.activeIndex)}
                    allowTouchMove={false}
                    className="w-full h-full"
                >
                    {questions.map((question, index) => (
                        <SwiperSlide key={question.id}>
                            <div className="flex flex-col items-center justify-start h-full space-y-5 pt-2">
                                {/* Title Card */}
                                <div className="backdrop-blur-xl bg-white/30 rounded-2xl px-6 py-4 border border-white/40 shadow-lg">
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {question.scrambled}
                                    </h2>
                                </div>

                                {/* Input and Button */}
                                <div className="flex gap-3 w-full max-w-md px-2 items-center">
                                    <input
                                        type="text"
                                        value={currentAnswer}
                                        onChange={(e) => handleAnswerChange(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && currentAnswer.trim() && !showCorrectAnimation) {
                                                handleTryAnswer();
                                            }
                                        }}
                                        placeholder="Type your answer..."
                                        className="flex-1 px-5 py-3 rounded-full backdrop-blur-xl bg-white/60 text-gray-800 border-2 border-white/60 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 text-base font-medium shadow-md placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        autoFocus={index === currentQuestionIndex}
                                        disabled={showCorrectAnimation}
                                    />
                                    <motion.button
                                        onClick={handleTryAnswer}
                                        disabled={!currentAnswer.trim() || showCorrectAnimation}
                                        animate={{
                                            backgroundColor: showCorrectAnimation ? '#22c55e' : '#007aff',
                                            scale: showCorrectAnimation ? 1.1 : 1,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut"
                                        }}
                                        className="px-6 py-3 rounded-full font-bold text-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                                    >
                                        {showCorrectAnimation ? (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                            >
                                                <Check size={24} />
                                            </motion.div>
                                        ) : (
                                            'Try'
                                        )}
                                    </motion.button>
                                </div>

                                {/* Image */}
                                <div className="w-full max-w-md px-2">
                                    <div className="relative w-full aspect-square backdrop-blur-xl bg-white/40 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60">
                                        {question.image ? (
                                            <Image
                                                src={question.image}
                                                alt="Question"
                                                fill
                                                className="object-contain"
                                                priority={index === currentQuestionIndex}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <p className="text-gray-600 text-lg font-medium">No image available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description hint (below image) */}
                                <div className="w-full max-w-md px-2 space-y-3">

                                    {/* Translation hint */}
                                    {question.description && (
                                        <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-4 border border-white/40 shadow-lg">
                                            <p className="text-gray-700 text-sm text-center font-medium">
                                                💡 Hint: {question.description}
                                            </p>
                                            <p className="text-gray-700 text-sm text-center font-bold">
                                                {wordCountText}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Word Details Slider */}
            <AnimatePresence>
                {showWordDetails && questions[currentQuestionIndex] && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/40 rounded-t-3xl shadow-2xl border-t-2 border-white/60 z-50 max-h-[60vh] overflow-y-auto"
                    >
                        <div className="p-6 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {questions[currentQuestionIndex].answer}
                                    </h3>
                                    {questions[currentQuestionIndex].pronunciation && (
                                        <p className="text-sm text-gray-700 mt-1 font-medium">
                                            /{questions[currentQuestionIndex].pronunciation}/
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        if (audioRef.current) {
                                            audioRef.current.currentTime = 0;
                                            audioRef.current.play().catch(err => console.log('Audio play failed:', err));
                                        }
                                    }}
                                    className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md ml-4 backdrop-blur-sm"
                                >
                                    <Volume2 size={24} />
                                </button>
                            </div>

                            {/* Translation */}
                            <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-4 border border-white/40 shadow-lg">
                                <p className="text-gray-700 font-medium">
                                    {questions[currentQuestionIndex].description}
                                </p>
                            </div>

                            {/* Examples (max 2) */}
                            {questions[currentQuestionIndex].examples.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Examples</h4>
                                    {questions[currentQuestionIndex].examples.slice(0, 2).map((example, idx) => (
                                        <div key={idx} className="backdrop-blur-xl bg-indigo-100/40 rounded-xl p-3 border-l-4 border-indigo-500 shadow-md">
                                            <p className="text-gray-700 text-sm italic">"{example}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}


                            {/* Next Button - Only for Host */}
                            {isHost ? (
                                <button
                                    onClick={handleNextQuestion}
                                    className="w-full relative overflow-hidden backdrop-blur-xl bg-white/20 border-2 border-white/40 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl"
                                >
                                    {/* Animated wave fill - fills from left to right */}
                                    <motion.div
                                        key={`wave-${currentQuestionIndex}-${showWordDetails}`}
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{
                                            duration: 10,
                                            ease: 'linear',
                                            repeat: 0,
                                        }}
                                    />

                                    {/* Button content */}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Game'}
                                        <ChevronRight size={20} />
                                    </span>
                                </button>
                            ) : (

                                <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-3 border border-white/40 shadow-lg text-center">
                                    <p className="text-gray-700 text-sm font-medium">
                                        Waiting for host to move to next question...
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Hidden audio element */}
                        {questions[currentQuestionIndex].titleVoice && (
                            <audio
                                autoPlay
                                ref={audioRef}
                                src={questions[currentQuestionIndex].titleVoice}
                                preload="auto"
                            />
                        )}
                    </motion.div>
                )
                }
            </AnimatePresence >
        </motion.div >
    );
}

export default function GamePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Preloader />
            </div>
        }>
            <GameContent />
        </Suspense>
    );
}

