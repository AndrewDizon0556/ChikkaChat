import { useState } from "react";
import Modal from "@/components/shared/Modal";
import Avatar from "@/components/shared/Avatar";
import { useUserStore } from "@/store/userStore";
import { useChatStore } from "@/store/chatStore";
import type { User } from "@/types";

interface UserSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UserSearchModal({ open, onClose }: UserSearchModalProps) {
  const [query, setQuery] = useState("");
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

  const handleSelectUser = async (selectedUser: User) => {
    const convo = await createConversation("private", [selectedUser._id]);
    setActiveConversation(convo);
    handleClose();
  };

  const handleClose = () => {
    setQuery("");
    clearSearch();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="New Conversation">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        autoFocus
      />

      <div className="mt-4 max-h-64 overflow-y-auto">
        {loading && (
          <p className="py-4 text-center text-sm text-gray-400">Searching...</p>
        )}

        {!loading && query.length >= 2 && searchResults.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">No users found</p>
        )}

        {searchResults.map((u) => (
          <button
            key={u._id}
            onClick={() => handleSelectUser(u)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50"
          >
            <Avatar src={u.photo_url} name={u.display_name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {u.display_name}
              </p>
              <p className="truncate text-xs text-gray-400">{u.email}</p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
