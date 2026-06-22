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

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${
        active ? "bg-blue-50 border-r-2 border-blue-500" : ""
      }`}
    >
      <Avatar
        src={photoUrl}
        name={displayName}
        online={isGroup ? undefined : isOnline}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate font-medium text-gray-800">{displayName}</p>
          {timeStr && (
            <span className="ml-2 shrink-0 text-xs text-gray-400">{timeStr}</span>
          )}
        </div>
        {lastMsg && (
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {lastMsg.content}
          </p>
        )}
      </div>
    </div>
  );
}
