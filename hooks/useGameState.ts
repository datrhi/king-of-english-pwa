import { setThemeColor } from "@/utils/pwa";
import { useCallback, useState } from "react";

export interface UseGameStateReturn {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: Record<number, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  pointsEarned: number;
  setPointsEarned: (points: number) => void;
  showPointsAnimation: boolean;
  setShowPointsAnimation: (show: boolean) => void;
  showCorrectAnimation: boolean;
  setShowCorrectAnimation: (show: boolean) => void;
  showWrongAnimation: boolean;
  setShowWrongAnimation: (show: boolean) => void;
  showLeaderboard: boolean;
  setShowLeaderboard: (show: boolean) => void;
  showWordDetails: boolean;
  setShowWordDetails: (show: boolean) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  isGameOver: boolean;
  setIsGameOver: (gameOver: boolean) => void;
  handleShowCorrectAnimation: () => void;
  handleShowWrongAnimation: () => void;
  handleShowPointsAnimation: () => void;
  handleCorrectAnswer: (questionProgress: number) => void;
  handleWrongAnswer: () => void;
}

export function useGameState(): UseGameStateReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showWrongAnimation, setShowWrongAnimation] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleShowCorrectAnimation = useCallback(() => {
    setShowCorrectAnimation(true);
    setThemeColor("#22c55e");
    setTimeout(() => {
      setShowCorrectAnimation(false);
      setThemeColor();
    }, 2000);
    setTimeout(() => {
      setShowWordDetails(true);
    }, 800);
  }, []);

  const handleShowWrongAnimation = useCallback(() => {
    setShowWrongAnimation(true);
    setThemeColor("#ef4444");
    setTimeout(() => {
      setShowWrongAnimation(false);
      setThemeColor();
    }, 2000);
    setTimeout(() => {
      setShowWordDetails(true);
    }, 800);
  }, []);

  const handleShowPointsAnimation = useCallback(() => {
    setShowPointsAnimation(true);
    setTimeout(() => {
      setShowPointsAnimation(false);
    }, 2000);
  }, []);

  const handleCorrectAnswer = useCallback(
    (questionProgress: number) => {
      const earnedPoints = Math.round(questionProgress);
      setPointsEarned(earnedPoints);
      setScore((prev) => prev + earnedPoints);
      handleShowCorrectAnimation();
      handleShowPointsAnimation();
    },
    [handleShowCorrectAnimation, handleShowPointsAnimation]
  );

  const handleWrongAnswer = useCallback(() => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: "",
    }));
    handleShowWrongAnimation();
  }, [handleShowWrongAnimation]);

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswers,
    score,
    setScore,
    pointsEarned,
    setPointsEarned,
    showPointsAnimation,
    setShowPointsAnimation,
    showCorrectAnimation,
    setShowCorrectAnimation,
    showWrongAnimation,
    setShowWrongAnimation,
    showLeaderboard,
    setShowLeaderboard,
    showWordDetails,
    setShowWordDetails,
    isPaused,
    setIsPaused,
    isGameOver,
    setIsGameOver,
    handleShowCorrectAnimation,
    handleShowWrongAnimation,
    handleShowPointsAnimation,
    handleCorrectAnswer,
    handleWrongAnswer,
  };
}
