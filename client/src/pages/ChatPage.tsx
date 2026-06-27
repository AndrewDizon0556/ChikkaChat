import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageArea from "@/components/chat/MessageArea";
import MessageComposer from "@/components/chat/MessageComposer";
import GroupManageModal from "@/components/chat/GroupManageModal";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
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
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar - responsive */}
      <div
        className={`${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-80 shadow-xl transition-transform duration-300 md:relative md:translate-x-0 md:shadow-none`}
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
          <WelcomeScreen onOpenSidebar={() => setMobileSidebarOpen(true)} />
        )}
      </div>
    </div>
  );
}
