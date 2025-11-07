"use client";

import { useCourses } from "@/hooks/useCourses";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import type { Course } from "@/services/coursesApi";
import {
  Block,
  Button,
  Link,
  Preloader,
  Searchbar,
  Sheet,
  Toolbar,
  ToolbarPane,
} from "konsta/react";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";

export default function CourseList() {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useTransitionRouter();

  // Fetch courses from API
  const { data: courses, isLoading, error } = useCourses({ sortBy: "name" });

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setSheetOpened(true);
  };

  const handleViewLessons = () => {
    if (selectedCourse) {
      router.push(`/lessons?course=${selectedCourse.id}`);
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

  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses?.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Preloader />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <p className="text-red-500 text-center mb-4">
          Failed to load courses. Please try again.
        </p>
        <p className="text-gray-500 text-sm text-center">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  // Show empty state (no courses loaded)
  if (!courses || courses.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <p className="text-gray-500 text-center">
          No courses available at the moment.
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
          placeholder="Search courses..."
          onInput={handleSearch}
          value={searchQuery}
          onClear={handleClear}
          clearButton
        />
      </div>

      {/* FlatList-like container */}
      <div className="flex flex-col gap-4 p-4 pb-20">
        {filteredCourses && filteredCourses.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-4">
            <p className="text-gray-500 text-center">
              No courses found matching "{searchQuery}".
            </p>
          </div>
        ) : (
          filteredCourses?.map((course: Course, index: number) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className={`${getBgClass(
                index
              )} w-full min-h-20 rounded-2xl flex flex-row items-center px-4 gap-4 hover:bg-blue-light-1 cursor-pointer active:scale-[0.98] transition-transform duration-150`}
            >
              <div className="flex-1 py-4">
                <h2 className="font-text-medium text-title text-base font-semibold">
                  {course.name}
                </h2>
              </div>
              <div className="flex-shrink-0 text-gray-400">
                <ChevronRight size={16} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Course Details Sheet Modal */}
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
          <h2 className="text-2xl font-bold mb-4">{selectedCourse?.name}</h2>
          {selectedCourse?.description && (
            <p className="text-gray-700 leading-relaxed mb-6">
              {selectedCourse.description}
            </p>
          )}
          {!selectedCourse?.description && (
            <p className="text-gray-400 italic mb-6">
              No description available for this course.
            </p>
          )}
          <div className="mt-8">
            <Button large rounded onClick={handleViewLessons}>
              View Lessons
            </Button>
          </div>
        </Block>
      </Sheet>
    </div>
  );
}
