---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sysd-cross-cutting-policy-040-20261114t040532z-6bd9ea5e
  type: exec-result
  task_id: T-KATA-WAVE-1-sysd-cross-cutting-policy-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-sysd-cross-cutting-policy-040/T-KATA-WAVE-1-sysd-cross-cutting-policy-040-20261114T040532Z-6bd9ea5e/plan.md
  started_at: "2026-11-14T04:05:48.263Z"
  completed_at: "2026-11-14T05:38:33.207Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sysd-cross-cutting-policy
    - specdojo:sysd-cross-cutting-policy-rulebook
---

# Edit Result

## 1. 実施内容

- `sysd-cross-cutting-policy-rulebook.md` を lints/standards に基づいて見直し、記述ガイドの補強と構造の調整を行いました。
- `packages/docs-site/.vitepress/sidebar-config.ts` に不足していた `recipe` および `template` のメニュー項目を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sysd-cross-cutting-policy-rulebook.md`: rulebook の型・完成例・Rule ID・参照名の判断基準を補強し、`rulebook-authoring-standard` 等に準拠した形式へ更新しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: サイドバーメニューに recipe および template を追加しました。

## 3. 申し送り

- reporter は result の実施内容・変更ファイル・進め方と実践の型の適用へ以下の判断根拠を記録すること。変更ファイルは docs/ja/specdojo/rulebooks/sysd-cross-cutting-policy-rulebook.md と packages/docs-site/.vitepress/sidebar-config.ts。成果物本体・sample・recipe・template・result・grade サイドカーは編集していない。
- 判断根拠: rulebook-authoring-standard、document-metadata-standard、rulebook Frontmatter schema、docs-structure-guide、ryu-guide、共通実行規約、PJR-2GD6、指定された3観点の判定根拠、sysd-index、sysd-cross-cutting-policy、宣言済み recipe・sample・template、clis-sample、既存 grade result、前段005の result を確認した。値・構文・構造の詳細を正本へ委ねる方針と、必須領域・例外・公開責任の規定は妥当として維持した。
- F001: 現行 sample の `type: architecture` と template の生成物 Frontmatter が rulebook の `deliverable_type` と一致し、六つの本文章とルール詳細の六要素が揃っていることを確認した。rulebook に型の対応、完成例への必須内容の適用、架空参照・検証計画と実行証跡の区別を明記した。F002: 現行 sample・template の関連導線見出しは一致している。rulebook に見出し・表・リンクの呼称統一と略号の対応明示を判断基準として追加し、良い例・悪い例を示した。正式な再評価とサイドカー更新は後続段で行う。plan に Kata 原因の condense 記録はない。
- 型の要否: recipe は対象範囲・途中失敗・正本・受入条件を導く問いが必要なため維持。template は六章構成と反復するルール詳細の骨組みを再利用するため維持。frontmatter の既存完全 ID 宣言を保持した。完成例は sample に外出し済みで、rulebook にサンプル章はない。後続の各メンテナンス段では改訂した rulebook を正として照合すること。
- lint・schema・型検査・単体／統合テストは指定どおり親 runner に委ねた。sidebar-kata.test.ts を含む親検証の結果を確認すること。executor では親検証の対象限定版も実行していない。
- 適用外の検証: `npm run validate:schema:file`（executor は YAML/YML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（対象 project に `catalog_path` は設定されているが、executor は docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿個票や既存 plan/result 等の履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
