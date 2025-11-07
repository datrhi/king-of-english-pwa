"use client";

import { useExercises } from "@/hooks/useExercises";
import { useCreateRoom } from "@/hooks/useRooms";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import type { Exercise } from "@/services/exercisesApi";
import { getAvatarUrl, getUsername } from "@/services/userService";
import { shimmer, toBase64 } from "@/utils/shimmer";
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
import Image from "next/image";
import { useState } from "react";

interface ExercisesListProps {
  lessonId: string;
}

export default function ExercisesList({ lessonId }: ExercisesListProps) {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const router = useTransitionRouter();

  // Fetch exercises from API
  const {
    data: exercises,
    isLoading,
    error,
  } = useExercises(lessonId, { sortBy: "name" });

  // Create room mutation
  const createRoomMutation = useCreateRoom();

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setSheetOpened(true);
  };

  const handleCreateRoom = async () => {
    if (!selectedExercise) return;

    try {
      // Get username from session storage or fetch from random user API
      const username = await getUsername();

      // Get avatar URL
      const avatarUrl = getAvatarUrl(username);

      // Create room with exercise details
      const room = await createRoomMutation.mutateAsync({
        name: username,
        exerciseId: selectedExercise.id,
        image: selectedExercise.image?.startsWith("http")
          ? selectedExercise.image
          : `https://langeek.co${selectedExercise.image}`,
      });

      console.log("Room created:", room);

      // Navigate to lobby - the lobby page will handle joining via WebSocket
      const params = new URLSearchParams({
        pin: room.pinCode,
        name: username,
        avatar: avatarUrl,
        isHost: "true",
      });
      router.push(`/lobby?${params.toString()}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setSheetOpened(false);
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

  // Filter exercises based on search query
  const filteredExercises = searchQuery
    ? exercises?.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : exercises;

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
          Failed to load exercises. Please try again.
        </p>
        <p className="text-gray-500 text-sm text-center">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  // Show empty state (no exercises loaded)
  if (!exercises || exercises.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <p className="text-gray-500 text-center">
          No exercises available for this lesson.
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
          placeholder="Search exercises..."
          onInput={handleSearch}
          value={searchQuery}
          onClear={handleClear}
          clearButton
        />
      </div>

      {/* FlatList-like container */}
      <div className="flex flex-col gap-4 p-4 pb-20">
        {filteredExercises && filteredExercises.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-4">
            <p className="text-gray-500 text-center">
              No exercises found matching "{searchQuery}".
            </p>
          </div>
        ) : (
          filteredExercises?.map((exercise: Exercise, index: number) => (
            <div
              key={exercise.id}
              onClick={() => handleExerciseClick(exercise)}
              className={`${getBgClass(
                index
              )} w-full min-h-20 rounded-2xl flex flex-row items-center px-4 gap-4 hover:bg-blue-light-1 cursor-pointer active:scale-[0.98] transition-transform duration-150`}
            >
              {exercise.image && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative">
                  <Image
                    src={
                      exercise.image.startsWith("http")
                        ? exercise.image
                        : `https://langeek.co${exercise.image}`
                    }
                    alt={exercise.name}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(64, 64)
                    )}`}
                  />
                </div>
              )}
              <div className="flex-1 py-4">
                <h2 className="font-text-medium text-title text-base font-semibold">
                  {exercise.name}
                </h2>
              </div>
              <div className="flex-shrink-0 text-gray-400">
                <ChevronRight size={16} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Exercise Details Sheet Modal */}
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
          {selectedExercise?.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden mb-4 relative">
              <Image
                src={
                  selectedExercise.image.startsWith("http")
                    ? selectedExercise.image
                    : `https://langeek.co${selectedExercise.image}`
                }
                alt={selectedExercise.name}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(700, 475)
                )}`}
              />
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4">{selectedExercise?.name}</h2>
          <div className="mt-8">
            <Button
              large
              rounded
              onClick={handleCreateRoom}
              disabled={createRoomMutation.isPending}
            >
              {createRoomMutation.isPending
                ? "Creating Room..."
                : "Create Room"}
            </Button>
          </div>
        </Block>
      </Sheet>
    </div>
  );
}
