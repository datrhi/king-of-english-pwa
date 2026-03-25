import { useNavigation, useRoute } from "@/lib/navigation";
import { useDialog } from "@/providers/DialogProvider";
import {
  disconnectRoomSocket,
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
import { useEffect, useRef } from "react";

export const useRoomUsers = () => {
  const { params } = useRoute();
  const pin = params?.pin as string | undefined;
  const setUserId = useSetAtom(userIdAtom);
  const { showAlert } = useDialog();
  const navigation = useNavigation();
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
      // Room is already closed server-side; disconnect client socket immediately
      disconnectRoomSocket();
      showAlert({
        content: data.message,
        onConfirm: () => navigation.reset({ routes: [{ name: "Home" }] }),
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
