import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-[640px]",
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className={`w-full ${maxWidthClass} rounded-lg bg-surface text-on-surface border border-outline-variant shadow-xl overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/60">
          <h3 id="dialog-title" className="text-lg font-bold text-on-surface">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container transition-colors focus-visible:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
