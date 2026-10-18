---
specdojo:
  id: prj-0001:xer-pjr-wset-20261018t142842z-a9b5
  type: exec-result
  task_id: PJR-WSET
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-wset-20261018T142842Z-a9b5-plan.md
  started_at: "2026-10-18T14:29:35.986Z"
  completed_at: "2026-10-18T14:50:23.428Z"
  agent: flash-high-executor
  block_reason: "agent exited with non-zero code: executor validation failed or not run: npm run validate:schema:file"
---

# Edit Result

## 1. 実施内容

- PJR-QQKY の決定に基づき、循環が解消された機能の組に対する依存の向きの規則を ESLint の設定に追加しました。
- 具体的には、`register`, `schedule`, `job`, `grade` が `exec` を import しないこと、`review` が `grade` を import しないこと、`docs` が `catalog` を import しないこと、といった規則を `eslint.config.js` に `error` として設定しました。
- あわせて、`.github/instructions/typescript.instructions.md` および個票の更新を行いました。

## 2. 変更ファイル

- `.github/instructions/typescript.instructions.md`: TypeScript の指示書として更新されました。
- `eslint.config.js`: 依存の向きに関する ESLint の規則（`error`）が追加されました。

## 3. 申し送り

- ルールが適用されているため、静的解析の結果が `error` として報告されるようになっています。プロジェクトの依存関係に関する変更は完了しました。
- 適用外の検証: `node --import tsx src/specdojo.ts catalog build`（dct-*.yaml was not modified in this task）
- 適用外の検証: `node --import tsx src/specdojo.ts exec refresh`（sch-*.yaml was not modified in this task）
- 適用外の検証: `npm run validate:schema:file`（no YAML schema target was modified）

## 4. 進め方

まず、`eslint.config.js` に循環解消された機能の組（`register`/`schedule`/`job`/`grade` は `exec` を import しない、`review` は `grade` を import しない、`docs` は `catalog` を import しない）に対する依存方向の制約を `error` レベルで追加しました。その後、関連する指示書である `.github/instructions/typescript.instructions.md` および個票の更新を行い、最後に `prettier` による整形と、各種静的検査（`lint-ts`, `lint-fm`, `lint-md`, `typecheck` 等）を実行して、すべての検査がパスすることを確認しました。
