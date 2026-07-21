# Mobile Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the KFD website feel smooth on phones while preserving the approved visual design, copy, navigation, quote flow, and five public routes.

**Architecture:** Keep the original source images as fallbacks, add optimized WebP derivatives under `public/assets/optimized/`, and centralize responsive image markup in one small component. Mobile-only CSS removes continuous compositing costs, reduces below-the-fold image height and spacing, and defers rendering of distant sections without changing the desktop design.

**Tech Stack:** React 19, Vite 6, Vitest, Testing Library, CSS media queries, macOS image conversion tools.

## Global Constraints

- Preserve the current visual direction, content, five public routes, navigation, and quote workflow.
- Keep the original PNG/JPEG files as fallbacks.
- Add no CDN, service worker, or new runtime dependency.
- Use responsive WebP sources for high-impact homepage and shared brand images.
- Give the homepage hero high fetch priority and asynchronous decoding.
- Keep below-the-fold images lazy-loaded and asynchronously decoded.
- On screens up to 760px, disable the hero zoom and header backdrop blur, shorten large image cards to 260–280px, and reduce major section padding to 52–56px.
- Preserve the existing `prefers-reduced-motion` accessibility behavior.

---

### Task 1: Lock mobile performance behavior with regression tests

**Files:**
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: rendered `App` markup and the text of `src/styles.css`.
- Produces: regression coverage for responsive image delivery, image loading priority, and mobile compositing rules.

- [ ] **Step 1: Write failing responsive-image tests**

Add tests that render the homepage and assert that the hero and header logo are inside `<picture>` elements with mobile and desktop WebP `<source>` nodes, the hero image has `fetchpriority="high"` and `decoding="async"`, and a below-the-fold factory image has `loading="lazy"` and `decoding="async"`.

- [ ] **Step 2: Write failing mobile-CSS tests**

Extract the `@media (max-width: 760px)` block and assert it contains `backdrop-filter: none`, `animation: none`, 56px or less section padding, 280px or less large-card height, a hover-capability guard, and `content-visibility: auto` for below-the-fold sections.

- [ ] **Step 3: Run the focused tests to verify RED**

Run: `PATH=/Users/ceng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm exec vitest run src/App.test.jsx`

Expected: the new assertions fail because responsive `<picture>` sources, async decoding, and the mobile performance rules do not exist yet.

- [ ] **Step 4: Commit the failing tests**

Run: `git add src/App.test.jsx && git commit -m "test: define mobile performance requirements"`

---

### Task 2: Generate lightweight responsive image assets

**Files:**
- Create: `public/assets/optimized/kfd-logo-340.webp`
- Create: `public/assets/optimized/kfd-logo-520.webp`
- Create: `public/assets/optimized/hero-gate-760.webp`
- Create: `public/assets/optimized/hero-gate-1448.webp`
- Create: responsive 760px and 1448px WebP files for `kfd-kba-printing-final`, `workshop-panorama`, `product-color-printing-power`, `product-corrugated-board`, and `product-standard-carton`.

**Interfaces:**
- Consumes: original files in `public/assets/`.
- Produces: `/assets/optimized/<name>-760.webp` and `/assets/optimized/<name>-1448.webp` URLs, plus compact logo variants.

- [ ] **Step 1: Confirm WebP conversion support**

Run a temporary conversion with the available local image tool and inspect the output format and dimensions. If the system converter cannot write WebP, use the bundled workspace image library without adding a project dependency.

- [ ] **Step 2: Generate the mobile and desktop derivatives**

Resize proportionally, encode photographic assets at visually high WebP quality, and preserve alpha in logo files. Do not modify or delete the originals.

- [ ] **Step 3: Verify dimensions and byte sizes**

Run `sips -g pixelWidth -g pixelHeight` for each generated file and list sizes. Expected: every optimized file is smaller than its original; the 760px files are substantially smaller than the original PNGs.

- [ ] **Step 4: Commit generated assets**

Run: `git add public/assets/optimized && git commit -m "perf: add responsive webp assets"`

---

### Task 3: Serve responsive images with correct loading priority

**Files:**
- Create: `src/components/ResponsiveImage.jsx`
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Header.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces: `ResponsiveImage({ src, mobileSrc, desktopSrc, alt, sizes, loading, fetchPriority, className })`, which renders a `<picture>` with WebP sources and an original `<img>` fallback.
- Consumes: optimized URLs from Task 2.

- [ ] **Step 1: Add the minimal `ResponsiveImage` component**

Render a mobile WebP source for `(max-width: 760px)`, a desktop WebP source, and the original `img`. Pass native image attributes through to the fallback and always use `decoding="async"`.

- [ ] **Step 2: Upgrade the hero and brand images**

Use responsive assets for the hero and header/footer logo. Set only the hero to eager/high priority; keep its original source as the fallback.

- [ ] **Step 3: Upgrade high-impact homepage images**

Use responsive assets for the factory pair and three featured product images. Keep `loading="lazy"`, add appropriate `sizes`, and retain meaningful alt text.

- [ ] **Step 4: Add async decoding to remaining page images**

Add `decoding="async"` to below-the-fold and secondary images without changing their visible content or interaction behavior.

- [ ] **Step 5: Run the focused tests to verify image behavior is GREEN**

Run: `PATH=/Users/ceng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm exec vitest run src/App.test.jsx`

Expected: responsive image and native loading-attribute assertions pass; mobile CSS assertions may remain red until Task 4.

- [ ] **Step 6: Commit responsive delivery**

Run: `git add src/components/ResponsiveImage.jsx src/components/Hero.jsx src/components/Header.jsx src/components/Footer.jsx src/App.jsx src/pages src/components && git commit -m "perf: serve responsive website images"`

---

### Task 4: Remove mobile compositing hotspots and shorten the page

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing component class names.
- Produces: mobile-only rendering and interaction-cost reductions with unchanged desktop styling.

- [ ] **Step 1: Disable continuous mobile compositing**

Inside `@media (max-width: 760px)`, set `.site-header { backdrop-filter: none; -webkit-backdrop-filter: none; }` and `.hero-bg img { animation: none; transform: scale(1.035); }`.

- [ ] **Step 2: Reduce mobile content height**

Set homepage section vertical padding to 56px and large homepage image/card heights to 280px while preserving one-column layout and image crops.

- [ ] **Step 3: Defer distant section rendering**

Apply `content-visibility: auto` and a conservative `contain-intrinsic-size` to homepage sections below the hero and comparable long-list sections.

- [ ] **Step 4: Avoid hover work on touch-only devices**

Move transform and heavy shadow hover effects behind `@media (hover: hover) and (pointer: fine)` and ensure touch devices keep stable transforms.

- [ ] **Step 5: Run focused and full tests to verify GREEN**

Run: `PATH=/Users/ceng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm exec vitest run`

Expected: all tests pass with no warnings or unhandled errors.

- [ ] **Step 6: Commit mobile rendering fixes**

Run: `git add src/styles.css src/App.test.jsx && git commit -m "perf: smooth mobile rendering"`

---

### Task 5: Build, visually compare, and measure

**Files:**
- Create: `.audit/mobile-smoothness-2026-07-21/05-home-top-fixed.png`
- Create: `.audit/mobile-smoothness-2026-07-21/06-home-scroll-fixed.png`
- Modify: `.audit/mobile-smoothness-2026-07-21/audit.md`

**Interfaces:**
- Consumes: local production build and the original audit screenshots.
- Produces: visual comparison evidence and before/after transfer-size notes.

- [ ] **Step 1: Build the production bundle**

Run: `PATH=/Users/ceng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm run build`

Expected: Vite exits successfully and writes `dist/`.

- [ ] **Step 2: Verify formatting and repository scope**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors; only intentional production files and untracked audit evidence are present.

- [ ] **Step 3: Compare matching mobile states**

Using the in-app browser at 390×844, capture the homepage top and scrolled state. Compare each against `01-home-top.png` and `04-home-scroll.png` at the same viewport; verify no crop, spacing, typography, navigation, or CTA regressions.

- [ ] **Step 4: Check tablet and desktop layouts**

Inspect at 834×900 and a desktop viewport. Verify hero image composition, logo clarity, section grids, links, menu, and quote dialog.

- [ ] **Step 5: Measure loaded image bytes**

Record homepage image transfer size near the top and after scrolling. Expected: initial mobile image transfer is materially below the prior 14.72 MiB, and below-the-fold images are not all fetched before approaching their sections.

- [ ] **Step 6: Record audit results**

Append the measured before/after sizes and any visual adjustments to `.audit/mobile-smoothness-2026-07-21/audit.md`. Keep `.audit/` out of the production commit unless explicitly requested.

---

### Task 6: Publish and verify production

**Files:**
- No additional source files expected.

**Interfaces:**
- Consumes: verified main-branch production build.
- Produces: updated `https://en.kfdpack.com/` release with an atomic rollback point.

- [ ] **Step 1: Push the verified commits**

Push the intended branch to `zxl134679134679-cmd/kfd2zhongwen` after confirming the commit list and clean production diff.

- [ ] **Step 2: Build a new server release**

Update `/opt/kfd/source`, install locked dependencies, build, copy `dist/` into a timestamped directory under `/var/www/kfd/releases`, and atomically repoint `/var/www/kfd/current`.

- [ ] **Step 3: Verify Nginx and HTTPS**

Run the Nginx configuration check and verify `https://en.kfdpack.com/`, `/products`, `/solutions`, `/factory`, `/certifications`, and `/contact` return successfully.

- [ ] **Step 4: Recheck production on mobile**

Open the live homepage at 390×844 and verify header scrolling, hero, navigation drawer, image transitions, page scrolling, and quote dialog.

- [ ] **Step 5: Preserve rollback information**

Record the previous `/var/www/kfd/current` target and the new release target so the site can be reverted by switching the symlink if needed.
