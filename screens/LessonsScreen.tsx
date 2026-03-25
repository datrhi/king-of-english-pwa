"use client";

import LessonsList from "@/components/LessonsList";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { useRoute } from "@/lib/navigation";

export default function LessonsScreen() {
  const { params } = useRoute<{ course: string }>();
  const courseId = params.course;

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
