import { useLeaderboardTimer } from "@/hooks/useLeaderboardTimer";
import { useDialog } from "@/providers/DialogProvider";
import {
  currentQuestionIndexAtom,
  isGameOverAtom,
  scoreAtom,
  showLeaderboardAtom,
} from "@/stores/gameStore";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Crown, Medal, Trophy } from "lucide-react";
import { useMemo } from "react";

export interface LeaderboardPlayer {
  id: string;
  name: string;
  score: number;
  isCurrentUser: boolean;
}

interface LeaderboardProps {
  show: boolean;
  players: LeaderboardPlayer[];
  handleLeaderboardComplete: () => void;
}

const ProgressBar = function ProgressBar({
  handleLeaderboardComplete,
}: {
  handleLeaderboardComplete: () => void;
}) {
  const show = useAtomValue(showLeaderboardAtom);
  const { progress } = useLeaderboardTimer({
    isActive: show,
    duration: 5000,
    onComplete: handleLeaderboardComplete,
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="backdrop-blur-xl bg-white/30 rounded-full p-2 border border-white/40 shadow-lg">
        <div className="relative h-4 backdrop-blur-sm bg-white/40 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.05,
              ease: "linear",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="relative z-10 text-xs font-bold text-white drop-shadow-md">
              Next in {Math.ceil(progress / 20)}s
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LeaderboardList = function LeaderboardList({
  players,
}: {
  players: LeaderboardPlayer[];
}) {
  return (
    <div className="space-y-3">
      {players.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className={`flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl shadow-lg ${
            player.isCurrentUser
              ? "bg-gradient-to-r from-indigo-100/60 to-purple-100/60 border-2 border-indigo-400/60"
              : "bg-white/30 border border-white/40"
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
                <span className="text-gray-700 font-bold text-lg">
                  {index + 1}
                </span>
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1">
            <p
              className={`font-bold text-base ${
                player.isCurrentUser ? "text-indigo-700" : "text-gray-800"
              }`}
            >
              {player.name}
              {player.isCurrentUser && " 👤"}
            </p>
          </div>

          {/* Score */}
          <div
            className={`text-right font-bold text-xl ${
              player.isCurrentUser ? "text-indigo-700" : "text-gray-700"
            }`}
          >
            {player.score}
            <span className="text-sm ml-1 font-medium">pts</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export function Leaderboard({
  show,
  players,
  handleLeaderboardComplete,
}: LeaderboardProps) {
  return (
    <AnimatePresence>
      {show && (
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
                className="text-gray-700 text-sm font-medium mb-3"
              >
                Current Rankings
              </motion.p>

              {/* Progress Bar */}
              <ProgressBar
                handleLeaderboardComplete={handleLeaderboardComplete}
              />
            </div>

            {/* Leaderboard List - Memoized to prevent re-renders from progress updates */}
            <LeaderboardList players={players} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GameLeaderboard({
  questionsLength,
  nextSlide,
  onExit,
}: {
  questionsLength: number;
  nextSlide: () => void;
  onExit: () => void;
}) {
  const [show, setShowLeaderboard] = useAtom(showLeaderboardAtom);
  const score = useAtomValue(scoreAtom);
  const currentQuestionIndex = useAtomValue(currentQuestionIndexAtom);
  const setIsGameOver = useSetAtom(isGameOverAtom);
  const { showAlert } = useDialog();

  const handleLeaderboardComplete = () => {
    setShowLeaderboard(false);

    if (currentQuestionIndex < questionsLength - 1) {
      setTimeout(() => {
        nextSlide();
      }, 100);
    } else {
      setIsGameOver(true);
      setTimeout(() => {
        showAlert({
          content: `You scored ${score} points!`,
          title: "🎮 Game Over",
          onConfirm: onExit,
        });
      }, 300);
    }
  };

  const leaderboardData: LeaderboardPlayer[] = useMemo(() => {
    return [
      {
        id: "1",
        name: "You",
        score: score,
        isCurrentUser: true,
      },
      {
        id: "2",
        name: "Player 2",
        score: Math.max(0, Math.floor(score * 0.9)),
        isCurrentUser: false,
      },
      {
        id: "3",
        name: "Player 3",
        score: Math.max(0, Math.floor(score * 0.8)),
        isCurrentUser: false,
      },
      {
        id: "4",
        name: "Player 4",
        score: Math.max(0, Math.floor(score * 0.7)),
        isCurrentUser: false,
      },
    ].sort((a, b) => b.score - a.score);
  }, [score]);

  return (
    <Leaderboard
      show={show}
      players={leaderboardData}
      handleLeaderboardComplete={handleLeaderboardComplete}
    />
  );
}
