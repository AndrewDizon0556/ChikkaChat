import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageArea from "@/components/chat/MessageArea";
import MessageComposer from "@/components/chat/MessageComposer";
import GroupManageModal from "@/components/chat/GroupManageModal";
import { useChatStore } from "@/store/chatStore";
import { useSocketStore } from "@/store/socketStore";
import { useUserStore } from "@/store/userStore";
import type { Message } from "@/types";

export default function ChatPage() {
  const navigate = useNavigate();
  const {
    activeConversation,
    fetchConversations,
    fetchMessages,
    addMessage,
  } = useChatStore();
  const { socket, connect, disconnect } = useSocketStore();
  const { setUserOnline, setUserOffline, setTyping } = useUserStore();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  useEffect(() => {
    fetchConversations();
    connect();
    return () => {
      disconnect();
    };
  }, [fetchConversations, connect, disconnect]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message:receive", (message: Message) => {
      addMessage(message);
    });

    socket.on(
      "user:status",
      ({ userId, status }: { userId: string; status: string }) => {
        if (status === "online") setUserOnline(userId);
        else setUserOffline(userId);
      }
    );

    socket.on(
      "typing:update",
      ({
        userId,
        conversationId,
        isTyping,
      }: {
        userId: string;
        conversationId: string;
        isTyping: boolean;
      }) => {
        setTyping(conversationId, userId, isTyping);
      }
    );

    return () => {
      socket.off("message:receive");
      socket.off("user:status");
      socket.off("typing:update");
    };
  }, [socket, addMessage, setUserOnline, setUserOffline, setTyping]);

  useEffect(() => {
    if (activeConversation && socket) {
      socket.emit("conversation:join", activeConversation._id);
      fetchMessages(activeConversation._id);
      setReplyingTo(null);
      setMobileSidebarOpen(false);

      return () => {
        socket.emit("conversation:leave", activeConversation._id);
      };
    }
  }, [activeConversation, socket, fetchMessages]);

  const handleSendMessage = (
    content: string,
    messageType?: string,
    fileUrl?: string,
    replyTo?: string
  ) => {
    if (!socket || !activeConversation) return;
    socket.emit("message:send", {
      conversationId: activeConversation._id,
      content,
      messageType: messageType || "text",
      fileUrl,
      replyTo,
    });
  };

  const handleTypingStart = () => {
    if (socket && activeConversation) {
      socket.emit("typing:start", activeConversation._id);
    }
  };

  const handleTypingStop = () => {
    if (socket && activeConversation) {
      socket.emit("typing:stop", activeConversation._id);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - responsive */}
      <div
        className={`${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-80 transition-transform duration-200 md:relative md:translate-x-0`}
      >
        <ConversationSidebar onNavigateProfile={() => navigate("/profile")} />
      </div>

      {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && activeConversation && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {activeConversation ? (
          <>
            <ChatHeader
              conversation={activeConversation}
              onInfoClick={
                activeConversation.type === "group"
                  ? () => setGroupModalOpen(true)
                  : undefined
              }
              onBackClick={() => setMobileSidebarOpen(true)}
            />
            <MessageArea
              conversation={activeConversation}
              onReply={setReplyingTo}
            />
            <MessageComposer
              onSend={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
            />

            {activeConversation.type === "group" && (
              <GroupManageModal
                open={groupModalOpen}
                onClose={() => setGroupModalOpen(false)}
                conversation={activeConversation}
              />
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
            <svg className="mb-4 h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">Welcome to ChikkaChat</p>
            <p className="mt-1 text-sm">Select a conversation or start a new one</p>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 md:hidden"
            >
              Open Conversations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
