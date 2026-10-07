"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingStep1Schema, OnboardingStep2Schema } from "@/features/auth/schemas";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ArrowLeft, Check, AlertCircle, Briefcase, Target } from "lucide-react";

const ROLES = [
  { id: "product-designer", title: "Product Designer", desc: "Crafting structured UX requirements & flows" },
  { id: "product-manager", title: "Product Manager", desc: "Setting clear product scope & PRDs" },
  { id: "founder", title: "Founder / Solopreneur", desc: "Moving from idea to implementation quickly" },
  { id: "software-engineer", title: "Software Engineer", desc: "Building software from technical design specs" },
  { id: "ai-builder", title: "AI Coding Builder", desc: "Generating prompt-ready specifications for Cursor/v0" },
];

const GOALS = [
  { id: "design-specs", title: "Generate Portable design.md", desc: "Get structured Markdown documentation before opening Figma or code." },
  { id: "team-handoff", title: "Engineering Handoff", desc: "Give developers unambiguous requirements, states, and user flows." },
  { id: "ai-agents", title: "AI Coding Agent Context", desc: "Feed clean, standardized context to AI coding assistants." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");

  // Errors
  const [stepError, setStepError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep1 = () => {
    setStepError(null);
    const result = OnboardingStep1Schema.safeParse({ role: selectedRole });
    if (!result.success) {
      setStepError("Please select a primary role to continue.");
      return;
    }
    setStep(2);
  };

  const handleComplete = () => {
    setStepError(null);
    const result = OnboardingStep2Schema.safeParse({ goal: selectedGoal });
    if (!result.success) {
      setStepError("Please select your primary goal to continue.");
      return;
    }

    setIsLoading(true);
    router.push("/projects/new");
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
          <span>Step {step} of 2</span>
          <span>
            {step === 1 && "Your Role"}
            {step === 2 && "Primary Goal"}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      {stepError && (
        <div
          role="alert"
          className="p-3.5 rounded-md bg-error-container border border-error/30 text-on-error-container flex items-start gap-2.5 text-xs font-medium animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <span>{stepError}</span>
        </div>
      )}

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span>What is your primary role?</span>
            </h2>
            <p className="text-xs text-on-surface-variant">
              Luma tailors its AI clarification questions to your perspective.
            </p>
          </div>

          <div className="space-y-2.5">
            {ROLES.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.id);
                    if (stepError) setStepError(null);
                  }}
                  className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-primary bg-primary-container/30 text-on-surface ring-1 ring-primary"
                      : "border-outline-variant/60 bg-surface hover:border-outline text-on-surface"
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">{r.title}</h3>
                    <p className="text-[11px] text-on-surface-variant">{r.desc}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            onClick={handleNextStep1}
            variant="primary"
            size="lg"
            className="w-full mt-4"
          >
            <span>Continue to Goal</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Primary Goal */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              <span>What is your primary goal?</span>
            </h2>
            <p className="text-xs text-on-surface-variant">
              How will you use generated design.md specifications?
            </p>
          </div>

          <div className="space-y-3">
            {GOALS.map((g) => {
              const isSelected = selectedGoal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGoal(g.id);
                    if (stepError) setStepError(null);
                  }}
                  className={`w-full p-4 rounded-lg border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-secondary bg-secondary-container/30 text-on-surface ring-1 ring-secondary"
                      : "border-outline-variant/60 bg-surface hover:border-outline text-on-surface"
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">{g.title}</h3>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{g.desc}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-secondary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setStep(1)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button
              type="button"
              onClick={handleComplete}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="flex-1 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Launch Workspace</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
