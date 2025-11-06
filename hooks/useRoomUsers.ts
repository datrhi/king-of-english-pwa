import { useTransitionRouter } from "@/lib/next-view-transitions";
import { useDialog } from "@/providers/DialogProvider";
import {
  emitGetRoomUsers,
  offRoomUsers,
  onRoomClosed,
  onRoomUsers,
  onUserJoined,
  onUserLeft,
} from "@/services/socketService";
import { userIdAtom, usersAtom } from "@/stores/gameStore";
import { useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useRoomUsers = () => {
  const searchParams = useSearchParams();
  const pin = searchParams.get("pin");
  const setUsers = useSetAtom(usersAtom);
  const setUserId = useSetAtom(userIdAtom);
  const { showAlert } = useDialog();
  const router = useTransitionRouter();
  useEffect(() => {
    if (pin) {
      const rawPin = pin.replace(/\s/g, "");
      emitGetRoomUsers(rawPin);
    }
  }, [pin]);

  useEffect(() => {
    onRoomUsers((data) => {
      const { users, socketId } = data;
      setUsers(users);
      setUserId(socketId);
    });
    onUserJoined((data) => {
      setUsers((prev) => {
        if (prev.some((u) => u.id === data.user.id)) {
          return prev;
        }
        return [...prev, data.user];
      });
    });
    onUserLeft((data) => {
      setUsers((prev) => prev.filter((u) => u.id !== data.user.id));
    });
    onRoomClosed((data) => {
      showAlert({
        content: data.message,
        onConfirm: () => router.reset("/?source=pwa"),
        title: "Room Closed",
        disableBackdropClick: true,
      });
    });
    return () => {
      offRoomUsers();
    };
  }, []);
};
