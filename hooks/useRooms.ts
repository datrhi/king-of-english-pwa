import {
  createRoom,
  deleteRoom,
  getRoomByPinCode,
  type CreateRoomPayload,
} from "@/services/roomsApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => createRoom(payload),
  });
};

export const useRoom = (pinCode: string) => {
  return useQuery({
    queryKey: ["room", pinCode],
    queryFn: () => getRoomByPinCode(pinCode),
    enabled: !!pinCode,
  });
};

export const useDeleteRoom = () => {
  return useMutation({
    mutationFn: (pinCode: string) => deleteRoom(pinCode),
  });
};
