# Scroll Stability and Delivery Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove remaining mobile and desktop scroll jank and reduce first-load and release overhead without changing the approved design.

**Architecture:** Stabilize layout by removing inaccurate deferred-render placeholders, keep motion only as a short desktop-only enhancement, and centralize lazy image priority in `ResponsiveImage`. Clean only proven-unused files, then enable text compression at the Nginx boundary.

**Tech Stack:** React 19, Vite 6, Vitest, CSS media queries, Nginx.

## Global Constraints

- Preserve visual direction, copy, routes, images, menu, language switch, certifications, and quote flow.
- Add no runtime dependency, CDN, service worker, page, or route.
- Preserve every original image still referenced by `src/` or `index.html`.
- Keep an atomic server rollback release.

---

### Task 1: Define scroll and loading behavior with failing tests

**Files:**
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: rendered `App`, `ResponsiveImage`, and `src/styles.css`.
- Produces: regression checks for stable layout, bounded motion, lazy priority, intrinsic key-image dimensions, and factory navigation.

- [ ] Add tests asserting no `content-visibility`, `contain-intrinsic-size`, `slowZoom`, or active `backdrop-filter` rule; assert entrance animation exists only inside the fine-pointer/no-reduced-motion media query.
- [ ] Add tests asserting lazy images receive `fetchpriority="low"`, Hero remains `high`, key Hero/logo images have width and height, and the Hero factory link targets `/factory`.
- [ ] Run `PATH=/Users/ceng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm exec vitest run src/App.test.jsx`; expect the new checks to fail for the current implementation.
- [ ] Commit the failing tests with `git commit -m "test: define stable scrolling requirements"`.

### Task 2: Implement stable rendering and image priority

**Files:**
- Modify: `src/components/ResponsiveImage.jsx`
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Header.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- `ResponsiveImage` maps `loading="lazy"` to `fetchPriority="low"` unless an explicit priority is supplied.
- Hero and brand fallback images expose intrinsic dimensions.

- [ ] Remove inaccurate deferred-render CSS, continuous Hero animation, and header blur.
- [ ] Scope a 0.45-second `fadeUp` to `(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)`; render touch content immediately.
- [ ] Add lazy image priority defaults and intrinsic dimensions to Hero/logo usage.
- [ ] Change the Hero factory link from `#factory` to `/factory`.
- [ ] Run the focused tests; expect all scroll and loading tests to pass.
- [ ] Commit with `git commit -m "perf: stabilize scrolling and image scheduling"`.

### Task 3: Remove unused assets and optimize the share image

**Files:**
- Delete: `public/assets/hero-gate.png`
- Delete: `public/assets/product-oversize-carton.png`
- Delete: `public/assets/paper-warehouse.png`
- Delete: `public/assets/hero-factory.png`
- Delete: `public/assets/capability-workshop.png`
- Delete: `public/assets/capability-printing.png`
- Delete: `public/assets/capability-corrugator.png`
- Delete: `public/assets/capability-quality.png`
- Delete: `public/assets/product-carton.png`
- Delete: `public/assets/product-board.png`
- Delete: `public/assets/kfd-logo.png`
- Create: `public/assets/optimized/kfd-factory-share-1200.jpg`
- Modify: `index.html`

**Interfaces:**
- Produces: a smaller Open Graph image at `/assets/optimized/kfd-factory-share-1200.jpg`.

- [ ] Re-run the source-reference list and verify all eleven deletion candidates remain unreferenced.
- [ ] Generate the 1200 px JPEG from `kfd-factory-exterior.png` at quality 82 and update `og:image`.
- [ ] Remove only the eleven confirmed unused files.
- [ ] Run all tests and `pnpm run build`; expect success and a materially smaller `dist/`.
- [ ] Commit with `git commit -m "perf: remove unused website assets"`.

### Task 4: Visual verification and production delivery

**Files:**
- Modify: `.audit/performance-second-pass-2026-07-21/audit.md`
- Server config: `/etc/nginx/sites-enabled/en-kfdpack`

**Interfaces:**
- Produces: stable production layout and gzip-compressed CSS/JavaScript responses.

- [ ] At 390 × 844, capture top and mid-page screenshots and verify document height is unchanged before/after scrolling, no overflow, no broken images, and touch content has no entrance animation.
- [ ] At 1440 × 900, verify no infinite Hero animation, no backdrop blur, stable height, full navigation, and no console errors.
- [ ] Run all tests, production build, `git diff --check`, and source-reference validation.
- [ ] Push `main`, create a new atomic server release with directories 755/files 644, and retain the previous release path.
- [ ] Add Nginx gzip settings for JavaScript, CSS, JSON, SVG, and text; run `nginx -t` before reload.
- [ ] Verify all six public URLs, optimized images, production asset hashes, and `Content-Encoding: gzip` for JavaScript/CSS.
