import { io, Socket } from "socket.io-client";
import { firebaseAuth } from "@/firebase/config";

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket> => {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
    auth: { token },
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
