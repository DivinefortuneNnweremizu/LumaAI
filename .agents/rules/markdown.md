---
title: Markdown Rules
product: Luma
version: 1.0.0
status: Active
owner: Engineering
last_updated: 2026-07
applies_to: design.md, exports, documentation
trigger: always_on
related_files:
  - AGENTS.md
  - .agents/rules/design-system.md
  - .agents/rules/security.md
  - .agents/rules/ai-behavior.md
---

# Markdown Rules

This document defines how Markdown is written, generated, rendered, and exported in **Luma**.

The primary artifact of the product is `design.md`.

Every generated specification and every export must be valid, portable, and readable Markdown that a human would happily hand to another designer or engineer.

---

# Core Principles

- `design.md` is the center of the product.
- Markdown is a deliverable—not an implementation detail.
- Clarity and structure always beat clever formatting.
- Every export must produce **valid Markdown**.
- Markdown must be portable across tools (GitHub, VS Code, Notion, Obsidian, documentation sites).

---

# Document Structure

Every `design.md` should follow a consistent, predictable structure:

1. `# Title` — single top-level heading identifying the product.
2. Metadata block — project name, version, status, owner, last updated.
3. `## Overview` — what the product is and the problem it solves.
4. `## Goals` / `## Non-Goals`.
5. `## Users & Personas`.
6. `## User Flows`.
7. `## Information Architecture`.
8. `## Screens & Layouts`.
9. `## Components & Patterns`.
10. `## States` — loading, empty, error, success.
11. `## Accessibility`.
12. `## Assumptions`.
13. `## Open Questions`.
14. `## Version History`.

Do not invent sections. The exact template lives in the design-generator workflow.

---

# Heading Rules

- Use exactly one `#` heading per document.
- Use `##` for top-level sections and `###` for subsections.
- Never skip heading levels.
- Headings use Title Case.
- Keep headings concise and descriptive.

---

# Formatting Rules

- Use `##` (ATX) headings—never `setext` headings.
- Use tables for structured comparisons and specifications.
- Use `-` for unordered lists and `1.` for ordered lists.
- Use `**bold**` for emphasis, `*italic*` for secondary emphasis.
- Use fenced code blocks with a language tag for code and diagram snippets.
- Prefer Mermaid diagrams only where a diagram genuinely clarifies structure.
- Avoid:
  - inline HTML
  - images that link to external hosts
  - excessive nesting
  - decorative formatting
  - hard line-wrapping at arbitrary widths

---

# Tables

Tables are preferred for structured data:

- Always include a header row.
- Align columns consistently.
- Do not put overly long paragraphs in cells—link or summarize instead.

---

# Lists

- Keep list items to a single idea.
- Do not mix unordered and ordered lists at the same level.
- Avoid more than two levels of nesting.

---

# Assumptions & Facts

Generated Markdown must clearly separate facts from assumptions:

- Facts describe what the user explicitly stated.
- Assumptions are explicitly labeled as **Assumption**.

Never present a guess as a fact.

---

# Sanitization

Generated Markdown must be sanitized before rendering or storing.

- Never render AI output without sanitization.
- Strip or escape raw HTML and scripts.
- Disallow `javascript:` URLs and unsafe links.
- Reject unsupported syntax before it reaches the renderer.

Follow the Markdown Security section in `.agents/rules/security.md`.

---

# Rendering

- Prefer a trusted, sanitizing Markdown renderer.
- Support GitHub-flavored Markdown.
- Never execute Markdown as HTML.
- Preserve whitespace and readability in the rendered view.

---

# Export Rules

Every export must:

- Produce valid Markdown.
- Preserve the full document structure.
- Include the version number and export timestamp in the metadata.
- Never contain secrets, API keys, or private user data.

---

# Markdown Anti-Patterns

Do **not**:

- Use multiple `#` headings in one document.
- Skip heading levels.
- Embed raw HTML.
- Include untrusted links.
- Invent sections outside the template.
- Write run-on paragraphs.
- Use Markdown as a vehicle for code generation.

---

# Definition of Done

Markdown is complete when it:

- Is valid and portable.
- Follows the document template.
- Separates assumptions from facts.
- Is sanitized and safe to render.
- Exports without warnings.

> **Every `design.md` should read like documentation a senior designer handed to an engineer—structured, confident, and unambiguous.**
