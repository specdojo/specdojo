---
specdojo:
  id: prj-0001:xer-pjr-wset-20261018t142842z-a9b5
  type: exec-result
  task_id: PJR-WSET
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-wset-20261018T142842Z-a9b5-plan.md
  started_at: "2026-10-18T14:29:35.986Z"
  completed_at: "2026-10-18T15:43:31.111Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- PJR-QQKY の決定に基づき、循環が解消された 6 組の依存の向きの規則を `eslint.config.js` に `error` として追加しました。
- 対象となる依存関係の規則（`register`/`schedule`/`job`/`grade` は `exec` を import しない、`review` は `grade` を import しない、`docs` は `catalog` を import しない）を ESLint の設定に組み込みました。
- `.github/instructions/typescript.instructions.md` および個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-wset-src-feature-direction-rules.md` を更新しました。
- Prettier による整形および各種静的検査（`lint:ts`, `lint:fm`, `lint:md`, `typecheck`, `test:integration`, `test:unit`）がパスしていることを確認しました。

## 2. 変更ファイル

- `.github/instructions/typescript.instructions.md`: TypeScript の指示書を更新しました。
- `eslint.config.js`: 依存の向きに関する規則を `error` として追加しました。

## 3. 申し送り

- 成果物の更新と静的検査の完了を確認しました。作業は完了しています。
- 適用外の検証: `node --import tsx src/specdojo.ts catalog build`（dct-*.yaml was not modified in this task）
- 適用外の検証: `node --import tsx src/specdojo.ts exec refresh`（sch-*.yaml was not modified in this task）
- 適用外の検証: `npm run validate:schema:file`（no YAML schema target was modified）

## 4. 進め方

まず、依存の向きに関するルールを `eslint.config.js` に追加するための準備として、対象となる規則の内容を確認しました。次に、ESLint の設定ファイルに新しいルールを追加し、依存関係の違反が `error` として報告されるように構成しました。その後、指示書である `.github/instructions/typescript.instructions.md` と、コンテキストとなる個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-wset-src-feature-direction-rules.md` の両方を更新しました。最後に、変更が適切であることを保証するために、Prettier による整形と各種静的検査ツールを実行しました。
