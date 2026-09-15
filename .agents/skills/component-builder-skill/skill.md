---
title: Component Builder Skill
product: Luma
version: 1.0.0
status: Active
owner: Engineering
applies_to:
  - UI Components
  - React Components
  - Design System
  - Frontend Development
related_files:
  - AGENTS.md
  - .agents/rules/design-system.md
  - .agents/rules/code-style.md
  - .agents/rules/architecture.md
---

# Component Builder Skill

This skill teaches AI agents how to build UI components for **Luma**.

Every component must feel calm, AI-first, and effortless—the way modern AI workspaces feel—while remaining faithful to Luma's own design language, design tokens, typography, and product goals.

The goal is **not** to clone any specific product (ChatGPT, Linear, Notion, etc.).

Adopt the qualities that make those products effortless to use, but express them through Luma's own design tokens.

The objective is **consistency over creativity**.

Agents should compose interfaces from reusable primitives rather than creating one-off components.

---

# Core Philosophy

Every component should be:

- Simple
- Accessible
- Reusable
- Predictable
- Responsive
- Performant
- Type-safe
- Easy to maintain

A component is considered complete only when it is production-ready.

---

# Design Philosophy

Luma's interface should feel similar to modern AI-first applications like:

- ChatGPT
- Claude
- Cursor
- Linear
- Notion

Characteristics include:

- Calm visual hierarchy
- Minimal chrome
- Spacious layouts
- Rounded corners
- Subtle borders
- Soft elevation
- Clear typography
- Comfortable reading width
- Fast interactions

Avoid decorative UI.

Every visual element should have a purpose.

---

# Design System

Always follow:

- `design-system.md`
- Design Tokens
- Color Tokens
- Typography Tokens
- Spacing Tokens

Never introduce:

- New colors
- New spacing values
- New typography scales
- New border radius values

without updating the design system.

---

# Preferred Stack

All components should use:

- React
- TypeScript
- Tailwind CSS
- Lucide React Icons

Prefer composition over inheritance.

---

# Directory Structure

Create components using the following structure:

```text
components/

├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── dropdown.tsx
│   ├── textarea.tsx
│   ├── spinner.tsx
│   └── skeleton.tsx
│
├── layout/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── app-shell.tsx
│   ├── container.tsx
│   └── footer.tsx
│
├── editor/
│   ├── markdown-preview.tsx
│   ├── markdown-toolbar.tsx
│   ├── version-history.tsx
│   └── export-menu.tsx
│
└── project/
    ├── project-card.tsx
    ├── project-list.tsx
    ├── generation-progress.tsx
    └── upload-dropzone.tsx
```

File names use kebab-case per `code-style.md`. Component names remain PascalCase.

---

# Component Responsibilities

Each component should have a single responsibility.

Good:

```
<Button />

<Card />

<ProjectCard />
```

Avoid:

```
<ProjectCardWithToolbarAndExportMenu />
```

Split large components into smaller pieces.

---

# Component Size

Aim for:

- Under 200 lines
- One responsibility
- One exported component

Large components should be decomposed.

---

# Props

Use explicit interfaces.

Example:

```ts
interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
}
```

Avoid:

```
props: any
```

---

# TypeScript

Never use:

```ts
any
```

Prefer:

- interfaces
- discriminated unions
- utility types
- generics where appropriate

Type safety is mandatory.

---

# State Management

Prefer local state.

Escalate only when necessary.

Order of preference:

1. Local component state
2. URL state
3. Server state
4. Shared global state

Avoid unnecessary global state.

---

# Styling

Use Tailwind CSS.

Do not write inline styles unless unavoidable.

Prefer design tokens over hardcoded values.

Reference the token variables from `tokens/design-tokens.css`.

Good:

```tsx
className="bg-[var(--primary-color)] text-[var(--on-primary-color)]"
```

Avoid:

```tsx
style={{
  background:"#ffffff"
}}
```

---

# Layout

Follow ChatGPT-inspired layout principles:

- Left sidebar
- Fixed application shell
- Comfortable reading width
- Centered content
- Responsive spacing
- Minimal distractions

Do not recreate ChatGPT exactly.

Instead, capture its design philosophy.

---

# Responsive Design

Design mobile-first.

Breakpoints should support:

- Mobile
- Tablet
- Desktop
- Large Desktop

No desktop-only components.

---

# Accessibility

Every component must support:

- Keyboard navigation
- Screen readers
- Focus visibility
- WCAG AA contrast
- Reduced motion preferences

Never remove focus rings.

---

# Buttons

Support:

Variants

- Primary
- Secondary
- Outline
- Ghost
- Destructive

Sizes

- Small
- Medium
- Large

States

- Default
- Hover
- Active
- Disabled
- Loading

Loading buttons should prevent duplicate submissions.

---

# Forms

Forms should:

- Display labels
- Validate input
- Show inline errors
- Preserve user input on failure

Never rely on placeholders as labels.

---

# Loading States

Every asynchronous component needs:

- Skeleton
- Spinner
- Progress state

Avoid layout shift.

---

# Empty States

Every list should support:

- Empty
- Loading
- Error
- Success

Empty states should guide users toward the next action.

---

# Error States

Errors should be:

- Human-readable
- Actionable
- Non-technical

Avoid exposing stack traces.

---

# Icons

Use only:

Lucide React

Do not mix icon libraries.

---

# Animations

Animations should be subtle.

Maximum duration:

```
200ms
```

Use only for:

- Hover
- Focus
- Dialog transitions
- Dropdowns
- Loading indicators

Avoid excessive motion.

---

# Markdown Components

Luma is Markdown-first.

Markdown components should support:

- Syntax highlighting
- Copy code
- Tables
- Checklists
- Mermaid diagrams
- GitHub-flavored Markdown

Never execute Markdown as HTML.

---

# AI Components

AI-specific components include:

- Generation Progress
- Clarification Questions
- Token Usage
- AI Review
- Version Comparison
- Regeneration Controls

These components should clearly communicate system status.

---

# Naming Convention

Component names:

```
PascalCase
```

Files (kebab-case):

```
button.tsx

project-card.tsx

version-history.tsx
```

Hooks:

```
use-projects.ts

use-generation.ts
```

---

# Performance

Use:

- Lazy loading
- Dynamic imports
- React.memo where appropriate
- Suspense
- Server Components by default

Avoid premature optimization.

---

# Testing Checklist

Before considering a component complete:

- [ ] Responsive
- [ ] Accessible
- [ ] Type-safe
- [ ] Reusable
- [ ] Uses design tokens
- [ ] No hardcoded colors
- [ ] Keyboard accessible
- [ ] Handles loading state
- [ ] Handles empty state
- [ ] Handles error state
- [ ] Matches design-system.md
- [ ] Matches code-style.md

---

# Anti-Patterns

Never:

- Duplicate existing components
- Hardcode colors
- Hardcode spacing
- Mix icon libraries
- Use inline CSS unnecessarily
- Create giant components
- Ignore accessibility
- Use `any`
- Break design tokens
- Bypass shared UI primitives

---

# Definition of Done

A UI component is complete when it:

- Solves one clear problem.
- Matches Luma's design system.
- Feels consistent with the rest of the application.
- Works across supported screen sizes.
- Is fully typed.
- Is accessible.
- Is reusable.
- Is documented through its props.
- Passes linting and type checking.
- Can be confidently reused elsewhere without modification.

Every component should reinforce Luma's identity: a fast, calm, AI-first workspace that helps users transform ideas into high-quality product specifications.