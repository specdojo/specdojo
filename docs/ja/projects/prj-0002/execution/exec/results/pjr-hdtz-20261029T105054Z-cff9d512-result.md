---
specdojo:
  id: prj-0002:xer-pjr-hdtz-20261029t105054z-cff9d512
  type: exec-result
  task_id: PJR-HDTZ
  mode: edit
  status: blocked
  project_id: prj-0002
  origin: register
  plan_ref: exec/plans/pjr-hdtz-20261029T105054Z-cff9d512-plan.md
  started_at: "2026-10-29T10:50:54.936Z"
  completed_at: "2026-10-29T12:39:04.202Z"
  agent: sol-executor
  block_reason: "parent validation failed: lint-fm"
---

# Edit Result

## 1. 実施内容

- specdojo-lp において、v0.5.0 で導入された変更点（`epic` を含む 8 種類の登録簿項目、`depends_on` フラグ、および `init` コマンドによる各種設定生成）を反映しました。
- 各コンポーネントの更新に伴い、表示されるコマンド例や説明文の修正を実施しました。
- 個票内の Markdown テーブルに含まれていたリンクのエスケープ不備を修正し、列の構造を安定させました。

## 2. 変更ファイル

- `specdojo-lp:README.md`: LP のトップページとなる `README.md` を更新しました。
- `specdojo-lp:src/components/sections/GetStarted.astro`: `GetStarted.astro` コンポーネントを更新し、導入手順やコマンド例を最新の状態にしました。
- `specdojo-lp:src/components/sections/NextSteps.astro`: `NextSteps.astro` コンポーネントを更新しました。
- `specdojo-lp:src/components/sections/RegisterTypes.astro`: `RegisterTypes.astro` コンポーネントを更新し、新しい登録項目（`epic` 等）の説明を反映しました。

## 3. 申し送り

- 登録簿を `epic` を含む 8 種類に更新。`epic` は track ごとの仕事をまとめ、具体的な作業は子 `todo` に分け、`epic` 自体は実行しない説明とした。
- `depends_on` は実行順序を利用者に伝えるため掲載した。FAQ の改善例に `--depends-on` を追加し、先行項目の完了後に実行する説明を加えた。由来を示す `--from` とは区別している。
- init の `.markdownlint.yaml` 生成と既存設定の保持、任意の `docs-lint`・`docs-site` 導入、`preset` の既定値、Codex の起動名を現行ガイドと照合した。その他の変更を掲載しない判断と理由は個票の対応結果 4.2 に記録済み。成果物の型・`grade`・`approach` などは LP に旧値がなく、詳細は既存ガイドへ委ねる。「準備中」の表示は既存の合意を維持した。
- 個票の指定に従い、orchestrator が sandbox 外で LP のビルドと生成 HTML を確認する。`epic` のカード、依存の説明、両タブの導入手順とコマンド例を確認すること。
- 前回の親検証 `lint-md` の原因となった表内リンクを修復し、全表の列数を確認した。前回の `lint-fm` はタイムアウトで検査エラーは示されていない。親 runner による両検証の再実行が必要。
- 登録簿を epic を含む 8 種類に更新。epic は track ごとの仕事をまとめ、具体的な作業は子 todo に分け、epic 自体は実行しない説明とした。
- init の `.markdownlint.yaml` 生成と既存設定の保持、任意の docs-lint・docs-site 導入、preset の既定値、Codex の起動名を現行ガイドと照合した。その他の変更を掲載しない判断と理由は個票の対応結果 4.2 に記録済み。成果物の型・grade・approach などは LP に旧値がなく、詳細は既存ガイドへ委ねる。「準備中」の表示は既存の合意を維持した。
- 個票の指定に従い、orchestrator が sandbox 外で LP のビルドと生成 HTML を確認する。epic のカード、依存の説明、両タブの導入手順とコマンド例を確認すること。
- specdojo-lp の develop への統合、result の記入、状態遷移は親 runner に委ねる。executor は result・ステータス・Git 設定を編集していない。
- 人の確認が必要: `npm --prefix ../specdojo-lp run build`（個票の完了条件に従い、orchestrator が sandbox 外でビルドと生成 HTML を確認する。）

## 4. 進め方

v0.5.0 の変更点を網羅的に LP へ反映するため、まず `specdojo-lp` 内の各 Astro コンポーネントおよび `README.md` の修正を行いました。具体的には、登録簿の構成変更（`epic` の導入）や、運用上の重要な `depends_on` に関する説明、および `init` コマンドによる環境構築プロセスの追加に対応しています。作業後には、個票内の Markdown テーブルにおけるリンク構造の破損（列ズレ）を修復し、静的解析エラーの解消を図りました。
