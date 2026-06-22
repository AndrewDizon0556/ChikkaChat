import { useState } from "react";
import Modal from "@/components/shared/Modal";
import Avatar from "@/components/shared/Avatar";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useChatStore } from "@/store/chatStore";
import { useToastStore } from "@/components/shared/Toast";
import api from "@/api/axios";
import type { Conversation, User } from "@/types";

interface GroupManageModalProps {
  open: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export default function GroupManageModal({ open, onClose, conversation }: GroupManageModalProps) {
  const user = useAuthStore((s) => s.user);
  const { searchResults, searchUsers, clearSearch } = useUserStore();
  const { fetchConversations, setActiveConversation } = useChatStore();
  const addToast = useToastStore((s) => s.addToast);
  const [groupName, setGroupName] = useState(conversation.name || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const isAdmin = conversation.admin_id === user?._id;

  const handleRename = async () => {
    if (!groupName.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.put<Conversation>(`/api/conversations/${conversation._id}`, {
        name: groupName.trim(),
        members: conversation.members.map((m) => m._id),
      });
      setActiveConversation(data);
      await fetchConversations();
      addToast("Group renamed", "success");
    } catch {
      addToast("Failed to rename group", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async (newMember: User) => {
    try {
      const memberIds = [...conversation.members.map((m) => m._id), newMember._id];
      await api.put(`/api/conversations/${conversation._id}`, {
        name: conversation.name,
        members: memberIds,
      });
      await fetchConversations();
      addToast(`${newMember.display_name} added`, "success");
      setSearchQuery("");
      clearSearch();
    } catch {
      addToast("Failed to add member", "error");
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    try {
      const memberIds = conversation.members.filter((m) => m._id !== memberId).map((m) => m._id);
      await api.put(`/api/conversations/${conversation._id}`, {
        name: conversation.name,
        members: memberIds,
      });
      await fetchConversations();
      addToast(`${memberName} removed`, "success");
    } catch {
      addToast("Failed to remove member", "error");
    }
  };

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      await searchUsers(value);
    } else {
      clearSearch();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    clearSearch();
    onClose();
  };

  const existingIds = new Set(conversation.members.map((m) => m._id));

  return (
    <Modal open={open} onClose={handleClose} title="Group Settings">
      <div className="space-y-5">
        {/* Rename */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">Group Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              disabled={!isAdmin}
            />
            {isAdmin && (
              <button
                onClick={handleRename}
                disabled={saving || !groupName.trim()}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Save
              </button>
            )}
          </div>
        </div>

        {/* Members */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Members ({conversation.members.length})
          </label>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {conversation.members.map((m) => (
              <div key={m._id} className="flex items-center justify-between rounded-lg px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <Avatar src={m.photo_url} name={m.display_name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {m.display_name}
                      {m._id === user?._id && <span className="ml-1 text-xs text-gray-400">(You)</span>}
                      {m._id === conversation.admin_id && <span className="ml-1 text-xs text-blue-500">Admin</span>}
                    </p>
                  </div>
                </div>
                {isAdmin && m._id !== user?._id && (
                  <button
                    onClick={() => handleRemoveMember(m._id, m.display_name)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add member */}
        {isAdmin && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Add Member</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-2 max-h-32 overflow-y-auto">
              {searchResults
                .filter((u) => !existingIds.has(u._id))
                .map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleAddMember(u)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-gray-50"
                  >
                    <Avatar src={u.photo_url} name={u.display_name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.display_name}</p>
                      <p className="truncate text-xs text-gray-400">{u.email}</p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
