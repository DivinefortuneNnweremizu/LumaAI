---
title: Accessibility Rules
product: Luma
version: 1.0.0
status: Active
owner: Engineering
last_updated: 2026-07
applies_to: Entire Repository
trigger: always_on
related_files:
  - AGENTS.md
  - .agents/rules/design-system.md
  - .agents/rules/architecture.md
  - .agents/rules/code-style.md
  - .agents/rules/testing.md
---

# Accessibility Rules

This document defines the accessibility standards for **Luma**.

Luma targets **WCAG 2.1 AA**.

Accessibility is not a UI-only concern. It influences routing, forms, keyboard navigation, focus management, semantic HTML, error handling, AI interactions, and generated `design.md` output.

Accessibility is part of the **Definition of Done** for every feature.

---

# Core Principles

## Accessibility Is Not Optional

Every feature, component, and screen must be accessible.

There is no separate "accessible version."

## Accessibility by Design

Design with accessibility from the start—not as a retrofit.

## Never Remove Accessibility for Aesthetics

Visual choices must never conflict with operability or perceivability.

---

# Keyboard Navigation

Every interactive element must be fully operable by keyboard.

Requirements:

- Logical, predictable tab order.
- All interactive elements reachable via `Tab`.
- All menus, dialogs, and popovers opened with the keyboard.
- Visible focus indicator on every focused element.
- Focus never trapped in a dialog without an escape path.
- `Esc` closes overlays, menus, and dialogs.

Never remove `:focus-visible` styling.

---

# Focus Management

- Focus must move predictably on navigation and interaction.
- When a dialog opens, focus moves into it.
- When a dialog closes, focus returns to the trigger.
- Route changes should update the document title and reset focus appropriately.
- Modal contexts must trap focus.

---

# Semantic HTML

Use native HTML elements whenever possible.

- Use `<button>` for buttons and `<a>` for links.
- Use `<nav>`, `<main>`, `<header>`, `<footer>`, and `<section>` landmarks.
- Use a single `<h1>` per page.
- Do not fake controls with `<div>` and click handlers.
- Use `aria-label` only when the accessible name is not visible.

---

# Forms

- Every input has a visible label.
- Labels are programmatically associated with their inputs.
- Errors are announced to screen readers.
- Error messages identify the field and explain how to fix it.
- Placeholder text is never the label.
- `autocomplete` is used where appropriate.

---

# Color & Contrast

- Text must meet WCAG AA contrast ratios (4.5:1 body, 3:1 large text).
- Do not rely on color alone to convey meaning—combine with icons, text, or patterns.
- Focus states and interactive states must be distinguishable.
- Use design tokens for all colors.

---

# Screen Readers

- Use ARIA roles and properties only when needed.
- Do not add redundant ARIA to native elements.
- Decorative elements must be hidden from assistive technology.
- Status and progress updates must be announced (live regions).
- Images that convey meaning require alt text; decorative images use `alt=""`.

---

# Motion

Respect `prefers-reduced-motion`.

When the user requests reduced motion:

- Disable non-essential animations.
- Keep transitions short or replace them with fades.
- Never remove essential feedback.

---

# Touch Targets

Interactive elements must have a minimum target size of **44×44px** (or sufficient spacing to make the effective target 44px).

---

# Responsive Accessibility

Accessibility must be preserved across breakpoints:

- Text resizing (up to 200%) must not break layout or reading.
- Content reflows without loss of information.
- Landscape and portrait orientations are both supported.
- Navigation must remain usable on mobile (drawer behavior, focus management).

---

# AI Interactions

AI-driven UI must communicate state accessibly:

- Progress updates are announced to screen readers.
- Streaming responses do not re-announce the entire document.
- Clarification questions are reachable and operable by keyboard.
- Generated `design.md` output is navigable by heading.

---

# Generated Markdown Accessibility

Generated specifications must also be accessible:

- Correct heading hierarchy.
- Meaningful link text.
- Tables with proper structure.
- Alt text guidance for any included images.
- Accessible diagrams (summarized text where a diagram is used).

---

# Testing

Every feature must be checked for:

- Keyboard-only operation.
- Screen reader announcements.
- Focus management.
- Color contrast.
- Reduced-motion behavior.

Include accessibility checks in automated tests and manual QA.

---

# Accessibility Checklist

Before shipping a feature:

- [ ] Usable by keyboard only.
- [ ] Visible focus indicators present.
- [ ] Semantic HTML used.
- [ ] Forms have visible, associated labels.
- [ ] Error messages announced and actionable.
- [ ] Contrast meets WCAG AA.
- [ ] No reliance on color alone.
- [ ] `prefers-reduced-motion` respected.
- [ ] 44px touch targets.
- [ ] Screen reader flow verified.
- [ ] Generated Markdown is navigable by headings.
- [ ] No focus traps.

---

# Anti-Patterns

Do **not**:

- Remove focus rings.
- Use color alone to indicate state.
- Fake buttons and links with `<div>`.
- Hide interactive content behind `aria-hidden`.
- Trap focus in dialogs.
- Use placeholders as labels.
- Ship animated content without reduced-motion support.

---

# Definition of Done

A feature is accessible when every user—keyboard, screen reader, touch, low vision, or reduced motion—can complete the same tasks with equal confidence.

> **Luma should be a calm, intelligent workspace for everyone.**
