---
title: Testing Rules
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
  - .agents/rules/security.md
  - .agents/rules/performance.md
  - .agents/rules/accessibility.md
---

# Testing Rules

This document defines the testing standards for **Luma**.

Testing is not a phase—it is part of every task.

A feature is not complete until it is tested.

---

# Testing Philosophy

- Tests protect the quality of generated `design.md` output.
- Tests protect users, their data, and their payments.
- Prefer small, focused tests over brittle integration suites.
- Every test should be deterministic.
- The testing framework and commands are defined in `package.json`; use the project's established runner and conventions.

---

# Test Pyramid

1. **Unit tests** — the majority. Cover services, validation, utilities, and AI output parsing.
2. **Integration tests** — cover database operations, API routes, and service orchestration.
3. **End-to-end (E2E) tests** — cover critical user flows.

Prioritize the layers that protect the product most: AI generation correctness, security, and payment flows.

---

# What to Test

Priority order:

1. Security behavior (auth, authorization, webhooks, sanitization).
2. AI generation pipeline (input validation, prompt assembly, output validation, markdown structure).
3. Payment and subscription flows.
4. Data integrity and migrations.
5. Core UI flows (create project, generate, review, export).
6. Accessibility checks.

---

# Service & Utility Tests

Every service should be unit-tested:

- Input validation (Zod schemas).
- Business logic branches.
- Error handling.
- Edge cases (empty inputs, malformed payloads, duplicate references).

Use mocked external dependencies (AI providers, Flutterwave, Supabase) in unit tests.

---

# API & Route Handler Tests

Every route should be integration-tested:

- Correct HTTP status codes.
- Consistent response shape (`success`/`data` and `success`/`error`).
- Authentication and authorization enforcement.
- Input validation rejection.
- Rate limiting behavior.

---

# Database Tests

Test against a test database—never production.

Cover:

- Migrations apply cleanly.
- Relationships and constraints hold.
- Transactions roll back on failure.
- Soft-delete behavior.
- Seed data is valid.

---

# AI Testing

AI output is non-deterministic—test the contract, not the prose:

- Validate output structure against the `design.md` template.
- Validate JSON parsing for structured responses.
- Assert required sections exist.
- Assert no injected scripts or unsafe content.
- Assert assumptions are labeled.
- Mock the provider and test pipeline logic deterministically.

---

# Payment Testing

Before shipping payment code, verify:

- Successful payment
- Failed payment
- Duplicate webhook
- Invalid webhook
- Cancelled payment
- Retry flow
- Subscription upgrade
- Renewal
- Expiration

See `.agents/skills/flutterwave-integration/skill.md`.

---

# Frontend Testing

- Test components in isolation (render, interaction, accessibility).
- Test that loading, empty, and error states render correctly.
- Test that components use design tokens (no hardcoded colors).
- Prefer user-facing assertions over implementation details.

---

# Accessibility Testing

Automate what you can and manually verify the rest:

- Keyboard-only operation.
- Focus management.
- Screen reader announcements.
- Contrast checks.
- Reduced-motion behavior.

See `.agents/rules/accessibility.md`.

---

# Test Data

- Use factories or fixtures for consistent test data.
- Never use real user data in tests.
- Never include secrets in test fixtures.
- Seed data must never contain production secrets.

---

# CI & Quality Gates

- Tests run in CI before merge.
- Linting and type checking run before tests.
- A failing test blocks shipping.
- Performance budgets are checked where tooling supports it.

---

# Definition of Done

A task is complete only when:

- Tests exist for the changed behavior.
- Tests pass locally and in CI.
- No test depends on external live services (mocked or containerized).
- Type checking passes.
- Linting passes.

---

# Testing Anti-Patterns

Do **not**:

- Skip tests to "save time."
- Test implementation details instead of behavior.
- Write tests that depend on network calls or live providers.
- Mock everything (integration coverage matters).
- Assert on exact AI prose.
- Commit failing tests.
- Test against the production database.

---

# Testing Checklist

Before merging:

- [ ] Unit tests cover services and validation.
- [ ] Routes enforce auth, validation, and status codes.
- [ ] Migration tested against a test database.
- [ ] AI output contract tested with mocked provider.
- [ ] Payment flows tested (success, failure, duplicate, invalid).
- [ ] Component states (loading/empty/error) tested.
- [ ] Accessibility checks pass.
- [ ] Type check passes.
- [ ] Lint passes.
- [ ] CI green.

> **Untested code is unshipped code.**
