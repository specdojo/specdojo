---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-overview-005
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-overview-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-overview-005-plan.md
  started_at: "2026-08-08T16:00:03.164Z"
  completed_at: "2026-08-08T16:15:41.896Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: bootstrap
  targets:
    - prj-0001:cdfd-overview
    - specdojo:cdfd-rulebook
---

# Edit Result

## 1. 実施内容

概念データフロー図（全体概要）と、共通の CDFD rulebook / Mermaid 記法 rulebook / recipe / sample / template を、同じ構造・用語・粒度で初期整備した。

- 主成果物を新規作成し、初期セットアップ、登録簿運用、計画展開、タスク実行、定期運用、並行運用、構成変更、派生生成、報告を `P-01`〜`P-09` の九領域として定義した。
- 主成果物へ、九領域の起点イベント、主要入力、主要出力、データストア、領域別 CDFD の詳細化先を示す一覧表と、領域間の情報・イベントを示す Mermaid 全体図を記載した。
- 補助操作、領域別詳細、実装エビデンス、人間の最終判断、AI Agent 支援の境界を明示し、PO / ARC / QE が後続判断に使用できる受入確認を記載した。
- `cdfd-rulebook.md` は既存の目的と概念レベルの方針を維持しつつ、執筆標準に合わせて章構成、Frontmatter、必須表、全体概要と領域別 CDFD の分割判定、完成判定、禁止事項を再構成した。
- `cdfd-mermaid-rulebook.md` は既存のノード・線種の対応を活かし、重複見出し、ラベル要否、凡例、主 rulebook との適用関係を修正した。
- 既存 sample は一般的な説明だけの骨格だったため、駄菓子屋きぬや販売管理の三領域を題材に、表・図・境界・詳細化先がそろう最小完成例へ作り直した。
- 未整備だった recipe と template を新規作成し、rulebook の本文構成と同じ五章、および表・図で共通する項目・プレースホルダを揃えた。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`（新規）
- `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`（更新）
- `docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`（更新）
- `docs/ja/specdojo/recipes/cdfd-recipe.md`（新規）
- `docs/ja/specdojo/samples/cdfd-sample.md`（更新）
- `docs/ja/specdojo/templates/cdfd-template.md`（新規）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-overview-005-result.md`（更新）

検証結果:

- `npx prettier --write <変更 Markdown>`: 成功。
- `npx markdownlint <変更 Markdown>`: 成功。
- `npm run -s lint:md`: 成功。
- `npm run -s lint:fm`: 成功。Frontmatter のスキーマ検査を含めてエラーなし。
- `npm run docs:build`: 実行環境が `tsx` の一時 IPC ソケット作成を `EPERM` で拒否したため、文書生成の開始時に停止した。
- `npx vitepress build .`: 新規 CDFD の Mermaid ブロック検出まで進み、実行環境が Chromium プロセスを `Operation not permitted` で拒否したため停止した。いずれも Markdown や Frontmatter の検査エラーではなく、sandbox のプロセス制約による停止である。

## 3. 申し送り

- 後続の領域別 CDFD では、`P-01`〜`P-09` の起点イベント、主要入出力、データストア、責務境界を入力として引き継ぐ。実装上のコマンド、ファイル、状態遷移、例外経路は各領域の retrofit-pass で確認し、本全体概要へは領域境界に影響する差分だけを反映する。
- `docs:build` は Unix domain socket と Chromium の起動が許可された環境で再実行する。今回の失敗では生成ファイルや対象外ファイルの変更は発生していない。

## 4. 実践の型の活用

approach は bootstrap とし、内容の根拠は成果物カタログの定義・完了条件と [[prj-0001:prj-overview\|プロジェクト概要]] に限定した。プロジェクト概要の Why は、仕様を正本として人と AI Agent が引き継ぐこと、人間が主要判断を担うこと、作業と継続負荷を可視化することが全体フローへ与える影響だけを反映し、背景や価値仮説の全文は再掲していない。実装ファイルと Web 情報は内容根拠に使用せず、詳細は後続 retrofit-pass へ委譲した。

既存物と手本の評価:

- 主成果物は指定先に存在しなかったため新規作成した。同種で `status: ready` の CDFD 成果物は無かったため、内容は成果物カタログとプロジェクト概要から組み立てた。
- `cdfd-rulebook.md` と `cdfd-mermaid-rulebook.md` は既存の概念・記法を評価し、概念レベル、表と図の併用、ノードと線種の対応は維持した。一方、執筆標準の必須章、実践の型への Frontmatter 参照、全体概要の分割基準、重複見出し、ラベル付きエッジの判定が不足していたため更新した。
- recipe と template は未整備だったため新規作成した。sample は既存記述が rulebook の本文構成を満たさず完成例として使えなかったため、共通サンプル文脈に合わせて作り直した。
- 同種の ready CDFD 一式は無かったため、形の手本として `specdojo:prj-overview-rulebook` と `specdojo:pm-plan-rulebook`、対応する ready の recipe / sample / template を参照した。章番号、Frontmatter、表の列定義、問い・良い例 / 悪い例・レビュー観点、`frontmatter_template`、プレースホルダの置き方だけを手本とし、内容は転用していない。
- `upsert-rulebook` の前提に挙げられた `docs/ja/specdojo/guides/docs-contents-guide.md` はリポジトリに存在しなかったため参照できなかった。代わりに、本 plan が許可する成果物カタログ、対象 rulebook、プロジェクト概要と、構造規約の正本である各 authoring standard を使用した。

相互整合では `cdfd-rulebook.md` を構造・必須項目・禁止事項の正本とした。主成果物、sample、template は「目的と適用範囲」「プロセス領域一覧」「概念データフロー」「境界と分割方針」「未決事項（任意）」へ揃え、領域 ID、起点イベント、主要入出力、データストア、詳細化先を共通項目にした。recipe は同じ章を作るための問いと深掘り手順に一般化し、sample は三領域の最小完成例、template はプロジェクト固有値を持たない骨組みにした。Mermaid 記法は include 先へ分離し、sample / recipe / template の参照アンカーは主 rulebook だけに保持した。
