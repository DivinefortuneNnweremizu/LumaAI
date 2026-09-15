"use client";

import { use } from "react";
import { MarkdownViewer } from "@/components/editor/markdown-viewer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const DEMO_SPEC_CONTENT = `# Acme Analytics Mobile App

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Last Updated** | 2026-09-15 |

## Overview

Acme Analytics is a high-performance mobile analytics dashboard designed for product engineers and engineering leads to monitor system health, error rates, and active user metrics on the go.

## Goals

- Provide real-time access to key health metrics with low latency (<2s).
- Deliver crisp visual hierarchy optimized for one-handed mobile use. *(Assumption)*
- Adhere strictly to WCAG 2.1 AA accessibility guidelines.

## Non-Goals

- Complex query builder capabilities on mobile devices.

## Users & Personas

### Product Manager / Engineering Lead

Wants instant situational awareness of app metrics and immediate notification of system degradation.

**Key Needs:**
- Executive summaries
- Push alert history
- One-click metric sharing

## User Flows

### View Metrics Summary

1. User opens application and authenticates via biometric / SSO.
2. System loads executive metrics summary dashboard.
3. User taps on specific anomaly card to view breakdown details.

## Information Architecture

| Module / Area | Description |
|---|---|
| **Dashboard Overview** | Executive summary cards and trend graphs |
| **Alert Log** | Filterable history of operational alerts |
| **Settings & Entitlements** | Account preferences and notification thresholds |

## Screens & Layouts

### Dashboard Overview

Clean, single-column scrollable view featuring large numeric indicators and compact sparkline graphs.

**Key Elements:**
- Real-time status indicator pill
- System load sparkline graph
- Recent error list view

## Components & Patterns

| Component | Purpose | Pattern / Notes |
|---|---|---|
| **Metric Card** | Highlights key numerical KPI | Card with primary container background |
| **Alert Badge** | Displays warning/error status | Status pill badge |

## States

- **Loading:** Skeleton loader card matching layout dimensions
- **Empty:** "No active metrics recorded" state with refresh CTA
- **Error:** Retry banner displaying actionable status text
- **Success:** Complete metric cards with subtle refresh animation

## Accessibility

- Minimum 44px touch targets across all interactive controls.
- Full screen reader compatibility with ARIA live region support for metric updates.
- Respect prefers-reduced-motion preferences.

## Assumptions

- **Assumption:** Mobile users prioritize quick summary scans over deep raw data exports.

## Open Questions

- Should historical export files support PDF export in addition to Markdown?

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | 2026-09-15 | Initial specification generated |
`;

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/projects"
          className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-on-surface">Acme Analytics Mobile App</h1>
      </div>

      <MarkdownViewer
        content={DEMO_SPEC_CONTENT}
        projectName="Acme Analytics Mobile App"
        versionNumber={1}
      />
    </div>
  );
}
