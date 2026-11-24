---
specdojo:
  id: prj-0001:xer-pjr-ms7x-20261122t074746z-2b54c393
  type: exec-result
  task_id: PJR-MS7X
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-MS7X/pjr-ms7x-20261122T074746Z-2b54c393/plan.md
  started_at: "2026-11-22T07:47:47.443Z"
  completed_at: "2026-11-22T08:00:33.131Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Added `specdojo update` (`--to`, `--dry-run`, `--no-interactive`) under `src/update/` and `src/commands/update.ts`, with 35 unit tests in `tests/src/update/`. Added the `update` section to command-reference and upgrade notes to the Quick Start guide and README. Updated the ticket's work table, results (including the CHANGELOG reading decision and the CHANGELOG draft), and related documents. Row 5 (orchestrator verification with a real 0.9.1 install and an npm pack tarball) stays open. The real tar/npm calls in `src/update/system.ts` have not been run because the sandbox did not allow the smoke test.

## 2. 変更ファイル

- `README.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/guides/quick-start-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+30 / -2 行
- `src/specdojo.ts`: 変更、+2 / -0 行
- `src/commands/update.ts`: 追加、+60 / -0 行
- `src/update/package-manager.ts`: 追加、+135 / -0 行
- `src/update/run.ts`: 追加、+421 / -0 行
- `src/update/scaffold-drift.ts`: 追加、+236 / -0 行
- `src/update/system.ts`: 追加、+115 / -0 行
- `src/update/version.ts`: 追加、+144 / -0 行
- `tests/src/update/package-manager.test.ts`: 追加、+114 / -0 行
- `tests/src/update/run.test.ts`: 追加、+250 / -0 行
- `tests/src/update/scaffold-drift.test.ts`: 追加、+153 / -0 行
- `tests/src/update/update-fixture.ts`: 追加、+29 / -0 行
- `tests/src/update/version.test.ts`: 追加、+82 / -0 行

## 3. 申し送り

- Work table row 5 is still open: after integration, the orchestrator should install npm specdojo 0.9.1 in an empty repository, run `config scaffold --provider claude`, then run `specdojo update --to &lt;npm pack tarball&gt;`. Check the version update, the CHANGELOG output, detection and interactive application of the stale skill copies, and that `--no-interactive` rewrites nothing.
- The real tar / npm view / npm pack calls in `src/update/system.ts` have not been run (the sandbox did not allow the smoke test). The row 5 check covers this path.
- CHANGELOG.md was not changed. The draft entry (category: 追加) is in the ticket under `### 5.1. CHANGELOG に書く事項`.
- CHANGELOG reading time: read the new version's CHANGELOG from the package extracted to a temp dir before the update. The same content can be shown in `--dry-run`, and the extracted package also serves as the comparison source. Cost: one extra tarball fetch.
- `_UNDECIDED_:` whether to propose rewrites of config files. The first version only shows the related CHANGELOG lines. A possible approach (ship machine-readable migration declarations per version and ask with a diff) is recorded in the ticket.
- No protected configuration change (`package.json`, `lefthook.yml`) was needed.
- 人の確認が必要: `specdojo update --to &lt;npm pack tarball&gt; (real 0.9.1 install in an empty repository)`（Work table row 5: needs a real npm install and an npm pack tarball outside the agent sandbox; the orchestrator runs it after integration）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
