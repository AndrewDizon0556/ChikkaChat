import { create } from "zustand";
import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/socket";

interface SocketState {
  socket: Socket | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connected: false,

  connect: async () => {
    try {
      const socket = await connectSocket();

      socket.on("connect", () => {
        set({ connected: true });
      });

      socket.on("disconnect", () => {
        set({ connected: false });
      });

      set({ socket, connected: socket.connected });
    } catch {
      set({ socket: null, connected: false });
    }
  },

  disconnect: () => {
    disconnectSocket();
    set({ socket: null, connected: false });
  },
}));
