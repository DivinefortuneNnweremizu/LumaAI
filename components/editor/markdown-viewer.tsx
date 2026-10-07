"use client";

import React, { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "../ui/button";

interface MarkdownViewerProps {
  content: string;
  projectName: string;
  versionNumber?: number;
  compact?: boolean;
  availableVersions?: number[];
  onSelectVersion?: (versionNumber: number) => void;
}

export function MarkdownViewer({
  content,
  projectName,
  versionNumber = 1,
  compact = false,
  availableVersions,
  onSelectVersion,
}: MarkdownViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-design.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-full space-y-4 ${compact ? "" : "max-w-4xl mx-auto space-y-6"}`}>
      {/* Document Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface border border-outline-variant shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          {availableVersions && availableVersions.length > 1 && onSelectVersion ? (
            <select
              value={versionNumber}
              onChange={(e) => onSelectVersion(Number(e.target.value))}
              aria-label="Select version"
              className="h-8 rounded bg-primary-container text-on-primary-container font-bold text-xs px-2 border-none focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {availableVersions.map((v) => (
                <option key={v} value={v}>
                  v{v}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
              v{versionNumber}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-on-surface truncate">{projectName} Specification</h3>
            {!compact && <span className="text-xs text-on-surface-variant">Validated 13-Section design.md</span>}
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-xs font-semibold border border-outline-variant"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-on-surface-variant" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <Button onClick={handleDownload} variant="primary" size="sm">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Export .md</span>
          </Button>
        </div>
      </div>

      {/* Rendered Document View */}
      <article
        className={`w-full rounded-xl bg-surface border border-outline-variant shadow-sm font-sans space-y-6 leading-relaxed text-on-surface ${
          compact ? "p-5" : "p-8 md:p-12"
        }`}
      >
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-on-surface overflow-x-auto">
          {content}
        </pre>
      </article>
    </div>
  );
}
