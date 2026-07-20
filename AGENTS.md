# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Confirmed project decisions

- Build from selected visual option 1.
- Do not show a customer-name or customer-logo wall; keep the homepage focused on products, manufacturing capability, and the quote flow.
- Keep the main conversion path as a three-step, front-end-only quote request.
- Preserve the original KFD logo lockup extracted from the company PPT without redrawing it.
- Prefer real factory, production-line, printing, and laboratory photographs from the company PPT; generated imagery is acceptable only where the PPT has no suitable product photo.
- Use a bright ivory, navy, restrained orange and muted-gold editorial style with only subtle scroll reveals, photo push-in, and hover motion.
- Keep the page suitable for client reception and future WeChat sharing.
- Keep `/products` as the product solutions page and `/manufacturing` as the manufacturing and quality page.
- Homepage product links must lead to `/products`; manufacturing and quality links must lead to `/manufacturing`.
- Product-specific inquiry buttons on `/products` must open the shared three-step quote flow with the matching product preselected.
