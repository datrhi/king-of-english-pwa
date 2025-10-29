"use client";

import { useSearchParams } from "next/navigation";
import LessonsList from "@/components/LessonsList";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { Suspense } from "react";
import { Preloader } from "konsta/react";

function LessonsPageContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course");

  if (!courseId) {
    return (
      <ScreenWithBackground
        headerProps={{
          title: "Lessons",
        }}
        view="scrollable"
        contentPosition="center"
      >
        <div className="w-full flex flex-col items-center justify-center py-20 px-4">
          <p className="text-red-500 text-center">
            No course selected. Please go back and select a course.
          </p>
        </div>
      </ScreenWithBackground>
    );
  }

  return (
    <ScreenWithBackground
      headerProps={{
        title: "Lessons",
      }}
      view="scrollable"
      contentPosition="start"
    >
      <LessonsList courseId={courseId} />
    </ScreenWithBackground>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={
      <ScreenWithBackground
        headerProps={{
          title: "Lessons",
        }}
        view="scrollable"
        contentPosition="center"
      >
        <div className="w-full flex items-center justify-center py-20">
          <Preloader />
        </div>
      </ScreenWithBackground>
    }>
      <LessonsPageContent />
    </Suspense>
  );
}

