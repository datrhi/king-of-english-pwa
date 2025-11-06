import { RoomEvent, useEmitRoomEvent } from "@/hooks/useRoomEventSync";
import {
  currentQuestionIndexAtom,
  showWordDetailsAtom,
} from "@/stores/gameStore";
import { Question } from "@/types/game";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { ChevronRight, Volume2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";

interface WordDetailsProps {
  show: boolean;
  word: string;
  pronunciation?: string;
  translation: string;
  examples: string[];
  audioSrc?: string;
  isHost: boolean;
  onShowLeaderboard: () => void;
}

export function WordDetails({
  show,
  word,
  pronunciation,
  translation,
  examples,
  audioSrc,
  isHost,
  onShowLeaderboard,
}: WordDetailsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/40 rounded-t-3xl shadow-2xl border-t-2 border-white/60 z-50 max-h-[95vh] overflow-y-auto"
        >
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {word}
                </h3>
                {pronunciation && (
                  <p className="text-sm text-gray-700 mt-1 font-medium">
                    /{pronunciation}/
                  </p>
                )}
              </div>
              <button
                onClick={handlePlayAudio}
                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md ml-4 backdrop-blur-sm"
              >
                <Volume2 size={24} />
              </button>
            </div>

            {/* Translation */}
            <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-4 border border-white/40 shadow-lg">
              <p className="text-gray-700 font-medium">{translation}</p>
            </div>

            {/* Examples (max 2) */}
            {examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Examples
                </h4>
                {examples.slice(0, 2).map((example, idx) => (
                  <div
                    key={idx}
                    className="backdrop-blur-xl bg-indigo-100/40 rounded-xl p-3 border-l-4 border-indigo-500 shadow-md"
                  >
                    <p className="text-gray-700 text-sm italic">
                      &quot;{example}&quot;
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Next Button */}
            {isHost ? (
              <button
                onClick={onShowLeaderboard}
                className="w-full relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-white/40 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Show Leaderboard
                  <ChevronRight size={20} />
                </span>
              </button>
            ) : (
              <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-3 border border-white/40 shadow-lg text-center">
                <p className="text-gray-700 text-sm font-medium">
                  Waiting for host to show leaderboard...
                </p>
              </div>
            )}
          </div>

          {/* Hidden audio element */}
          {audioSrc && (
            <audio autoPlay ref={audioRef} src={audioSrc} preload="auto" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GameWordDetails({
  questions,
}: {
  questions: Question[] | null;
}) {
  const showWordDetails = useAtomValue(showWordDetailsAtom);
  const currentQuestionIndex = useAtomValue(currentQuestionIndexAtom);
  const { emitEvent } = useEmitRoomEvent();
  const isHost = useSearchParams().get("isHost") === "true";
  // Handle show leaderboard - host emits event, everyone reacts
  const handleShowLeaderboard = () => {
    emitEvent(RoomEvent.SHOW_LEADERBOARD);
  };

  const currentQuestion = questions?.[currentQuestionIndex];
  if (!currentQuestion) return null;
  return (
    <WordDetails
      show={showWordDetails}
      word={currentQuestion.answer}
      pronunciation={currentQuestion.pronunciation}
      translation={currentQuestion.description}
      examples={currentQuestion.examples}
      audioSrc={currentQuestion.titleVoice}
      isHost={isHost}
      onShowLeaderboard={handleShowLeaderboard}
    />
  );
}
