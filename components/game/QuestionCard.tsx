import { RoomEvent, useEmitRoomEvent } from "@/hooks/useRoomEventSync";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { useDialog } from "@/providers/DialogProvider";
import {
  currentAnswerAtom,
  currentQuestionIndexAtom,
  handleCorrectAnswerAtom,
  handleWrongAnswerAtom,
  showCorrectAnimationAtom,
} from "@/stores/gameStore";
import { Question } from "@/types/game";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Check, Lightbulb } from "lucide-react";
import { TextDisplay } from "./TextDisplay";

interface QuestionCardProps {
  scrambled: string;
  image: string;
  description: string;
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  isCorrect: boolean;
  autoFocus?: boolean;
  isKeyboardOpen?: boolean;
  onShowHint: () => void;
  questionAnswer: string;
  shouldRun?: boolean;
}

export function QuestionCard({
  scrambled,
  image,
  description,
  answer,
  onAnswerChange,
  onSubmit,
  isCorrect,
  autoFocus = false,
  isKeyboardOpen = false,
  onShowHint,
  questionAnswer,
  shouldRun = false,
}: QuestionCardProps) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-start pt-2 ${isKeyboardOpen ? "space-y-1 sm:space-y-2" : "space-y-3 sm:space-y-5"
        }`}
    >
      {/* Title Card */}
      <div
        className={`backdrop-blur-xl bg-white/30 rounded-2xl px-4 sm:px-6 border border-white/40 shadow-lg w-full max-w-md mx-2 transition-all duration-300 ${isKeyboardOpen ? "py-2" : "py-3 sm:py-4"
          }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <h2
              className={`font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center break-words transition-all duration-300 ${isKeyboardOpen
                ? "text-xl sm:text-2xl"
                : "text-2xl sm:text-3xl md:text-4xl"
                }`}
            >
              {scrambled}
            </h2>
          </div>
          <button
            onClick={onShowHint}
            className="flex-shrink-0 p-2 rounded-full bg-yellow-400/80 hover:bg-yellow-500/80 transition-colors shadow-md"
            aria-label="Show hint"
          >
            <Lightbulb className={isKeyboardOpen ? "w-5 h-5" : "w-6 h-6"} />
          </button>
        </div>
      </div>

      {/* Input and Button */}
      <div className="flex gap-2 sm:gap-3 w-full max-w-md px-2 items-center">
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && answer.trim() && !isCorrect) {
              onSubmit();
            }
          }}
          placeholder={isKeyboardOpen ? "Try something" : "Type your answer..."}
          className={`flex-1 rounded-full backdrop-blur-xl bg-white/60 text-gray-800 border-2 border-white/60 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 font-medium shadow-md placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-0 transition-all duration-300 ${isKeyboardOpen
            ? "px-3 py-2 text-sm"
            : "px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base"
            }`}
          autoFocus={autoFocus}
          disabled={isCorrect}
        />
        <motion.button
          onClick={onSubmit}
          disabled={!answer.trim() || isCorrect}
          animate={{
            backgroundColor: isCorrect ? "#22c55e" : "#007aff",
            scale: isCorrect ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className={`rounded-full font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isKeyboardOpen
            ? "px-4 py-2 text-base min-w-[60px]"
            : "px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg min-w-[60px] sm:min-w-[80px]"
            }`}
        >
          {isCorrect ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Check
                size={isKeyboardOpen ? 18 : 20}
                className={isKeyboardOpen ? "" : "sm:w-6 sm:h-6"}
              />
            </motion.div>
          ) : (
            "Try"
          )}
        </motion.button>
      </div>

      {/* Scrambled Text Display */}
      <TextDisplay shouldRun={shouldRun} text={questionAnswer} isKeyboardOpen={isKeyboardOpen} />
    </div>
  );
}

export function GameQuestionCard({
  question,
  stopTimer,
  getCurrentProgress,
  index,
}: {
  question: Question;
  stopTimer: () => void;
  getCurrentProgress: () => number;
  index: number;
}) {
  const [currentAnswer, setCurrentAnswer] = useAtom(currentAnswerAtom);
  const currentQuestionIndex = useAtomValue(currentQuestionIndexAtom);
  const showCorrectAnimation = useAtomValue(showCorrectAnimationAtom);
  const handleCorrectAnswer = useSetAtom(handleCorrectAnswerAtom);
  const handleWrongAnswer = useSetAtom(handleWrongAnswerAtom);
  const { notifyAll } = useEmitRoomEvent();
  const { isKeyboardOpen } = useVisualViewport();
  const { showHint } = useDialog();

  const handleShowHint = () => {
    showHint({
      title: "Hint",
      content: `${question.description}\n ${getWordCount(question.answer) > 1
        ? `[${getWordCount(question.answer)} words]`
        : `[${getWordCount(question.answer)} word]`
        }`,
      image: question.image,
    });
  };

  const getWordCount = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(" ").length;
  };

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleTryAnswer = () => {
    const correctAnswer = question.answer;

    if (currentAnswer === correctAnswer) {
      const questionProgress = getCurrentProgress();
      const earnedPoints = Math.round(questionProgress);
      // for update the score in leaderboard
      notifyAll(RoomEvent.CORRECT_ANSWER, earnedPoints);
      // local handler
      handleCorrectAnswer(earnedPoints);
    } else {
      // for update the score in leaderboard
      notifyAll(RoomEvent.WRONG_ANSWER, currentAnswer);
      // local handler
      handleWrongAnswer();
    }
  };
  return (
    <QuestionCard
      onShowHint={handleShowHint}
      scrambled={question.scrambled}
      image={question.image}
      description={question.description}
      answer={currentAnswer}
      onAnswerChange={handleAnswerChange}
      onSubmit={handleTryAnswer}
      isCorrect={showCorrectAnimation}
      autoFocus={index === currentQuestionIndex}
      isKeyboardOpen={isKeyboardOpen}
      questionAnswer={question.answer}
      shouldRun={index === currentQuestionIndex}
    />
  );
}
