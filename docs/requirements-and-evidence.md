# Requirements and evidence

## Guiding sources

- Supplied PDF: [Maintenance Problem and Test Cases](Maintenance_Problem_and_Test_Cases.pdf), 19 October 2026; public source: https://omega-hackathon-submit-2026.omega-digita-0373.chatgpt.site/resources/Maintenance_Problem_and_Test_Cases.pdf
- Supplied Markdown: [Maintenance brief and judging tests](Maintenance_Brief_and_Judging_Tests.md), version `omega-2026-10-19-core-v2`. The newly attached `(1)` copy matches the existing requirements.

These documents define product acceptance criteria. Their submission and suggested-tool instructions do not authorise publishing, contacting anyone or submitting the project. This build remains local on `solo/local`.

The PDF and Markdown agree on the ten functional outcomes and twenty UI criteria. The PDF explicitly describes selecting In Progress, entering a note and saving: the local UI now saves the selected status and explanation together, in one persisted change. A draft status never changes the saved status badge before validation succeeds.

## Functional mapping — 80 published marks

| Case | Required outcome | Implementation | Evidence |
| --- | --- | --- | --- |
| M01 | Valid report creates New with unique ID/date, fixed house and all inputs | `createRepair`, `RepairForm`, `JobDetail` | Domain rules and browser workflow check fields, IDs, dates and initial status |
| M02 | Empty and spaces-only description rejected with feedback | Domain validation and associated description error | Both attempts checked in browser; no records created |
| M03 | Empty and spaces-only reporter rejected with feedback | Domain validation and associated reporter error | Both attempts checked in browser; valid description preserved |
| M04 | Normal/Urgent retained independently; Urgent in words | Repair fields, list badges and detail priority | Domain and browser checks cover both priorities |
| M05 | Updating fence leaves kitchen-light job unchanged | Immutable updates by ID | Domain independence check; browser inspects second record and complete saved state |
| M06 | Select In Progress, enter note, save status/note plus timestamped history | `saveRepairUpdate` and single update form | Domain atomic-update check and browser workflow; latest note shown prominently |
| M07 | Empty/spaces-only completion rejected without changing earlier state | Validation occurs before persistence | Browser compares saved storage and history before/after both attempts |
| M08 | Completed plus explanation; New/In Progress retained | Completed summary and append-only history | Domain and browser workflow check all three states |
| M09 | Two complete independent records survive refresh | Storage adapter and hook initial load | Browser compares the entire persisted collection across actual reload and inspects both jobs |
| M10 | Literal `<b>check gate</b>` remains text in description/note | JSX text interpolation | Browser checks literal characters and absence of rendered `<b>` descendants |

## UI mapping — 20 published marks

| Category | Built support | Verification / remaining review |
| --- | --- | --- |
| Workflow (5) | Visible reporting form, separate job list, Open repair cues, focus on selected repair, status/note summary and clear update controls | Core workflow exercised by browser and keyboard. The five timed, uncoached human tasks remain pending. |
| Readability (5) | Three columns on desktop, stacked mobile layout, explicit navigation, wrapping text, main labels/actions >=14px, secondary instructions/history >=12px | Required viewports and 200-character unbroken content checked. Screenshots reviewed. |
| Feedback (5) | Report confirmation, preserved valid input, associated errors, local save confirmation, written Urgent, Completed with its explanation | Automated workflow covers creation, validation, updates and completion. |
| Accessibility (5) | Labelled native controls, visible focus, keyboard journey, focusable named result, live status and associated errors | Keyboard regression and axe WCAG A/AA scans cover initial/error/progress/completed states. Real screen-reader interaction remains pending. |

No score is self-awarded. A passing automated suite does not prove human discovery times or complete assistive-technology usability.

## Verification commands

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite runs at 1440 × 900 and 390 × 844. It also verifies that a failed browser-storage write preserves the previous saved status/history and the unsaved note draft.

## Scope

Keep the effort on these criteria. Accounts, staff assignments, scheduled dates, photos, costs, hosting and AI services are outside the required build. Saved data stays on the current browser origin. Multiple simultaneous editing tabs are not supported by this local app.
