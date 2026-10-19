# Shared architecture

## Stack

Vite, React, TypeScript and ordinary CSS. No server or paid services. Vitest checks business rules. `package-lock.json` pins the installed dependency tree; teammates should use `npm ci`.

## Ownership and dependency direction

`App.tsx` connects feature components to `useRepairs`. Features import shared types, not each other's state. `useRepairs` owns the jobs collection and persistence. Domain operations are pure with respect to their input records: they return a new repair or validation errors, never mutate an existing job. UI components render user content using JSX text interpolation.

## Data contract

See `src/domain/types.ts`. All IDs use `crypto.randomUUID()`; timestamps are ISO strings, displayed with British date formatting. Status is exactly `New`, `In Progress` or `Completed`. Priority is exactly `Normal` or `Urgent`. `house` is always `Meadow House`.

Each history entry has an ID, timestamp, status and note. The newest history entry contains the latest note. Completion adds an entry while retaining earlier ones. No extra latest-note field needs synchronising.

## Public hook operations

```ts
createRepair(input: ReportInput): Result<Repair>
startRepair(id: string): Result<Repair>
addProgressNote(id: string, note: string): Result<Repair>
completeRepair(id: string, note: string): Result<Repair>
```

The hook also returns `jobs` and `storageError`. Validation failure does not write storage or update jobs. Persistence failure does not announce success or replace current state. This starter uses synchronous local storage and a single active editing tab.

## Component contracts

- `RepairForm`: `onCreate(input)` returns a result; `onSaved(job)` selects the created job and announces success. Preserve inputs on failure.
- `JobList`: receives `jobs`, `selectedId`, `onSelect(id)`. No direct storage writes.
- `JobDetail`: receives `job`, `onStart(id)`, `onProgress(id, note)`, `onComplete(id, note)`, `onSaved(message)`. Keyed by job ID so note drafts do not move between jobs.
- `JobHistory`: receives history entries; renders timestamps and literal notes in order.

## Rules to preserve

Validate trimmed input before state changes. Never use HTML insertion for descriptions, reporters or notes. Never edit jobs by array index. Never overwrite earlier history. Shared interfaces and storage keys require integration-owner review.

## Suggested verification

Run `npm test` and `npm run build` for every pull request. Use the manual judging checklist for browser rendering, refresh, keyboard, mobile and feedback checks: domain tests alone cannot establish those behaviours.
