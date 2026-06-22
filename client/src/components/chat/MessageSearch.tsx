import { useState } from "react";
import api from "@/api/axios";
import Avatar from "@/components/shared/Avatar";
import type { Message } from "@/types";

interface MessageSearchProps {
  conversationId: string;
  open: boolean;
  onClose: () => void;
}

export default function MessageSearch({ conversationId, open, onClose }: MessageSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get<Message[]>("/api/messages/search", {
        params: { q: value, conversationId },
      });
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 top-full z-30 mt-1 w-80 rounded-lg border bg-white shadow-xl">
      <div className="flex items-center gap-2 border-b p-3">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search messages..."
          className="flex-1 text-sm outline-none"
          autoFocus
        />
        <button onClick={() => { onClose(); setQuery(""); setResults([]); }} className="text-gray-400 hover:text-gray-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {loading && <p className="p-4 text-center text-xs text-gray-400">Searching...</p>}

        {!loading && query.length >= 2 && results.length === 0 && (
          <p className="p-4 text-center text-xs text-gray-400">No messages found</p>
        )}

        {results.map((msg) => {
          const sender = typeof msg.sender_id === "object" ? msg.sender_id : null;
          return (
            <div key={msg._id} className="flex items-start gap-2 border-b px-3 py-2 last:border-0">
              <Avatar src={sender?.photo_url} name={sender?.display_name || "U"} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-700">{sender?.display_name}</p>
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-500">{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
