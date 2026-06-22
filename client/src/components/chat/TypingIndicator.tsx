import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import type { Conversation } from "@/types";

interface TypingIndicatorProps {
  conversation: Conversation;
}

export default function TypingIndicator({ conversation }: TypingIndicatorProps) {
  const user = useAuthStore((s) => s.user);
  const typingUsers = useUserStore((s) => s.typingUsers);

  const typers = typingUsers.get(conversation._id);
  if (!typers || typers.size === 0) return null;

  const typingNames = conversation.members
    .filter((m) => m._id !== user?._id && typers.has(m._id))
    .map((m) => m.display_name);

  if (typingNames.length === 0) return null;

  const text =
    typingNames.length === 1
      ? `${typingNames[0]} is typing`
      : `${typingNames.join(", ")} are typing`;

  return (
    <div className="px-6 py-1">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="flex gap-0.5">
          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
}
