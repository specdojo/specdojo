---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sysd-critical-flows-060-20261114t074133z-8cd46b99
  type: exec-result
  task_id: T-KATA-WAVE-1-sysd-critical-flows-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-sysd-critical-flows-060/T-KATA-WAVE-1-sysd-critical-flows-060-20261114T074133Z-8cd46b99/plan.md
  started_at: "2026-11-14T07:41:37.724Z"
  completed_at: "2026-11-14T07:54:02.802Z"
  agent: sol-executor
  execution: agent
  approach: template-maintenance
  targets:
    - sysd-critical-flows
    - specdojo:sysd-critical-flows-template
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/templates/sysd-critical-flows-template.md` を `docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md` 等の規範および成果物の実例に同期し、構造を最適化しました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/sysd-critical-flows-template.md`: 第5章の名称と一覧表の6列を `rulebook` に合わせ、概要を個別の記入欄へ整理しました。永続化・成功確定と整合性・冪等・再実行を分離し、フロー別 trace 方針、受入条件ID、検証の所在・網羅性・実行状況、および不足の解消先を明示する形式に更新しました。また、末尾の重複した説明を削減しました。

## 3. 申し送り

- reporter は result の必須セクションへ以下の実施内容・根拠を記録すること。変更ファイルは docs/ja/specdojo/templates/sysd-critical-flows-template.md のみ。5章の名称と一覧6列を rulebook に合わせ、概要を個別の記入欄へ整理。永続化・成功確定と整合性・冪等・再実行を分離し、フロー別 trace 方針、受入条件ID、検証の所在・網羅性・実行状況と不足の解消先を明示した。末尾の重複した説明を削減した。
- 判断根拠は docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md、同系統の recipe・sample、docs/ja/specdojo/standards/template-authoring-standard.md、rulebook-authoring-standard.md、docs/ja/product/040-system-design/sysd-critical-flows.md、sysd-index.md、および成果物・rulebook・sample の既存 grade result。過去評価の title 必須指摘は現行 rulebook と矛盾するため採用せず、既存の `frontmatter_template` を維持した。最大5件、図・運用・変更影響・未決事項・人間承認の骨組みは現行要件に整合するため維持した。
- recipe は候補選定と失敗境界の判断手順、template は5章と反復するフロー・表の骨組みを提供するため、どちらも必要。rulebook の既存ID宣言を維持した。完成例は既に sample に外出しされ、rulebook は章別の判断基準と良い例・悪い例を備えるため変更不要。型のメニューにも4文書が登録済み。PJR-2GD6 に従い実装・schema・構文・設定値を転載していない。lint・schema・単体／統合テストは指定された親 runner の検証へ委ねる。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown template のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/templates/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票・既存 plan・result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

`sysd-critical-flows-template` を対象とし、対応する `rulebook` の章構成および項目名に同期させました。具体的には第5章の名称変更、一覧表の列定義を `rulebook` と一致させ、各項目の記入欄（成功確定、再実行、trace 等）を整理し、冗長な記述を削減することで、成果物作成の開始点として適切な骨組みを整備しました。
