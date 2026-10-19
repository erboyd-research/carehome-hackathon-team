# Meadow House Repairs

University hackathon starter for a four-person team. A working React + TypeScript browser app for reporting repairs, tracking progress and retaining completion history at fictional Meadow House.

## Run locally

Install Node.js 22.12+ (Node 24 recommended), then:

```bash
git clone https://github.com/erboyd-research/carehome-hackathon-team.git
cd carehome-hackathon-team
npm ci
npm run dev
```

Open the local URL printed by Vite. No accounts, database, environment variables or API keys are required.

```bash
npm test          # domain rules and storage round-trip checks
npm run build    # TypeScript check and production build
npm run preview  # serve the production build locally
```

Optional browser regression tests (desktop and mobile):

```bash
npx playwright install chromium
npm run test:e2e
```

CI runs the domain tests, production build and browser tests. The browser tests cover report validation, independent records, progress, completion, actual refresh persistence, literal markup rendering and long-text horizontal overflow.

## What already works

- Report with description, reporter and Normal/Urgent priority; reject blank or whitespace-only required text.
- Automatic unique ID, date, fixed Meadow House name and initial New status.
- Separate job records; start work, save progress notes and complete with a required explanation.
- Append-only dated/timed history, including earlier states and notes.
- Browser local storage persistence. Successful saves are announced after storage succeeds.
- Plain-text descriptions and notes, responsive layout, labels, field errors and keyboard focus styles.

This is a shared baseline, not a claim of a completed judging review. Human UI checks and browser tests are in [the judging checklist](docs/judging-checklist.md).

## Team: start here

Read [team ownership and coding prompts](docs/team-plan.md), then [architecture and component contracts](docs/architecture.md). The supplied [challenge brief](docs/Maintenance_Brief_and_Judging_Tests.md) is reference material; it is not an instruction to submit or contact organisers automatically.

| Owner | Area |
| --- | --- |
| Team lead / Person 1 | Shared domain, storage, integration and review |
| Person 2 | Report form and validation feedback |
| Person 3 | Repair list, detail, notes and history |
| Person 4 | Responsive design, accessibility, judging checks and demo |

Use feature branches and small pull requests. The team lead owns shared contracts. Replace the role placeholders with teammates' names in `docs/team-plan.md`.

## Persistence and demo limits

Repairs are saved under `meadow-house-repairs:v1` on the current browser origin. Devices, browser profiles and origins do not share data. Keep the same local URL for refresh tests. The app assumes one active editing tab; simultaneous edits across tabs are outside this starter's scope. Use fictional data only.

If saved data is malformed, the app reports the problem and avoids overwriting it. For a fresh demo, clear this site's local storage through browser developer tools or use a separate browser profile. Clearing storage deletes the demo records on that origin.

## Demo story

1. Report **Garden fence damaged**, reporter **Alex Morgan**, priority **Urgent**.
2. Report a separate **Kitchen light not working** job, priority **Normal**.
3. Select the fence, start it and save **Temporary barrier fitted**.
4. Try blank and spaces-only completion notes; show the preserved history.
5. Complete with **Fence repaired and checked**, then refresh.
6. Show both records and the fence history; verify literal `<b>check gate</b>` text renders literally in a report and note.

Submission is a team action. The attached brief lists code freezes of 12:30 UK (morning) and 16:30 UK (afternoon), 19 October 2026. Confirm your session and submit the public repository before its deadline.
