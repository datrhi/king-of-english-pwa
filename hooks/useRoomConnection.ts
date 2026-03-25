import { disconnectRoomSocket, leaveRoom } from "@/services/socketService";
import { useCallback, useEffect, useRef } from "react";

interface UseRoomConnectionOptions {
  pin: string;
  /**
   * If true, the connection will persist even when component unmounts
   * (useful when navigating between lobby and game)
   */
  persistOnNavigation?: boolean;
}

function cleanupRoom(pin: string) {
  leaveRoom(pin);
  disconnectRoomSocket();
  sessionStorage.removeItem("inGameSession");
}

/**
 * Hook to manage WebSocket room connection lifecycle.
 * Handles cleanup on: unmount, page close, app background, and app kill.
 */
export const useRoomConnection = (options: UseRoomConnectionOptions) => {
  const { pin, persistOnNavigation = false } = options;
  const isExitingRef = useRef(false);
  const pinRef = useRef(pin);
  pinRef.current = pin;

  useEffect(() => {
    sessionStorage.setItem("inGameSession", "true");

    const handleBeforeUnload = () => cleanupRoom(pinRef.current);

    // pagehide is more reliable than beforeunload on mobile Safari/PWA
    const handlePageHide = () => cleanupRoom(pinRef.current);

    // Mobile PWA: disconnect when app goes to background
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        cleanupRoom(pinRef.current);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (isExitingRef.current || !persistOnNavigation) {
        cleanupRoom(pinRef.current);
      }
    };
  }, [pin, persistOnNavigation]);

  const markAsExiting = useCallback(() => {
    isExitingRef.current = true;
  }, []);

  return { markAsExiting };
};
