---
specdojo:
  id: prj-0001:xer-pjr-b5ty-20261031t064525z-aed4a0ed
  type: exec-result
  task_id: PJR-B5TY
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-b5ty-20261031T064525Z-aed4a0ed-plan.md
  started_at: "2026-10-31T06:45:25.941Z"
  completed_at: "2026-10-31T07:01:36.049Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- ブラウザ不要の Mermaid 構文検査 tool を導入し、単体テストを追加しました。
- `docs/` 配下の 3,572 文書および 189 図をスキャンし、構文エラーがないことを確認しました。
- `CHANGELOG.md` および個票 `pjr-b5ty-mermaid-syntax-lint.md` を更新しました。

## 2. 変更ファイル

- `CHANGELOG.md`: Mermaid の構文検査機能の追加に関する記録を追記。
- `tests/tools/lint-mermaid.test.ts`: Mermaid 構文検査ツールの動作を検証するための単体テストを追加。
- `tools/lint-mermaid.mjs`: Mermaid 図の構文を解析するためのメインツールを作成。
- `tools/mermaid-parse-loader.mjs`: 構文解析用 Worker をロードするためのローダーを作成。
- `tools/mermaid-parse-worker.mjs`: ブラウザ環境に依存せず、Mermaid の構文解析を行う Worker を作成。

## 3. 申し送り

- 解析には [Mermaid公式API](https://mermaid.js.org/config/usage#syntax-validation-without-rendering) の `mermaid.parse` を採用した。docs-site の mermaid-cli から同じ Mermaid パッケージを解決し、版のずれを防ぐ。今回の版は12.0.0。docs-lintへの依存追加を避け、リポジトリ内 tool とした。構文解析専用Worker内だけでDOMPurifyのラベル処理を置き換え、ブラウザ・DOM実装・描画を使わず解析する。診断行は元Markdownの開始fence行を示す。
- 変更ファイル: `tools/lint-mermaid.mjs`、`tools/mermaid-parse-worker.mjs`、`tools/mermaid-parse-loader.mjs`、`tests/tools/lint-mermaid.test.ts`、`CHANGELOG.md`、個票 `pjr-b5ty-mermaid-syntax-lint.md`。既存図の修正は不要だった。
- 保護設定の変更案を個票4.3節に記録した。利用者承認後のfeatureブランチで、package.jsonへlint:mermaid scriptとcheckへの接続、lefthook.ymlへ変更Markdownの検査、親検証の型・固定registry・schema・テストへlint-mermaid IDを追加し、`.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` に接続する。保護設定は本実行では変更していない。
- 単体テスト・型検査・既存lint・schema検証は指定された親runnerに委ねた。resultファイルは編集していない。カタログ検証は終了コード0だが、変更対象外の未作成文書に関する `based_on` 警告がある。

## 4. 進め方

Markdown ファイル内の Mermaid コードブロックを抽出し、[Mermaid公式API](https://mermaid.js.org/config/usage#syntax-validation-without-rendering) の `mermaid.parse` を用いて構文エラーを判定する独自の lint ツールを構築しました。Worker を利用することで、重い構文解析を非同期かつ環境に依存しない形で行えるようにしています。既存の `docs/` 配下の全文書に対してこのツールを実行し、図の構文エラーがないことを検証しました。
