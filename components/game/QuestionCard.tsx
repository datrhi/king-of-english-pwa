import { RoomEvent, useEmitRoomEvent } from "@/hooks/useRoomEventSync";
import { useVisualViewport } from "@/hooks/useVisualViewport";
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
import { Check } from "lucide-react";
import Image from "next/image";

interface QuestionCardProps {
  scrambled: string;
  image: string;
  description: string;
  wordCount: number;
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  isCorrect: boolean;
  autoFocus?: boolean;
  isKeyboardOpen?: boolean;
}

export function QuestionCard({
  scrambled,
  image,
  description,
  wordCount,
  answer,
  onAnswerChange,
  onSubmit,
  isCorrect,
  autoFocus = false,
  isKeyboardOpen = false,
}: QuestionCardProps) {
  const wordCountText = wordCount === 1 ? "1 word" : `${wordCount} words`;

  return (
    <div
      className={`flex flex-col items-center justify-start h-full pt-2 ${
        isKeyboardOpen ? "space-y-1 sm:space-y-2" : "space-y-3 sm:space-y-5"
      }`}
    >
      {/* Title Card */}
      <div
        className={`backdrop-blur-xl bg-white/30 rounded-2xl px-4 sm:px-6 border border-white/40 shadow-lg w-full max-w-md mx-2 transition-all duration-300 ${
          isKeyboardOpen ? "py-2" : "py-3 sm:py-4"
        }`}
      >
        <h2
          className={`font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center break-words transition-all duration-300 ${
            isKeyboardOpen
              ? "text-xl sm:text-2xl"
              : "text-2xl sm:text-3xl md:text-4xl"
          }`}
        >
          {scrambled}
        </h2>
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
          className={`flex-1 rounded-full backdrop-blur-xl bg-white/60 text-gray-800 border-2 border-white/60 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 font-medium shadow-md placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-0 transition-all duration-300 ${
            isKeyboardOpen
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
          className={`rounded-full font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isKeyboardOpen
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

      {/* Image */}
      <div
        className={`w-full px-2 transition-all duration-300 ${
          isKeyboardOpen ? "max-w-[200px] sm:max-w-[250px]" : "max-w-md"
        }`}
      >
        <div className="relative w-full aspect-square backdrop-blur-xl bg-white/40 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60">
          {image ? (
            <Image
              src={image}
              alt="Question"
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p
                className={`text-gray-600 font-medium ${
                  isKeyboardOpen ? "text-sm" : "text-lg"
                }`}
              >
                No image available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Description hint */}
      <div className="w-full max-w-md px-2 space-y-3">
        {description && (
          <div
            className={`backdrop-blur-xl bg-white/30 rounded-2xl border border-white/40 shadow-lg transition-all duration-300 ${
              isKeyboardOpen ? "p-2" : "p-4"
            }`}
          >
            <p
              className={`text-gray-700 text-center font-medium transition-all duration-300 ${
                isKeyboardOpen ? "text-xs" : "text-sm"
              }`}
            >
              💡 Hint: {description}
            </p>
            <p
              className={`text-gray-700 text-center font-bold transition-all duration-300 ${
                isKeyboardOpen ? "text-xs" : "text-sm"
              }`}
            >
              {wordCountText}
            </p>
          </div>
        )}
      </div>
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
      scrambled={question.scrambled}
      image={question.image}
      description={question.description}
      wordCount={getWordCount(question.answer)}
      answer={currentAnswer}
      onAnswerChange={handleAnswerChange}
      onSubmit={handleTryAnswer}
      isCorrect={showCorrectAnimation}
      autoFocus={index === currentQuestionIndex}
      isKeyboardOpen={isKeyboardOpen}
    />
  );
}
