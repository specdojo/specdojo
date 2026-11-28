---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-availability-sample-040-20261123t113900z-83b0dc6c
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-availability-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-availability-sample-040/T-KATA-WAVE-4-nfr-availability-sample-040-20261123T113900Z-83b0dc6c/plan.md
  started_at: "2026-11-23T11:39:07.779Z"
  completed_at: "2026-11-23T11:50:53.894Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-availability-sample
    - specdojo:nfr-availability-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook を簡潔に整え、grade の指摘事項（F001〜F017）に対応しました。
- 「サンプル」章を削除し、完成例は `specdojo:nfr-availability-sample` に任せる構成に変更しました。
- frontmatter の `recipe` および `template` を `not-needed` と宣言しました。
- 各章の記述ガイドに、判断基準、良い例、悪い例を追記しました。
- 用語定義（RTO/RPO）の補足や、表記ゆれの統一、未決事項の扱いに関する指示を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-availability-rulebook.md`: grade の指摘（F001〜F017）に基づき、章構成の調整、記述ガイドへの判断基準・例の追加、用語定義の拡充を行いました。また、指示に従い「サンプル」章を削除し、`recipe` と `template` を `not-needed` に設定しました。

## 3. 申し送り

- F013: `specdojo:nfr-availability-sample` が rulebook の「本文要件」の章（概要（対象・目的）／適用範囲・除外条件／可用性要件一覧／測定・検証方法／関連ドキュメント導線／条件付きの未決事項）に沿っていない。sample はこの段の対象外のため、次の sample の段で駄菓子屋きぬやの文脈に合わせて書き直す。
- F017: ready にしてよいかは、sample の書き直しと再 grade の後に判断する。recipe・template は `not-needed` と宣言済み。
- F007 は一部だけ反映した: 復旧の判断を担う運用者の Role code は求めたが、基準値の合意者は承認の担当にあたり PJR-76N9 で成果物の本文に求めないため入れていない。承認は登録簿の個票で追う。
- F009・F012: rulebook-authoring-standard の経過措置であるサンプル章は、plan の指示（rulebook に完成例の章を置かない）に従って削除し、完成例は sample に任せた。

## 4. 進め方と実践の型の適用

rulebook-maintenance
