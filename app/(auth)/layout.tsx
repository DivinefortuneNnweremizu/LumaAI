import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-background text-on-background px-4 py-6 md:px-8">
      {/* Auth Navigation Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm">
            L
          </div>
          <span className="font-bold text-lg text-on-background tracking-tight">
            Luma
          </span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Product Design Workspace</span>
        </div>
      </header>

      {/* Auth Content Card Container */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-surface border border-outline-variant rounded-xl p-8 shadow-sm">
          {children}
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="max-w-5xl w-full mx-auto py-3 text-center text-xs text-on-surface-variant border-t border-outline-variant/40">
        <span>&copy; {new Date().getFullYear()} Luma Design Platform. Portable Markdown & WCAG 2.1 AA Compliant.</span>
      </footer>
    </div>
  );
}
