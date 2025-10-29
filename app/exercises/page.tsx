"use client";

import { useSearchParams } from "next/navigation";
import ExercisesList from "@/components/ExercisesList";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { Suspense } from "react";
import { Preloader } from "konsta/react";

function ExercisesPageContent() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lesson");

  if (!lessonId) {
    return (
      <ScreenWithBackground
        headerProps={{
          title: "Exercises",
        }}
        view="scrollable"
        contentPosition="center"
      >
        <div className="w-full flex flex-col items-center justify-center py-20 px-4">
          <p className="text-red-500 text-center">
            No lesson selected. Please go back and select a lesson.
          </p>
        </div>
      </ScreenWithBackground>
    );
  }

  return (
    <ScreenWithBackground
      headerProps={{
        title: "Exercises",
      }}
      view="scrollable"
      contentPosition="start"
    >
      <ExercisesList lessonId={lessonId} />
    </ScreenWithBackground>
  );
}

export default function ExercisesPage() {
  return (
    <Suspense fallback={
      <ScreenWithBackground
        headerProps={{
          title: "Exercises",
        }}
        view="scrollable"
        contentPosition="center"
      >
        <div className="w-full flex items-center justify-center py-20">
          <Preloader />
        </div>
      </ScreenWithBackground>
    }>
      <ExercisesPageContent />
    </Suspense>
  );
}

