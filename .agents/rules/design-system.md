---
title: Design System Rules
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
  - .agents/rules/code-style.md
  - .agents/rules/security.md
  - .agents/rules/markdown.md
  - tokens/color-tokens.json
  - tokens/design-tokens.css
  - tokens/convert-tokens.js
---

# Design System Rules

Luma exists to help people transform product ideas into implementation-ready design specifications.

The interface should feel like sitting beside an experienced product designer—not using a complicated design tool.

The overall interaction model is inspired by modern AI-first applications like ChatGPT—not its branding, but its experience.

The UI should emphasize:

- Content-first design
- Minimal visual noise
- Calm workspace
- Progressive disclosure
- Conversational AI interactions
- Excellent typography
- Generous whitespace
- Fast perceived performance

The goal is **not** to clone ChatGPT.

Instead, Luma should adopt the qualities that make ChatGPT effortless to use while expressing its own visual identity through its own design tokens.

The generated `design.md` is always the center of the experience.

Everything else exists to support reading, refining, reviewing, and exporting that document.

---

# Design Principles

## Content Before Chrome

The interface should almost disappear.

Generated specifications are the hero.

UI controls should remain visually secondary until needed.

---

## Calm Workspace

Avoid visual clutter.

Every screen should feel spacious.

Whitespace is intentional.

Avoid unnecessary dividers, borders, decorative graphics, and visual distractions.

---

## AI Feels Like Collaboration

Users should feel like they're working alongside an experienced Product Designer.

The AI should always communicate:

- What it's doing
- Why it's doing it
- What happens next

Never expose internal AI reasoning.

Never sound robotic.

---

## Progressive Disclosure

Reveal complexity only when users need it.

Advanced settings, prompts, exports, and configuration should remain hidden until requested.

---

## Fast Perceived Performance

The application should never feel idle.

Long AI operations must communicate progress with meaningful status updates instead of generic spinners.

---

## Reading Is the Primary Activity

Most of a user's time is spent reading.

Typography, spacing, and layout should optimize for long-form documentation.

Never sacrifice readability for visual flair.

---

## Consistency Builds Trust

Every screen should feel like part of one cohesive workspace.

Prefer improving existing patterns over introducing new ones.

---

# Layout Philosophy

The application follows a workspace layout rather than a dashboard layout.

```
Sidebar
        ↓
Content Workspace
        ↓
Optional Context Panel
```

The generated specification should always occupy the visual center of the experience.

Navigation should feel secondary.

Large monitors should gain whitespace rather than wider text columns.

Reading width should remain comfortable.

The layout should encourage focus rather than exploration.

---

# Workspace Rules

The workspace should resemble a modern writing application.

Prefer:

- Large typography
- Comfortable spacing
- Soft surfaces
- Subtle borders
- Sticky navigation
- Contextual actions
- Inline editing

Avoid:

- Dense dashboards
- Card-heavy layouts
- Decorative illustrations
- Floating widgets
- Overwhelming side panels
- Excessive visual hierarchy

---

# Color System

Color exists to communicate meaning—not decoration.

Most of the interface should rely on neutral surfaces.

Primary color is reserved for:

- Primary actions
- Active navigation
- Focus states
- Important links

Secondary color identifies AI-powered functionality.

Tertiary color provides supporting emphasis where appropriate.

Status colors communicate system status only.

The token set currently defines `--error-color` for errors and destructive actions. Success and warning status tokens are not yet defined—add them to `tokens/color-tokens.json` before using them in UI.

Avoid large areas of saturated color.

The application should feel calm during long working sessions.

---

## Color Tokens

The authoritative color tokens are defined in `tokens/color-tokens.json` and compiled into `tokens/design-tokens.css`.

Never hardcode color values. Add or change colors only by editing `tokens/color-tokens.json` and regenerating the CSS with `tokens/convert-tokens.js`.

Light theme role tokens:

| Token | Value (light) | Usage |
|---------|---------|---------|
| `--primary-color` | `hsl(244, 75%, 59%)` | Primary actions, active navigation, focus states, important links |
| `--on-primary-color` | `hsl(0, 0%, 100%)` | Content on primary |
| `--primary-container-color` | `hsl(243, 100%, 88%)` | Primary-emphasis containers |
| `--on-primary-container-color` | `hsl(246, 70%, 46%)` | Content on primary containers |
| `--secondary-color` | `hsl(263, 59%, 52%)` | AI-powered interactions |
| `--secondary-container-color` | `hsl(262, 100%, 87%)` | AI-emphasis containers |
| `--on-secondary-container-color` | `hsl(265, 75%, 40%)` | Content on secondary containers |
| `--tertiary-color` | `hsl(200, 100%, 29%)` | Supporting highlights |
| `--tertiary-container-color` | `hsl(207, 100%, 78%)` | Tertiary-emphasis containers |
| `--background-color` | `hsl(300, 56%, 98%)` | Default application background |
| `--on-background-color` | `hsl(270, 7%, 11%)` | Primary text |
| `--surface-color` | `hsl(300, 56%, 98%)` | Cards, dialogs, editors |
| `--on-surface-color` | `hsl(270, 7%, 11%)` | Text on surfaces |
| `--surface-container-color` | `hsl(300, 19%, 94%)` | Elevated surfaces |
| `--surface-container-high-color` | `hsl(300, 14%, 91%)` | Higher elevated surfaces |
| `--outline-color` | `hsl(262, 3%, 48%)` | Borders and dividers |
| `--outline-variant-color` | `hsl(273, 8%, 79%)` | Subtle borders |
| `--error-color` | `hsl(356, 76%, 41%)` | Errors and destructive actions |
| `--error-container-color` | `hsl(4, 100%, 97%)` | Error surfaces |
| `--inverse-surface-color` | `hsl(276, 5%, 19%)` | Inverse surfaces |

Dark mode is implemented with the `[data-theme="dark"]` selector (and `prefers-color-scheme`) using the same CSS variables—never separate component styles.

The full token set (primitives, surface containers, inverse roles) is defined in `tokens/design-tokens.css`.

---

# Typography

The type system is defined by the tokens in `tokens/design-tokens.css`:

| Token | Value | Usage |
|---------|---------|---------|
| `--font-family-sans` | `'Nunito Sans'` | Primary UI font |
| `--font-family-display` | `'Nunito Sans'` | Display / headline font |
| `--font-family-mono` | `'Nunito Sans'` | Monospace / code font |

Typography should prioritize readability before personality.

## Type Scale

Use the `--font-size-*`, `--line-height-*`, and `--font-weight-*` tokens from `tokens/design-tokens.css`.

| Usage | Size Token | Line Height Token | Weight Token |
|---------|---------|---------|---------|
| Landing displays | `--font-size-3xl` | `--line-height-tight` | `--font-weight-bold` |
| Page titles | `--font-size-2xl` | `--line-height-tight` | `--font-weight-bold` |
| Section titles | `--font-size-xl` | `--line-height-snug` | `--font-weight-semibold` |
| Card headings | `--font-size-lg` | `--line-height-snug` | `--font-weight-semibold` |
| Body text | `--font-size-base` | `--line-height-relaxed` | `--font-weight-regular` |
| Supporting text | `--font-size-sm` | `--line-height-normal` | `--font-weight-regular` |
| Captions / labels | `--font-size-xs` | `--line-height-normal` | `--font-weight-medium` |

Do not introduce arbitrary font sizes or line heights.

---

# Spacing

Use the `--spacing-*` tokens from `tokens/design-tokens.css`.

The interface should breathe.

Documentation deserves generous whitespace.

---

# Border Radius

Use the `--radius-*` tokens from `tokens/design-tokens.css`.

| Token | Value | Usage |
|---------|---------|---------|
| `--radius-sm` | `0.25rem` | Small controls, chips |
| `--radius-md` | `0.5rem` | Cards, inputs |
| `--radius-lg` | `0.75rem` | Dialogs, panels |
| `--radius-xl` | `1rem` | Large surfaces |
| `--radius-full` | `9999px` | Pills, avatars |

Rounded corners should feel soft without appearing playful.

---

# Shadows

Use the `--shadow-*` and `--elevation-*` tokens from `tokens/design-tokens.css`.

Use shadows sparingly.

| Token | Usage |
|---------|---------|
| `--shadow-sm` | Cards |
| `--shadow-md` | Dialogs |
| `--shadow-lg` | Popovers |

Avoid heavy elevation.

---

# Components

Reusable primitives belong in:

```
components/ui/
```

Always compose components.

Never duplicate primitives.

---

## Sidebar

The sidebar is the application's primary navigation.

Contents:

- Projects
- Recent Projects
- Templates
- Settings
- Upgrade

Desktop:

Persistent sidebar.

Mobile:

Drawer navigation.

The sidebar should remain visually quiet.

---

## Command Bar

Global command/search interface.

Supports:

- Project search
- Navigation
- Commands
- Quick actions

Keyboard shortcuts:

```
⌘ K
Ctrl + K
```

---

## AI Composer

The product input should resemble a modern AI prompt composer.

Supports:

- Multi-line input
- Drag-and-drop uploads
- Screenshot preview
- Moodboard preview
- Attachments
- Keyboard shortcuts

Avoid making it resemble a traditional form.

---

## Button

Variants:

- Primary
- Secondary
- Outline
- Ghost
- Destructive

Sizes:

- Small
- Medium
- Large

Never place multiple primary buttons within the same hierarchy.

---

## Input

Rules:

- Labels always visible
- Placeholder is never the label
- Error below input
- Focus ring uses Primary color
- Minimum height: 44px

---

## Card

Cards should:

- Use Surface background
- Medium border radius
- Subtle border
- Minimal shadow
- No gradients

---

## Dialog

Use dialogs for:

- Export
- Upgrade
- Confirmation
- Destructive actions

Maximum width:

```
640px
```

---

## Markdown Editor

The editor is the heart of the application.

Prioritize:

- Readability
- Syntax highlighting
- Comfortable spacing
- Markdown fidelity
- Side-by-side comparison
- Version comparison

---

# Iconography

Use **Lucide React** exclusively.

Sizes:

- 16px inline
- 20px buttons
- 24px navigation

Every icon must include accessible text where necessary

---

# Motion

Motion communicates state.

Never decorate.

Allowed animations:

- Fade
- Opacity
- Scale
- Slide (subtle)

Duration:

```
150–200ms
```

Avoid:

- Bounce
- Spin (except loading)
- Page transitions
- Decorative animation

---

# AI Feedback Patterns

Every AI operation should communicate meaningful progress.

Examples:

- Understanding your product...
- Analyzing screenshots...
- Identifying design patterns...
- Creating user flows...
- Building information architecture...
- Writing design.md...
- Reviewing accessibility...
- Finalizing specification...

Avoid generic messages like:

```
Thinking...
Loading...
Please wait...
```

---

# Reading Experience

This application is fundamentally a reading experience.

Every design decision should improve readability.

Prefer:

- Comfortable line height
- Narrow reading width
- Strong hierarchy
- Generous paragraph spacing
- Excellent typography
- Minimal distractions

The experience should feel closer to reading a beautifully formatted Notion document than using a traditional SaaS dashboard.

---

# Empty States

Every empty state should educate.

Instead of:

```
No Projects
```

Use:

```
Start by describing your first product idea.
```

Every empty state should include a primary CTA.

---

# Loading States

Prefer skeleton loaders over spinners.

Long-running AI tasks should display progress stages.

The interface should remain interactive whenever possible.

---

# Accessibility

Target:

**WCAG 2.1 AA**

Requirements:

- Full keyboard navigation
- Visible focus indicators
- Screen reader support
- Proper semantic HTML
- Minimum 44px touch targets
- Respect `prefers-reduced-motion`

Generated Markdown should also remain accessible.

---

# Responsive Design

Design mobile-first.

Breakpoints:

- Mobile
- Tablet
- Desktop
- Large Desktop

Documentation should never become difficult to read because of excessively wide layouts.

---

# What Not To Do

- Do not visually clone ChatGPT.
- Do not create visual clutter.
- Do not overuse the AI accent color.
- Do not introduce unnecessary gradients.
- Do not use glassmorphism.
- Do not use neumorphism.
- Do not animate entire pages.
- Do not center-align long-form content.
- Do not use more than three font weights.
- Do not create multiple competing primary actions.
- Do not invent new component styles without updating this document.
- Do not use Gradients as the UI aims to remain minimal across board.

---

# Design Goal

The interface should disappear.

Users should feel like they are collaborating with an experienced product designer inside a calm, intelligent workspace.

Every interaction should reinforce one outcome:

> **Help users transform ideas into clear, actionable, implementation-ready design specifications as quickly and confidently as possible.**