# Solo build plan

## Current working setup

This checkout is for local solo work on branch `solo/local`. Its starting commit is `084f21fbec02324e1d06a147df5140e514e9d799`. GitHub `main` can continue separately. Do not push this branch or merge remote changes until the user asks.

The core repair journey already works. Build on this baseline, fix observed problems and improve usability. Keep the original brief as the acceptance criteria. No backend, login system, paid service or AI API is needed for this challenge.

## Architecture: one small app, four layers

```text
React feature screens
  src/features/reporting/     report form and feedback
  src/features/jobs/          job list, detail, history and updates
            |
App composition + shared state
  src/App.tsx                selected job and save announcements
  src/hooks/useRepairs.ts     one jobs collection and all write operations
            |
Repair rules
  src/domain/types.ts        agreed data model and Result<T>
  src/domain/repairs.ts      validation and immutable repair transitions
            |
Storage adapter
  src/domain/storage.ts      validated load and localStorage save
```

The hook coordinates the rules and storage; domain rules do not depend on browser storage. UI calls hook operations, never writes storage directly. History is the source of saved notes. Do not keep duplicate status or latest-note fields that can disagree with history.

Every change follows: input -> validate -> produce next record -> persist -> update displayed state -> announce success. Rejection preserves the earlier job and history. Storage failure must not look like a successful save. User content renders as ordinary text.

Use the existing structure. Add a shared component only when the same element genuinely appears in multiple places. Avoid a new state library, generic repository framework, microservices or a folder per hypothetical future feature.

## Solo SDLC: one issue, one small change, one checked checkpoint

### 1. Establish the baseline

Run `npm test`, `npm run build`, then the existing browser suite. Walk through the README demo story yourself. Record actual outcomes in `docs/judging-checklist.md`. Keep an issue list of concrete failures or usability problems, each with a reproduction and expected result.

Done when: you can report two jobs, update one, reject blank completion, complete it and refresh without losing either record. You can explain how the state is saved.

### 2. Make one complete workflow easy to use

Work through report -> select -> start -> note -> complete -> refresh. Prioritise actions a judge cannot find, unclear feedback, mobile navigation and long text. Change one observed problem at a time. Keep validation, timestamps and persistence intact.

First UI task: on a 390px-wide screen, report a repair and then locate its update controls. Decide from that walkthrough whether the current scroll distance needs an explicit "View repair" link or focus movement. If you add navigation, preserve keyboard focus and error behaviour. Do not redesign unrelated screens in the same change.

Done when: a fresh user can perform the whole journey without coaching on desktop and mobile.

### 3. Lock down failure cases

Check empty and spaces-only required fields, invalid completion, two independent jobs, literal HTML-looking text and refresh. Use existing tests first; add a regression test only for a new rule or reproduced bug. Keep fictional input data.

Done when: every published functional rule has observed evidence; unresolved failures are explicit.

### 4. Review usability and accessibility

Check all 20 UI criteria: keyboard, visible focus, labels, error associations, save announcements, contrast, 200-character text, and the two required viewport sizes. Automated checks support this review; they do not replace human timed tasks or screen-reader checks.

Done when: the checklist records what was actually tested, with remaining issues prioritised by impact on the judging criteria.

### 5. Freeze, rehearse and reconcile

Reserve at least the final third of remaining time for testing and fixes. Rehearse the same short demo from the README. Before submission, compare this branch with the latest GitHub version and choose changes deliberately. Repeat the full checks after combining code.

Done when: the selected final version builds, passes the functional walkthrough and has accurate run instructions. Publishing and submission happen only when requested.

## Everyday commands

Run from the repository folder. If PowerShell blocks npm, use `npm.cmd` in place of `npm`.

```bash
npm run dev
```

In a second terminal:

```bash
npm test
npm run build
```

Browser regression suite (first install downloads its browser):

```bash
npx playwright install chromium
npm run test:e2e
```

If using installed Chrome on Windows PowerShell:

```powershell
$env:PW_BROWSER_CHANNEL = 'chrome'
npm run test:e2e
```

After a checked change, make a local checkpoint:

```bash
git diff
git add src/path-you-changed docs/path-you-changed
git commit -m "Describe the behaviour improved"
```

Use actual changed paths in `git add`. Do not stage dependencies, build output, secrets or real care data. A local commit does not upload anything.

## Compare with main later

First commit your local work. Fetch updates without merging them:

```bash
git fetch origin
git status
git log --left-right --oneline HEAD...origin/main
git diff --stat HEAD origin/main
git diff HEAD origin/main -- src docs
```

In the log, `<` marks commits only on your current branch and `>` marks commits only on remote main. The diff shows what would change from your current files to remote main. Fetch leaves your working files unchanged; avoid `git pull` until you choose an integration strategy.

For a useful self-contained incoming commit, inspect it and then optionally apply it locally:

```bash
git show COMMIT_SHA
git cherry-pick COMMIT_SHA
```

Replace `COMMIT_SHA` with a reviewed commit hash. Cherry-picking applies the whole commit; for mixed changes, select individual hunks with your editor's comparison tools. Resolve conflicts deliberately and rerun tests before accepting the combined version. Keep `solo/local` as the local experiment until you explicitly choose what to publish.

## Copyable prompt for each coding session

> Work in this local checkout on solo/local. Read AGENTS.md, docs/architecture.md and docs/solo-build-plan.md. The judging brief is the acceptance criteria. First inspect the current code and reproduce the specific issue I give you. Make the smallest complete change through the existing UI, hook, domain and storage layers. Preserve independent records, validation-before-save, history, plain-text rendering and refresh persistence. Run checks relevant to the change and explain what passed and what remains unverified. Keep work local; do not push, merge remote branches, deploy or submit without my instruction. Today's task: [one concrete outcome].
