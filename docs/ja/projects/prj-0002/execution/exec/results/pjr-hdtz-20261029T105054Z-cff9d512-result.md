---
specdojo:
  id: prj-0002:xer-pjr-hdtz-20261029t105054z-cff9d512
  type: exec-result
  task_id: PJR-HDTZ
  mode: edit
  status: complete
  project_id: prj-0002
  origin: register
  plan_ref: exec/plans/pjr-hdtz-20261029T105054Z-cff9d512-plan.md
  started_at: "2026-10-29T10:50:54.936Z"
  completed_at: "2026-10-29T13:34:23.975Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- specdojo-lp の各コンポーネントおよび README を更新し、v0.5.0 での変更点を反映しました。
- 登録簿の項目を epic を含む 8 種類に拡充し、作業の構造化について説明を追加しました。
- `depends_on` フラグを用いた実行順序の制御に関するコマンド例と説明を追加しました。
- `init` コマンドに関する設定（`.markdownlint.yaml` の生成や既存設定の保持、Codex の起動名など）を最新のガイド内容に合わせて更新しました。
- 個票における表のリンク形式を修正し、列数が一致することを確認しました。

## 2. 変更ファイル

- `specdojo-lp:README.md`: LP 全体の README を更新しました。
- `specdojo-lp:src/components/sections/GetStarted.astro`: 導入セクションのコンポーネントを更新しました。
- `specdojo-lp:src/components/sections/NextSteps.astro`: 次のステップに関するコンポーネントを更新しました。
- `specdojo-lp:src/components/sections/RegisterTypes.astro`: 登録タイプのコンポーネントを更新しました。

## 3. 申し送り

- 登録簿を epic を含む 8 種類に更新。epic は track ごとの仕事をまとめ、具体的な作業は子 todo に分け、epic 自体は実行しない説明とした。
- `depends_on` は実行順序を利用者に伝えるため掲載した。FAQ の改善例に `--depends-on` を追加し、先行項目の完了後に実行する説明を加えた。由来を示す `--from` とは区別している。
- init の `.markdownlint.yaml` 生成と既存設定の保持、任意の docs-lint・docs-site 導入、preset の既定値、Codex の起動名を現行ガイドと照合した。その他の変更を掲載しない判断と理由は個票の対応結果 4.2 に記録済み。成果物の型・grade・approach などは LP に旧値がなく、詳細は既存ガイドへ委ねる。「準備中」の表示は既存の合意を維持した。
- 個票の指定に従い、orchestrator が sandbox 外で LP のビルドと生成 HTML を確認する。epic のカード、依存の説明、両タブの導入手順とコマンド例を確認すること。
- 前回の親検証 `lint-md` の原因となった表内リンクを修復し、全表の列数を確認した。前回の `lint-fm` はタイムアウトで検査エラーは示されていない。親 runner による両検証の再実行が必要。
- specdojo-lp の develop への統合、result の記入、状態遷移は親 runner に委ねる。executor は result・ステータス・Git 設定を編集していない。
- 人の確認が必要: `npm --prefix ../specdojo-lp run build`（個票の完了条件に従い、orchestrator が sandbox 外でビルドと生成 HTML を確認する。）

## 4. 進め方

v0.5.0 での仕様変更（登録品目の分類、依存関係の明示、初期設定プロセス）を Landing Page に反映するため、主要な Astro コンポーネントと README を対象に修正を行いました。各コンポーネントの構文チェックおよび、表内のエスケープ処理による列の整合性を検証しています。
