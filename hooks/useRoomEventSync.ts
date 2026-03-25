import {
  emitRoomEvent,
  offRoomEvent,
  onRoomEvent,
} from "@/services/socketService";
import { useRoute } from "@/lib/navigation";
import { useCallback, useEffect, useRef } from "react";

export interface RoomEventData {
  pinCode: string;
  userId?: string;
  username?: string;
  action: string;
  data: unknown;
  socketId: string;
}

export interface UseRoomEventSyncProps {
  onEvent: (eventData: RoomEventData) => void;
  dependencies?: any[];
}

export enum RoomEvent {
  DISTRIBUTE_WORDS = "distribute_words",
  CORRECT_ANSWER = "correct_answer",
  WRONG_ANSWER = "wrong_answer",
  SHOW_WORD_DETAILS = "show_word_details",
  SHOW_LEADERBOARD = "show_leaderboard",
  NEXT_QUESTION = "next_question",
  START_GAME = "start_game",
}

/**
 * Hook for synchronizing room state through room events.
 * - Host can emit events using the returned `emitEvent` function
 * - All users (including host) will receive events through `onEvent` callback
 * This ensures everyone stays in sync regardless of role
 */
export function useRoomEventSync({
  onEvent,
  dependencies = [],
}: UseRoomEventSyncProps) {
  const onEventRef = useRef(onEvent);

  // Update ref when callback changes
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    onRoomEvent((eventData) => {
      console.log(`[RoomEventSync] Received event:`, eventData);
      onEventRef.current(eventData);
    });

    return () => {
      offRoomEvent();
    };
  }, dependencies);
}

export function useEmitRoomEvent() {
  const { params } = useRoute();
  const pin = params?.pin || "000000";
  const isHost = params?.isHost === "true";
  const emitEvent = useCallback(
    (action: string, data?: unknown) => {
      if (!isHost) {
        console.warn(
          `[RoomEventSync] Non-host attempted to emit event: ${action}`
        );
        return;
      }
      emitRoomEvent(pin, action, data);
    },
    [pin, isHost]
  );

  const notifyAll = useCallback(
    (action: string, data?: unknown) => {
      emitRoomEvent(pin, action, data);
    },
    [pin]
  );

  return { emitEvent, notifyAll };
}
