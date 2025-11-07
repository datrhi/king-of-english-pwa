"use client";
import Lobby from "@/components/Lobby";
import { useRoomConnection } from "@/hooks/useRoomConnection";
import {
  RoomEvent,
  useEmitRoomEvent,
  useRoomEventSync,
} from "@/hooks/useRoomEventSync";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import { useDialog } from "@/providers/DialogProvider";
import {
  joinRoom,
  offRoomClosed,
  offUserJoined,
  offUserLeft,
  offUserUpdated,
  onRoomClosed,
  onUserJoined,
  onUserLeft,
  onUserUpdated,
  RoomUser,
  updateUser,
} from "@/services/socketService";
import {
  getAvatarUrl,
  getUsername,
  saveUsername,
} from "@/services/userService";
import { Preloader } from "konsta/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function LobbyContent() {
  const router = useTransitionRouter();
  const searchParams = useSearchParams();
  const { showAlert, showInput } = useDialog();

  // Get params from URL
  const pin = searchParams.get("pin") || "000000";
  const userName = searchParams.get("name") || "Guest";
  const isHost = searchParams.get("isHost") === "true";

  // State
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [roomData, setRoomData] = useState<{
    exerciseName: string;
    exerciseId: string;
    image?: string;
  }>({
    exerciseName: "Unknown Exercise",
    exerciseId: "",
    image: "",
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Manage WebSocket connection lifecycle (persist when navigating to game)
  const { markAsExiting } = useRoomConnection({
    pin,
    persistOnNavigation: true,
  });

  // Room event handler - all users (including host) react to events the same way
  const handleRoomEvent = useCallback(
    (eventData: { action: string; data: unknown }) => {
      console.log("[Lobby] Received room event:", eventData);

      switch (eventData.action) {
        case RoomEvent.START_GAME: {
          // Navigate to game screen with necessary params
          const params = new URLSearchParams({
            pin,
            exerciseId: roomData.exerciseId,
            exerciseName: roomData.exerciseName,
            isHost: isHost.toString(),
          });
          const gameUrl = `/game?${params.toString()}`;
          console.log("[Lobby] Navigating to game:", gameUrl);
          router.push(gameUrl);
          break;
        }
        default:
          console.log("[Lobby] Unknown room event action:", eventData.action);
      }
    },
    [pin, roomData, isHost, router]
  );

  // Setup room event synchronization
  useRoomEventSync({
    onEvent: handleRoomEvent,
    dependencies: [isInitialized],
  });

  const { emitEvent } = useEmitRoomEvent();

  // Join room on mount
  useEffect(() => {
    const initRoom = async () => {
      try {
        const userName = await getUsername();
        const result = await joinRoom(pin, userName, getAvatarUrl(userName));

        if (result.success && result.data) {
          setIsInitialized(true);
          setUsers(result.data.users);
          setRoomData({
            exerciseName: result.data.room.exercise?.name || "Unknown Exercise",
            exerciseId: result.data.room.exerciseId,
            image: result.data.room.image,
          });

          setLoading(false);
        } else {
          showAlert({
            content: result.error || "Failed to join room",
            onConfirm: () => router.back(),
            title: "Room Error",
            disableBackdropClick: true,
          });
        }
      } catch (err) {
        console.error("Error joining room:", err);
        showAlert({
          content: "Failed to join room. Please try again.",
          onConfirm: () => router.back(),
          title: "Connection Error",
          disableBackdropClick: true,
        });
      }
    };

    void initRoom();
  }, [pin]);

  useEffect(() => {
    // Listen for real-time user updates
    onUserJoined((data) => {
      console.log("User joined:", data);
      setUsers((prev) => {
        // Check if user already exists
        if (prev.some((u) => u.id === data.user.id)) {
          return prev;
        }
        return [...prev, data.user];
      });
    });

    onUserLeft((data) => {
      console.log("User left:", data);
      setUsers((prev) => prev.filter((u) => u.id !== data.user.id));
    });

    onUserUpdated((data) => {
      console.log("User updated:", data);
      setUsers((prev) => {
        const userIndex = prev.findIndex((u) => u.id === data.user.id);
        if (userIndex !== -1) {
          const updated = [...prev];
          updated[userIndex] = data.user;
          return updated;
        }
        return prev;
      });
    });

    // Listen for room closed event (when host leaves)
    onRoomClosed((data) => {
      console.log("Room closed:", data);
      // Mark as exiting to trigger cleanup
      markAsExiting();
      // Show message and redirect
      showAlert({
        content: data.message,
        onConfirm: () => router.reset("/?source=pwa"),
        title: "Room Closed",
        disableBackdropClick: true,
      });
    });

    // Cleanup - remove event listeners (connection handled by useRoomConnection)
    return () => {
      offUserJoined();
      offUserLeft();
      offUserUpdated();
      offRoomClosed();
    };
  }, [isInitialized]);

  const handleStartGame = () => {
    console.log("[Lobby] Host starting game...");
    // Host emits start_game event, then ALL users (including host) will receive it
    // and navigate to the game screen together
    emitEvent(RoomEvent.START_GAME);
  };

  const handleExitLobby = () => {
    console.log("Exiting lobby...");

    // Mark as intentionally exiting to trigger cleanup
    markAsExiting();

    // Navigate back to home screen
    router.back();
  };

  const handleEditCharacter = () => {
    console.log("Editing character...");
    // Find current user
    const currentUser = users.find((u) => u.isMe);
    const currentName = currentUser?.name;

    showInput({
      title: "Edit Character",
      content: "Enter your new username:",
      placeholder: "Username",
      defaultValue: currentName,
      maxLength: 20,
      confirmText: "Save",
      cancelText: "Cancel",
      onConfirm: (newName) => {
        const trimmedName = newName.trim();
        if (!trimmedName) {
          showAlert({
            title: "Invalid Username",
            content: "Username cannot be empty.",
          });
          return;
        }

        if (trimmedName.length < 2) {
          showAlert({
            title: "Invalid Username",
            content: "Username must be at least 2 characters long.",
          });
          return;
        }

        // Save to session storage
        saveUsername(trimmedName);

        // Update avatar URL based on new username
        const newAvatar = getAvatarUrl(trimmedName);

        // Update user in the room
        updateUser(pin, trimmedName, newAvatar);

        console.log("Username updated to:", trimmedName);
      },
    });
  };

  const handleShare = async () => {
    console.log("Sharing lobby...");
    try {
      await navigator.share({
        title: "Join my game!",
        text: `Join my ${roomData.exerciseName} game with PIN: ${pin}`,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share not supported or cancelled:", err);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `Join my ${roomData.exerciseName} game with PIN: ${pin}\n${window.location.href}`
        );
        showAlert({
          content: "Lobby link copied to clipboard!",
          title: "Shared",
        });
      } catch (clipboardErr) {
        showAlert({
          content: "Failed to share or copy link. Please try again.",
          title: "Share Failed",
        });
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Preloader />
      </div>
    );
  }

  // Map users to include isHost property
  const usersWithHostInfo = users.map((user) => ({
    ...user,
  }));

  return (
    <Lobby
      pinCode={pin}
      users={usersWithHostInfo}
      exerciseName={roomData.exerciseName}
      image={roomData.image}
      maxPlayers={300}
      onStartGame={handleStartGame}
      onExitLobby={handleExitLobby}
      onEditCharacter={handleEditCharacter}
      onShare={handleShare}
      isHost={isHost}
    />
  );
}

export default function LobbyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Preloader />
        </div>
      }
    >
      <LobbyContent />
    </Suspense>
  );
}
