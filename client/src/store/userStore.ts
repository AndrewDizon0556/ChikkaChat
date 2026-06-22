import { create } from "zustand";
import api from "@/api/axios";
import type { User } from "@/types";

interface UserState {
  onlineUsers: Set<string>;
  typingUsers: Map<string, Set<string>>;
  searchResults: User[];

  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  searchUsers: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  onlineUsers: new Set(),
  typingUsers: new Map(),
  searchResults: [],

  setUserOnline: (userId) => {
    set((state) => {
      const updated = new Set(state.onlineUsers);
      updated.add(userId);
      return { onlineUsers: updated };
    });
  },

  setUserOffline: (userId) => {
    set((state) => {
      const updated = new Set(state.onlineUsers);
      updated.delete(userId);
      return { onlineUsers: updated };
    });
  },

  setTyping: (conversationId, userId, isTyping) => {
    set((state) => {
      const updated = new Map(state.typingUsers);
      const convoTypers = new Set(updated.get(conversationId) || []);

      if (isTyping) {
        convoTypers.add(userId);
      } else {
        convoTypers.delete(userId);
      }

      updated.set(conversationId, convoTypers);
      return { typingUsers: updated };
    });
  },

  searchUsers: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    const { data } = await api.get<User[]>("/api/users/search", {
      params: { q: query },
    });
    set({ searchResults: data });
  },

  clearSearch: () => set({ searchResults: [] }),
}));
