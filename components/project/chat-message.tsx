"use client";

import { Sparkles, User } from "lucide-react";
import { ChatMessage } from "@/features/projects/chat-types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-primary-container text-on-primary-container" : "bg-secondary-container text-on-secondary-container"
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.images.map((img) => (
              <img
                key={img.id}
                src={img.dataUrl}
                alt={img.name}
                className="w-24 h-24 rounded-md object-cover border border-outline-variant"
              />
            ))}
          </div>
        )}

        {message.text && (
          <div
            className={`px-4 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
              isUser
                ? "bg-primary text-on-primary rounded-tr-sm"
                : "bg-surface-container text-on-surface rounded-tl-sm"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
