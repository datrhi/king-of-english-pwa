import { pointsEarnedAtom, showPointsAnimationAtom } from "@/stores/gameStore";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";

interface PointsAnimationProps {
  show: boolean;
  points: number;
}

export function PointsAnimation({ show, points }: PointsAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl px-8 py-6 border-4 border-white/60 shadow-2xl">
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, type: "spring", damping: 10 }}
              className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-500 bg-clip-text text-transparent text-center"
            >
              +{points}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center text-white font-bold text-lg mt-2 drop-shadow-lg"
            >
              Points!
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GamePointsAnimation() {
  const showPointsAnimation = useAtomValue(showPointsAnimationAtom);
  const pointsEarned = useAtomValue(pointsEarnedAtom);
  return <PointsAnimation show={showPointsAnimation} points={pointsEarned} />;
}
