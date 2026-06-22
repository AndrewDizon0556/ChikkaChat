import { create } from "zustand";
import api from "@/api/axios";
import type { Conversation, Message, PaginatedMessages } from "@/types";

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  pagination: PaginatedMessages["pagination"] | null;
  loading: boolean;

  fetchConversations: () => Promise<void>;
  setActiveConversation: (conversation: Conversation) => void;
  fetchMessages: (conversationId: string, page?: number) => Promise<void>;
  addMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  createConversation: (
    type: "private" | "group",
    members: string[],
    name?: string
  ) => Promise<Conversation>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  pagination: null,
  loading: false,

  fetchConversations: async () => {
    const { data } = await api.get<Conversation[]>("/api/conversations");
    set({ conversations: data });
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation, messages: [], pagination: null });
  },

  fetchMessages: async (conversationId, page = 1) => {
    set({ loading: true });
    const { data } = await api.get<PaginatedMessages>(
      `/api/messages/${conversationId}`,
      { params: { page, limit: 30 } }
    );

    if (page === 1) {
      set({ messages: data.messages, pagination: data.pagination });
    } else {
      set({
        messages: [...data.messages, ...get().messages],
        pagination: data.pagination,
      });
    }
    set({ loading: false });
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  removeMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((m) => m._id !== messageId),
    }));
  },

  createConversation: async (type, members, name) => {
    const { data } = await api.post<Conversation>("/api/conversations", {
      type,
      members,
      name,
    });
    set((state) => ({ conversations: [data, ...state.conversations] }));
    return data;
  },
}));
