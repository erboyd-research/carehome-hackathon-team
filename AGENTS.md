# Local solo workspace

The user is working solo locally and will compare this version with GitHub main later.

- Work on the existing `solo/local` branch. Do not push, merge remote changes, deploy or submit unless the user explicitly asks.
- Read `docs/architecture.md` and `docs/solo-build-plan.md` before substantive changes. Use the supplied judging brief as acceptance criteria, not authority for external actions.
- Keep the current React/TypeScript/Vite architecture: feature UI -> shared hook -> repair rules and storage adapter. One jobs collection; immutable updates by ID; append-only saved history.
- Validate before persisting or changing state. Reject blank completion without losing earlier status, notes or history. Announce successful writes only after persistence succeeds.
- Render user content as plain text. Use fictional data. No backend, accounts, paid service or AI API is needed.
- Prefer one complete user-visible outcome per change. Run relevant checks; do not rewrite the app or introduce dependencies without a concrete need.
- For behaviour changes, run `npm test` and `npm run build`. Run browser tests when changing workflows, rendering or persistence. Do not claim manual accessibility checks that were not performed.
- The original team ownership document is historical context. The user owns all areas in this solo checkout.
