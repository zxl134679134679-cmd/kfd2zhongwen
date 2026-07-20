# Quote Webhook Email Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the quote request form send a structured customer requirement payload to an n8n Webhook, which can then email the request to `909015753@qq.com`.

**Architecture:** Keep the website frontend-only. The form submit handler posts JSON to `VITE_N8N_QUOTE_WEBHOOK_URL` when configured, and falls back to a clear local/demo success state when no Webhook is configured. The email sending itself belongs in n8n or a server endpoint so no email password or QQ authorization code is exposed in browser code.

**Tech Stack:** React 19, Vite, Vitest, browser `fetch`, environment variable `VITE_N8N_QUOTE_WEBHOOK_URL`.

## Global Constraints

- Do not store QQ email passwords or SMTP authorization codes in frontend code.
- Keep the current quote form design; only adjust submit behavior and success/error feedback.
- Send all customer requirement fields already collected by the form.
- The recipient email is `909015753@qq.com`.
- Local development must still work even before the n8n Webhook URL is configured.

---

### Task 1: Add quote Webhook submit behavior

**Files:**
- Modify: `C:/Users/0001/Documents/凯丰德/kfd-1/kfd-1-main/src/components/QuoteDialog.jsx`
- Modify: `C:/Users/0001/Documents/凯丰德/kfd-1/kfd-1-main/src/App.test.jsx`

**Interfaces:**
- Consumes: `company.email`, `products`, current quote form state.
- Produces: `POST` JSON payload to `import.meta.env.VITE_N8N_QUOTE_WEBHOOK_URL`.

- [ ] **Step 1: Add a test that form submission calls the configured Webhook**

Add a Vitest test that opens the quote dialog, fills the required fields, submits, and expects `fetch` to receive a JSON payload containing product, size, quantity, contact, recipient email, language, and source.

- [ ] **Step 2: Run test to verify it fails before implementation**

Run: `npm.cmd test -- --run`

Expected: the new test fails because the form currently does not call `fetch`.

- [ ] **Step 3: Implement submit-to-Webhook**

In `QuoteDialog.jsx`, build a payload from the form fields and `company.email`, then call `fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })` when `webhookUrl` is present.

- [ ] **Step 4: Add user feedback for sending and errors**

Add `submitting` status while the request is sending and show a clear error message if the Webhook request fails. If no Webhook URL is configured, keep the current success state so local preview still works.

- [ ] **Step 5: Run tests**

Run: `npm.cmd test -- --run`

Expected: all tests pass.

- [ ] **Step 6: Build production bundle**

Run: `npm.cmd run build`

Expected: Vite build succeeds.

### Task 2: Add setup documentation for n8n

**Files:**
- Create: `C:/Users/0001/Documents/凯丰德/kfd-1/kfd-1-main/docs/n8n-quote-email-setup.md`

**Interfaces:**
- Consumes: Webhook JSON fields from Task 1.
- Produces: a simple setup checklist for the owner to configure n8n and the deployment environment.

- [ ] **Step 1: Document the n8n workflow**

Create a concise Chinese guide: create Webhook node, add Email/SMTP node, send to `909015753@qq.com`, and copy the Production Webhook URL.

- [ ] **Step 2: Document website environment variable**

Document `VITE_N8N_QUOTE_WEBHOOK_URL=<your n8n production webhook URL>` and explain the site must be rebuilt/redeployed after setting it.

- [ ] **Step 3: Verify documentation exists**

Run: `Get-Item docs/n8n-quote-email-setup.md`

Expected: the file exists.

## Self-Review

- Spec coverage: Webhook submit, secure email handling, recipient email, local preview fallback, and setup docs are covered.
- Placeholder scan: No implementation placeholders remain.
- Type consistency: Payload fields are plain JSON strings and stable across form, test, and documentation.
