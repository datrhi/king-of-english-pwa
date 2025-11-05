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
}: QuestionCardProps) {
  const wordCountText = wordCount === 1 ? "1 word" : `${wordCount} words`;

  return (
    <div className="flex flex-col items-center justify-start h-full space-y-3 sm:space-y-5 pt-2">
      {/* Title Card */}
      <div className="backdrop-blur-xl bg-white/30 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-white/40 shadow-lg w-full max-w-md mx-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center break-words">
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
          placeholder="Type your answer..."
          className="flex-1 px-3 sm:px-5 py-2.5 sm:py-3 rounded-full backdrop-blur-xl bg-white/60 text-gray-800 border-2 border-white/60 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 text-sm sm:text-base font-medium shadow-md placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
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
          className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-base sm:text-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px] sm:min-w-[80px] flex-shrink-0"
        >
          {isCorrect ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Check size={20} className="sm:w-6 sm:h-6" />
            </motion.div>
          ) : (
            "Try"
          )}
        </motion.button>
      </div>

      {/* Image */}
      <div className="w-full max-w-md px-2">
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
              <p className="text-gray-600 text-lg font-medium">
                No image available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Description hint */}
      <div className="w-full max-w-md px-2 space-y-3">
        {description && (
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-4 border border-white/40 shadow-lg">
            <p className="text-gray-700 text-sm text-center font-medium">
              💡 Hint: {description}
            </p>
            <p className="text-gray-700 text-sm text-center font-bold">
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
    const questionProgress = getCurrentProgress();

    stopTimer();

    if (currentAnswer === correctAnswer) {
      handleCorrectAnswer(questionProgress);
    } else {
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
    />
  );
}
