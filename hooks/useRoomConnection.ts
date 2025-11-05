import { disconnectRoomSocket, leaveRoom } from "@/services/socketService";
import { useEffect, useRef } from "react";

interface UseRoomConnectionOptions {
  pin: string;
  /**
   * If true, the connection will persist even when component unmounts
   * (useful when navigating between lobby and game)
   */
  persistOnNavigation?: boolean;
}

/**
 * Hook to manage WebSocket room connection lifecycle
 * Handles proper cleanup on reload, navigation, and intentional exits
 */
export const useRoomConnection = (options: UseRoomConnectionOptions) => {
  const { pin, persistOnNavigation = false } = options;
  const isExitingRef = useRef(false);

  useEffect(() => {
    // Mark that we're in an active game session
    sessionStorage.setItem("inGameSession", "true");

    // Handle page reload/close - always disconnect from socket
    const handleBeforeUnload = () => {
      const rawPin = pin.replace(/\s/g, "");
      leaveRoom(rawPin);
      disconnectRoomSocket();
      sessionStorage.removeItem("inGameSession");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Only leave room if we're intentionally exiting
      // or if we're not persisting on navigation
      if (isExitingRef.current || !persistOnNavigation) {
        const rawPin = pin.replace(/\s/g, "");
        leaveRoom(rawPin);
        disconnectRoomSocket();
        sessionStorage.removeItem("inGameSession");
      }
    };
  }, [pin, persistOnNavigation]);

  /**
   * Call this before navigating away to properly leave the room
   */
  const markAsExiting = () => {
    isExitingRef.current = true;
  };

  return { markAsExiting };
};
