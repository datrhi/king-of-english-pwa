import { api } from "./api";

export interface Room {
  pinCode: string;
  name: string;
  category: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomPayload {
  name: string;
  category: string;
  image?: string;
}

export const createRoom = async (payload: CreateRoomPayload): Promise<Room> => {
  const response = await api.post<Room>("/rooms", payload);
  return response.data;
};

export const getRoomByPinCode = async (pinCode: string): Promise<Room> => {
  const response = await api.get<Room>(`/rooms/${pinCode}`);
  return response.data;
};

export const deleteRoom = async (pinCode: string): Promise<void> => {
  await api.delete(`/rooms/${pinCode}`);
};
