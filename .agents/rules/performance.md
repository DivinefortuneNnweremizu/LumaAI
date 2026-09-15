---
title: Performance Rules
product: Luma
version: 1.0.0
status: Active
owner: Engineering
last_updated: 2026-07
applies_to: Entire Repository
trigger: always_on
related_files:
  - AGENTS.md
  - .agents/rules/architecture.md
  - .agents/rules/design-system.md
  - .agents/rules/code-style.md
---

# Performance Rules

This document defines the performance standards for **Luma**.

Luma is a reading-and-writing experience. Slow interfaces break focus.

Performance is part of the Definition of Done.

---

# Performance Budgets

The following targets are non-negotiable:

| Operation | Target |
|---------|---------|
| Project Loading | < 2 seconds |
| Generation | < 30 seconds |
| Regeneration | < 15 seconds |
| Export | < 2 seconds |

If an implementation risks exceeding a budget, rethink the approach before shipping.

---

# Web Vitals

Optimize for:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- Interaction to Next Paint (INP)

Avoid layout shift by reserving space for dynamic content (skeletons, fixed heights).

---

# Server-First Rendering

- Default to React Server Components.
- Keep client bundles small.
- Only ship JavaScript to the browser when required.

See `.agents/rules/architecture.md`.

---

# Data Loading

- Avoid N+1 queries.
- Batch related reads into a single query where possible.
- Use Prisma relations and `include`/`select` deliberately.
- Paginate list endpoints (cursor-based preferred).
- Never return excessive payloads.

---

# Caching

Cache:

- Static assets
- Templates
- Documentation
- Reusable metadata
- AI-generated results only when the user explicitly approves caching

Never cache:

- User-specific AI generations (by default)
- Authentication state
- Payment verification

---

# AI Generation Performance

- Stream AI responses where appropriate so users see progress.
- Surface meaningful progress stages instead of idle spinners.
- Return partial, validated output as it becomes available.
- Keep prompts and context assembly efficient—send only required context.
- Generation must complete within the 30-second budget.

---

# Markdown Rendering

- Render `design.md` efficiently for long documents.
- Lazy-load heavy renderers and syntax highlighters.
- Avoid re-rendering the full document on every edit.
- Consider virtualization or incremental rendering for very large documents.

---

# Bundling & Assets

- Use dynamic imports for large, optional modules.
- Lazy-load below-the-fold components.
- Optimize images (widths, formats, responsive sources).
- Serve fonts with `font-display: swap` and preload critical fonts.
- Avoid shipping unused icons and utilities (use Lucide React tree-shaking).

---

# Client Performance

- Memoize only when profiling shows a benefit.
- Avoid unnecessary re-renders and duplicate requests.
- Debounce expensive inputs (search, clarification answers).
- Keep interactions responsive—never block the main thread.

---

# State Management

- Prefer server components and URL state.
- Avoid unnecessary global state.
- Keep client state local and minimal.

---

# Network

- Minimize round trips.
- Prefer streaming and incremental responses for AI.
- Use compression.
- Batch related client requests when safe.

---

# Measuring

Performance work must be measured:

- Track budgets in CI where possible.
- Profile before optimizing.
- Compare against the budgets above.

---

# Performance Checklist

Before shipping a feature:

- [ ] Meets the operation budgets.
- [ ] No N+1 queries.
- [ ] Streams or stages AI progress.
- [ ] Uses server components where possible.
- [ ] No avoidable layout shift.
- [ ] Assets lazy-loaded and optimized.
- [ ] No duplicate requests.
- [ ] Markdown renders efficiently.
- [ ] Measured against the budget.

---

# Anti-Patterns

Do **not**:

- Block the main thread with heavy work.
- Render the full document on every keystroke.
- Fetch data you do not display.
- Cache user-specific data blindly.
- Prematurely optimize without measuring.
- Ship heavy client libraries when a server approach exists.

---

# Definition of Good Performance

The application should always feel fast:

- Navigation is instant.
- Reading is smooth.
- Generation shows steady, meaningful progress.
- Nothing ships unless it meets the budget.

> **A calm workspace that never makes the user wait.**
