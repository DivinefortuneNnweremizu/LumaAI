"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PromptComposer } from "@/components/project/prompt-composer";
import { ClarificationCard } from "@/components/project/clarification-card";
import { ClarificationQuestion } from "@/services/ai/types";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<"compose" | "clarify" | "generating">("compose");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([]);
  const [statusMessage, setStatusMessage] = useState("Understanding your product...");

  const handleComposeSubmit = async (inputTitle: string, inputDescription: string) => {
    setTitle(inputTitle);
    setDescription(inputDescription);
    setStep("clarify");

    // Fetch up to 2 clarification questions
    try {
      const res = await fetch("/api/design/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaDescription: inputDescription }),
      });
      const data = await res.json();
      if (data.data?.questions) {
        setQuestions(data.data.questions);
      } else {
        setQuestions([
          {
            id: "q1",
            question: "What primary user role or persona should be emphasized first in the workflow?",
            context: "Clarifying target user focus for initial navigation.",
          },
          {
            id: "q2",
            question: "Will users need offline access or mobile push notifications?",
            context: "Determining platform capabilities and technical bounds.",
          },
        ]);
      }
    } catch {
      setQuestions([
        {
          id: "q1",
          question: "What primary user role should be prioritized?",
          context: "Clarifying target audience scope.",
        },
      ]);
    }
  };

  const handleClarificationComplete = async (answers: Array<{ question: string; answer: string }>) => {
    setStep("generating");

    // Staged progress updates per ai-behavior.md
    const stages = [
      "Understanding your product...",
      "Identifying design patterns...",
      "Creating user flows & Information Architecture...",
      "Writing 13-section design.md...",
      "Reviewing accessibility & finalizing specification...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < stages.length) {
        setStatusMessage(stages[i]);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      const res = await fetch("/api/design/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: title,
          ideaDescription: description,
          answers,
        }),
      });

      const data = await res.json();
      clearInterval(interval);
      if (data.data?.projectId) {
        router.push(`/projects/${data.data.projectId}`);
      } else {
        router.push("/projects/demo-1");
      }
    } catch {
      clearInterval(interval);
      router.push("/projects/demo-1");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/projects"
          className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-on-surface">New Specification</h1>
      </div>

      {step === "compose" && (
        <PromptComposer onSubmit={handleComposeSubmit} />
      )}

      {step === "clarify" && (
        <ClarificationCard
          questions={questions}
          onComplete={handleClarificationComplete}
        />
      )}

      {step === "generating" && (
        <div className="p-12 rounded-xl bg-surface border border-outline-variant text-center space-y-6 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-on-surface">{statusMessage}</h3>
            <p className="text-xs text-on-surface-variant">
              Luma is assembling facts and labeling explicit assumptions for your design.md document.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
