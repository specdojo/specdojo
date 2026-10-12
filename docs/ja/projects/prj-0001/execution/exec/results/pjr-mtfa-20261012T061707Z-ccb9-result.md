---
specdojo:
  id: prj-0001:xer-pjr-mtfa-20261012t061707z-ccb9
  type: exec-result
  task_id: PJR-MTFA
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-mtfa-20261012T061707Z-ccb9-plan.md
  started_at: "2026-10-12T06:17:07.334Z"
  completed_at: "2026-10-12T07:02:41.569Z"
  agent: claude-expert-executor
  block_reason: "agent exited with non-zero code: executor validation failed or not run: specdojo index build, specdojo catalog validate"
---

# Edit Result

## 1. 実施内容

- `CHANGELOG.md` の 0.3.0 に、PJR-HRMS 完了後の変更を追記した。内訳は追加機能 3 件(PJR-VQZA、PJR-MD3C、PJR-BJH6)、不具合修正 9 件、既知の問題 3 件(PJR-W2EB、PJR-PV5B、PJR-HJ99)である。
- 移行ガイドの「更新前に確認する」の表に、`task.review`、`tmp/` の規則、`config init` の `.gitignore` 追記の 3 行を加えた。
- PJR-HJ99 は個票が waiting で実装が未統合のため、不具合修正ではなく既知の問題に記載した。
- executor の検査は `npx prettier --write` と `npx markdownlint` が passed だった。runner の検査(`lint-ts`、`lint-fm`、`lint-md`、`test-integration`、`validate-schema`、`typecheck`、`test-unit`)もすべて passed だった。

## 2. 変更ファイル

- `CHANGELOG.md`: 0.3.0 に追加機能 3 件、不具合修正 9 件、既知の問題 3 件を追記した。差分は 60 行の追加である。
- `docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md`: 「更新前に確認する」の表に `task.review`、`tmp/` の規則、`config init` の `.gitignore` 追記の 3 行を追加し、表を整形した。

## 3. 申し送り

- PJR-HJ99 は完了条件との差分が残っている。実装の統合後に、CHANGELOG の既知の問題から不具合修正へ移す必要がある。
- `specdojo index build` は executor では `not_run` だった。出力先の `.specdojo/doc-index.json` が agent の書き込み禁止対象で、runner が worktree の準備と統合の前に再生成するためである。
- `specdojo catalog validate` は、`docs/ja/projects/` 配下の変更がないため `not_applicable` とした。
- `test-unit` の出力末尾に `unknown option '--reserve'` などの CLI エラー文言と `reporter failed` が含まれている。これらは出力の一部で、検査自体は exit 0 の passed である。
- 適用外の検証: `specdojo catalog validate`（変更したのは CHANGELOG.md と docs/ja/specdojo/guides/ 配下だけで、表の適用条件（docs/ja/projects/ 配下の変更）に当たらない）

## 4. 進め方と実践の型の適用

登録簿の項目と個票の内容に沿って、PJR-HRMS 完了後の変更と公開時点で残る問題を `CHANGELOG.md` の 0.3.0 に分類して追記した。利用者に影響する変更は、移行ガイドの確認表にも反映した。整形と lint を実行し、変更後の検査もすべて passed を確認した。
