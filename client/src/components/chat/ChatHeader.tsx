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
    <div className="relative z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onBackClick && (
          <button onClick={onBackClick} className="icon-btn -ml-1 md:hidden">
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
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-800">{displayName}</h3>
          <p className="flex items-center gap-1.5 text-xs">
            {isGroup ? (
              <span className="text-slate-500">
                {conversation.members.length} members
              </span>
            ) : (
              <>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isOnline ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                <span className={isOnline ? "text-emerald-600" : "text-slate-400"}>
                  {isOnline ? "Active now" : "Offline"}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="icon-btn"
          title="Search messages"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {isGroup && onInfoClick && (
          <button
            onClick={onInfoClick}
            className="icon-btn"
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
