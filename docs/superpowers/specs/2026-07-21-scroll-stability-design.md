# Scroll Stability and Delivery Performance Design

## Goal

Remove the remaining mobile and desktop scroll jank without changing the approved visual direction, copy, routes, imagery, or quote flow.

## Evidence

- At 390 × 844, scrolling into the product area changes document height from 5330 px to 6227 px because `content-visibility: auto` replaces a 900 px intrinsic placeholder with real section heights.
- At 1440 × 900, the Hero image continuously runs the 18-second infinite `slowZoom` animation while the fixed header continuously applies `backdrop-filter: blur(8px)`.
- The production JavaScript response is 285,272 bytes and is not compressed; Vite reports 86.93 KiB after gzip.
- Eleven unreferenced root assets total 17.40 MiB and are copied into every release.

## Selected Approach

Use the balanced fix approved by the user:

1. Remove `content-visibility` and `contain-intrinsic-size` from the long page sections so document height is stable before and during scrolling.
2. Remove the infinite Hero background animation at every breakpoint.
3. Remove header backdrop blur at every breakpoint, retaining the existing gradient background.
4. Keep only short, one-time entrance animation on fine-pointer desktop devices; mobile and touch devices render content immediately.
5. Give every lazy image `fetchPriority="low"` while retaining `loading="lazy"` and `decoding="async"`.
6. Add intrinsic width and height to the header/footer logo and Hero fallback images to reduce layout uncertainty.
7. Remove only the eleven assets proven unreferenced by `src/` and `index.html`.
8. Replace the large Open Graph PNG with a 1200 px JPEG and update `index.html`.
9. Enable gzip for HTML-adjacent text assets on Nginx, keeping existing asset caching.

## Rejected Alternatives

- CSS-only: fixes scrolling but leaves uncompressed delivery and release bloat.
- Aggressive virtualization/AVIF/CDN: adds runtime complexity and visual risk that the current small site does not need.

## Testing

- Test CSS contains no `content-visibility`, `contain-intrinsic-size`, `slowZoom`, or `backdrop-filter` runtime rule.
- Test touch devices receive no entrance animation and fine-pointer desktops receive a short, one-time animation.
- Test lazy responsive images receive `fetchpriority="low"` automatically while eager/high-priority images do not.
- Test the Hero factory link opens `/factory` instead of a missing hash target.
- Run all Vitest tests and a production Vite build.
- Recheck 390 × 844 and 1440 × 900 screenshots, document height before/after scrolling, image loading, console errors, and all routes.
- Verify production gzip through the `Content-Encoding` response header and confirm rollback release remains available.

## Constraints

- No new runtime dependency, CDN, service worker, page, route, or visual redesign.
- Preserve original source fallbacks that are still referenced.
- Keep the menu, language switch, quote flow, certification links, and five public routes working.
