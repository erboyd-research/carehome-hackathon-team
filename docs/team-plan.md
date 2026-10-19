# Four-person team plan

Replace the owner placeholders with your names. The starter already implements the core workflow; each owner should verify and improve their area against the brief, then send a small pull request.

## Person 1 — team lead / integration

Own `src/domain/`, `src/hooks/`, `src/App.tsx`, package/configuration files and CI. Agree shared contracts before feature work. Review and merge each pull request. Run a full demo before submission. Coordinate contract changes rather than letting multiple assistants redesign the app.

Copyable coding prompt:

> You own shared repair operations, persistence and integration. Read docs/architecture.md and the supplied judging brief. Preserve the shared types and result contract. Verify independence, failed-completion atomicity and full persistence. Review feature pull requests, run npm test and npm run build, and resolve integration issues. Do not add a backend, accounts or paid services.

## Person 2 — repair reporting

Own `src/features/reporting/`. Check tests 1–4. Improve field feedback, preserved valid inputs, creation confirmation and keyboard flow. Verify blank and spaces-only input independently. Use hook callbacks; do not add your own jobs collection.

Copyable coding prompt:

> Improve only the report feature and its CSS. Use the existing ReportInput and Result<Repair> types and RepairForm callbacks. Meet judging tests 1–4: unique New job fields, description and reporter validation and retained Normal/Urgent priority. Preserve valid input on errors, label controls, associate errors and keep keyboard focus visible. Do not edit shared domain or hook files without agreement. Run npm test and npm run build.

## Person 3 — repair tracking and updates

Own `src/features/jobs/`. Check tests 5–8 and literal note rendering. Verify latest note visibility, history retention, record selection, completion validation and long content. Start with the existing component props.

Copyable coding prompt:

> Improve only the jobs feature and its CSS. Read shared types and existing component contracts. Meet tests 5–8: independent jobs, In Progress and saved notes with dated history, blank completion rejected without any loss, and valid completion retaining earlier history. Render all descriptions and notes as text. Preserve draft notes on validation failure. No duplicate state store or shared interface changes. Run npm test and npm run build.

## Person 4 — quality, accessibility and demo

Own `src/styles/base.css`, `docs/judging-checklist.md`, README and browser QA. Check every published test, especially refresh and literal HTML-looking text. Inspect 1440 × 900 and 390 × 844. Coordinate feature-specific markup fixes with its owner. Record actual outcomes; do not mark checks passed without performing them.

Copyable coding prompt:

> Review the app against all 10 functional tests and all 20 UI checks in the supplied brief. Own global styles and QA docs; coordinate feature changes with their owner. Test mobile/desktop, long text, keyboard focus, control names, contrast and screen-reader feedback. Record actual checks and bugs in docs/judging-checklist.md. Prepare the README demo story. Extra features earn no functional marks. Run npm test and npm run build.

## Working agreement

1. Everyone runs `npm ci` and `npm run dev` before changing code.
2. Start branches from current `main`: `feature/reporting`, `feature/jobs`, `feature/quality`, or `feature/integration`.
3. Work in your owned files. Ask the integration owner before changing shared contracts.
4. Keep commits and pull requests small; state the behaviour changed and how you checked it.
5. Pull the merged baseline before continuing; commit local work before switching branches.
6. Reserve the final 35% of remaining time for testing, fixes, demo and submission. Stop adding features then.

## Merge checklist

- [ ] Shared types and storage key still agree.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Changed workflow checked in a browser.
- [ ] No real care data, secrets or API keys.
- [ ] README still matches run commands.

## Demo ownership

Person 1 introduces the problem and architecture. Person 2 reports two jobs. Person 3 starts and completes one, including a rejected blank completion. Person 4 refreshes, demonstrates independence and explains the checks. Choose one person to operate the app to keep the demo smooth.
