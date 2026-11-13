---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cxd-specdojo-060-20261113t213510z-f69e53d3
  type: exec-result
  task_id: T-KATA-WAVE-1-cxd-specdojo-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cxd-specdojo-060/T-KATA-WAVE-1-cxd-specdojo-060-20261113T213510Z-f69e53d3/plan.md
  started_at: "2026-11-13T21:35:19.833Z"
  completed_at: "2026-11-13T21:54:44.689Z"
  agent: sol-executor
  execution: agent
  approach: template-maintenance
  targets:
    - cxd-specdojo
    - specdojo:cxd-template
---

# Edit Result

## 1. 実施内容

- `cxd-template` の表の列名および境界項目を `cxd-rulebook` に同期し、整合性を確保しました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/cxd-template.md`: Person の「対応ロール」、外部システムの「区分・位置づけ」「不在・障害時の影響と扱い」、関係の「関係ID」を `rulebook` と一致させ、境界外の項目に「対象外と委譲先」を明示しました。

## 3. 申し送り

- 変更ファイル: docs/ja/specdojo/templates/cxd-template.md。Person の「対応ロール」、外部システムの「区分・位置づけ」「不在・障害時の影響と扱い」、関係の「関係ID」を rulebook と一致させ、境界外の項目に「対象外と委譲先」を明示した。
- 判断根拠: cxd-rulebook の本文要件・記述ガイド, template-authoring-standard, rulebook-authoring-standard, document-metadata-standard, cxd-mermaid-rulebook, cxd-recipe, cxd-sample, 成果物 cxd-specdojo, および PJR-2GD6 を確認した。sample・成果物と列名が異なる箇所は改訂済み rulebook を正とした。必須章、任意章、Mermaid の骨組み、既存プレースホルダは要件を満たすため維持し、実装・構文詳細は追加していない。
- recipe は境界・依存・未確定事項を判断する手順として、template は共通の図・表・記入欄の開始点として必要と判断した。rulebook の既存 ID 宣言を維持した。完成例は既に cxd-sample に外出しされており、主 rulebook にサンプル章はない。
- 新規文書はなく、型一式のサイドバー登録も既存のため変更不要。result と grade サイドカーは更新していない。reporter は本報告の実施内容・変更ファイル・判断根拠を result に反映すること。親 runner の検証は runner に委ねる。
- 判断根拠: cxd-rulebook の本文要件・記述ガイド、template-authoring-standard、rulebook-authoring-standard、document-metadata-standard、cxd-mermaid-rulebook、cxd-recipe、cxd-sample、成果物 cxd-specdojo、および PJR-2GD6 を確認した。sample・成果物と列名が異なる箇所は改訂済み rulebook を正とした。必須章、任意章、Mermaid の骨組み、既存プレースホルダは要件を満たすため維持し、実装・構文詳細は追加していない。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は template のみで、docs/ja/projects/ 配下に変更がない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿個票および既存 plan・result を変更していない。）

## 4. 進め方と実践の型の適用

`cxd-template` を見直し対象とし、改訂済みの `cxd-rulebook` を正として構造と項目名を同期しました。具体的には、Person・外部システム・関係の各定義表の列名を `rulebook` と一致させ、境界外項目の「対象外と委譲先」を明示しました。必須章や Mermaid の骨組みなどは現状維持とし、実装詳細を記述しない方針（PJR-2GD6）を遵守しました。recipe および template の必要性を確認し、既存の ID 宣言を維持しています。
