import { useState } from "react";
import ConversationItem from "./ConversationItem";
import UserSearchModal from "./UserSearchModal";
import CreateGroupModal from "./CreateGroupModal";
import Avatar from "@/components/shared/Avatar";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import type { Conversation } from "@/types";

interface ConversationSidebarProps {
  onNavigateProfile: () => void;
}

export default function ConversationSidebar({ onNavigateProfile }: ConversationSidebarProps) {
  const { user, logout } = useAuthStore();
  const { conversations, activeConversation, setActiveConversation } =
    useChatStore();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filtered = conversations.filter((c: Conversation) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    if (c.type === "group") return c.name?.toLowerCase().includes(q);
    return c.members.some(
      (m) =>
        m._id !== user?._id &&
        m.display_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex w-80 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={onNavigateProfile}
          >
            <Avatar
              src={user?.photo_url}
              name={user?.display_name || "U"}
              size="sm"
              online
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user?.display_name}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setSearchModalOpen(true)}
              title="New chat"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => setGroupModalOpen(true)}
              title="New group"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={logout}
              title="Logout"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-3">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            {conversations.length === 0
              ? "No conversations yet. Click + to start one."
              : "No matches found."}
          </div>
        )}
        {filtered.map((convo) => (
          <ConversationItem
            key={convo._id}
            conversation={convo}
            active={activeConversation?._id === convo._id}
            onClick={() => setActiveConversation(convo)}
          />
        ))}
      </div>

      <UserSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      <CreateGroupModal
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
      />
    </div>
  );
}
