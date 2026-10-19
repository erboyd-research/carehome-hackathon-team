# Browser judging checklist

Sources: `Maintenance_Brief_and_Judging_Tests.md`, judging version `omega-2026-10-19-core-v2`, and `Maintenance_Problem_and_Test_Cases.pdf` (M01–M10 and the 20 UI checks).

Checked items have observed automated or visual evidence; final judging remains a human decision. The five timed workflow observations remain unchecked. See readiness-review.md for current findings and every remaining action. The current automated browser suite also tests actual refresh persistence, literal text rendering and keyboard operation. It does not establish uncoached human discovery times or real screen-reader usability. See `requirements-and-evidence.md` for the case-by-case mapping.

## Functional — 8 marks each, all-or-nothing

- [x] 1. Submit Garden fence damaged / Alex Morgan / Urgent. See New, automatic unique ID, date, Meadow House and all report fields.
- [x] 2. Empty description and then spaces only both create no job and give useful feedback.
- [x] 3. Empty reporter and then spaces only both create no job and give useful feedback.
- [x] 4. Create Normal and Urgent reports; each retains its priority and Urgent appears in words.
- [x] 5. Create fence and kitchen-light jobs. Change only fence. Distinct IDs; kitchen-light fields, status, notes and history stay unchanged.
- [x] 6. Select In Progress and save Temporary barrier fitted together. See In Progress, latest note and dated/timed history including earlier entries.
- [x] 7. Attempt empty and then spaces-only completion. Both rejected; previous status, saved notes and history stay intact.
- [x] 8. Complete with Fence repaired and checked. See Completed, explanation and earlier New/In Progress history.
- [x] 9. Refresh with two records, one completed. Both retain their own fields, status, notes and history.
- [x] 10. Enter literal `<b>check gate</b>` in description and note. Literal tags remain visible; no bold interpretation or execution.

## Human UI — 1 mark each

### Workflow
- [ ] Find main action within 10 seconds without a hint.
- [ ] Find a record within 30 seconds.
- [ ] Find update actions within 30 seconds.
- [ ] Identify saved outcome within 20 seconds.
- [ ] Complete core tasks without coaching or source inspection.

### Readability
- [x] 1440 × 900: no clipping, overlap or page-level horizontal scroll.
- [x] 390 × 844: required content reachable without page-level horizontal scroll.
- [x] Main text, labels and actions at least 14px; secondary instructions at least 12px.
- [x] Consistent action names and distinguishable controls.
- [x] 200-character description/note and feedback fully readable, including unbroken text.

### Feedback
- [x] Clear creation confirmation.
- [x] Validation explains error and preserves valid inputs.
- [x] Progress updates clearly confirm saved result.
- [x] Urgent conveyed in words.
- [x] Completed status and completion explanation clear.

### Accessibility
- [x] Every control has an accessible name; placeholder alone is insufficient.
- [x] Core tasks work by keyboard without a trap.
- [x] Keyboard focus visible on main controls.
- [x] Text contrast at least 4.5:1; large text at least 3:1.
- [x] Errors associated with inputs; updates announced or focus moves to a named result.

## Review log

| Reviewer / date | Environment / viewport | Checks performed | Outcome / issue |
| --- | --- | --- | --- |
| Pending team review | | | |

## Starter verification — 19 October 2026

- `npm test`: 11 domain/storage tests passed.
- `npm run build`: TypeScript and production build passed.
- `npm run test:e2e`: 4 browser scenarios passed in installed Chrome: workflow and text/layout scenarios at both 1440 × 900 and 390 × 844.
- Desktop and mobile screenshots visually inspected for long-text wrapping and reachable content.
- Local execution used `PW_BROWSER_CHANNEL=chrome`; the default test configuration uses Playwright Chromium. CI installs Chromium automatically.
- Human timed usability, screen-reader behaviour, full keyboard traversal and measured contrast remain for the team's manual review. No judging score is claimed by these checks.

## Solo PDF-aligned build — 19 October 2026

- `npm test`: 13 domain/storage tests passed, including one-entry status/note saves and rejection preserving the original record.
- `npm run build`: TypeScript and production build passed.
- `npm run test:e2e`: 10 scenarios passed across desktop 1440 × 900 and mobile 390 × 844. Covers all ten functional cases through the full workflow, text-rendering/long-content checks, keyboard operation, failed storage writes and accessibility scans.
- axe WCAG A/AA scans passed on initial, report-validation, saved-progress, completion-validation and completed states at both viewports. These include essential text contrast and accessible names in the rendered states.
- The keyboard journey reports a repair, saves progress and completes it; verifies visible focus and focus on the named repair after creation. Error focus and associations are checked separately.
- Desktop/mobile screenshots inspected; save feedback is in document flow and beside the update action so it does not overlay the controls.
- Pending: the five timed uncoached workflow observations and human screen-reader review. No official score is claimed.

## Omega Digital styling review — 19 October 2026

- Applied the reference site's Poppins fonts, public logo, red/ink/cream colour tokens and fine-bordered card styling. Asset sources and font license are documented in `brand-reference.md`.
- Rechecked the production build, 13 domain tests and all 10 browser scenarios after restyling; all passed.
- Automated WCAG A/AA scans passed for the tested initial, error, progress and completion states on desktop and mobile, including contrast checks.
- Reviewed final desktop and mobile screenshots for branding, wrapping and reachable content. Human timed discovery and real screen-reader review remain pending.

## Larger workspace and completed-record disclosure — 19 October 2026

- Replaced three narrow columns with two equal main panels, enlarged headings and step numbers, and put reporter/priority fields side by side on desktop.
- Removed the empty detail placeholder, introductory marketing paragraph, default storage message and all hackathon/demo text from the ordinary UI. Save/error feedback remains available for actual actions.
- Repair record is a native details/summary disclosure, initially closed. Completed jobs leave the active list and remain accessible inside it. Initial load/refresh never opens a repair automatically.
- `npm test`: 13 passed; `npm run build`: passed; `npm run test:e2e`: 12 passed across desktop/mobile including the full workflow, archive, keyboard and automated accessibility checks.
- The new desktop regression confirms both main panels are at least 500px wide at 1440 × 900, aligned side by side, with the Report repair button within the viewport. The mobile check verifies no page-level horizontal overflow.
- Final desktop/mobile previews visually reviewed. Human timed usability and real screen-reader review remain pending.

## Common repairs and two-part priority — 19 October 2026

- Optional common-repair selector fills the same editable description field; free typing still works and no extra field is required by the domain/storage model.
- Normal and Urgent are native radios styled as two equal buttons. Normal is selected by default with white text on a dark background; Urgent is red with white text when hovered or selected. Hover does not select it.
- `npm test`: 13 passed; `npm run build`: passed; `npm run test:e2e`: 14 passed across desktop/mobile, including presets, custom descriptions, preserved priority on validation, hover states, keyboard use, contrast and the original judging workflow.
- Desktop/mobile screenshots inspected. Practical human-check and publication steps are in `final-checks-runbook.md`. Those steps remain a plan, not completed human observations or a submission.
