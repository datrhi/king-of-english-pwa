"use client";
import {
  Backdrop,
  ColorOverlay,
  GameContent,
  GameContentRef,
  GameHeaderComponent,
  GameLeaderboard,
  GamePointsAnimation,
  GameWordDetails,
} from "@/components/game";
import { useRoomConnection } from "@/hooks/useRoomConnection";
import {
  RoomEvent,
  useEmitRoomEvent,
  useRoomEventSync,
} from "@/hooks/useRoomEventSync";
import { useRoomUsers } from "@/hooks/useRoomUsers";
import { useRandomWords } from "@/hooks/useWords";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import { useDialog } from "@/providers/DialogProvider";
import { Word } from "@/services/wordsApi";
import {
  handleScoreUpdateAtom,
  showLeaderboardActionAtom,
  showLeaderboardAtom,
  showWordDetailsAtom,
} from "@/stores/gameStore";
import { scrambleWord } from "@/utils/game";
import { useSetAtom } from "jotai";
import { Button, Card, Preloader } from "konsta/react";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "swiper/css";

interface Question {
  id: string;
  image: string;
  description: string;
  answer: string;
  scrambled: string;
  titleVoice: string;
  pronunciation: string;
  examples: string[];
}

function Game() {
  const router = useTransitionRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useDialog();
  const gameContentRef = useRef<GameContentRef>(null);

  // Get params from URL
  const pin = searchParams.get("pin") || "000000";
  const exerciseId = searchParams.get("exerciseId") || "";
  const exerciseName = searchParams.get("exerciseName") || "Unknown Exercise";
  const isHost = searchParams.get("isHost") === "true";

  // State for synchronized words - received via room events
  const [syncedWords, setSyncedWords] = useState<Word[] | null>(null);
  const [wordsReceived, setWordsReceived] = useState(false);

  const handleScoreUpdate = useSetAtom(handleScoreUpdateAtom);
  const setShowWordDetails = useSetAtom(showWordDetailsAtom);
  const handleShowLeaderboard = useSetAtom(showLeaderboardActionAtom);
  const setShowLeaderboard = useSetAtom(showLeaderboardAtom);

  // Only host fetches random words
  const { data: hostWords } = useRandomWords(exerciseId, 10);

  // Manage WebSocket connection lifecycle (persist when navigating within game flow)
  useRoomConnection({
    pin,
    persistOnNavigation: true,
  });

  // Room event handler - all users (including host) react to events the same way
  const handleRoomEvent = (eventData: {
    action: string;
    data: unknown;
    socketId: string;
  }) => {
    switch (eventData.action) {
      case RoomEvent.DISTRIBUTE_WORDS: {
        // All users (including host) receive the words
        const words = eventData.data as Word[];
        setSyncedWords(words);
        setWordsReceived(true);
        break;
      }
      case RoomEvent.CORRECT_ANSWER: {
        const score = eventData.data as number;
        const socketId = eventData.socketId as string;
        handleScoreUpdate(socketId, score);
        break;
      }
      case RoomEvent.WRONG_ANSWER: {
        // Trigger wrong answer display for everyone
        const socketId = eventData.socketId as string;
        const answer = eventData.data as string;
        console.log(`[Game] User ${socketId} answered ${answer} incorrectly`);
        break;
      }
      case RoomEvent.SHOW_WORD_DETAILS: {
        setShowWordDetails(true);
        break;
      }
      case RoomEvent.SHOW_LEADERBOARD: {
        handleShowLeaderboard();
        break;
      }
      case RoomEvent.NEXT_QUESTION: {
        setShowLeaderboard(false);

        const gameContent = gameContentRef.current;
        if (gameContent) {
          gameContent.nextSlide();
        }
        break;
      }
      default:
        console.log("[Game] Unknown room event action:", eventData.action);
    }
  };

  // Setup room event synchronization
  useRoomEventSync({
    onEvent: handleRoomEvent,
  });

  useRoomUsers();

  const { emitEvent } = useEmitRoomEvent();

  // Host distributes words when they're fetched
  useEffect(() => {
    if (hostWords) {
      console.log("[Game] Host distributing words to all users...");
      emitEvent(RoomEvent.DISTRIBUTE_WORDS, hostWords);
    }
  }, [hostWords, emitEvent]);

  // Determine which words to use
  const words = syncedWords;
  const isLoading = !wordsReceived;
  const error = null;

  // Convert words to questions
  const questions: Question[] = useMemo(() => {
    return (
      words?.map((word) => ({
        id: word.id,
        image: word.photo,
        description: word.translation,
        answer: word.title.toLowerCase().trim(),
        scrambled: scrambleWord(word.title),
        titleVoice: word.titleVoice,
        pronunciation: word.pronunciation,
        examples: word.examples || [],
      })) || []
    );
  }, [words]);

  useEffect(() => {
    if (error) {
      showAlert({
        content: "Failed to load game questions. Please try again.",
        onConfirm: () => {
          router.reset("/?source=pwa");
        },
        title: "Error",
        disableBackdropClick: true,
      });
    }
  }, [error, showAlert, router]);

  const onExit = useCallback(() => {
    router.reset("/?source=pwa");
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Preloader className="mb-4" />
      </div>
    );
  }

  // No questions state
  if (!words || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="p-6 text-center backdrop-blur-xl bg-white/30 border border-white/40 shadow-xl">
          <p className="text-lg mb-4 text-gray-700 font-medium">
            No questions available
          </p>
          <Button onClick={onExit}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated color overlay for correct/wrong feedback */}
      <ColorOverlay />
      {/* Backdrop overlay for leaderboard/word details */}
      <Backdrop />

      {/* Points Animation */}
      <GamePointsAnimation />

      {/* Header */}
      <GameHeaderComponent
        pin={pin}
        questions={questions}
        onSettings={onExit}
      />

      {/* Game Content */}
      <GameContent ref={gameContentRef} questions={questions} />

      {/* Leaderboard */}
      <GameLeaderboard questionsLength={questions.length} />

      {/* Word Details */}
      <GameWordDetails questions={questions} />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Preloader />
        </div>
      }
    >
      <Game />
    </Suspense>
  );
}
