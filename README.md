# Meadow House Repairs

Local solo build of the university hackathon app. Report repairs, save progress and retain completion history at fictional Meadow House. The supplied PDF and Markdown judging brief define the acceptance criteria.

Start with [requirements and evidence](docs/requirements-and-evidence.md) and the [solo build plan](docs/solo-build-plan.md). This branch stays local until the user chooses to compare and publish changes.

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

CI is configured to run the domain tests, production build and browser tests when this code is published. Local browser tests cover report validation, independent records, atomic status/note updates, completion, refresh persistence, literal markup, long text, keyboard operation, failed storage writes and automated WCAG A/AA checks.

## What already works

- Report with description, reporter and Normal/Urgent priority; reject blank or whitespace-only required text.
- Optionally choose a common repair to fill an editable description, or type any repair directly. Normal/Urgent use an accessible two-part selector with standard keyboard radio behaviour; hover alone never changes priority.
- Automatic unique ID, date, fixed Meadow House name and initial New status.
- Separate job records; choose a status and save its explanation together in one update.
- A large two-column desktop workspace for reporting and active jobs. Completed jobs stay in a closed-by-default Repair record; open the record to inspect a completed repair. Detail panels appear only after creating or opening a job.
- Prominent latest saved note, with Completed and its completion explanation displayed together.
- Append-only dated/timed history, including earlier states and notes.
- Browser local storage persistence. Successful saves are announced after storage succeeds.
- Plain-text descriptions and notes, responsive layout, labels, field errors and keyboard focus styles.

Human timed usability and assistive-technology review are still recorded separately in [the judging checklist](docs/judging-checklist.md). Automated checks are evidence, not a judging score.

## Original team plan

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
3. Open the fence, choose **In Progress**, enter **Temporary barrier fitted**, then **Save update**.
4. Choose **Completed**, try blank and spaces-only completion notes, and show the preserved saved status and history.
5. Enter **Fence repaired and checked**, click **Complete repair**, then refresh.
6. Open **Repair record**, then open the fence to inspect its completion and history. The kitchen-light job remains in the active list. Verify literal `<b>check gate</b>` text renders literally in a report and note.

Submission is a team action. The attached brief lists code freezes of 12:30 UK (morning) and 16:30 UK (afternoon), 19 October 2026. Confirm your session and submit the public repository before its deadline.
