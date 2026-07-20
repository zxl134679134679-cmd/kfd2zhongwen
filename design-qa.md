# KFD website design QA

Status: Passed

Checked on 2026-07-20.

## Scope

- Homepage
- Products page
- Packaging solutions page
- Factory page
- Certifications page
- Contact page
- Chinese / English language switch
- Quote dialog entry
- Certification PDF links

## Result

- Build passed.
- Automated checks passed: 6 / 6.
- All main page URLs return normally in local preview.
- No mojibake patterns found in source after the rewrite.
- Product order is aligned with the latest direction: printed cartons first.
- Certifications point to local PDF files under `/certificates/`.

## Notes

- The quote dialog is currently a front-end collection flow. To send inquiries automatically, connect it later to email or n8n.
- Local preview URL used for this QA: `http://127.0.0.1:4175/`.
