import { useState } from "react";
import ConversationItem from "./ConversationItem";
import UserSearchModal from "./UserSearchModal";
import CreateGroupModal from "./CreateGroupModal";
import Avatar from "@/components/shared/Avatar";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useUIStore } from "@/store/uiStore";
import type { Conversation } from "@/types";

interface ConversationSidebarProps {
  onNavigateProfile: () => void;
}

export default function ConversationSidebar({ onNavigateProfile }: ConversationSidebarProps) {
  const { user, logout } = useAuthStore();
  const { conversations, activeConversation, setActiveConversation } =
    useChatStore();
  const {
    searchModalOpen,
    groupModalOpen,
    openSearchModal,
    closeSearchModal,
    openGroupModal,
    closeGroupModal,
  } = useUIStore();
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
    <div className="flex h-full w-80 flex-col border-r border-slate-200 bg-white">
      {/* Profile header */}
      <div className="px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-2">
          <button
            className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-slate-50"
            onClick={onNavigateProfile}
            title="View profile"
          >
            <Avatar
              src={user?.photo_url}
              name={user?.display_name || "U"}
              size="md"
              online
              ring
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.display_name}
              </p>
              <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active now
              </p>
            </div>
          </button>
          <button
            onClick={logout}
            title="Log out"
            className="icon-btn"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search conversations"
            className="field bg-slate-50 pl-10"
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 px-4 pb-2 pt-3">
        <button onClick={openSearchModal} className="btn-primary flex-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
        <button onClick={openGroupModal} className="btn-ghost border border-slate-200 px-3" title="New group">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Section label */}
      <div className="flex items-center justify-between px-5 pb-1 pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Messages
        </span>
        {conversations.length > 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
            {conversations.length}
          </span>
        )}
      </div>

      {/* Conversation list */}
      <div className="scrollbar-slim flex-1 overflow-y-auto px-2 pb-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            {conversations.length === 0 ? (
              <>
                <p className="text-sm font-semibold text-slate-700">
                  No conversations yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Start a new chat to connect with friends.
                </p>
                <button
                  onClick={openSearchModal}
                  className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Start your first chat →
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-700">
                  No matches found
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try a different name or keyword.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((convo) => (
              <ConversationItem
                key={convo._id}
                conversation={convo}
                active={activeConversation?._id === convo._id}
                onClick={() => setActiveConversation(convo)}
              />
            ))}
          </div>
        )}
      </div>

      <UserSearchModal open={searchModalOpen} onClose={closeSearchModal} />
      <CreateGroupModal open={groupModalOpen} onClose={closeGroupModal} />
    </div>
  );
}
