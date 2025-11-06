import {
  showCorrectAnimationAtom,
  showWrongAnimationAtom,
} from "@/stores/gameStore";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

export const ColorOverlay = () => {
  const showWrongAnimation = useAtomValue(showWrongAnimationAtom);
  const showCorrectAnimation = useAtomValue(showCorrectAnimationAtom);
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[1]"
      initial={{ opacity: 0 }}
      animate={{
        backgroundColor: showCorrectAnimation
          ? "#22c55e"
          : showWrongAnimation
          ? "#ef4444"
          : "transparent",
        opacity: showWrongAnimation || showCorrectAnimation ? 0.95 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    />
  );
};
