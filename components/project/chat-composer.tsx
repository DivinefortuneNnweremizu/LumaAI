"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { ChatImageAttachment } from "@/features/projects/chat-types";

interface ChatComposerProps {
  onSend: (text: string, images: ChatImageAttachment[]) => void;
  isLoading?: boolean;
  maxImages: number;
  placeholder?: string;
}

export function ChatComposer({
  onSend,
  isLoading = false,
  maxImages,
  placeholder = "Describe your product idea, or ask for a change...",
}: ChatComposerProps) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<ChatImageAttachment[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAttachMore = maxImages < 0 || images.length < maxImages;

  // localStorage typically caps out around 5-10MB per origin, shared across
  // every project's chat history — keep each image well under that so a
  // couple of attachments don't silently blow the whole quota.
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setAttachError(null);

    const selected = Array.from(files);
    const notImages = selected.filter((f) => !f.type.startsWith("image/"));
    const validImages = selected.filter((f) => f.type.startsWith("image/"));
    const tooLarge = validImages.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    const incoming = validImages.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);

    const skippedReasons: string[] = [];
    if (notImages.length > 0) {
      skippedReasons.push(
        notImages.length === 1 ? `"${notImages[0].name}" isn't an image` : `${notImages.length} files weren't images`
      );
    }
    if (tooLarge.length > 0) {
      skippedReasons.push(
        tooLarge.length === 1
          ? `"${tooLarge[0].name}" is larger than 2MB`
          : `${tooLarge.length} images are larger than 2MB`
      );
    }

    const room = maxImages < 0 ? incoming.length : Math.max(0, maxImages - images.length);
    const accepted = incoming.slice(0, room);
    const overLimit = incoming.length > accepted.length;

    if (overLimit) {
      skippedReasons.push(`only ${maxImages} image${maxImages === 1 ? "" : "s"} can be attached at a time`);
    }

    if (skippedReasons.length > 0) {
      setAttachError(`Some files were skipped — ${skippedReasons.join("; ")}.`);
    }

    if (accepted.length === 0) return;

    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), name: file.name, dataUrl: reader.result as string },
        ]);
      };
      reader.onerror = () => {
        setAttachError(`Couldn't read "${file.name}". Please try again.`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setAttachError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && images.length === 0) return;
    onSend(text.trim(), images);
    setText("");
    setImages([]);
    setAttachError(null);
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
      className="w-full rounded-xl bg-surface border border-outline-variant shadow-sm p-3 space-y-3 transition-all focus-within:border-primary/60 focus-within:shadow-md"
    >
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative w-16 h-16 rounded-md overflow-hidden border border-outline-variant group">
              <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                aria-label={`Remove ${img.name}`}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-on-surface/70 text-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {attachError && (
        <p role="alert" className="text-xs text-error font-medium">
          {attachError}
        </p>
      )}

      <textarea
        rows={2}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full text-sm bg-transparent text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none resize-none leading-relaxed"
      />

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-outline-variant/40">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!canAttachMore}
            title={
              canAttachMore
                ? "Attach a screenshot or moodboard"
                : `You can attach up to ${maxImages} image${maxImages === 1 ? "" : "s"} at a time`
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-outline-variant transition-colors text-xs font-semibold ${
              canAttachMore
                ? "hover:bg-surface-container text-on-surface"
                : "opacity-50 cursor-not-allowed bg-surface-container-low"
            }`}
          >
            <ImagePlus className="w-3.5 h-3.5 text-secondary" />
            <span>Attach image{maxImages !== 1 ? "s" : ""}</span>
            {maxImages >= 0 && (
              <span className="text-[10px] text-on-surface-variant">
                {images.length}/{maxImages}
              </span>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || (!text.trim() && images.length === 0)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary text-on-primary disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-all shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
