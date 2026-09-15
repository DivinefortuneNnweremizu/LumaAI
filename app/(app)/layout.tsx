"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { CommandBar } from "@/components/layout/command-bar";
import { UpgradeDialog } from "@/components/billing/upgrade-dialog";
import { Search, Sparkles } from "lucide-react";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<"FREE" | "PRO">("FREE");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-background">
      {/* Sidebar */}
      <Sidebar userPlan={userPlan} onUpgradeClick={() => setIsUpgradeOpen(true)} />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-outline-variant/60 bg-surface flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                });
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-surface-container text-xs text-on-surface-variant hover:bg-surface-container-high transition-colors border border-outline-variant/60"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search or type command...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface text-[10px] font-mono border border-outline-variant">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {userPlan === "FREE" && (
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded bg-secondary-container text-on-secondary-container hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Upgrade Pro</span>
              </button>
            )}

            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
              U
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
      </div>

      {/* Command Bar Modal */}
      <CommandBar />

      {/* Upgrade Pro Modal */}
      <UpgradeDialog isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </div>
  );
}
