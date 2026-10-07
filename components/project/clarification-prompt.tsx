"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ClarificationQuestion } from "@/services/ai/types";
import { Button } from "../ui/button";

interface ClarificationPromptProps {
  questions: ClarificationQuestion[];
  onSubmit: (answers: Array<{ question: string; answer: string }>) => void;
  isLoading?: boolean;
}

export function ClarificationPrompt({
  questions,
  onSubmit,
  isLoading = false,
}: ClarificationPromptProps) {
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
    onSubmit(formatted);
  };

  if (limitedQuestions.length === 0) return null;

  return (
    <div
      className="w-full rounded-xl bg-surface-container-low border border-outline-variant/60 p-4 space-y-4"
      aria-live="polite"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {limitedQuestions.map((q, idx) => (
          <div key={q.id} className="space-y-1.5">
            <label htmlFor={`q-${q.id}`} className="text-xs font-bold text-on-surface flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{q.question}</span>
            </label>

            <input
              id={`q-${q.id}`}
              type="text"
              placeholder="Your answer or preference..."
              value={answers[q.id] || ""}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-md bg-surface border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none ml-7"
              style={{ width: "calc(100% - 1.75rem)" }}
            />
          </div>
        ))}

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            className="text-xs text-on-surface-variant underline hover:text-on-surface transition-colors"
          >
            Skip & use assumptions
          </button>

          <Button type="submit" isLoading={isLoading} variant="primary" size="sm">
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
