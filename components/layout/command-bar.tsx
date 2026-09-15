"use client";

import { useEffect, useState } from "react";
import { Search, FileText, Plus, Command } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-on-background/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-surface text-on-surface border border-outline-variant shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-outline-variant/60">
          <Search className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search projects... (Press Esc to exit)"
            className="w-full py-3.5 bg-transparent text-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant/60"
          />
        </div>

        <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Quick Actions
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/projects/new");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left hover:bg-surface-container transition-colors"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span>Create New Specification</span>
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/projects");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left hover:bg-surface-container transition-colors"
          >
            <FileText className="w-4 h-4 text-on-surface-variant" />
            <span>Go to Projects Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
