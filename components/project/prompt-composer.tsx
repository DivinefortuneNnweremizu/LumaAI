"use client";

import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, Send, Paperclip } from "lucide-react";
import { Button } from "../ui/button";

interface PromptComposerProps {
  onSubmit: (title: string, description: string) => void;
  isLoading?: boolean;
  canUploadImages?: boolean;
}

export function PromptComposer({
  onSubmit,
  isLoading = false,
  canUploadImages = false,
}: PromptComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    const finalTitle = title.trim() || description.trim().slice(0, 30) + "...";
    onSubmit(finalTitle, description);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl bg-surface border border-outline-variant shadow-sm p-5 space-y-4 transition-all focus-within:border-primary/60 focus-within:shadow-md"
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
        <Sparkles className="w-4 h-4" />
        <span>Describe your Product Idea</span>
      </div>

      <input
        type="text"
        placeholder="Product Title (e.g. Acme Mobile Analytics Dashboard)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-base font-bold bg-transparent text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
      />

      <textarea
        rows={4}
        placeholder="Describe the product, key user personas, target features, or problem to solve... (Press ⌘+Enter to submit)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full text-sm bg-transparent text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none resize-none leading-relaxed"
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-outline-variant/40">
        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
          <button
            type="button"
            disabled={!canUploadImages}
            title={canUploadImages ? "Upload screenshot or moodboard" : "Upgrade to Pro for image analysis"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-outline-variant transition-colors ${
              canUploadImages
                ? "hover:bg-surface-container text-on-surface"
                : "opacity-60 cursor-not-allowed bg-surface-container-low"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-secondary" />
            <span>Attach Screenshot / Moodboard</span>
            {!canUploadImages && <span className="text-[10px] font-bold text-secondary uppercase ml-1">(Pro)</span>}
          </button>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!description.trim()}
          variant="primary"
          size="md"
        >
          <span>Generate design.md</span>
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
