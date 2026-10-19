# Browser judging checklist

Source: `Maintenance_Brief_and_Judging_Tests.md`, judging version `omega-2026-10-19-core-v2`.

These are manual checks, initially unchecked. Automated tests exercise the underlying rules and serialization; they do not prove browser usability, actual refresh persistence or safe DOM rendering.

## Functional — 8 marks each, all-or-nothing

- [ ] 1. Submit Garden fence damaged / Alex Morgan / Urgent. See New, automatic unique ID, date, Meadow House and all report fields.
- [ ] 2. Empty description and then spaces only both create no job and give useful feedback.
- [ ] 3. Empty reporter and then spaces only both create no job and give useful feedback.
- [ ] 4. Create Normal and Urgent reports; each retains its priority and Urgent appears in words.
- [ ] 5. Create fence and kitchen-light jobs. Change only fence. Distinct IDs; kitchen-light fields, status, notes and history stay unchanged.
- [ ] 6. Start fence; save Temporary barrier fitted. See In Progress, latest note and dated/timed history including earlier entries.
- [ ] 7. Attempt empty and then spaces-only completion. Both rejected; previous status, saved notes and history stay intact.
- [ ] 8. Complete with Fence repaired and checked. See Completed, explanation and earlier New/In Progress history.
- [ ] 9. Refresh with two records, one completed. Both retain their own fields, status, notes and history.
- [ ] 10. Enter literal `<b>check gate</b>` in description and note. Literal tags remain visible; no bold interpretation or execution.

## Human UI — 1 mark each

### Workflow
- [ ] Find main action within 10 seconds without a hint.
- [ ] Find a record within 30 seconds.
- [ ] Find update actions within 30 seconds.
- [ ] Identify saved outcome within 20 seconds.
- [ ] Complete core tasks without coaching or source inspection.

### Readability
- [ ] 1440 × 900: no clipping, overlap or page-level horizontal scroll.
- [ ] 390 × 844: required content reachable without page-level horizontal scroll.
- [ ] Main text, labels and actions at least 14px; secondary instructions at least 12px.
- [ ] Consistent action names and distinguishable controls.
- [ ] 200-character description/note and feedback fully readable, including unbroken text.

### Feedback
- [ ] Clear creation confirmation.
- [ ] Validation explains error and preserves valid inputs.
- [ ] Progress updates clearly confirm saved result.
- [ ] Urgent conveyed in words.
- [ ] Completed status and completion explanation clear.

### Accessibility
- [ ] Every control has an accessible name; placeholder alone is insufficient.
- [ ] Core tasks work by keyboard without a trap.
- [ ] Keyboard focus visible on main controls.
- [ ] Text contrast at least 4.5:1; large text at least 3:1.
- [ ] Errors associated with inputs; updates announced or focus moves to a named result.

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
