import Avatar from "@/components/shared/Avatar";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import type { Conversation } from "@/types";

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  active,
  onClick,
}: ConversationItemProps) {
  const user = useAuthStore((s) => s.user);
  const onlineUsers = useUserStore((s) => s.onlineUsers);

  const isGroup = conversation.type === "group";
  const otherMember = conversation.members.find((m) => m._id !== user?._id);
  const displayName = isGroup
    ? conversation.name || "Group Chat"
    : otherMember?.display_name || "Unknown";
  const photoUrl = isGroup ? undefined : otherMember?.photo_url;
  const isOnline = otherMember ? onlineUsers.has(otherMember._id) : false;

  const lastMsg = conversation.last_message;
  const timeStr = lastMsg?.created_at
    ? new Date(lastMsg.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const preview = lastMsg?.content || "No messages yet";

  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
        active
          ? "bg-brand-gradient-soft ring-1 ring-brand-100"
          : "hover:bg-slate-50"
      }`}
    >
      <div className="relative">
        <Avatar
          src={photoUrl}
          name={displayName}
          online={isGroup ? undefined : isOnline}
        />
        {isGroup && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-brand-500 shadow-soft">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={`truncate text-sm font-semibold ${
              active ? "text-brand-900" : "text-slate-800"
            }`}
          >
            {displayName}
          </p>
          {timeStr && (
            <span
              className={`shrink-0 text-[11px] font-medium ${
                active ? "text-brand-500" : "text-slate-400"
              }`}
            >
              {timeStr}
            </span>
          )}
        </div>
        <p
          className={`mt-0.5 truncate text-xs ${
            lastMsg ? "text-slate-500" : "italic text-slate-400"
          }`}
        >
          {preview}
        </p>
      </div>
    </button>
  );
}
