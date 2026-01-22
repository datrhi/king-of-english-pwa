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
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { useEffect } from "react";
import { ScrambleInput } from "./ScrambleInput";

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
  // onShowHint: () => void;
  questionAnswer: string;
  shouldRun?: boolean;
  wordCountText: number;
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
  // onShowHint,
  questionAnswer,
  shouldRun = false,
  wordCountText,
}: QuestionCardProps) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-start pt-2 ${isKeyboardOpen ? "space-y-1 sm:space-y-2" : "space-y-3 sm:space-y-5"
        }`}
    >
      {/* Scramble Input Component */}
      <ScrambleInput
        scrambled={scrambled}
        answer={answer}
        onAnswerChange={onAnswerChange}
        onSubmit={onSubmit}
        isCorrect={isCorrect}
        isKeyboardOpen={isKeyboardOpen}
      />
      {/* Image */}
      <div
        className={`w-full px-2 transition-all duration-300 ${isKeyboardOpen ? "max-w-[200px] sm:max-w-[250px]" : "max-w-md"
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
                className={`text-gray-600 font-medium ${isKeyboardOpen ? "text-sm" : "text-lg"
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
            className={`backdrop-blur-xl bg-white/30 rounded-2xl border border-white/40 shadow-lg transition-all duration-300 ${isKeyboardOpen ? "p-2" : "p-4"
              }`}
          >
            <p
              className={`text-gray-700 text-center font-medium transition-all duration-300 ${isKeyboardOpen ? "text-xs" : "text-sm"
                }`}
            >
              💡 Hint: {description}
            </p>
            <p
              className={`text-gray-700 text-center font-bold transition-all duration-300 ${isKeyboardOpen ? "text-xs" : "text-sm"
                }`}
            >
              {wordCountText > 1
                ? `${wordCountText} words`
                : `${wordCountText} word`}
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

  useEffect(() => {
    if (
      currentAnswer.length === question.answer.length &&
      index === currentQuestionIndex
    ) {
      handleTryAnswer();
    }
  }, [currentAnswer, index, currentQuestionIndex]);

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

    if (currentAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
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
      // onShowHint={handleShowHint}
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
      wordCountText={getWordCount(question.answer)}
    />
  );
}
