"use client";

import Lobby from "@/components/Lobby";
import { useRoomConnection } from "@/hooks/useRoomConnection";
import {
  RoomEvent,
  useEmitRoomEvent,
  useRoomEventSync,
} from "@/hooks/useRoomEventSync";
import { useNavigation, useRoute } from "@/lib/navigation";
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
import { useCallback, useEffect, useState } from "react";

export default function LobbyScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<{
    pin: string;
    name?: string;
    isHost?: string;
  }>();
  const pin = params.pin || "000000";
  const isHost = params.isHost === "true";
  const { showAlert, showInput } = useDialog();

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

  const { markAsExiting } = useRoomConnection({
    pin,
    persistOnNavigation: true,
  });

  const handleRoomEvent = useCallback(
    (eventData: { action: string; data: unknown }) => {
      console.log("[Lobby] Received room event:", eventData);

      switch (eventData.action) {
        case RoomEvent.START_GAME: {
          console.log("[Lobby] Navigating to game");
          navigation.push("Game", {
            pin,
            exerciseId: roomData.exerciseId,
            exerciseName: roomData.exerciseName,
            isHost: isHost.toString(),
          });
          break;
        }
        default:
          console.log("[Lobby] Unknown room event action:", eventData.action);
      }
    },
    [pin, roomData, isHost, navigation]
  );

  useRoomEventSync({
    onEvent: handleRoomEvent,
    dependencies: [isInitialized],
  });

  const { emitEvent } = useEmitRoomEvent();

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
            onConfirm: () => navigation.goBack(),
            title: "Room Error",
            disableBackdropClick: true,
          });
        }
      } catch (err) {
        console.error("Error joining room:", err);
        showAlert({
          content: "Failed to join room. Please try again.",
          onConfirm: () => navigation.goBack(),
          title: "Connection Error",
          disableBackdropClick: true,
        });
      }
    };

    void initRoom();
  }, [pin, navigation, showAlert]);

  useEffect(() => {
    onUserJoined((data) => {
      console.log("User joined:", data);
      setUsers((prev) => {
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

    onRoomClosed((data) => {
      console.log("Room closed:", data);
      markAsExiting();
      showAlert({
        content: data.message,
        onConfirm: () => navigation.reset({ routes: [{ name: "Home" }] }),
        title: "Room Closed",
        disableBackdropClick: true,
      });
    });

    return () => {
      offUserJoined();
      offUserLeft();
      offUserUpdated();
      offRoomClosed();
    };
  }, [isInitialized, markAsExiting, navigation, showAlert]);

  const handleStartGame = () => {
    console.log("[Lobby] Host starting game...");
    emitEvent(RoomEvent.START_GAME);
  };

  const handleExitLobby = () => {
    console.log("Exiting lobby...");
    markAsExiting();
    navigation.goBack();
  };

  const handleEditCharacter = () => {
    console.log("Editing character...");
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

        saveUsername(trimmedName);
        const newAvatar = getAvatarUrl(trimmedName);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Preloader />
      </div>
    );
  }

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
