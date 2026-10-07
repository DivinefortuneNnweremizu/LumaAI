"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";
import { ChatComposer } from "@/components/project/chat-composer";
import { ChatMessageBubble } from "@/components/project/chat-message";
import { ClarificationPrompt } from "@/components/project/clarification-prompt";
import { MarkdownViewer } from "@/components/editor/markdown-viewer";
import { useProjectChat } from "@/features/projects/use-project-chat";
import { FREE_ENTITLEMENTS } from "@/services/billing/entitlements";

export default function NewProjectPage() {
  const searchParams = useSearchParams();
  const existingProjectId = searchParams.get("project");
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    project,
    messages,
    pendingQuestions,
    isThinking,
    statusMessage,
    storageError,
    versions,
    activeVersion,
    isPanelOpen,
    setIsPanelOpen,
    setActiveVersionNumber,
    sendMessage,
    submitClarification,
  } = useProjectChat(existingProjectId);

  const entitlements = FREE_ENTITLEMENTS;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pendingQuestions, isThinking]);

  return (
    <div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row gap-4">
      {/* Chat Column */}
      <div className={`flex flex-col min-h-0 ${isPanelOpen ? "md:w-[420px] shrink-0" : "flex-1 max-w-3xl mx-auto w-full"}`}>
        <div className="flex items-center gap-3 pb-4 shrink-0">
          <Link
            href="/projects"
            className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-on-surface truncate flex-1">
            {project ? project.name : "New Specification"}
          </h1>
          {versions.length > 0 && (
            <button
              onClick={() => setIsPanelOpen((v) => !v)}
              className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
              title={isPanelOpen ? "Hide specification panel" : "Show specification panel"}
            >
              {isPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          )}
        </div>

        {storageError && (
          <div
            role="alert"
            className="mb-3 p-3 rounded-md bg-error-container border border-error/30 text-on-error-container flex items-start gap-2.5 text-xs font-medium shrink-0"
          >
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <span>{storageError}</span>
          </div>
        )}

        {messages.length === 0 && !isThinking ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2 max-w-sm">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-on-surface">Describe your product idea</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tell Luma what you&apos;re building. You can attach up to {entitlements.maxImagesPerMessage} reference
                images. Luma will ask up to two clarification questions, then write a full 13-section design.md.
              </p>
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto space-y-5 pb-4">
            {messages.map((m) => (
              <div key={m.id} className="space-y-3">
                <ChatMessageBubble message={m} />
                {m.clarificationQuestions && pendingQuestions && (
                  <div className="pl-10">
                    <ClarificationPrompt
                      questions={pendingQuestions}
                      onSubmit={submitClarification}
                      isLoading={isThinking}
                    />
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="px-4 py-2.5 rounded-xl rounded-tl-sm bg-surface-container text-on-surface-variant text-xs font-medium flex items-center">
                  {statusMessage || "Thinking..."}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-3 shrink-0">
          <ChatComposer
            onSend={sendMessage}
            isLoading={isThinking}
            maxImages={entitlements.maxImagesPerMessage}
            placeholder={
              pendingQuestions
                ? "Answer the questions above to continue..."
                : versions.length > 0
                ? "Ask for a change to the specification..."
                : "Describe your product idea..."
            }
          />
        </div>
      </div>

      {/* Specification Panel */}
      {isPanelOpen && activeVersion && project && (
        <div className="flex-1 min-h-0 min-w-0 border-l border-outline-variant/60 pl-4 overflow-y-auto animate-in fade-in duration-200">
          <MarkdownViewer
            content={activeVersion.markdown}
            projectName={project.name}
            versionNumber={activeVersion.versionNumber}
            compact
            availableVersions={versions.map((v) => v.versionNumber)}
            onSelectVersion={setActiveVersionNumber}
          />
        </div>
      )}
    </div>
  );
}
