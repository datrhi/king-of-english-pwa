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
import { useRandomWords } from "@/hooks/useWords";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import { useDialog } from "@/providers/DialogProvider";
import { scrambleWord } from "@/utils/game";
import { Button, Card, Preloader } from "konsta/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
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

  // Fetch random words
  const { data: words, isLoading, error } = useRandomWords(exerciseId, 10);

  // Manage WebSocket connection lifecycle (persist when navigating within game flow)
  const { markAsExiting } = useRoomConnection({
    pin,
    persistOnNavigation: true,
  });

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
          markAsExiting();
          router.reset("/?source=pwa");
        },
        title: "Error",
        disableBackdropClick: true,
      });
    }
  }, [error, showAlert, router, markAsExiting]);

  const onExit = useCallback(() => {
    markAsExiting();
    router.reset("/?source=pwa");
  }, [router, markAsExiting]);

  const onNextSlide = useCallback(() => {
    const gameContent = gameContentRef.current;
    if (!gameContent) return;
    gameContent.nextSlide();
  }, []);

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
      <GameLeaderboard
        nextSlide={onNextSlide}
        onExit={onExit}
        questionsLength={questions.length}
      />

      {/* Word Details */}
      <GameWordDetails questions={questions} isHost={isHost} />
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
