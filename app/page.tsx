import Link from "next/link";
import { ArrowRight, FileText, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col justify-between bg-background text-on-background px-6 py-8 md:px-12 lg:px-20 selection:bg-primary-container">
      {/* Header */}
      <header className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
            L
          </div>
          <span className="font-bold text-xl tracking-tight text-on-background">
            Luma
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium border border-outline-variant">
            Specification Generator
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            href="/sign-up"
            className="text-sm font-semibold text-on-background hover:text-primary transition-colors"
          >
            Sign In / Sign Up
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-on-primary font-medium text-sm hover:opacity-95 transition-all shadow-sm focus-visible:outline-none"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </header>

      {/* Main Content Area - Minimalistic & 100vh Centered */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>AI-Powered Product Design Platform</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-background tracking-tight leading-tight max-w-3xl mb-6">
          Transform product ideas into implementation-ready specifications.
        </h1>

        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl font-normal leading-relaxed mb-10">
          Describe your vision in plain text, screenshots, or moodboards. Luma generates a comprehensive, portable <code className="px-2 py-1 rounded bg-surface-container text-primary font-mono text-sm font-medium">design.md</code> file before Figma or code begins.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-md bg-primary text-on-primary font-semibold text-base shadow-sm hover:opacity-95 transition-all focus-visible:outline-none"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-surface-container text-on-surface font-semibold text-base hover:bg-surface-container-high transition-all border border-outline-variant focus-visible:outline-none"
          >
            <FileText className="w-4 h-4 text-on-surface-variant" />
            View Sample Spec
          </a>
        </div>

        {/* Minimal Highlights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full mt-14 pt-8 border-t border-outline-variant/60 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-surface-container text-primary mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-on-background">13-Section Spec</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Complete user flows, IA, components, and states.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-surface-container text-secondary mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-on-background">Fast Generation</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Streamed progress in &lt;30 seconds with 2-question limit.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-surface-container text-tertiary mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-on-background">Portable Markdown</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Standard GFM markdown ready for GitHub, Notion or AI coding agents.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between max-w-6xl w-full mx-auto py-2 border-t border-outline-variant/40 text-xs text-on-surface-variant">
        <span>&copy; {new Date().getFullYear()} Luma Design Specification Platform. All rights reserved.</span>
        <div className="flex items-center gap-6 mt-2 sm:mt-0 font-medium">
          <span>Light Mode Default</span>
          <span>•</span>
          <span>WCAG 2.1 AA</span>
          <span>•</span>
          <span>Flutterwave Ready</span>
        </div>
      </footer>
    </div>
  );
}
