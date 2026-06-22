import { useState } from "react";
import api from "@/api/axios";
import { useChatStore } from "@/store/chatStore";
import { useToastStore } from "@/components/shared/Toast";
import type { Message } from "@/types";

interface MessageActionsProps {
  message: Message;
  isOwn: boolean;
  onReply: (message: Message) => void;
}

export default function MessageActions({ message, isOwn, onReply }: MessageActionsProps) {
  const [open, setOpen] = useState(false);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const addToast = useToastStore((s) => s.addToast);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/messages/${message._id}`);
      removeMessage(message._id);
      addToast("Message deleted", "success");
    } catch {
      addToast("Failed to delete message", "error");
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className={`absolute z-20 rounded-lg bg-white py-1 shadow-lg ${isOwn ? "right-0" : "left-0"}`}>
            <button
              onClick={() => { onReply(message); setOpen(false); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
            {isOwn && (
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
