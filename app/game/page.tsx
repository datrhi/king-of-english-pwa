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
import { Check, ChevronRight, Crown, Medal, Pause, Play, Settings, Trophy, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import { scrambleWord } from '@/utils/game';
import { setThemeColor } from '@/utils/pwa';
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
    const [showLeaderboard, setShowLeaderboard] = useState(false);
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

    // Mock leaderboard data - In real app, this would come from the server
    const leaderboardData = useMemo(() => {
        return [
            { id: '1', name: 'You', score: score + 1, isCurrentUser: true },
            { id: '2', name: 'Player 2', score: Math.max(0, score + 1 - Math.floor(Math.random() * 3)), isCurrentUser: false },
            { id: '3', name: 'Player 3', score: Math.max(0, score + 1 - Math.floor(Math.random() * 4)), isCurrentUser: false },
            { id: '4', name: 'Player 4', score: Math.max(0, score + 1 - Math.floor(Math.random() * 5)), isCurrentUser: false },
        ].sort((a, b) => b.score - a.score);
    }, [score]);

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
            setThemeColor('#22c55e');

            // Show leaderboard after a short delay
            setTimeout(() => {
                setShowLeaderboard(true);
            }, 800);

            setTimeout(() => {
                setShowCorrectAnimation(false);
                setThemeColor();
            }, 2000);
        } else {
            // Wrong answer - trigger red background animation
            setShowWrongAnimation(true);
            setThemeColor('#ef4444');

            // Clear the input after wrong answer
            setAnswers((prev) => ({
                ...prev,
                [currentQuestionIndex]: '',
            }));

            // Reset animation after 2 seconds for smoother fade back
            setTimeout(() => {
                setShowWrongAnimation(false);
                setThemeColor();
            }, 2000);
        }
    };

    // Auto-hide leaderboard after 5 seconds
    useEffect(() => {
        if (showLeaderboard) {
            const timer = setTimeout(() => {
                setShowLeaderboard(false);
                setShowWordDetails(true);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showLeaderboard]);

    const handleNextQuestion = () => {
        // Clear timer if manually triggered
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setShowWordDetails(false);
        setShowLeaderboard(false);

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
        <div className="h-screen flex flex-col overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Animated color overlay for correct/wrong feedback */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[1]"
                initial={{ opacity: 0 }}
                animate={{
                    backgroundColor: showWrongAnimation
                        ? '#ef4444' // red-500
                        : showCorrectAnimation
                            ? '#22c55e' // green-500
                            : 'transparent',
                    opacity: showWrongAnimation || showCorrectAnimation ? 0.95 : 0,
                }}
                transition={{
                    duration: 0.2,
                    ease: "easeOut",
                }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-md">
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
            <div className="relative z-10 flex-1 flex flex-col items-center justify-start p-4">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    onSwiper={setSwiperInstance}
                    onSlideChange={(swiper) => setCurrentQuestionIndex(swiper.activeIndex)}
                    allowTouchMove={false}
                    className="w-full h-full !overflow-visible"
                >
                    {questions.map((question, index) => (
                        <SwiperSlide key={question.id}>
                            <div className="flex flex-col items-center justify-start h-full space-y-3 sm:space-y-5 pt-2">
                                {/* Title Card */}
                                <div className="backdrop-blur-xl bg-white/30 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-white/40 shadow-lg w-full max-w-md mx-2">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center break-words">
                                        {question.scrambled}
                                    </h2>
                                </div>

                                {/* Input and Button */}
                                <div className="flex gap-2 sm:gap-3 w-full max-w-md px-2 items-center">
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
                                        className="flex-1 px-3 sm:px-5 py-2.5 sm:py-3 rounded-full backdrop-blur-xl bg-white/60 text-gray-800 border-2 border-white/60 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 text-sm sm:text-base font-medium shadow-md placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
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
                                        className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-base sm:text-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px] sm:min-w-[80px] flex-shrink-0"
                                    >
                                        {showCorrectAnimation ? (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                            >
                                                <Check size={20} className="sm:w-6 sm:h-6" />
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

            {/* Leaderboard Screen */}
            <AnimatePresence>
                {showLeaderboard && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/40 rounded-t-3xl shadow-2xl border-t-2 border-white/60 z-50 max-h-[95vh] overflow-y-auto"
                    >
                        <div className="p-6 space-y-4">
                            {/* Header */}
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.1, type: "spring", damping: 15 }}
                                    className="flex justify-center mb-3"
                                >
                                    <Trophy className="text-yellow-500" size={48} />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                                >
                                    Leaderboard
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-700 text-sm font-medium"
                                >
                                    Current Rankings
                                </motion.p>
                            </div>

                            {/* Leaderboard List */}
                            <div className="space-y-3">
                                {leaderboardData.map((player, index) => (
                                    <motion.div
                                        key={player.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className={`flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl shadow-lg ${player.isCurrentUser
                                            ? 'bg-gradient-to-r from-indigo-100/60 to-purple-100/60 border-2 border-indigo-400/60'
                                            : 'bg-white/30 border border-white/40'
                                            }`}
                                    >
                                        {/* Rank Badge */}
                                        <div className="flex-shrink-0">
                                            {index === 0 ? (
                                                <motion.div
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ delay: 0.7, duration: 0.5 }}
                                                    className="w-12 h-12 backdrop-blur-xl bg-gradient-to-br from-yellow-400/80 to-yellow-600/80 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300/40"
                                                >
                                                    <Crown className="text-white" size={24} />
                                                </motion.div>
                                            ) : index === 1 ? (
                                                <div className="w-12 h-12 backdrop-blur-xl bg-gradient-to-br from-gray-300/80 to-gray-500/80 rounded-full flex items-center justify-center shadow-md border-2 border-gray-200/40">
                                                    <Medal className="text-white" size={24} />
                                                </div>
                                            ) : index === 2 ? (
                                                <div className="w-12 h-12 backdrop-blur-xl bg-gradient-to-br from-orange-400/80 to-orange-600/80 rounded-full flex items-center justify-center shadow-md border-2 border-orange-300/40">
                                                    <Medal className="text-white" size={24} />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 backdrop-blur-xl bg-white/50 rounded-full flex items-center justify-center shadow-sm border-2 border-white/40">
                                                    <span className="text-gray-700 font-bold text-lg">{index + 1}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Player Info */}
                                        <div className="flex-1">
                                            <p className={`font-bold text-base ${player.isCurrentUser ? 'text-indigo-700' : 'text-gray-800'
                                                }`}>
                                                {player.name}
                                                {player.isCurrentUser && ' 👤'}
                                            </p>
                                        </div>

                                        {/* Score */}
                                        <div className={`text-right font-bold text-xl ${player.isCurrentUser ? 'text-indigo-700' : 'text-gray-700'
                                            }`}>
                                            {player.score}
                                            <span className="text-sm ml-1 font-medium">pts</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Word Details Slider */}
            <AnimatePresence>
                {showWordDetails && questions[currentQuestionIndex] && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/40 rounded-t-3xl shadow-2xl border-t-2 border-white/60 z-50 max-h-[95vh] overflow-y-auto"
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
        </div >
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

