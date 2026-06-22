import { useState } from "react";
import Modal from "@/components/shared/Modal";
import Avatar from "@/components/shared/Avatar";
import { useUserStore } from "@/store/userStore";
import { useChatStore } from "@/store/chatStore";
import type { User } from "@/types";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchResults, searchUsers, clearSearch } = useUserStore();
  const { createConversation, setActiveConversation } = useChatStore();

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      setLoading(true);
      await searchUsers(value);
      setLoading(false);
    } else {
      clearSearch();
    }
  };

  const toggleMember = (user: User) => {
    setSelectedMembers((prev) =>
      prev.find((m) => m._id === user._id)
        ? prev.filter((m) => m._id !== user._id)
        : [...prev, user]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedMembers.length < 2) return;

    const convo = await createConversation(
      "group",
      selectedMembers.map((m) => m._id),
      groupName.trim()
    );
    setActiveConversation(convo);
    handleClose();
  };

  const handleClose = () => {
    setGroupName("");
    setQuery("");
    setSelectedMembers([]);
    clearSearch();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Group">
      <div className="space-y-4">
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          autoFocus
        />

        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((m) => (
              <span
                key={m._id}
                className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {m.display_name}
                <button
                  onClick={() => toggleMember(m)}
                  className="ml-1 text-blue-400 hover:text-blue-600"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users to add..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <div className="max-h-40 overflow-y-auto">
          {loading && (
            <p className="py-2 text-center text-sm text-gray-400">Searching...</p>
          )}

          {searchResults
            .filter((u) => !selectedMembers.find((m) => m._id === u._id))
            .map((u) => (
              <button
                key={u._id}
                onClick={() => toggleMember(u)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50"
              >
                <Avatar src={u.photo_url} name={u.display_name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.display_name}</p>
                  <p className="truncate text-xs text-gray-400">{u.email}</p>
                </div>
              </button>
            ))}
        </div>

        <button
          onClick={handleCreate}
          disabled={!groupName.trim() || selectedMembers.length < 2}
          className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Create Group ({selectedMembers.length} members)
        </button>
      </div>
    </Modal>
  );
}
