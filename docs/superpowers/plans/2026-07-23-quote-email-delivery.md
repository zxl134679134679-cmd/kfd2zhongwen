# Quote Email Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send every valid website quote request through a lightweight same-origin server endpoint and deliver it to `zxl134679@163.com` through 163 SMTP before showing the customer a success message.

**Architecture:** The React form posts JSON to `/api/quote`. Nginx proxies that exact path to a loopback-only Node.js HTTP service that validates and escapes the payload, rate-limits by client address, and uses Nodemailer with server-only SMTP credentials. The recipient is a server constant and no customer data is stored.

**Tech Stack:** React 19, Vite 6, Vitest, Node.js built-in test runner and HTTP server, Nodemailer, Nginx, systemd.

## Global Constraints

- Keep the current three-step quote dialog layout and accessibility behavior.
- Production submissions use same-origin `POST /api/quote`.
- The recipient is always `zxl134679@163.com`.
- Never commit or expose the 163 SMTP authorization code.
- Never show success unless the API returns a successful response.
- Do not store complete customer submissions in files, databases, or application logs.
- Keep the mail service loopback-only on `127.0.0.1:8787`.
- Ignore the existing untracked `.audit/` directory.

---

## File Structure

- `src/components/QuoteDialog.jsx` — browser form state, payload creation, same-origin submission, customer feedback, honeypot field.
- `src/App.test.jsx` — browser-facing success, failure, endpoint, payload, and recipient-removal tests.
- `server/quote-mailer/package.json` — isolated mail-service runtime and test scripts.
- `server/quote-mailer/src/quote.js` — pure validation, normalization, escaping, and mail-content functions.
- `server/quote-mailer/src/app.js` — HTTP routing, request-size checks, JSON parsing, rate limiting, and status responses.
- `server/quote-mailer/src/index.js` — environment validation, Nodemailer transport, loopback listener, privacy-safe logs.
- `server/quote-mailer/test/quote.test.js` — pure quote validation and mail-content tests.
- `server/quote-mailer/test/app.test.js` — real local HTTP tests with injected fake mail delivery.
- `server/quote-mailer/.env.example` — non-secret SMTP variable names and safe defaults.
- `deploy/kfd-quote-mailer.service` — systemd unit template.
- `deploy/en-kfdpack-quote-api.nginx` — exact Nginx location and rate-limit configuration.
- `docs/quote-email-operations.md` — owner runbook for SMTP setup, deployment, verification, and rollback.
- `.gitignore` — prevent local or server environment files from entering Git.

---

### Task 1: Make Frontend Success Depend on Real Delivery

**Files:**
- Modify: `src/components/QuoteDialog.jsx`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: existing quote form state and optional `window.__KFD_QUOTE_WEBHOOK_URL__` test override.
- Produces: `POST /api/quote` JSON with `source`, `language`, `submittedAt`, `pageUrl`, quote fields, `contact`, and empty `website`; success UI only for an OK response.

- [ ] **Step 1: Write failing frontend tests**

Update the existing configured-webhook tests and add assertions equivalent to:

```jsx
test("quote dialog posts to the same-origin mail endpoint without a recipient", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true });
  vi.stubGlobal("fetch", fetchMock);
  // Open and complete the existing three-step form.
  expect(fetchMock.mock.calls[0][0]).toBe("/api/quote");
  const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(payload.recipientEmail).toBeUndefined();
  expect(payload.website).toBe("");
  expect(await screen.findByRole("heading", { name: "需求已发送" })).toBeInTheDocument();
});

test("quote dialog keeps the form open when delivery fails", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
  // Open and complete the existing three-step form.
  expect(await screen.findByRole("alert")).toHaveTextContent("提交失败");
  expect(screen.queryByRole("heading", { name: "需求已发送" })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the targeted tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.jsx
```

Expected: the new endpoint, removed recipient, honeypot, and “需求已发送” assertions fail against the current implementation.

- [ ] **Step 3: Implement the minimal frontend behavior**

In `QuoteDialog.jsx`:

```jsx
const webhookUrl = (
  (typeof window !== "undefined" ? window.__KFD_QUOTE_WEBHOOK_URL__ : "") ||
  "/api/quote"
).trim();
```

Change the success copy to “需求已发送” / “Request sent”, remove `recipientEmail` from the payload, add `website: ""`, always call `fetch`, and retain the existing non-OK error path. Add an off-screen honeypot input:

```jsx
<label className="quote-honeypot" aria-hidden="true">
  Website
  <input
    name="website"
    tabIndex="-1"
    autoComplete="off"
    value={form.website}
    onChange={(event) => update("website", event.target.value)}
  />
</label>
```

Add `website: ""` to `emptyForm`. Keep the test-only window override so Vitest can inject an endpoint without Vite environment mutation.

- [ ] **Step 4: Run frontend tests and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.jsx
```

Expected: all frontend tests pass.

- [ ] **Step 5: Commit the frontend behavior**

```bash
git add src/components/QuoteDialog.jsx src/App.test.jsx
git commit -m "feat: require real quote email delivery"
```

---

### Task 2: Build Validated and Escaped Mail Content

**Files:**
- Create: `server/quote-mailer/package.json`
- Create: `server/quote-mailer/src/quote.js`
- Create: `server/quote-mailer/test/quote.test.js`

**Interfaces:**
- Consumes: unknown JSON from the HTTP layer.
- Produces: `validateAndNormalizeQuote(value)` returning `{ ok: true, quote }` or `{ ok: false, error }`; `buildQuoteMail(quote, receivedAt)` returning `{ subject, text, html }`.

- [ ] **Step 1: Create the service package**

Create `server/quote-mailer/package.json`:

```json
{
  "name": "kfd-quote-mailer",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "test": "node --test"
  },
  "dependencies": {
    "nodemailer": "^7.0.0"
  }
}
```

Run `npm install --package-lock-only` inside `server/quote-mailer` so the lockfile is deterministic.

- [ ] **Step 2: Write failing validation and escaping tests**

Cover these exact behaviors in `test/quote.test.js`:

```js
test("accepts a complete website quote", () => {
  const result = validateAndNormalizeQuote(validQuote);
  assert.equal(result.ok, true);
  assert.equal(result.quote.product, "彩印纸箱");
});

test("rejects a filled honeypot", () => {
  assert.equal(validateAndNormalizeQuote({ ...validQuote, website: "bot" }).ok, false);
});

test("rejects missing required fields and oversized notes", () => {
  assert.equal(validateAndNormalizeQuote({ ...validQuote, contact: "" }).ok, false);
  assert.equal(validateAndNormalizeQuote({ ...validQuote, notes: "x".repeat(4001) }).ok, false);
});

test("escapes customer html and never accepts a browser recipient", () => {
  const quote = validateAndNormalizeQuote({
    ...validQuote,
    notes: "<script>alert(1)</script>",
    recipientEmail: "attacker@example.com"
  }).quote;
  const mail = buildQuoteMail(quote, new Date("2026-07-23T00:00:00Z"));
  assert.doesNotMatch(mail.html, /<script>/);
  assert.match(mail.html, /&lt;script&gt;/);
  assert.doesNotMatch(JSON.stringify(mail), /attacker@example\.com/);
});
```

- [ ] **Step 3: Run service tests and verify RED**

Run:

```bash
cd server/quote-mailer
npm test
```

Expected: FAIL because `src/quote.js` and its exports do not exist.

- [ ] **Step 4: Implement validation and mail generation**

Implement:

```js
const FIELD_LIMITS = {
  source: 40,
  language: 5,
  submittedAt: 40,
  pageUrl: 500,
  product: 120,
  size: 200,
  quantity: 200,
  material: 500,
  printing: 500,
  destination: 500,
  notes: 4000,
  contact: 500,
  website: 200,
};

const REQUIRED = ["source", "product", "size", "quantity", "contact"];

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
```

`validateAndNormalizeQuote` must reject arrays, non-objects, a source other than `kfdpack-website`, non-string fields, filled `website`, missing required fields, and strings beyond the listed limits. It must return only allow-listed fields, so `recipientEmail` disappears.

`buildQuoteMail` must format the fixed subject prefix and create both text and HTML output using only the normalized allow-list. Display `未填写` for blank optional values and escape every HTML cell.

- [ ] **Step 5: Run service tests and verify GREEN**

Run:

```bash
cd server/quote-mailer
npm test
```

Expected: all quote tests pass.

- [ ] **Step 6: Commit quote validation**

```bash
git add server/quote-mailer
git commit -m "feat: validate and format quote emails"
```

---

### Task 3: Add the Loopback HTTP and SMTP Service

**Files:**
- Create: `server/quote-mailer/src/app.js`
- Create: `server/quote-mailer/src/index.js`
- Create: `server/quote-mailer/test/app.test.js`
- Create: `server/quote-mailer/.env.example`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `createQuoteServer({ sendQuoteMail, now, rateLimit })`, environment variables `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`, `PORT`.
- Produces: loopback HTTP service on `127.0.0.1:8787`; fixed-recipient Nodemailer delivery.

- [ ] **Step 1: Write failing real-HTTP tests**

Start the server on an ephemeral loopback port and test:

```js
test("delivers a valid quote and returns 204", async () => {
  const deliveries = [];
  const server = createQuoteServer({
    sendQuoteMail: async (mail) => deliveries.push(mail),
    now: () => new Date("2026-07-23T00:00:00Z")
  });
  // listen on 127.0.0.1:0, POST valid JSON, then close
  assert.equal(response.status, 204);
  assert.equal(deliveries.length, 1);
});

test("rejects invalid json, oversized content, wrong methods and rapid repeats", async () => {
  // Assert 400, 413, 405, and 429 respectively.
});

test("returns 503 without leaking smtp details when delivery fails", async () => {
  // Inject sendQuoteMail that throws Error("smtp.163.com secret").
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /smtp|secret|163/);
});
```

- [ ] **Step 2: Run HTTP tests and verify RED**

Run:

```bash
cd server/quote-mailer
npm test
```

Expected: FAIL because `createQuoteServer` is missing.

- [ ] **Step 3: Implement the HTTP service**

`app.js` must:

- accept only `POST /quote`;
- require `application/json`;
- stop reading beyond 32 KiB and return `413`;
- parse JSON and pass it to `validateAndNormalizeQuote`;
- use `x-real-ip` or the socket address only as a rate-limit key;
- allow five attempts per ten-minute window per key;
- build mail content and call the injected `sendQuoteMail`;
- return `204` on delivery, `400` on invalid input, `405` on wrong method, `415` on wrong content type, `429` on excess attempts, and `503` on delivery failure;
- log no request body.

- [ ] **Step 4: Implement SMTP startup**

`index.js` must validate all required environment variables before listening, create Nodemailer with:

```js
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

The send function must hard-code the configured server recipient:

```js
await transport.sendMail({
  from: process.env.MAIL_FROM,
  to: process.env.MAIL_TO,
  subject: mail.subject,
  text: mail.text,
  html: mail.html,
});
```

Require `MAIL_TO` to equal `zxl134679@163.com`, bind to `127.0.0.1`, and log only startup plus success/failure request identifiers.

- [ ] **Step 5: Add safe environment documentation**

Create `.env.example`:

```dotenv
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=zxl134679@163.com
SMTP_PASS=在服务器上填写163客户端授权码
MAIL_FROM=zxl134679@163.com
MAIL_TO=zxl134679@163.com
PORT=8787
```

Add these ignore rules to the repository root:

```gitignore
.env
.env.*
!.env.example
```

- [ ] **Step 6: Run service tests and verify GREEN**

Run:

```bash
cd server/quote-mailer
npm test
```

Expected: all validation and HTTP tests pass without network access.

- [ ] **Step 7: Commit the mail service**

```bash
git add .gitignore server/quote-mailer
git commit -m "feat: add lightweight SMTP quote service"
```

---

### Task 4: Add Safe Production Service and Proxy Configuration

**Files:**
- Create: `deploy/kfd-quote-mailer.service`
- Create: `deploy/en-kfdpack-quote-api.nginx`
- Create: `docs/quote-email-operations.md`

**Interfaces:**
- Consumes: installed service at `/opt/kfd-quote-mailer`, secret file `/etc/kfd-quote-mailer.env`, loopback port `8787`.
- Produces: systemd-managed service and same-origin public endpoint `https://en.kfdpack.com/api/quote`.

- [ ] **Step 1: Add the systemd unit**

Create a unit with:

```ini
[Unit]
Description=KFD quote email delivery service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=kfd-mailer
Group=kfd-mailer
WorkingDirectory=/opt/kfd-quote-mailer
EnvironmentFile=/etc/kfd-quote-mailer.env
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/tmp

[Install]
WantedBy=multi-user.target
```

- [ ] **Step 2: Add the Nginx fragment**

Create a documented fragment containing:

```nginx
limit_req_zone $binary_remote_addr zone=kfd_quote:10m rate=3r/m;

location = /api/quote {
    limit_except POST { deny all; }
    client_max_body_size 32k;
    limit_req zone=kfd_quote burst=3 nodelay;
    proxy_pass http://127.0.0.1:8787/quote;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_connect_timeout 3s;
    proxy_read_timeout 20s;
}
```

The runbook must explain that `limit_req_zone` belongs in the `http` context while `location` belongs inside the existing `en.kfdpack.com` server block.

- [ ] **Step 3: Write the owner runbook**

Document exact paths, permissions, commands, and rollback:

- create system user `kfd-mailer`;
- install production dependencies with `npm ci --omit=dev`;
- create `/etc/kfd-quote-mailer.env` as root with mode `600`;
- have the owner enter `SMTP_PASS` directly on the server;
- run service tests before restart;
- run `systemctl daemon-reload`, enable and restart the service;
- check `systemctl is-active kfd-quote-mailer`;
- back up `/etc/nginx/sites-enabled/en-kfdpack`;
- add the rate zone and location, run `nginx -t`, then reload;
- restore the backup and reload Nginx for rollback.

- [ ] **Step 4: Verify configuration files**

Run:

```bash
git diff --check
rg -n "SMTP_PASS|/api/quote|127.0.0.1:8787|MAIL_TO" deploy docs/quote-email-operations.md
```

Expected: no whitespace errors; only the example placeholder contains `SMTP_PASS`, and no real authorization code exists.

- [ ] **Step 5: Commit production configuration**

```bash
git add deploy docs/quote-email-operations.md
git commit -m "docs: add quote mailer deployment configuration"
```

---

### Task 5: Verify, Publish, and Deploy

**Files:**
- Modify only if verification exposes a defect: files from Tasks 1–4.
- Server-only secret: `/etc/kfd-quote-mailer.env` (never added to Git).

**Interfaces:**
- Consumes: tested frontend and mail-service source, existing GitHub repository, logged-in US server, 163 SMTP authorization code entered by the owner.
- Produces: production mail delivery on `https://en.kfdpack.com/api/quote`.

- [ ] **Step 1: Run the complete local verification**

Run:

```bash
npm test -- --run
npm run build
(cd server/quote-mailer && npm ci && npm test)
git diff --check
git status --short
```

Expected: frontend tests pass, Vite build exits `0`, service tests pass, no diff errors, and `.audit/` remains untouched.

- [ ] **Step 2: Push the verified source**

```bash
git push origin main
```

Expected: GitHub `main` advances to the verified commit.

- [ ] **Step 3: Install the mail service on the US server**

Using the already authenticated provider console or SSH session:

- place the contents of `server/quote-mailer` in `/opt/kfd-quote-mailer`;
- install Node.js if the existing production host does not already provide it;
- run `npm ci --omit=dev`;
- install the systemd unit;
- create the root-owned environment file without printing it;
- pause for the owner to enter the 163 authorization code directly;
- start the service and verify `systemctl is-active kfd-quote-mailer` returns `active`.

- [ ] **Step 4: Install and validate the Nginx route**

Back up `/etc/nginx/sites-enabled/en-kfdpack`, merge the reviewed fragment, and run:

```bash
nginx -t
systemctl reload nginx
```

Expected: Nginx syntax is successful and reload exits `0`.

- [ ] **Step 5: Deploy the new frontend**

Use the existing atomic release process for `en.kfdpack.com`: upload the locally built `dist/`, keep the previous release, switch the `current` symlink, and leave rollback available.

- [ ] **Step 6: Verify public failure and success behavior**

Before SMTP credentials are enabled, submit a test and confirm the page shows failure rather than success. After the owner enters the authorization code, submit a unique test such as `KFD-20260723-001` and verify:

- `POST https://en.kfdpack.com/api/quote` returns `204`;
- the dialog shows “需求已发送”;
- `zxl134679@163.com` receives one complete email;
- no authorization code or complete submission appears in service logs;
- repeated rapid submissions receive `429`;
- homepage, `/products`, `/solutions`, `/factory`, `/certifications`, and `/contact` still return successfully.

- [ ] **Step 7: Verify mobile and desktop UI**

Use the in-app browser at one desktop and one phone viewport. Confirm the three steps, submitting state, failure state, success state, focus restoration, and smooth dialog scrolling.

- [ ] **Step 8: Record the deployed version**

Record the final Git commit and deployment timestamp in the completion report. Do not include the SMTP authorization code or customer test contact details.

---

## Self-Review

- Spec coverage: same-origin API, fixed recipient, credential isolation, input validation, HTML escaping, honeypot, dual rate limits, privacy-safe logs, real-delivery success, systemd, Nginx, SMTP setup, rollback, email receipt, and responsive UI verification are each assigned to a task.
- Placeholder scan: implementation steps contain concrete interfaces, paths, commands, limits, expected results, and code shapes. The only non-secret example value is explicitly marked for owner entry in `.env.example`.
- Type consistency: the frontend and service share the same allow-listed string fields; `website` is the honeypot; `validateAndNormalizeQuote` feeds `buildQuoteMail`; `createQuoteServer` receives an injected `sendQuoteMail`; `/api/quote` proxies to loopback `/quote`.
