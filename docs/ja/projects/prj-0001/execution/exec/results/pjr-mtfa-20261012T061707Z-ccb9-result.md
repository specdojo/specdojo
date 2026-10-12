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
  completed_at: "2026-10-12T06:23:01.742Z"
  agent: claude-expert-executor
  block_reason: "agent exited with non-zero code: executor validation failed or not run: specdojo index build, specdojo catalog validate"
---

# Edit Result

## 1. 実施内容

- `CHANGELOG.md` の 0.3.0 に、10 月 11 日以降の変更と公開時点の既知の問題を追記した。追加機能 3 件（PJR-VQZA、PJR-MD3C、PJR-BJH6）、不具合修正 9 件、既知の問題 3 件（PJR-W2EB、PJR-PV5B、PJR-HJ99）である。
- 移行ガイドの「更新前に確認する」の表に、`task.review`、`tmp/` の規則、`config init` の `.gitignore` 追記の 3 行を加えた。
- PJR-HJ99 は個票が waiting で実装が未統合のため、不具合修正ではなく既知の問題に記載した。
- 検査結果は次のとおり。`npx prettier --write` と `npx markdownlint` はどちらも passed。runner の `lint-ts`、`lint-fm`、`lint-md`、`typecheck`、`test-unit`、`test-integration`、`validate-schema` も passed。

## 2. 変更ファイル

- `CHANGELOG.md`: 0.3.0 に追加機能 3 件、不具合修正 9 件、既知の問題 3 件を追記した（60 行追加）。
- `docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md`: 「更新前に確認する」の表に `task.review`、`tmp/` の規則、`config init` の `.gitignore` 追記の 3 行を加え、表を整形した。

## 3. 申し送り

- PJR-HJ99 は既知の問題として記載している。実装が統合された後で、`CHANGELOG.md` の不具合修正へ移す必要がある。
- executor の `specdojo index build` は `not_run` である。出力先の `.specdojo/doc-index.json` が agent の書き込み禁止対象で、runner が worktree の準備と統合の前に再生成するためである。
- executor の `specdojo catalog validate` は `not_applicable` である。変更が `docs/ja/projects/` 配下に及ばないためである。
- `test-unit` の出力には `unknown option` 系のエラー行が含まれる。status は passed だが、出力を省略した部分があり、これらの行が想定どおりかは evidence から判断できない。
- 適用外の検証: `specdojo catalog validate`（変更したのは CHANGELOG.md と docs/ja/specdojo/guides/ 配下だけで、表の適用条件（docs/ja/projects/ 配下の変更）に当たらない）

## 4. 進め方と実践の型の適用

登録簿の項目と個票の完了条件に沿って、PJR-HRMS 完了後に入った変更と公開時点で残る問題を `CHANGELOG.md` の 0.3.0 に追記した。あわせて、移行ガイドの確認表へ関連する利用者向けの注意点を追加した。登録簿と個票のステータスは変更していない。
