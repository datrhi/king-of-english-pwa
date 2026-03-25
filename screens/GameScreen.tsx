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
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { useRandomWords } from "@/hooks/useWords";
import { useNavigation, useRoute } from "@/lib/navigation";
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
import {
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

export default function GameScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<{
    pin: string;
    exerciseId: string;
    exerciseName: string;
    isHost: string;
  }>();
  const pin = params.pin || "000000";
  const exerciseId = params.exerciseId || "";
  const exerciseName = params.exerciseName || "Unknown Exercise";
  const isHost = params.isHost === "true";

  const { showAlert } = useDialog();
  const gameContentRef = useRef<GameContentRef>(null);
  const { height: viewportHeight } = useVisualViewport();

  const [syncedWords, setSyncedWords] = useState<Word[] | null>(null);
  const [wordsReceived, setWordsReceived] = useState(false);

  const handleScoreUpdate = useSetAtom(handleScoreUpdateAtom);
  const setShowWordDetails = useSetAtom(showWordDetailsAtom);
  const handleShowLeaderboard = useSetAtom(showLeaderboardActionAtom);
  const setShowLeaderboard = useSetAtom(showLeaderboardAtom);

  const { data: hostWords } = useRandomWords(exerciseId, 10);

  useRoomConnection({
    pin,
    persistOnNavigation: false,
  });

  const handleRoomEvent = (eventData: {
    action: string;
    data: unknown;
    socketId: string;
  }) => {
    switch (eventData.action) {
      case RoomEvent.DISTRIBUTE_WORDS: {
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

  useRoomEventSync({
    onEvent: handleRoomEvent,
  });

  useRoomUsers();

  const { emitEvent } = useEmitRoomEvent();

  useEffect(() => {
    if (hostWords) {
      console.log("[Game] Host distributing words to all users...");
      emitEvent(RoomEvent.DISTRIBUTE_WORDS, hostWords);
    }
  }, [hostWords, emitEvent]);

  const words = syncedWords;
  const isLoading = !wordsReceived;
  const error = null;

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
          navigation.reset({ routes: [{ name: "Home" }] });
        },
        title: "Error",
        disableBackdropClick: true,
      });
    }
  }, [error, showAlert, navigation]);

  const onExit = useCallback(() => {
    navigation.reset({ routes: [{ name: "Home" }] });
  }, [navigation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Preloader className="mb-4" />
      </div>
    );
  }

  if (!words || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div
      className="flex flex-col overflow-hidden relative"
      style={{
        height: viewportHeight > 0 ? `${viewportHeight}px` : "100vh",
      }}
    >
      <ColorOverlay />
      <Backdrop />

      <GamePointsAnimation />

      <GameHeaderComponent
        pin={pin}
        questions={questions}
        onSettings={onExit}
      />

      <GameContent ref={gameContentRef} questions={questions} />

      <GameLeaderboard questionsLength={questions.length} />

      <GameWordDetails questions={questions} />
    </div>
  );
}
