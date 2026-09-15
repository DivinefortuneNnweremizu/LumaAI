"use client";

import React, { useState } from "react";
import { Check, Sparkles, Shield, Zap } from "lucide-react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeDialog({ isOpen, onClose }: UpgradeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Upgrade to Luma Pro">
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-secondary-container/60 text-on-secondary-container flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">Accelerate your product design workflow</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Unlock unlimited specifications, moodboard & screenshot analysis, section regeneration, and AI design reviews.
            </p>
          </div>
        </div>

        {/* Plan card */}
        <div className="p-6 rounded-xl border-2 border-primary bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Pro Plan</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-on-surface">$29</span>
                <span className="text-xs text-on-surface-variant">/ month</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold">
              Most Popular
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-on-surface pt-2 border-t border-outline-variant/60">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Unlimited active specifications</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Screenshot & Moodboard multimodal analysis</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Section regeneration & version diff comparison</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>AI Design Review against WCAG & usability heuristics</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Priority generation & premium Markdown exports</span>
            </li>
          </ul>

          <Button
            onClick={handleCheckout}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            className="w-full mt-4"
          >
            Upgrade via Flutterwave ($29)
          </Button>

          <p className="text-[11px] text-center text-on-surface-variant">
            Secure billing handled by Flutterwave. Cancel anytime.
          </p>
        </div>
      </div>
    </Dialog>
  );
}
