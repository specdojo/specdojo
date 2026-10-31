---
specdojo:
  id: prj-0001:xer-pjr-b5ty-20261031t064525z-aed4a0ed
  type: exec-result
  task_id: PJR-B5TY
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-b5ty-20261031T064525Z-aed4a0ed-plan.md
  started_at: "2026-10-31T06:45:25.941Z"
  completed_at: "2026-10-31T07:21:53.404Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- Mermaid の図の構文を検査する新しい lint ツール `tools/lint-mermaid.mjs` を実装しました。
- 解析エンジンとして `docs-site` の `mermaid-cli` が使用している Mermaid 12.0.0 の `mermaid.parse` を採用し、既存の全図（3,572 文書・189 図）において構文エラーがないことを確認しました。
- 単体テスト `tests/tools/lint-mermaid.test.ts` において、改行コード（LF/CRLF）の差異による期待値の不一致問題を修正し、両方の形式を正しく検証できるようにしました。
- `CHANGELOG.md` および個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-b5ty-mermaid-syntax-lint.md` を更新しました。

## 2. 変更ファイル

- `CHANGELOG.md`: Mermaid 構文 lint ツールの導入に関する変更。
- `tests/tools/lint-mermaid.test.ts`: 改行コードの差異を許容するよう、テストの期待値構築ロジックを修正。
- `tools/lint-mermaid.mjs`: Mermaid 構文を解析するためのメインロジックを実装。
- `tools/mermaid-parse-loader.mjs`: 解析用 Worker へのロードを制御するローダーを実装。
- `tools/mermaid-parse-worker.mjs`: DOM なしで Mermaid の構文を解析する Worker を実装。

## 3. 申し送り

- 解析には `docs-site` の `mermaid-cli` から解決した同じ Mermaid 12.0.0 の `mermaid.parse` を採用した。従来の Jison 系を含む全対象種類を扱えるためである。本リポジトリの `tool` とし、`docs-lint` 利用者への依存追加を避けた。構文解析専用 Worker 内だけで `DOMPurify` import を置き換え、ブラウザや DOM を起動せず解析する。既存図の修正・未検査はいずれもない。
- 個票 4.3 に保護された設定の変更案を記載した。利用者承認後、`feature` ブランチで `package.json` に `lint:mermaid` と `check` への接続を追加し、`lefthook.yml` の `markdown` command に変更 Markdown の検査を追加する。`exec` 親検証は `lint-mermaid` の固定 `registry`・型・スキーマ `enum`・関連テストを追加してから、`.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` に追加する。`docs-site` の依存は `PUPPETEER_SKIP_DOWNLOAD=true npm --prefix packages/docs-site ci` で導入する。
- 前回の `test-unit` 失敗は、抽出時に保持された CRLF を LF と比較した期待値が原因だった。入力と同じ改行で期待値を構築し、LF・CRLF を検査するよう修正した。修正後の単体テストと他の設定済み親検証は `executor` 内で重複実行していないため、親 `runner` で合否を確認する。
- 解析には docs-site の mermaid-cli から解決した同じ Mermaid 12.0.0 の mermaid.parse を採用した。従来の Jison 系を含む全対象種類を扱えるためである。本リポジトリの tool とし、docs-lint 利用者への依存追加を避けた。構文解析専用 Worker 内だけで DOMPurify import を置き換え、ブラウザや DOM を起動せず解析する。既存図の修正・未検査はいずれもない。
- 個票 4.3 に保護された設定の変更案を記載した。利用者承認後、feature ブランチで package.json に lint:mermaid と check への接続を追加し、lefthook.yml の markdown command に変更 Markdown の検査を追加する。exec 親検証は lint-mermaid の固定 registry・型・スキーマ enum・関連テストを追加してから、.specdojo/exec-defaults.yaml の `pipeline.parent_validations` に追加する。docs-site の依存は `PUPPETEER_SKIP_DOWNLOAD=true` npm --prefix packages/docs-site ci で導入する。
- 前回の test-unit 失敗は、抽出時に保持された CRLF を LF と比較した期待値が原因だった。入力と同じ改行で期待値を構築し、LF・CRLF を検査するよう修正した。修正後の単体テストと他の設定済み親検証は executor 内で重複実行していないため、親 runner で合否を確認する。

## 4. 進め方

既存の `markdownlint` や `remark` では検知できない Mermaid 図の構文エラーを、`docs:build` 前の段階で検知するための専用 lint ツールを実装しました。具体的には、ブラウザ環境をエミュレートせず、Worker 内で `mermaid.parse` を用いて構文を解析する `tools/lint-mermaid.mjs` を作成しました。また、テストコードにおける改行コード依存の問題を解消することで、環境に依存しない安定した検証を実現しました。
