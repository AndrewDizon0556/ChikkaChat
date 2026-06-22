import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import type { Conversation, Message } from "@/types";

interface MessageAreaProps {
  conversation: Conversation;
  onReply: (message: Message) => void;
}

export default function MessageArea({ conversation, onReply }: MessageAreaProps) {
  const user = useAuthStore((s) => s.user);
  const { messages, pagination, loading, fetchMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || loading || !pagination) return;

    if (el.scrollTop === 0 && pagination.page < pagination.pages) {
      fetchMessages(conversation._id, pagination.page + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4"
    >
      {loading && pagination && pagination.page > 1 && (
        <div className="mb-4 flex justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {messages.length === 0 && !loading && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="mx-auto mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet. Say hi!</p>
          </div>
        </div>
      )}

      <div className="space-y-0.5">
        {messages.map((msg, i) => {
          const senderId =
            typeof msg.sender_id === "object"
              ? msg.sender_id._id
              : msg.sender_id;
          const isOwn = senderId === user?._id;

          const prevMsg = messages[i - 1];
          const prevSenderId = prevMsg
            ? typeof prevMsg.sender_id === "object"
              ? prevMsg.sender_id._id
              : prevMsg.sender_id
            : null;
          const showSender = senderId !== prevSenderId;

          return (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={isOwn}
              showSender={showSender}
              onReply={onReply}
            />
          );
        })}
      </div>

      <TypingIndicator conversation={conversation} />
      <div ref={bottomRef} />
    </div>
  );
}
