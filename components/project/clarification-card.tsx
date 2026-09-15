"use client";

import React, { useState } from "react";
import { HelpCircle, Check, ArrowRight } from "lucide-react";
import { ClarificationQuestion } from "@/services/ai/types";
import { Button } from "../ui/button";

interface ClarificationCardProps {
  questions: ClarificationQuestion[];
  onComplete: (answers: Array<{ question: string; answer: string }>) => void;
  isLoading?: boolean;
}

export function ClarificationCard({
  questions,
  onComplete,
  isLoading = false,
}: ClarificationCardProps) {
  // Hard cap at 2 questions per ai-behavior.md
  const limitedQuestions = questions.slice(0, 2);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = limitedQuestions.map((q) => ({
      question: q.question,
      answer: answers[q.id]?.trim() || "Skipped (AI will make a clear, explicitly labeled assumption)",
    }));
    onComplete(formatted);
  };

  if (limitedQuestions.length === 0) return null;

  return (
    <div
      className="w-full rounded-xl bg-surface border border-outline-variant p-6 shadow-sm space-y-6 animate-in fade-in duration-200"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
        <HelpCircle className="w-4 h-4 text-primary" />
        <span>AI Clarifications (Max 2 Questions)</span>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        Help refine the specification by answering these brief questions, or click &quot;Generate with Assumptions&quot; to let Luma label its inference explicitly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {limitedQuestions.map((q, idx) => (
          <div key={q.id} className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/50 space-y-2">
            <label htmlFor={`q-${q.id}`} className="text-xs font-bold text-on-surface flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              <span>{q.question}</span>
            </label>

            {q.context && (
              <p className="text-[11px] text-on-surface-variant italic pl-7">
                Why we ask: {q.context}
              </p>
            )}

            <input
              id={`q-${q.id}`}
              type="text"
              placeholder="Your answer or preference..."
              value={answers[q.id] || ""}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-md bg-surface border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            />
          </div>
        ))}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="text-xs text-on-surface-variant underline hover:text-on-surface transition-colors"
          >
            Skip all & use assumptions
          </button>

          <Button type="submit" isLoading={isLoading} variant="primary" size="md">
            <span>Proceed to Generation</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
