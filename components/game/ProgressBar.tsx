import { useGameTimer } from "@/hooks/useGameTimer";
import { RoomEvent, useEmitRoomEvent } from "@/hooks/useRoomEventSync";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import {
  correctCountAtom,
  currentQuestionIndexAtom,
  isGameOverAtom,
  showLeaderboardAtom,
  showWordDetailsAtom,
  usersAtom,
} from "@/stores/gameStore";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { forwardRef, useEffect, useImperativeHandle } from "react";

interface ProgressBarProps {
  progress: number; // 0-1000
  isKeyboardOpen?: boolean;
}

export function ProgressBar({
  progress,
  isKeyboardOpen = false,
}: ProgressBarProps) {
  return (
    <div
      className={`w-full px-2 transition-all duration-300 ${
        isKeyboardOpen ? "max-w-[250px]" : "max-w-md"
      }`}
    >
      <div
        className={`backdrop-blur-xl bg-white/30 rounded-full border border-white/40 shadow-lg transition-all duration-300 ${
          isKeyboardOpen ? "p-1" : "p-2"
        }`}
      >
        <div
          className={`relative backdrop-blur-sm bg-white/40 rounded-full overflow-hidden transition-all duration-300 ${
            isKeyboardOpen ? "h-4" : "h-6"
          }`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full"
            animate={{
              width: `${(progress / 1000) * 100}%`,
              backgroundColor:
                progress > 500
                  ? "#22c55e"
                  : progress > 250
                  ? "#f59e0b"
                  : "#ef4444",
            }}
            transition={{
              duration: 0.1,
              ease: "linear",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`relative z-10 font-bold text-white drop-shadow-md transition-all duration-300 ${
                isKeyboardOpen ? "text-[10px]" : "text-xs"
              }`}
            >
              {Math.round(progress)} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GameProgressBarProps {
  index: number;
}
export interface GameProgressBarRef {
  stopTimer: () => void;
  getCurrentProgress: () => number;
}
export const GameProgressBar = forwardRef<
  GameProgressBarRef,
  GameProgressBarProps
>(({ index }, ref) => {
  const showLeaderboard = useAtomValue(showLeaderboardAtom);
  const showWordDetails = useAtomValue(showWordDetailsAtom);
  const currentQuestionIndex = useAtomValue(currentQuestionIndexAtom);
  const isGameOver = useAtomValue(isGameOverAtom);
  const correctCount = useAtomValue(correctCountAtom);
  const users = useAtomValue(usersAtom);
  const { emitEvent } = useEmitRoomEvent();
  const { isKeyboardOpen } = useVisualViewport();
  const isCurrentQuestion = index === currentQuestionIndex;

  const handleTimeOut = () => {
    emitEvent(RoomEvent.SHOW_WORD_DETAILS);
  };

  const {
    questionProgress: progress,
    stopTimer,
    questionProgressRef,
  } = useGameTimer({
    shouldRun:
      !showLeaderboard && !showWordDetails && !isGameOver && isCurrentQuestion,
    onTimeOut: handleTimeOut,
  });

  useImperativeHandle(ref, () => ({
    stopTimer,
    getCurrentProgress: () => {
      return questionProgressRef.current;
    },
  }));

  useEffect(() => {
    if (correctCount === users.length) {
      stopTimer();
      handleTimeOut();
    }
  }, [users, correctCount]);

  return (
    !showLeaderboard &&
    !showWordDetails && (
      <div
        className={`w-full flex justify-center items-center transition-all duration-300 ${
          isKeyboardOpen ? "mt-1 sm:mt-2" : "mt-3 sm:mt-5"
        }`}
      >
        <ProgressBar progress={progress} isKeyboardOpen={isKeyboardOpen} />
      </div>
    )
  );
});
