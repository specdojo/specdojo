---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cnd-sample-045-20261123t070234z-70bf586a
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cnd-sample-045
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cnd-sample-045/T-KATA-WAVE-6-NOTATION-cnd-sample-045-20261123T070234Z-70bf586a/plan.md
  started_at: "2026-11-23T07:02:43.223Z"
  completed_at: "2026-11-23T07:23:50.221Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - specdojo:cnd-sample
    - specdojo:cnd-recipe
---

# Edit Result

## 1. 実施内容

- cnd-recipe を `cnd-rulebook` の修正および PJR-76N9 に合わせて更新しました。
- 具体的には、概要の問い、メモ / 将来課題の問いとコツ、良い例の『未確定の配置』の項目、および仕上げチェックから、役割の割り当てに関する記述を削除しました。
- また、メモ / 将来課題の 3 か所の記述を、`rulebook` 6.5 の『当面の扱いと解消条件』の形式に統一しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/cnd-recipe.md`: `rulebook` の変更（役割の割り当てに関する記述の削除）および PJR-76N9 に基づき、問いや手順から役割の割り当てに関する内容を削除し、メモ / 将来課題の記述を `rulebook` の規定に合わせる更新を行いました。

## 3. 申し送り

- cnd-sample.md には、役割の割り当てと承認の進み具合の記述（メモ / 将来課題の表の担当ロール列、承認前・変更時の役割の手順の段落など）がまだ残っています。PJR-76N9 に従い、sample を直す段で扱う必要があります。
- cnd-sample.md には、役割の割り当てと承認の進み具合の記述（メモ / 将来課題の表の担当ロール列、承認前・変更時の役割の手順の段落など）がまだ残っている。PJR-76N9 に従い、sample を直す段で扱う必要がある。

## 4. 進め方と実践の型の適用

rulebook の変更内容に基づき、既存の recipe を同期しました。役割の割り当てに関する記述を、概要・詳細手順・仕上げチェックの各所から削除し、メモ / 将来課題の項目を `rulebook` の定める『当面の扱いと解消条件』の形式に修正することで、設計の責務を問いと作成手順に絞り込みました。
