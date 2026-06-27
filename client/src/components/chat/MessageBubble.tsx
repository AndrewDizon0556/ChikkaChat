import Avatar from "@/components/shared/Avatar";
import MessageActions from "./MessageActions";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSender: boolean;
  onReply: (message: Message) => void;
}

export default function MessageBubble({
  message,
  isOwn,
  showSender,
  onReply,
}: MessageBubbleProps) {
  const sender =
    typeof message.sender_id === "object" ? message.sender_id : null;
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderContent = () => {
    if (message.message_type === "image" && message.file_url) {
      return (
        <div>
          <img
            src={message.file_url}
            alt="Shared image"
            className="max-w-[240px] rounded-lg"
            loading="lazy"
          />
          {message.content && message.content !== "Sent an image" && (
            <p className="mt-1">{message.content}</p>
          )}
        </div>
      );
    }

    if (message.message_type === "file" && message.file_url) {
      return (
        <div>
          <a
            href={message.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
              isOwn
                ? "border-white/30 hover:bg-white/10"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="truncate text-sm">{message.content}</span>
          </a>
        </div>
      );
    }

    if (message.reply_to && typeof message.reply_to === "object") {
      return (
        <div>
          <div
            className={`mb-1 rounded border-l-2 px-2 py-1 text-xs ${
              isOwn
                ? "border-white/50 bg-white/15"
                : "border-slate-300 bg-slate-100"
            }`}
          >
            <p className="truncate opacity-75">{message.reply_to.content}</p>
          </div>
          <p>{message.content}</p>
        </div>
      );
    }

    return <p>{message.content}</p>;
  };

  return (
    <div className={`group flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
      <div className={`flex max-w-[78%] items-start gap-2 md:max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
        {!isOwn && showSender && (
          <div className="mt-auto">
            <Avatar
              src={sender?.photo_url}
              name={sender?.display_name || "U"}
              size="sm"
            />
          </div>
        )}
        {!isOwn && !showSender && <div className="w-9" />}

        <div className={`flex items-center gap-1 ${isOwn ? "flex-row-reverse" : ""}`}>
          <div>
            {!isOwn && showSender && sender && (
              <p className="mb-1 ml-1 text-xs font-semibold text-slate-500">
                {sender.display_name}
              </p>
            )}
            <div
              className={`animate-pop-in rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                isOwn
                  ? "rounded-br-md bg-brand-gradient text-white shadow-soft"
                  : "rounded-bl-md border border-slate-100 bg-white text-slate-800 shadow-soft"
              }`}
            >
              {renderContent()}
              <p
                className={`mt-1 text-right text-[10px] ${
                  isOwn ? "text-white/70" : "text-slate-400"
                }`}
              >
                {time}
              </p>
            </div>
          </div>

          <MessageActions message={message} isOwn={isOwn} onReply={onReply} />
        </div>
      </div>
    </div>
  );
}
