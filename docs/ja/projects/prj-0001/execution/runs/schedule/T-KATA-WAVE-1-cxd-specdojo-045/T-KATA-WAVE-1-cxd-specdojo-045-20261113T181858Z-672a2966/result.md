---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cxd-specdojo-045-20261113t181858z-672a2966
  type: exec-result
  task_id: T-KATA-WAVE-1-cxd-specdojo-045
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cxd-specdojo-045/T-KATA-WAVE-1-cxd-specdojo-045-20261113T181858Z-672a2966/plan.md
  started_at: "2026-11-13T18:19:10.360Z"
  completed_at: "2026-11-13T21:00:17.151Z"
  agent: sol-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - cxd-specdojo
    - specdojo:cxd-recipe
---

# Edit Result

## 1. 実施内容

- CXD recipe (`docs/ja/specdojo/recipes/cxd-recipe.md`) の問い・対比例および作成手順を改訂しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/cxd-recipe.md`: 対象システム・Person・外部システム・関係の四小節に問いと対比例を整理し、技術前提から検証対象・主確認ロールを導く手順を補いました。

## 3. 申し送り

- result の実施内容・変更ファイルには、docs/ja/specdojo/recipes/cxd-recipe.md の改訂を記録してください。対象システム・Person・外部システム・関係の四小節に問いと対比例を整理し、技術前提から検証対象・主確認ロールを導く手順を補いました。
- 判断根拠は recipe-authoring-standard、rulebook-authoring-standard、cxd-rulebook、cxd-specdojo、cxd-sample、cxd-template、および PJR-2GD6 です。rulebook を正として内容の対応を確認し、規則・構文・詳細構造の再定義を避けました。既存の深掘り手順・レビュー観点は根拠と整合するため維持しました。
- recipe は境界判断を引き出す問いに、template は図・定義表・検証観点の骨組みに必要と判断しました。cxd-rulebook の既存 ID 宣言を維持しています。完成例は既に sample に分離済みで、新規文書はありません。sidebar にも四種の登録があるため変更不要です。
- plan に展開された finding はありません。既存の rulebook・sample の grade result は旧版への指摘であり、現行文書の未解消 finding として扱っていません。result と grade result サイドカーは更新していません。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown recipe のみで、YAML ファイルの変更がないため。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル・plan・result を変更していないため。）
- 適用外の検証: `npm run validate:catalog`（変更が docs/ja/specdojo/ 配下に限られ、docs/ja/projects/ 配下の成果物を変更していないため。）

## 4. 進め方と実践の型の適用

recipe-maintenance
