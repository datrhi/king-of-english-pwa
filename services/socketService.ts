import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Initialize socket connection for rooms
 */
export const initializeRoomSocket = (): Socket => {
  if (!socket) {
    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
      "http://localhost:3001";
    socket = io(`${socketUrl}/rooms`, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }
  return socket;
};

/**
 * Get the current socket instance
 */
export const getRoomSocket = (): Socket | null => {
  return socket;
};

export interface RoomUser {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  isMe: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  image?: string;
}

export interface RoomData {
  pinCode: string;
  name: string;
  exerciseId: string;
  exercise?: Exercise;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JoinedRoomResponse {
  pinCode: string;
  room: RoomData;
  user: RoomUser;
  users: RoomUser[];
  isHost: boolean;
  message: string;
}

/**
 * Join a room with user details
 */
export const joinRoom = (
  pinCode: string,
  name: string,
  avatar?: string
): Promise<{
  success: boolean;
  data?: JoinedRoomResponse;
  error?: string;
}> => {
  return new Promise((resolve) => {
    const roomSocket = initializeRoomSocket();

    // Listen for successful join
    roomSocket.once("joinedRoom", (data: JoinedRoomResponse) => {
      console.log("Successfully joined room:", data);
      resolve({ success: true, data });
    });

    // Listen for errors
    roomSocket.once("error", (error) => {
      console.error("Error joining room:", error);
      resolve({ success: false, error: error.message });
    });

    // Emit join room event
    roomSocket.emit("joinRoom", { pinCode, name, avatar });
  });
};

/**
 * Leave a room
 */
export const leaveRoom = (pinCode: string): void => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.emit("leaveRoom", { pinCode });
  }
};

/**
 * Listen for when a user joins the room
 */
export const onUserJoined = (
  callback: (data: { pinCode: string; user: RoomUser }) => void
) => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.on("userJoined", callback);
  }
};

/**
 * Listen for when a user leaves the room
 */
export const onUserLeft = (
  callback: (data: { pinCode: string; user: RoomUser }) => void
) => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.on("userLeft", callback);
  }
};

/**
 * Remove user joined listener
 */
export const offUserJoined = () => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.off("userJoined");
  }
};

/**
 * Remove user left listener
 */
export const offUserLeft = () => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.off("userLeft");
  }
};

/**
 * Listen for when the room is closed (host left)
 */
export const onRoomClosed = (
  callback: (data: { pinCode: string; reason: string; message: string }) => void
) => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.on("roomClosed", callback);
  }
};

/**
 * Remove room closed listener
 */
export const offRoomClosed = () => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.off("roomClosed");
  }
};

/**
 * Disconnect from socket
 */
export const disconnectRoomSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Emit a room event (typically used by host)
 */
export const emitRoomEvent = (
  pinCode: string,
  action: string,
  data?: unknown
): void => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.emit("roomEvent", {
      pinCode,
      action,
      data,
    });
  }
};

/**
 * Listen for room events
 */
export const onRoomEvent = (
  callback: (data: {
    pinCode: string;
    userId?: string;
    username?: string;
    action: string;
    data: unknown;
    socketId: string;
  }) => void
) => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.on("roomEvent", callback);
  }
};

/**
 * Remove room event listener
 */
export const offRoomEvent = () => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.off("roomEvent");
  }
};

export const onRoomUsers = (
  callback: (data: {
    pinCode: string;
    users: RoomUser[];
    count: number;
    socketId: string;
  }) => void
) => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.on("roomUsers", callback);
  }
};

export const offRoomUsers = () => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.off("roomUsers");
  }
};

export const emitGetRoomUsers = (pinCode: string) => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.emit("getRoomUsers", { pinCode });
  }
};

/**
 * Update user information (name and/or avatar) in a room
 */
export const updateUser = (
  pinCode: string,
  name: string,
  avatar?: string
): void => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.emit("updateUser", { pinCode, name, avatar });
  }
};

/**
 * Listen for when a user's information is updated
 */
export const onUserUpdated = (
  callback: (data: { pinCode: string; user: RoomUser }) => void
) => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.on("userUpdated", callback);
  }
};

/**
 * Remove user updated listener
 */
export const offUserUpdated = () => {
  const roomSocket = getRoomSocket();
  if (roomSocket) {
    roomSocket.off("userUpdated");
  }
};
