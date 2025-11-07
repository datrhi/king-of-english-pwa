import { useVisualViewport } from "@/hooks/useVisualViewport";
import { currentQuestionIndexAtom, scoreAtom } from "@/stores/gameStore";
import { Question } from "@/types/game";
import { useAtomValue } from "jotai";
import { Button } from "konsta/react";
import { Pause, Play, Settings } from "lucide-react";
import { useState } from "react";

interface GameHeaderProps {
  pin: string;
  score: number;
  currentQuestion: number;
  totalQuestions: number;
  isPaused: boolean;
  onPause: () => void;
  onSettings: () => void;
  isKeyboardOpen?: boolean;
}

export function GameHeader({
  pin,
  score,
  currentQuestion,
  totalQuestions,
  isPaused,
  onPause,
  onSettings,
  isKeyboardOpen = false,
}: GameHeaderProps) {
  return (
    <div
      className={`relative z-10 flex items-center justify-between bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-md transition-all duration-300 ${
        isKeyboardOpen ? "px-2 py-1.5" : "px-4 py-3"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-gray-800 font-bold transition-all duration-300 ${
            isKeyboardOpen ? "text-sm" : "text-base"
          }`}
        >
          PIN {pin}
        </span>
      </div>
      <div
        className={`flex items-center ${isKeyboardOpen ? "gap-1.5" : "gap-3"}`}
      >
        <div
          className={`backdrop-blur-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-white/40 transition-all duration-300 ${
            isKeyboardOpen ? "px-2 py-0.5" : "px-3 py-1.5"
          }`}
        >
          <span
            className={`text-indigo-700 font-bold transition-all duration-300 ${
              isKeyboardOpen ? "text-xs" : "text-sm"
            }`}
          >
            {score} pts
          </span>
        </div>
        <span
          className={`text-gray-800 font-bold transition-all duration-300 ${
            isKeyboardOpen ? "text-sm" : "text-base"
          }`}
        >
          {currentQuestion}/{totalQuestions}
        </span>
        <Button
          onClick={onPause}
          rounded
          clear
          className="text-gray-700"
          inline
          small
        >
          {isPaused ? (
            <Play size={isKeyboardOpen ? 16 : 20} />
          ) : (
            <Pause size={isKeyboardOpen ? 16 : 20} />
          )}
        </Button>
        <Button
          onClick={onSettings}
          rounded
          clear
          className="text-gray-700"
          inline
          small
        >
          <Settings size={isKeyboardOpen ? 16 : 20} />
        </Button>
      </div>
    </div>
  );
}

export function GameHeaderComponent({
  pin,
  questions,
  onSettings,
}: {
  pin: string;
  questions: Question[];
  onSettings: () => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const score = useAtomValue(scoreAtom);
  const currentQuestionIndex = useAtomValue(currentQuestionIndexAtom);
  const { isKeyboardOpen } = useVisualViewport();
  return (
    <div className="relative z-[45]">
      <GameHeader
        pin={pin}
        score={score}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        isPaused={isPaused}
        onPause={() => setIsPaused((prev) => !prev)}
        onSettings={onSettings}
        isKeyboardOpen={isKeyboardOpen}
      />
    </div>
  );
}
