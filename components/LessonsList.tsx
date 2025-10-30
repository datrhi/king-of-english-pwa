"use client";

import { useLessons } from "@/hooks/useLessons";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import type { Lesson } from "@/services/lessonsApi";
import { shimmer, toBase64 } from "@/utils/shimmer";
import { Block, Button, Link, Preloader, Searchbar, Sheet, Toolbar, ToolbarPane } from "konsta/react";
import { ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface LessonsListProps {
  courseId: string;
}

export default function LessonsList({ courseId }: LessonsListProps) {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useTransitionRouter();

  // Fetch lessons from API
  const { data: lessons, isLoading, error } = useLessons(courseId);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSheetOpened(true);
  };

  const handleViewExercises = () => {
    if (selectedLesson) {
      router.push(`/exercises?lesson=${selectedLesson.id}`);
    }
  };

  const handleCloseSheet = () => {
    setSheetOpened(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  // Filter lessons based on search query
  const filteredLessons = searchQuery
    ? lessons?.filter((lesson) =>
      lesson.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : lessons;

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <Preloader />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <p className="text-red-500 text-center mb-4">
          Failed to load lessons. Please try again.
        </p>
        <p className="text-gray-500 text-sm text-center">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  // Show empty state (no lessons loaded)
  if (!lessons || lessons.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <p className="text-gray-500 text-center">
          No lessons available for this course.
        </p>
      </div>
    );
  }

  // Helper to get background color based on index
  const getBgClass = (index: number) => {
    return index % 2 === 0 ? "bg-blue-light-4" : "bg-blue-light-3";
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="px-4 pt-4">
        <Searchbar
          placeholder="Search lessons..."
          onInput={handleSearch}
          value={searchQuery}
          onClear={handleClear}
          clearButton
        />
      </div>

      {/* FlatList-like container */}
      <div className="flex flex-col gap-4 p-4 pb-20">
        {filteredLessons && filteredLessons.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-4">
            <p className="text-gray-500 text-center">
              No lessons found matching "{searchQuery}".
            </p>
          </div>
        ) : (
          filteredLessons?.map((lesson: Lesson, index: number) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson)}
              className={`${getBgClass(index)} w-full min-h-20 rounded-2xl flex flex-row items-center px-4 gap-4 hover:bg-blue-light-1 cursor-pointer active:scale-[0.98] transition-transform duration-150`}
            >
              {lesson.image && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative">
                  <Image
                    src={lesson.image}
                    alt={lesson.name}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(64, 64))}`}
                  />
                </div>
              )}
              <div className="flex-1 py-4">
                <h2 className="font-text-medium text-title text-base font-semibold">
                  {lesson.name}
                </h2>
                {lesson.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {lesson.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 text-gray-400">
                <ChevronRight size={16} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lesson Details Sheet Modal */}
      <Sheet
        className="pb-safe"
        opened={sheetOpened}
        onBackdropClick={handleCloseSheet}
      >
        <Toolbar top className="justify-end ios:pt-4">
          <div className="ios:hidden" />
          <ToolbarPane>
            <Link iconOnly onClick={handleCloseSheet}>
              <X className="w-6 h-6" />
            </Link>
          </ToolbarPane>
        </Toolbar>
        <Block className="ios:mt-4">
          {selectedLesson?.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden mb-4 relative">
              <Image
                src={selectedLesson.image}
                alt={selectedLesson.name}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              />
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4">
            {selectedLesson?.name}
          </h2>
          {selectedLesson?.description && (
            <p className="text-gray-700 leading-relaxed mb-6">
              {selectedLesson.description}
            </p>
          )}
          {!selectedLesson?.description && (
            <p className="text-gray-400 italic mb-6">
              No description available for this lesson.
            </p>
          )}
          <div className="mt-8">
            <Button large rounded onClick={handleViewExercises}>
              View Exercises
            </Button>
          </div>
        </Block>
      </Sheet>
    </div>
  );
}

