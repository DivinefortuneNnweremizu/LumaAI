"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, Plus, Settings, Sparkles, FileText, LayoutDashboard } from "lucide-react";

interface SidebarProps {
  userPlan?: "FREE" | "PRO";
  onUpgradeClick?: () => void;
}

export function Sidebar({ userPlan = "FREE", onUpgradeClick }: SidebarProps) {
  const pathname = usePathname();

  const isProjectsActive = pathname.startsWith("/projects");
  const isSettingsActive = pathname.startsWith("/settings");

  return (
    <aside className="w-64 border-r border-outline-variant/60 bg-surface flex flex-col justify-between h-screen shrink-0 select-none">
      <div>
        {/* Brand */}
        <div className="p-5 border-b border-outline-variant/40 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
              L
            </div>
            <span className="font-bold text-base text-on-background tracking-tight">
              Luma
            </span>
          </Link>

          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
            {userPlan}
          </span>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          <Link
            href="/projects"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              isProjectsActive
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Projects</span>
          </Link>

          <Link
            href="/projects/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span>New Specification</span>
          </Link>
        </nav>
      </div>

      {/* Footer / Upgrade Pro badge */}
      <div className="p-4 border-t border-outline-variant/40 space-y-3">
        {userPlan === "FREE" && (
          <div className="p-3.5 rounded-lg bg-secondary-container/50 border border-secondary-container text-on-secondary-container">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mb-2.5">
              Unlock image analysis, section regeneration, and AI design review.
            </p>
            <button
              onClick={onUpgradeClick}
              className="w-full py-1.5 px-3 rounded text-xs font-bold bg-secondary text-on-secondary hover:opacity-90 transition-opacity"
            >
              Upgrade for $29
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 px-1">
          <span className="font-medium">Luma v1.0</span>
          <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded">Light Mode</span>
        </div>
      </div>
    </aside>
  );
}
