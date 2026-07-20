# Remove Customer Wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the customer-name wall and let manufacturing capability flow directly into the cooperation process.

**Architecture:** Delete the isolated `Customers` section from the page composition, remove its now-unused data and styles, and update the homepage regression test to assert that customer names and partner copy are absent. Keep all other components unchanged.

**Tech Stack:** React 19, Vite 6, Vitest, Testing Library, CSS

## Global Constraints

- Do not display customer names, logos, counts, or unverified claims.
- Preserve the existing industrial visual system and three-step quote flow.
- Do not alter unrelated homepage sections.

---

### Task 1: Remove the customer wall

**Files:**
- Delete: `src/components/Customers.jsx`
- Modify: `src/App.jsx`
- Modify: `src/content.js`
- Modify: `src/styles.css`
- Modify: `src/App.test.jsx`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: Existing `App` homepage composition.
- Produces: Homepage without a customer-name section.

- [ ] **Step 1: Write the failing regression test**

Replace the customer-presence assertions with assertions that the partner heading and all four names are absent.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `pnpm test --run src/App.test.jsx`

Expected: FAIL because the current homepage still renders `服务行业头部客户` and the four customer names.

- [ ] **Step 3: Implement the minimal removal**

Remove the `Customers` import and render call from `App.jsx`, delete `Customers.jsx`, delete the `customers` export, remove `.customers-*` styles, and update `AGENTS.md` with the new durable decision.

- [ ] **Step 4: Verify tests and production build**

Run: `pnpm test --run && pnpm build`

Expected: all five tests pass and Vite exits with code 0.

- [ ] **Step 5: Verify the live page visually**

Reload `http://localhost:4174/` in the in-app browser at desktop and mobile widths. Confirm the capability section flows directly into the process section and no customer names remain.

