# AGENTS.md — Luma

This file is the entry point for every AI coding agent working on the Luma codebase.

Read this file first.

Before making any code changes:

1. Read this file completely.
2. Load every rule in `.agents/rules/`.
3. Load the relevant skill(s) from `.agents/skills/`.
4. If a workflow exists for the task, follow it from beginning to end.
5. If documentation conflicts, this file is authoritative for implementation decisions.

---

# What Design.md Generator Is

Luma is an AI-powered product design platform that transforms product ideas into structured, implementation-ready design specifications (`design.md`).

Users can describe an idea using text, screenshots, moodboards, or a combination of inputs.

The AI analyzes those inputs and produces a comprehensive design specification that Product Designers, Product Managers, UX Designers, UX Researchers, founders, and AI coding agents can use before opening Figma or writing code.

The primary output of this product is **design.md**.

The platform is **not**:

- a design tool
- a Figma competitor
- a wireframe generator
- a UI builder
- a no-code platform
- an AI coding assistant
- a project management application

Every feature should improve the quality, completeness, usability, or maintainability of generated design specifications.

If it does not improve the design specification, it does not belong in this product.

---

# Who We Are Building For

Primary users include:

- Product Designers
- UX Designers
- Product Managers
- UX Researchers
- Startup founders
- AI builders
- Product teams

Users are looking for structure, clarity and speed—not generated UI.

They want confidence before design and development begin.

Avoid unnecessary complexity.

Every interaction should move users closer to a complete design specification.

---

# Product Philosophy

The AI assists product thinking.

It does not replace product thinking.

Always prefer:

- clarity over cleverness
- structure over verbosity
- maintainability over shortcuts
- explicit assumptions over hallucinations
- reusable systems over one-off solutions

The generated documentation should be something a human would happily hand to another designer or engineer.

---

# Tech Stack

The following stack is canonical for this project.

- Next.js (App Router) with React and TypeScript
- PostgreSQL for the database
- Prisma as the ORM
- Flutterwave for payments (not Paystack, regardless of what older documents say)


## Frontend

- Next.js 15 (App Router)
- React
- TypeScript


## Backend

- Next.js Route Handlers
- Server Actions

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- Supabase Authentication

## AI

- DeepseekAI Responses API
- deepseek-v4-pro (primary generation)
- deepseek-v4-flash (lightweight tasks)

Responsibilities include:

- Product understanding
- Screenshot analysis
- Moodboard interpretation
- Clarification generation
- design.md generation
- AI Design Review

## Storage

- Supabase Storage

Stores:

- screenshots
- moodboards
- uploaded assets

## Payments

Flutterwave

Responsibilities:

- subscription billing
- webhook verification
- payment history
- subscription management

## Email

Resend

## Analytics

PostHog

## Error Monitoring

Sentry

## Deployment

Vercel

## Package Manager

pnpm

---

# Project Structure

```text
Design.md Generator/
│
├── AGENTS.md                             (this file)
│
├── .agents/
│   ├── rules/                            (always-on rules)
│   │   ├── architecture.md
│   │   ├── code-style.md
│   │   ├── design-system.md
│   │   ├── security.md
│   │   ├── accessibility.md
│   │   ├── ai-behavior.md
│   │   ├── performance.md
│   │   ├── testing.md
│   │   ├── naming.md
│   │   └── markdown.md
│   │
│   ├── skills/                           (load only when relevant)
│   │   ├── api-route-scaffolder/
│   │   ├── component-builder-skill/
│   │   ├── db-migration-runner/
│   │   ├── flutterwave-integration/
│   │   └── (planned)
│   │       ├── authentication/
│   │       ├── billing/
│   │       ├── project-management/
│   │       ├── screenshot-analysis/
│   │       ├── moodboard-analysis/
│   │       ├── prompt-orchestration/
│   │       ├── design-generator/
│   │       ├── design-review/
│   │       ├── markdown-export/
│   │       ├── version-history/
│   │       ├── storage/
│   │       ├── notifications/
│   │       └── analytics/
│   │
│   └── workflows/                        (planned)
│       ├── create-project.md
│       ├── upload-assets.md
│       ├── generate-design.md
│       ├── regenerate-section.md
│       ├── review-design.md
│       ├── export-design.md
│       ├── upgrade-plan.md
│       ├── payment-webhook.md
│       ├── archive-project.md
│       └── delete-project.md
│
├── tokens/                               (design system — source of truth)
│   ├── color-tokens.json                 (edit tokens here)
│   ├── design-tokens.css                 (auto-generated)
│   └── convert-tokens.js                 (regenerator)
│
├── app/
├── components/
├── features/
├── services/
├── lib/
├── hooks/
├── prisma/
├── types/
├── public/
├── tests/
├── docs/
└── package.json
```

---

# How to Use These Files

## Rules

Everything inside `.agents/rules/` is always active.

Load every rule before beginning work.

These rules define:

- architecture
- code style
- design system
- accessibility
- security
- testing
- AI behaviour
- performance
- naming conventions
- markdown

Never override these rules unless explicitly instructed.

## Design System

The design system's source of truth lives in `tokens/`.

- Edit tokens in `tokens/color-tokens.json`.
- Regenerate `tokens/design-tokens.css` with `tokens/convert-tokens.js`.
- Never edit `tokens/design-tokens.css` directly—it is auto-generated.

All UI must reference design tokens; never hardcode colors, spacing, type, or radius values.


## Workflows

Workflows are implementation recipes.

Follow them exactly.

Examples include:

- Create Project
- Generate design.md
- Regenerate Section
- Export Markdown
- Upgrade Subscription
- Handle Payment Webhook

Do not skip workflow steps.

---

# Core User Flows

## New Product

Create Project

↓

Provide Inputs

↓

AI Analysis

↓

Clarification Questions

↓

Generate design.md

↓

Review

↓

Export

---

## Update Existing Project

Open Project

↓

Add New Information

↓

Regenerate Sections

↓

Compare Versions

↓

Export Updated Specification

---

## AI-Assisted Development

Generate design.md

↓

Approve

↓

Provide to AI Coding Agent

↓

Build Product

↓

Update design.md

↓

Iterate

---

# AI Operating Principles

The AI must:

- Never invent product requirements.
- Never hallucinate user intent.
- Never generate features that were not requested.
- Clearly distinguish assumptions from facts.
- Ask no more than two clarification questions at a time.
- Preserve approved sections during regeneration.
- Prefer structured output over conversational output.
- Produce Markdown that is portable across tools.

---

# Subscription & Billing

## Free Plan

Includes:

- 3 active projects
- text-only input
- basic design.md generation
- markdown export
- limited monthly generations

---

## Pro Plan

Includes:

- unlimited projects
- screenshot analysis
- moodboard analysis
- mixed input support
- advanced AI analysis
- section regeneration
- unlimited version history
- AI Design Review
- premium exports
- priority processing

---

## Billing Rules

Flutterwave is the canonical payment provider.

Business logic must never depend directly on Flutterwave SDKs.

Payment processing must be abstracted behind a payment service.

Future providers should be replaceable without changing application logic.

Always verify webhook signatures.

Never trust client-side payment status.

Never expose secret keys.

---

# Non-Negotiables

1. The primary artifact is `design.md`.

2. Never generate code unless explicitly requested.

3. Never invent requirements.

4. Uploaded screenshots and moodboards are private.

5. Users own every generated specification.

6. Never silently discard uploaded files.

7. Preserve project history.

8. Every export must produce valid Markdown.

9. AI should explain uncertainty instead of guessing.

10. Every implementation should improve the quality of generated specifications.

---

# Performance Standards

Project Loading

Target:

<2 seconds

Generation

Target:

<30 seconds

Regeneration

Target:

<15 seconds

Export

Target:

<2 seconds

---

# Security Rules

- Store secrets in environment variables.
- Encrypt uploaded assets.
- Never expose API keys.
- Verify every payment webhook.
- Use secure authentication.
- Restrict project access to owners.
- Treat screenshots and moodboards as confidential.

---

# Success Metrics

Optimize for:

- design.md completion rate
- generation speed
- clarification completion rate
- export rate
- upgrade conversion
- retention
- user satisfaction

When implementation options are equal, choose the one that improves these metrics.

---
