# Real-life final checks

Keep the app local while doing these checks. The latest code has not been published or submitted. Use fictional names and repair details throughout.

## 1. Five-minute uncoached usability check

You need one person who has not used the app, a stopwatch and this record sheet. Use a fresh browser profile so existing records do not confuse the test. Do not clear a profile containing work you want to keep.

Give them the task, start timing when they see the relevant screen and do not point at controls. Record actual times and comments; do not count setup delays against them.

| Check | Say this to the reviewer | Pass | Observed result |
| --- | --- | --- | --- |
| W1 | "The garden fence is damaged. Report it as Alex Morgan, with Urgent priority." | Finds reporting within 10 seconds | Pending |
| W2 | "Find and open the fence repair." | Finds the record within 30 seconds | Pending |
| W3 | "Work has started. Record Temporary barrier fitted. Then finish it with Fence repaired and checked." | Finds progress/completion controls within 30 seconds | Pending |
| W4 | "What is its saved status, and what is the latest note?" | Both identified within 20 seconds | Pending |
| W5 | "Refresh, then find the completed repair and its earlier updates." | Whole report/progress/completion journey needs no coaching or source inspection | Pending |

Also ask them to open a completed repair through Repair record. If they hesitate, write down where, adjust that label or placement, and rerun the affected task with a different unfamiliar person. Keep the completed-record default closed.

Done when all five observations are recorded as passing. A developer's or automated test's speed is not evidence of uncoached human discovery.

## 2. Screen-reader smoke check — about five minutes

Use a screen reader you already have, such as Windows Narrator (start/stop with Windows+Ctrl+Enter) or NVDA. Record which screen reader and browser you used. Its reading/navigation mode can change how arrow keys reach form controls; switch to form/focus interaction when needed.

- [ ] Open the app. Navigate to What needs repairing, the optional common-repair picker, Reporter name and Priority. Confirm their names are announced.
- [ ] Confirm Normal/Urgent are announced as a group, with the selected option. Use the arrow keys to change priority. Hover alone must not change the selected value.
- [ ] Submit blank required fields. Confirm the error is read with the focused input; valid text elsewhere remains.
- [ ] Submit a valid report. Confirm creation/save is announced or focus lands on the named Repair details result.
- [ ] Save In Progress with a note. Confirm the save announcement and saved result are understandable.
- [ ] Try Completed without a note. Confirm the note error is read and the saved state remains unchanged.
- [ ] Complete with an explanation, close the detail and open Repair record by keyboard. Confirm the disclosure state and completed record are usable.
- [ ] Open/close a repair and continue with Tab/Shift+Tab. Confirm focus stays visible and does not become trapped.

If any check fails, record the precise missing label, announcement or focus move. Fix it and rerun that path. Do not mark this section passed from automated axe results alone.

Reviewer/tool/browser: ____________________  Date: __________  Outcome: __________

## 3. Final automated check — after the last code change

From the solo repository:

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
git status
```

On Windows PowerShell, use `npm.cmd` if script policy blocks `npm`. Browser installation is only needed the first time on that computer. Record the results, then commit the reviewed local work.

## 4. Compare and publish the reviewed version

When the user is ready to publish:

1. Run `git fetch origin` and inspect `git log --left-right --oneline HEAD...origin/main` plus `git diff HEAD origin/main`. Fetch does not merge remote changes.
2. If useful teammate changes exist, review and combine only those changes. Repeat the checks after integration.
3. Push `solo/local` and open a pull request into `main`. Review its actual changed files and checks, then merge the chosen version. Do not submit a branch that is absent from the public repository.
4. Copy the final `main` commit hash from GitHub and record it with the review results.

This runbook is a plan; it does not authorise automatically pushing, merging or submitting.

## 5. Fresh-install check

Clone the public repo into a separate, new folder using the clone command in the README. Do not overwrite the current solo folder. Run `npm ci`, `npm test`, `npm run build` and `npm run dev`. Verify that Git's current commit matches the intended published main commit. Walk through report -> progress -> rejected blank completion -> completion -> refresh -> completed record.

Done when someone can reproduce the reviewed app from public source with no API keys or missing assets. If it fails, fix the public source and repeat before submission.

## 6. Submit

- [ ] Open https://omegalifedigital.uk/submissions/ and choose Meadow House Repairs / Maintenance.
- [ ] Enter the real team details and correct session; retain the four-person team even if one person did most coding.
- [ ] Provide the public GitHub repository containing the reviewed main commit.
- [ ] Check that submission records the intended revision; save the private receipt/edit code outside the repo.
- [ ] Submit before the deadline for your session. The supplied brief lists 12:30 UK for morning and 16:30 UK for afternoon on 19 October 2026.

A hosted demo and the extra notes fields are optional. These steps close delivery and observed-usability gaps; only the organisers award the final score.
