---
specdojo:
  id: prj-0001:xer-pjr-2rhb-20261122t134221z-004391b3
  type: exec-result
  task_id: PJR-2RHB
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-2RHB/pjr-2rhb-20261122T134221Z-004391b3/plan.md
  started_at: "2026-11-22T13:42:22.141Z"
  completed_at: "2026-11-22T13:49:17.258Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- 「Job Run」を「job run」に 56 ファイル 225 箇所で統一し、メッセージを確かめるテストと snapshot も直した。`gl-rulebook` に英語表記の小文字の決まりと `notes` の書き方の決まりを追加した。個票の作業内容・対応結果・CHANGELOG 案を更新した。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/`: 1 件（変更 1 件、+12 / -12 行）
- `docs/ja/product/010-business-specs/020-data-model/`: 4 件（変更 4 件、+21 / -21 行）
- `docs/ja/product/010-business-specs/040-user-interface-model/`: 2 件（変更 2 件、+7 / -7 行）
- `docs/ja/product/010-business-specs/050-system-functions/`: 1 件（変更 1 件、+2 / -2 行）
- `docs/ja/product/040-system-design/`: 4 件（変更 4 件、+23 / -23 行）
- `docs/ja/projects/prj-0001/010-deliverables-catalog/`: 7 件（変更 7 件、+22 / -22 行）
- `docs/ja/projects/prj-0001/routines/`: 1 件（変更 1 件、+1 / -1 行）
- `docs/ja/specdojo/exec-templates/`: 2 件（変更 2 件、+12 / -12 行）
- `docs/ja/specdojo/guides/`: 6 件（変更 6 件、+15 / -15 行）
- `docs/ja/specdojo/references/`: 3 件（変更 3 件、+5 / -5 行）
- `docs/ja/specdojo/rulebooks/`: 1 件（変更 1 件、+3 / -3 行）
- `docs/ja/specdojo/standards/`: 2 件（変更 2 件、+9 / -9 行）
- `docs/specdojo/schemas/v1/`: 4 件（変更 4 件、+4 / -4 行）
- `src/dashboard/`: 1 件（変更 1 件、+1 / -1 行）
- `src/exec/`: 1 件（変更 1 件、+1 / -1 行）
- `src/exec/run/`: 3 件（変更 3 件、+30 / -30 行）
- `src/grade/`: 1 件（変更 1 件、+1 / -1 行）
- `src/job/`: 2 件（変更 2 件、+6 / -6 行）
- `src/routine/`: 2 件（変更 2 件、+2 / -2 行）
- `tests/fixtures/yaml-pages/`: 3 件（変更 3 件、+12 / -12 行）
- `tests/src/exec/`: 2 件（変更 2 件、+9 / -9 行）
- `tests/src/job/`: 1 件（変更 1 件、+6 / -6 行）
- `tests/src/routine/`: 2 件（変更 2 件、+4 / -4 行）
- `tools/grade/`: 1 件（変更 1 件、+1 / -1 行）

## 3. 申し送り

- 題名は「Job実行設計」など「Job Run」を含まないため変更していない。「ステータス定義（Job Run）」だけ「ステータス定義（job run）」にした。理由は英語の用語だけを小文字にする決まりのため。
- 用語集（`gl-execution.yaml` と生成ページ）は PJR-960C の範囲のため触っていない。`source` の wikilink 表示名「ステータス定義（Job Run）」が新しい題名と食い違うが、リンクは解決する。用語集側の更新が必要。
- 履歴（`execution/runs/`・個票・`events/`・grade の結果と条件）、`archive/`、`CHANGELOG.md` は直していない。
- CHANGELOG 案: 区分 Changed、「CLI の出力・エラーメッセージの「Job Run」を「job run」へ表記統一した（文言のみで挙動は変わらない）。」
- 保護された設定の変更は不要だった。
- `tmp/replace-job-run.mjs` は置換に使った作業用ファイル。`tmp/` 配下でコミット対象外。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
