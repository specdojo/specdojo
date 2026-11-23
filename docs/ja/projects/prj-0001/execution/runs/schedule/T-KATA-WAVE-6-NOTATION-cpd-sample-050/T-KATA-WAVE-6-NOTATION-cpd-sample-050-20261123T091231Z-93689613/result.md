---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cpd-sample-050-20261123t091231z-93689613
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cpd-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cpd-sample-050/T-KATA-WAVE-6-NOTATION-cpd-sample-050-20261123T091231Z-93689613/plan.md
  started_at: "2026-11-23T09:12:42.315Z"
  completed_at: "2026-11-23T09:33:45.260Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cpd-sample
    - specdojo:cpd-sample
---

# Edit Result

## 1. 実施内容

- sample である `docs/ja/specdojo/samples/cpd-sample.md` を、共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として拡充・修正しました。
- grade による指摘事項（F001〜F012）に対し、業務への影響の明記、用語の統一、冗長な記述の集約、検証手順の具体化などを行い、すべて解消しました。
- PJR-76N9 の規約に従い、本文中の役割の割り当てや承認の進み具合に関する記述を削除し、5章の表の構成を `template` と整合させました。
- 利用者が決定すべき値（日付など）については、推測せずに `_UNDECIDED_` として残しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cpd-sample.md`: grade の指摘（F001〜F012）に基づき、業務課題への影響の追記、用語（「保存」と「記録アクセス」）の統一、役割割当と公開判断に関する冗長な記述の整理、および `cpd-rulebook` に基づく検証コマンド（`node tools/lint-mermaid.mjs`）と期待される出力形式の追記を行いました。

## 3. 申し送り

- sample 本文の後続作業の日付は `_UNDECIDED_`（詳細設計の計画で決める）として残した。利用者が決める値である。
- rulebook への変更案: `cpd-rulebook` の「メモ / 将来課題」の記録項目は「対象・論点 / 影響と後続成果物 / 当面の扱い・解消条件」の3つだが、`cpd-template` は「引き継ぎ先」を足した4列になっている。sample は template に合わせたので、rulebook 側に「引き継ぎ先」を足すと3つがそろう。
- `cnd-sample` は `status: draft` で本文に「`draft` を維持する」と書いており、PJR-76N9 の承認の進み具合にあたる可能性がある。この段の対象外なので、別の段で見直すとよい。

## 4. 進め方と実践の型の適用

rulebook に沿い、sample を完成例として厚くした。F001〜F012 の指摘を解消し、PJR-76N9 に基づく記述の整理と `template` との整合性確保を実施した。
