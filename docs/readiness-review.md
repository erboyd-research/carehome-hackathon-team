# Judging readiness review

Reviewed on 19 October 2026 against the user's attached full checklist (omega core v2). This records observed evidence, not an awarded score. The judge's 100/100 cannot be guaranteed, especially while the five human workflow observations remain unperformed.

## Functional checklist — all ten demonstrated by current tests

- [x] M01: Valid report creates a distinct New job with ID, date, Meadow House, description, reporter and Urgent priority.
- [x] M02: Empty and spaces-only descriptions rejected; useful feedback; no job created.
- [x] M03: Empty and spaces-only reporter names rejected; useful feedback; valid description preserved.
- [x] M04: Each job retains its own Normal/Urgent priority; Urgent is written in words.
- [x] M05: Updating one job preserves the other job; IDs are distinct.
- [x] M06: Selected In Progress status and note save together; latest note and timestamped earlier history remain readable.
- [x] M07: Empty/spaces-only completion rejected; saved storage, status, notes and history stay unchanged.
- [x] M08: Completed and completion explanation appear together; earlier New/In Progress history remains.
- [x] M09: Two independent records, including completed history, survive actual browser refresh. Completed records are accessed through Repair record.
- [x] M10: Literal `<b>check gate</b>` remains literal text in descriptions and notes, with no rendered HTML elements.

Evidence: `src/domain/repairs.test.ts`, `e2e/repairs.spec.ts`, `e2e/layout.spec.ts`.

## Human UI checklist — implementation evidence, with workflow timing pending

### Workflow: pending independent human observation

- [ ] W1: An uncoached person finds reporting within 10 seconds.
- [ ] W2: They find/open a record within 30 seconds.
- [ ] W3: They find progress/completion controls within 30 seconds.
- [ ] W4: They identify the saved status and latest note within 20 seconds.
- [ ] W5: They complete the core tasks without coaching or inspecting source.

The controls exist and browser/keyboard journeys pass. Timings from a scripted test would not establish these five human outcomes.

### Readability: verified in rendered screens and checks

- [x] R1: Required content works at 1440 × 900 without clipping, overlap or page-level horizontal scrolling. Both main panels exceed 500px width; Report repair fits within the initial viewport.
- [x] R2: Required content remains reachable at 390 × 844 without page-level horizontal scrolling.
- [x] R3: Main controls/labels are at least 14px; secondary instructions/history are at least 12px. Fixed the mobile Repair record navigation link from 12px to 14px and added a regression assertion.
- [x] R4: Action/state names are consistent; buttons, links and the disclosure summary are distinguishable from static text.
- [x] R5: A 200-character description/note wraps fully, including an unbroken string; feedback is in flow, not overlaid on it.

### Feedback: verified in browser journeys

- [x] F1: Report creation announces a successful save and opens its named result.
- [x] F2: Validation messages explain the error and preserve valid entered content.
- [x] F3: Progress saves confirm the saved status and show the latest note.
- [x] F4: Urgent appears in words.
- [x] F5: Completed and the completion explanation are displayed together.

### Accessibility: verified within tested states

- [x] A1: Controls have programmatic names; placeholders are not the only labels.
- [x] A2: Keyboard journey covers report, progress and completion; archive opens by keyboard; closing a repair returns focus to Repair jobs.
- [x] A3: Main controls have a visible focus outline; keyboard test asserts its style and size.
- [x] A4: Automated WCAG A/AA contrast checks pass on initial, error, progress, completed and expanded-archive states at both viewports. Removed opacity fading from archive reveal so text does not lose contrast during animation.
- [x] A5: Field errors have associated descriptions and focus; saves use a live region and creation/opening focuses a named result.

Automated accessibility tests are not a substitute for a full assistive-technology audit. A short real screen-reader smoke check remains a prudent final review rather than an extra published scoring category.

## Current verification

- `npm test`: 13 passed.
- `npm run test:e2e` using installed Chrome: 12 passed across 1440 × 900 and 390 × 844, including expanded-archive accessibility.
- `npm run build`: TypeScript and production build passed.
- `git diff --check`: passed.
- Source inspection found no TODO/FIXME placeholders, HTML-insertion APIs or remote API fetches in `src/`. No `.env`, installed dependencies or generated build output is tracked.
- The existing locked dependencies, local brand/font assets and no-key setup support a simple reproducible install. Previously installed successfully with `npm ci` in this clean clone. CI is configured for Node 24, tests, build and Playwright Chromium when published.

## Remaining work and fix plan

| Remaining item | Action | Completion evidence |
| --- | --- | --- |
| W1: reporting discovery | Give an unfamiliar person the app and ask them to report a repair. Start a stopwatch as the page is shown; offer no hints. | Record observed time <=10s. If they hesitate, simplify the reporting label/placement and repeat with a different unfamiliar reviewer. |
| W2: record discovery | Ask them to open an existing active repair, then a completed repair through Repair record. | Record discovery/opening within 30s. If unclear, revise the record summary or Open repair cue while retaining the closed default. |
| W3: update controls | Ask them to record progress and then complete the repair with an explanation. | Find controls within 30s. If unclear, improve the update heading, field order or action wording, then retest. |
| W4: saved outcome | After saving, ask them to tell you the saved status and most recent note. | Both identified within 20s. If missed, strengthen the latest-note summary or move save confirmation closer to it. |
| W5: uncoached whole journey | Let them complete report -> progress -> completion -> refresh without advice or source inspection. | Record pass/fail and exact hesitation points; fix observed problems and repeat. |
| Real screen-reader smoke check | Use a screen reader to inspect form labels, errors, saved-result announcements, archive disclosure and focus transitions. | Record tool/browser and outcomes; repair any missing announcement or lost focus. |
| Latest source on public GitHub | Local work remains on `solo/local` at the user's request. Remote main was checked and still points to `084f21f`, the earlier starter. Compare versions, then publish the chosen final version only when requested. | Verify the intended commit is on the public repository and its checks pass. |
| Final setup and submission | From the chosen published revision, run `npm ci`, tests and build, rehearse the README story, then submit the correct repository/session before the applicable deadline. | A fresh install runs; the submitted commit matches the reviewed code; keep the private receipt out of the repo. |

The source already exists in a public repository, satisfying the basic public-source requirement. The latest local improvements are not yet represented there. Deployment, running notes, three-test notes and AI-tool notes are optional in the supplied brief; their absence is not a functional gap.

## Assessment

The local setup is suitable and appropriately small for this challenge: one browser app, one jobs collection, shared validation, immutable updates, append-only saved history and a separate persistence adapter. No required product feature is known to be missing after this review. Two concrete UI issues found during the audit were fixed and regression-checked. Full-mark readiness still depends on the human observations and delivering this exact reviewed version to the judges; a guaranteed 100/100 would overstate the evidence.
