import { showLeaderboardAtom, showWordDetailsAtom } from "@/stores/gameStore";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";

export const Backdrop = () => {
  const showLeaderboard = useAtomValue(showLeaderboardAtom);
  const showWordDetails = useAtomValue(showWordDetailsAtom);
  return (
    <AnimatePresence>
      {(showLeaderboard || showWordDetails) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        />
      )}
    </AnimatePresence>
  );
};
