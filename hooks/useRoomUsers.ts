import { useTransitionRouter } from "@/lib/next-view-transitions";
import { useDialog } from "@/providers/DialogProvider";
import {
  emitGetRoomUsers,
  offRoomClosed,
  offRoomUsers,
  offUserJoined,
  offUserLeft,
  onRoomClosed,
  onRoomUsers,
  onUserJoined,
  onUserLeft,
} from "@/services/socketService";
import {
  handleAddUser,
  handleInitUsers,
  handleRemoveUser,
  isGameOverAtom,
  userIdAtom,
} from "@/stores/gameStore";
import { useAtomValue, useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export const useRoomUsers = () => {
  const searchParams = useSearchParams();
  const pin = searchParams.get("pin");
  const setUserId = useSetAtom(userIdAtom);
  const { showAlert } = useDialog();
  const router = useTransitionRouter();
  const initUsers = useSetAtom(handleInitUsers);
  const addUser = useSetAtom(handleAddUser);
  const removeUser = useSetAtom(handleRemoveUser);

  const isGameOver = useAtomValue(isGameOverAtom);
  const isGameOverRef = useRef(isGameOver);
  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  useEffect(() => {
    if (pin) {
      emitGetRoomUsers(pin);
    }
  }, [pin]);

  useEffect(() => {
    onRoomUsers((data) => {
      const { users, socketId } = data;
      initUsers(users);
      setUserId(socketId);
    });
    onUserJoined((data) => {
      addUser(data.user);
    });
    onUserLeft((data) => {
      removeUser(data.user.id);
    });
    onRoomClosed((data) => {
      if (isGameOverRef.current) {
        return;
      }
      showAlert({
        content: data.message,
        onConfirm: () => router.reset("/?source=pwa"),
        title: "Room Closed",
        disableBackdropClick: true,
      });
    });
    return () => {
      offRoomUsers();
      offUserJoined();
      offUserLeft();
      offRoomClosed();
    };
  }, []);
};
