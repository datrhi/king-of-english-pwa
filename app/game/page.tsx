"use client";
import { GameHeader } from '@/components/game/GameHeader';
import { Leaderboard, type LeaderboardPlayer } from '@/components/game/Leaderboard';
import { PointsAnimation } from '@/components/game/PointsAnimation';
import { ProgressBar } from '@/components/game/ProgressBar';
import { QuestionCard } from '@/components/game/QuestionCard';
import { WordDetails } from '@/components/game/WordDetails';
import { useGameState } from '@/hooks/useGameState';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useLeaderboardTimer } from '@/hooks/useLeaderboardTimer';
import { useRandomWords } from '@/hooks/useWords';
import { useTransitionRouter } from '@/lib/next-view-transitions';
import { useDialog } from '@/providers/DialogProvider';
import { scrambleWord } from '@/utils/game';
import { setThemeColor } from '@/utils/pwa';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Card, Preloader } from 'konsta/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

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

    // Game state
    const gameState = useGameState();
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

    // Convert words to questions
    const questions: Question[] = useMemo(() => {
        return (
            words?.map((word) => ({
                id: word.id,
                image: word.photo,
                description: word.translation,
                answer: word.title.toLowerCase().trim(),
                scrambled: scrambleWord(word.title),
                titleVoice: word.titleVoice,
                pronunciation: word.pronunciation,
                examples: word.examples || [],
            })) || []
        );
    }, [words]);

    // Generate leaderboard data
    const leaderboardData: LeaderboardPlayer[] = useMemo(() => {
        return [
            { id: '1', name: 'You', score: gameState.score, isCurrentUser: true },
            {
                id: '2',
                name: 'Player 2',
                score: Math.max(0, Math.floor(gameState.score * 0.9)),
                isCurrentUser: false,
            },
            {
                id: '3',
                name: 'Player 3',
                score: Math.max(0, Math.floor(gameState.score * 0.8)),
                isCurrentUser: false,
            },
            {
                id: '4',
                name: 'Player 4',
                score: Math.max(0, Math.floor(gameState.score * 0.7)),
                isCurrentUser: false,
            },
        ].sort((a, b) => b.score - a.score);
    }, [gameState.score]);

    // Handle timeout callback
    const handleTimeOut = useCallback(() => {
        gameState.setShowWrongAnimation(true);
        setThemeColor('#ef4444');

        gameState.setAnswers((prev) => ({
            ...prev,
            [gameState.currentQuestionIndex]: '',
        }));

        setTimeout(() => {
            gameState.setShowWordDetails(true);
        }, 800);

        setTimeout(() => {
            gameState.setShowWrongAnimation(false);
            setThemeColor();
        }, 2000);
    }, [gameState]);

    // Game timer
    const { questionProgress, stopTimer } = useGameTimer({
        shouldRun:
            !gameState.showLeaderboard &&
            !gameState.showWordDetails &&
            !gameState.showCorrectAnimation &&
            !gameState.isGameOver &&
            questions.length > 0,
        onTimeOut: handleTimeOut,
    });

    // Leaderboard timer
    const handleLeaderboardComplete = useCallback(() => {
        gameState.setShowLeaderboard(false);
        gameState.setShowWordDetails(false);

        if (gameState.currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                swiperInstance?.slideNext();
            }, 100);
        } else {
            gameState.setIsGameOver(true);
            setTimeout(() => {
                showConfirm({
                    content: `You scored ${gameState.score} points! Would you like to play again?`,
                    title: '🎮 Game Over',
                    onConfirm: () => router.refresh(),
                    onCancel: () => router.reset('/?source=pwa'),
                    cancelText: 'Exit',
                    confirmText: 'Play Again',
                });
            }, 300);
        }
    }, [
        gameState,
        questions.length,
        swiperInstance,
        showConfirm,
        router,
    ]);

    const { progress: leaderboardProgress } = useLeaderboardTimer({
        isActive: gameState.showLeaderboard,
        duration: 5000,
        onComplete: handleLeaderboardComplete,
    });

    // Error handling
    useEffect(() => {
        if (error) {
            showAlert({
                content: 'Failed to load game questions. Please try again.',
                onConfirm: () => router.reset('/?source=pwa'),
                title: 'Error',
                disableBackdropClick: true,
            });
        }
    }, [error, showAlert, router]);

    // Handlers
    const handleAnswerChange = useCallback(
        (value: string) => {
            gameState.setAnswers((prev) => ({
                ...prev,
                [gameState.currentQuestionIndex]: value,
            }));
        },
        [gameState]
    );

    const handleTryAnswer = useCallback(() => {
        const currentAnswer =
            gameState.answers[gameState.currentQuestionIndex]?.toLowerCase().trim() || '';
        const correctAnswer = questions[gameState.currentQuestionIndex].answer;

        stopTimer();

        if (currentAnswer === correctAnswer) {
            gameState.handleCorrectAnswer(questionProgress);
        } else {
            gameState.handleWrongAnswer();
        }
    }, [gameState, questions, questionProgress, stopTimer]);

    const handleShowLeaderboard = useCallback(() => {
        gameState.setShowWordDetails(false);
        gameState.setShowLeaderboard(true);
    }, [gameState]);

    const handlePause = useCallback(() => {
        gameState.setIsPaused(!gameState.isPaused);
    }, [gameState]);

    const handleSettings = useCallback(() => {
        router.reset('/?source=pwa');
    }, [router]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Preloader className="mb-4" />
            </div>
        );
    }

    // No questions state
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

    const currentAnswer = gameState.answers[gameState.currentQuestionIndex] || '';
    const currentQuestion = questions[gameState.currentQuestionIndex];

    // Get word count for current question
    const getWordCount = (text: string): number => {
        const trimmed = text.trim();
        if (!trimmed) return 0;
        return trimmed.split(' ').length;
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Animated color overlay for correct/wrong feedback */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[1]"
                initial={{ opacity: 0 }}
                animate={{
                    backgroundColor: gameState.showWrongAnimation
                        ? '#ef4444'
                        : gameState.showCorrectAnimation
                            ? '#22c55e'
                            : 'transparent',
                    opacity: gameState.showWrongAnimation || gameState.showCorrectAnimation ? 0.95 : 0,
                }}
                transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                }}
            />

            {/* Backdrop overlay for leaderboard/word details */}
            <AnimatePresence>
                {(gameState.showLeaderboard || gameState.showWordDetails) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Points Animation */}
            <PointsAnimation show={gameState.showPointsAnimation} points={gameState.pointsEarned} />

            {/* Header */}
            <div className="relative z-[45]">
                <GameHeader
                    pin={pin}
                    score={gameState.score}
                    currentQuestion={gameState.currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    isPaused={gameState.isPaused}
                    onPause={handlePause}
                    onSettings={handleSettings}
                />
            </div>

            {/* Game Content */}
            <div
                className={`relative z-10 flex-1 flex flex-col items-center justify-start p-4 ${gameState.showLeaderboard || gameState.showWordDetails
                    ? 'pointer-events-none'
                    : ''
                    }`}
            >
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    onSwiper={setSwiperInstance}
                    onSlideChange={(swiper) => gameState.setCurrentQuestionIndex(swiper.activeIndex)}
                    allowTouchMove={false}
                    className="w-full h-full !overflow-visible"
                >
                    {questions.map((question, index) => (
                        <SwiperSlide key={question.id}>
                            <div className="flex flex-col items-center justify-start h-full">
                                <QuestionCard
                                    scrambled={question.scrambled}
                                    image={question.image}
                                    description={question.description}
                                    wordCount={getWordCount(question.answer)}
                                    answer={currentAnswer}
                                    onAnswerChange={handleAnswerChange}
                                    onSubmit={handleTryAnswer}
                                    isCorrect={gameState.showCorrectAnimation}
                                    autoFocus={index === gameState.currentQuestionIndex}
                                />

                                {/* Progress Bar */}
                                {!gameState.showLeaderboard && !gameState.showWordDetails && (
                                    <div className="mt-3 sm:mt-5 w-full flex justify-center items-center">
                                        <ProgressBar progress={questionProgress} />
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Leaderboard */}
            <Leaderboard
                show={gameState.showLeaderboard}
                players={leaderboardData}
                progress={leaderboardProgress}
            />

            {/* Word Details */}
            {currentQuestion && (
                <WordDetails
                    show={gameState.showWordDetails}
                    word={currentQuestion.answer}
                    pronunciation={currentQuestion.pronunciation}
                    translation={currentQuestion.description}
                    examples={currentQuestion.examples}
                    audioSrc={currentQuestion.titleVoice}
                    isHost={isHost}
                    onShowLeaderboard={handleShowLeaderboard}
                />
            )}
        </div>
    );
}

export default function GamePage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    <Preloader />
                </div>
            }
        >
            <GameContent />
        </Suspense>
    );
}
