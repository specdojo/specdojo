---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cnd-specdojo-045-20261113t224534z-e9632dfa
  type: exec-result
  task_id: T-KATA-WAVE-1-cnd-specdojo-045
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cnd-specdojo-045/T-KATA-WAVE-1-cnd-specdojo-045-20261113T224534Z-e9632dfa/plan.md
  started_at: "2026-11-13T22:45:38.231Z"
  completed_at: "2026-11-13T22:57:55.278Z"
  agent: sol-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - cnd-specdojo
    - specdojo:cnd-recipe
---

# Edit Result

## 1. 実施内容

- CND の `recipe` を改訂済みの `rulebook` に同期し、記述内容を具体化しました。
- VitePress のサイドバー設定を更新し、CND の `recipe` および `template` のメニュー登録を補完しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/cnd-recipe.md`: 上位図の経路網羅、図と定義の対応、正常時の期待結果、確認者、課題転送先・判断時点、変更影響、承認範囲と公開対象を具体化する問いと手順を追加し、改訂 `rulebook` と同期しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: CND の `recipe` および `template` を型メニューに追加しました。

## 3. 申し送り

- result 記載用: 変更ファイルは docs/ja/specdojo/recipes/cnd-recipe.md と packages/docs-site/.vitepress/sidebar-config.ts。recipe に上位図の経路網羅、図と定義の対応、正常時の期待結果、確認者、課題転送先・判断時点、変更影響、承認範囲と公開対象を具体化する問いと手順を追加した。
- 判断根拠: recipe-authoring-standard、rulebook-authoring-standard、cnd-rulebook、cnd-mermaid-rulebook、共通実行規約、pm-review-viewpoints の `vp-arc-conciseness`、PJR-2GD6 を確認した。cnd-specdojo、cxd-specdojo、cnd-sample、cnd-template と既存の CND rulebook・sample の grade result を参照し、現行 rulebook を正として同期した。plan に展開された finding はない。
- 維持した記述: 実行・配備単位での分割、正本と生成物、構築時と閲覧時、失敗と結果不明の区別は成果物と整合するため維持した。構文・値・schema・実装詳細は複製していない。
- 要否判断: recipe は境界・経路・観測結果を導く作成支援に必要、template は図と定義表の骨組みを再利用するため必要。rulebook の既存 ID 宣言を維持した。完成例は既存 cnd-sample に外出し済みで、主 rulebook にサンプル章はないため変更不要と判断した。result と grade result サイドカーは編集していない。
- 判断根拠: recipe-authoring-standard、rulebook-authoring-standard、cnd-rulebook、cnd-mermaid-rulebook、共通実行規約、pm-review-viewpoints の vp-arc-conciseness、PJR-2GD6 を確認した。cnd-specdojo、cxd-specdojo、cnd-sample、cnd-template と既存の CND rulebook・sample の grade result を参照し、現行 rulebook を正として同期した。plan に展開された finding はない。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML/YML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（変更は recipe とサイドバーのみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

recipe-maintenance
