"use client";

import ExercisesList from "@/components/ExercisesList";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { useRoute } from "@/lib/navigation";

export default function ExercisesScreen() {
  const { params } = useRoute<{ lesson: string }>();
  const lessonId = params.lesson;

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
