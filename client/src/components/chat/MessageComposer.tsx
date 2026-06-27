import { useState, useRef } from "react";
import { uploadFile, getFileType } from "@/services/upload";
import { useToastStore } from "@/components/shared/Toast";
import type { Message } from "@/types";

interface MessageComposerProps {
  onSend: (content: string, messageType?: string, fileUrl?: string, replyTo?: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

export default function MessageComposer({
  onSend,
  onTypingStart,
  onTypingStop,
  replyingTo,
  onCancelReply,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const addToast = useToastStore((s) => s.addToast);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTypingStart();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || uploading) return;

    onSend(text.trim(), "text", undefined, replyingTo?._id);
    setText("");
    onCancelReply();
    onTypingStop();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    inputRef.current?.focus();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      addToast("File too large. Maximum size is 10MB.", "error");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadFile(file, setUploadProgress);
      const fileType = getFileType(file.name);
      const content = fileType === "image" ? "Sent an image" : file.name;
      onSend(content, fileType, url);
      addToast("File uploaded successfully", "success");
    } catch {
      addToast("Failed to upload file. Please try again.", "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      {replyingTo && (
        <div className="flex animate-fade-in items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2">
          <div className="min-w-0 flex-1 border-l-2 border-brand-400 pl-3">
            <p className="text-xs font-semibold text-brand-600">
              Replying to{" "}
              {typeof replyingTo.sender_id === "object"
                ? replyingTo.sender_id.display_name
                : "User"}
            </p>
            <p className="truncate text-xs text-slate-500">{replyingTo.content}</p>
          </div>
          <button onClick={onCancelReply} className="icon-btn ml-2 p-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {uploading && (
        <div className="px-4 pt-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-gradient transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 md:px-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="icon-btn disabled:opacity-50"
          title="Attach a file"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
          autoComplete="off"
          disabled={uploading}
        />

        <button
          type="submit"
          disabled={!text.trim() || uploading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-soft transition-all duration-200 hover:shadow-glow hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
