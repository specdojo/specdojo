---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cnd-specdojo-040-20261113t222935z-e48e4870
  type: exec-result
  task_id: T-KATA-WAVE-1-cnd-specdojo-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cnd-specdojo-040/T-KATA-WAVE-1-cnd-specdojo-040-20261113T222935Z-e48e4870/plan.md
  started_at: "2026-11-13T22:29:39.157Z"
  completed_at: "2026-11-13T22:44:25.228Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - cnd-specdojo
    - specdojo:cnd-rulebook
---

# Edit Result

## 1. 実施内容

- CND rulebook の見直しを行い、承認・保守責任、課題管理への引き継ぎ、検証・公開条件に関する記述を補足しました。
- VitePress のサイドバー設定に、既存の CND `recipe` および `template` を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cnd-rulebook.md`: 承認・保守責任、課題管理への報告プロセス、検証コマンドおよび合格条件、公開判定基準などの不足項目を補完し、執筆標準に基づいた構成へ改訂しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: C4 コンテナ図のメニューに CND の `recipe` と `template` を追加し、ドキュメントサイトからのアクセスを可能にしました。

## 3. 申し送り

- result の実施内容・変更ファイルへ記録: docs/ja/specdojo/rulebooks/cnd-rulebook.md を改訂。packages/docs-site/.vitepress/sidebar-config.ts の C4 メニューへ CND recipe・template を追加。成果物本体、sample・recipe・template 本文、grade サイドカー、result は変更していない。
- 進め方と実践の型の適用へ記録する根拠: rulebook-authoring-standard.md、document-metadata-standard.md、id-and-file-naming-standard.md、people-and-organization-definition-standard.md、docs-structure-guide.md、deliverable-frontmatter.schema.yaml、rulebook-frontmatter.schema.yaml、共通レビュー観点の各 finding と同じ viewpoint、および PJR-2GD6 を確認。内容根拠として cnd-specdojo.md、cxd-specdojo.md、CND の関連 Kata 一式、初期整備タスク T-KATA-WAVE-1-cnd-specdojo-005 の result、execution/grade/results/specdojo.cnd-rulebook.yaml を照合した。plan に condense 記録はない。
- finding 対応: F001・F002・F004・F013 は「作成・合意・保守の責任」と概要ガイドに担当 Role code、確認者、判断者、完了時点、問い合わせ窓口を追加。F003 は ARC→PM→PJR の報告と転送先・判断時点の記録を追加。F005・F006・F009 は現行の主 rulebook 宣言を維持し、`specdojo:` 配下への配置と文書名を H1 に置く方針を明記。必須条件・値・構造の詳細はメタ情報標準と schema を正本とした。
- finding 対応: F007 は対象ファイルの Markdown・Frontmatter・Mermaid 構文検査、SVG 生成のコマンドと合格条件を追加。F008 は上位図の各利用目的・外部依存と担当コンテナの対応、全ノード・関係と定義の対応、正常・失敗時の観測条件を明確化。F012 はレビュー・未決事項・人間の承認・公開対象の確認条件を追加。実際の再評価は後続工程で行い、grade サイドカーは更新していない。
- 型の要否・維持判断: recipe は実行単位の分割、正本と生成物、構築時と実行時の判断を支援するため必要。template は共通する章・表の骨組みがあるため必要。Frontmatter の `specdojo:cnd-recipe`・`specdojo:cnd-template` 宣言を維持。完成例は `specdojo:cnd-sample` を正本とし、rulebook の7章構成、階層別の連番、章ごとの良い例・悪い例、サンプル章を置かない構成を維持した。
- F010・F011 は初期整備済みの現行 sample で主 rulebook が `specdojo:cnd-rulebook` となり、概要・図・要素定義・技術前提・将来課題を備えることを確認した。今回追加した承認者・PJR 転送先・判断時点・検証記録の反映は、計画どおり後続の T-KATA-WAVE-1-cnd-specdojo-045（recipe）、050（sample）、060（template）へ引き継ぐ。骨組みとの解釈差は rulebook の意味要件を正とする。
- lint・schema・型検査・単体／結合テストは指定の親 runner に委ね、重複実行していない。sidebar-kata.test.ts は親の test-unit 対象に含まれる。新設文書はなく、既存 recipe・template のメニュー登録漏れを修正した。
- 型の要否・維持判断: recipe は実行単位の分割、正本と生成物、構築時と実行時の判断を支援するため必要。template は共通する章・表の骨組みがあるため必要。Frontmatter の specdojo:cnd-recipe・specdojo:cnd-template 宣言を維持。完成例は specdojo:cnd-sample を正本とし、rulebook の7章構成、階層別の連番、章ごとの良い例・悪い例、サンプル章を置かない構成を維持した。
- F010・F011 は初期整備済みの現行 sample で主 rulebook が specdojo:cnd-rulebook となり、概要・図・要素定義・技術前提・将来課題を備えることを確認した。今回追加した承認者・PJR 転送先・判断時点・検証記録の反映は、計画どおり後続の T-KATA-WAVE-1-cnd-specdojo-045（recipe）、050（sample）、060（template）へ引き継ぐ。骨組みとの解釈差は rulebook の意味要件を正とする。
- 適用外の検証: `npm run validate:schema:file`（YAML/YML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更が docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan/result などの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
