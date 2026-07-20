# Remove Customer Wall Design

## Decision

Remove the complete customer-name section from the homepage. The manufacturing capability section will flow directly into the cooperation process section.

## Rationale

- Avoid the visually generic “customer wall” treatment.
- Do not display customer names, logos, counts, or unverified claims.
- Preserve the existing industrial visual system, quote flow, navigation, and all other homepage content.

## Acceptance Criteria

- “海尔”, “海信”, “正大”, “海氏海诺”, “PARTNERS”, and “服务行业头部客户” are absent from the rendered homepage.
- The `Customers` component and its `customers` content export are removed.
- The manufacturing section is followed by the cooperation process section.
- Existing quote-flow behavior and responsive layouts continue to work.

