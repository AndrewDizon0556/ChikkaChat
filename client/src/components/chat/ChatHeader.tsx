import { useState } from "react";
import Avatar from "@/components/shared/Avatar";
import MessageSearch from "./MessageSearch";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import type { Conversation } from "@/types";

interface ChatHeaderProps {
  conversation: Conversation;
  onInfoClick?: () => void;
  onBackClick?: () => void;
}

export default function ChatHeader({ conversation, onInfoClick, onBackClick }: ChatHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const onlineUsers = useUserStore((s) => s.onlineUsers);
  const [searchOpen, setSearchOpen] = useState(false);

  const isGroup = conversation.type === "group";
  const otherMember = conversation.members.find((m) => m._id !== user?._id);
  const displayName = isGroup
    ? conversation.name || "Group Chat"
    : otherMember?.display_name || "Unknown";
  const photoUrl = isGroup ? undefined : otherMember?.photo_url;
  const isOnline = otherMember ? onlineUsers.has(otherMember._id) : false;

  return (
    <div className="relative flex items-center justify-between border-b bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        {onBackClick && (
          <button onClick={onBackClick} className="mr-1 rounded-lg p-1 text-gray-500 hover:bg-gray-100 md:hidden">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <Avatar
          src={photoUrl}
          name={displayName}
          online={isGroup ? undefined : isOnline}
        />
        <div>
          <h3 className="font-semibold text-gray-800">{displayName}</h3>
          <p className="text-xs text-gray-500">
            {isGroup
              ? `${conversation.members.length} members`
              : isOnline
                ? "Online"
                : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          title="Search messages"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {isGroup && onInfoClick && (
          <button
            onClick={onInfoClick}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            title="Group settings"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>

      <MessageSearch
        conversationId={conversation._id}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
