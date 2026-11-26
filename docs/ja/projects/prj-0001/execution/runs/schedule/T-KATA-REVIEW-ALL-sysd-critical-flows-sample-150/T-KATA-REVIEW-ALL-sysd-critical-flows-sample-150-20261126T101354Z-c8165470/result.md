---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-critical-flows-sample-150-20261126t101354z-c8165470
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-critical-flows-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-critical-flows-sample-150/T-KATA-REVIEW-ALL-sysd-critical-flows-sample-150-20261126T101354Z-c8165470/plan.md
  started_at: "2026-11-26T10:14:06.200Z"
  completed_at: "2026-11-26T10:23:47.506Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-critical-flows-sample
    - specdojo:sysd-critical-flows-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`sysd-critical-flows-sample` を系列の sample（clis・sysd-index・sysd-cross-cutting-policy）と共通サンプル文脈に照らして見直した。
- 取引の識別子を「取引 ID」から系列の表記「取引番号」にそろえた。本文・表・mermaid の 14 か所が対象。
- 「運用助言 OPS」を共通サンプル文脈の役割名「店舗運営アドバイザー OPS」に直した。4.1 の表では ARC の初出に「技術メンター」を添えた。
- grade 由来の F001（5.2 の確認状況・ギャップ解消の列）と F002（照合待ちの定義）は、前の段で解消済みであることを executor が確認した。
- 相手側の sample を直す案 3 件は、変更せずに findings と handoff に残した。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。ほかの runner 検査は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 2. 重要フロー一覧、3. フロー詳細、4.1. 検知と責任、4.2. 管理記録への引渡し、5.2. 検証への引渡し | 取引の識別子をこの sample だけ「取引 ID」と書いており、`clis-sample`（7 か所）、`sysd-cross-cutting-policy-sample`（3 か所）、`sysd-index-sample`（1 か所）の「取引番号」と食い違う。 | 本文・表・mermaid の 14 か所を「取引番号」に置き換えた。 | vp-qe-kata-conformance（kata 相互と適用先）。販売管理 CLI 仕様の操作で表示する取引番号と同じものを指す。 | - |
| R5-2 | R5 | 2. 重要フロー一覧、4.1. 検知と責任 | 「運用助言 OPS」が共通サンプル文脈の役割名「店舗運営アドバイザー」と、`sysd-index-sample`・`sysd-cross-cutting-policy-sample` の表記に合わない。ARC は役割名なしで出てくる。 | 「店舗運営アドバイザー OPS」にし、4.1 の表で ARC の初出を「技術メンター ARC」にした。 | vp-qe-kata-conformance。sample-authoring-standard の「共通登場人物」、`sysd-cross-cutting-policy-sample` の「ARC・技術メンター」「OPS・店舗運営アドバイザー」。 | - |
| R5-3 | R5 | 1. 概要、5.1. 正本と変更影響 | 設計索引の架空の参照名が系列で揃っていない。本 sample と `sysd-index-sample` の命名（`kinuya-&lt;接頭辞&gt;`）では `kinuya-sysd-index` だが、`sysd-cross-cutting-policy-sample` は `kinuya-system-design-index` と書く。 | 相手側の案: `sysd-cross-cutting-policy-sample` の `kinuya-system-design-index` を `kinuya-sysd-index` にそろえる。本 sample は `sysd-index-sample` の命名に合っているので直さない。 | vp-qe-kata-conformance、vp-dev-change-impact。 | - |
| R5-4 | R5 | 1. 概要、5.1. 正本と変更影響、5.3. 未決事項と後続作業 | 運用手順と判断記録の架空の参照名が系列で食い違う。本 sample は `kinuya-opr-sale-reconciliation` と `kinuya-opr-reprint`、判断記録 `KIN-DEC-01`／`KIN-DEC-02` と書く。`sysd-index-sample` は `kinuya-opr-recovery`・`kinuya-dec-recovery`、`sysd-cross-cutting-policy-sample` は `kinuya-recovery-procedure`・`kinuya-decision-log` と書く。 | 相手側の案: `sysd-index-sample` の「非機能・運用」「テスト・判断記録」の行に、照合と再印刷の 2 つの OPR、判断記録の帳簿と記録 ID の関係を足して名前をそろえる。本 sample 側で 1 つの OPR に寄せる案は、SU-03 の「二つの OPR」と業務の分け方を変えることになるため選ばなかった。 | vp-dev-change-impact。 | 要判断 |
| R5-5 | R5 | 1. 概要、5.1. 正本と変更影響 | `sysd-index-sample` の「関連ドキュメント導線」は重要フローを `kinuya-sysd-critical-flows`「未作成」としている。本 sample が `kinuya-sysd-index` に求める「会計保存・排他」「印字試行記録」の行も、`sysd-index-sample` の SSOT 一覧にない。 | 相手側の案: `sysd-index-sample` の「構成・システム設計」の行の `kinuya-sysd-critical-flows` の状態を、重要フローの例を参照できる扱いにする。SSOT 一覧の「DB schema・移行」の行の参照先に、排他方式と印字試行記録の保存先を足す。sample どうしは互いを架空の参照名として扱う書き方で揃っているため、直さない案もある。 | vp-dev-change-impact。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-critical-flows-sample.md`: 取引の識別子を「取引 ID」から「取引番号」へ置き換えた。対象は重要フロー一覧、フロー詳細、検知と責任、管理記録への引渡し、検証への引渡しの 14 か所で、系列の sample の用語と一致する。「運用助言 OPS」は「店舗運営アドバイザー OPS」に直し、ARC の初出に「技術メンター」を添えた。整形後に markdownlint は 0 issues だった。

## 3. 申し送り

- R5-3 から R5-5 は、相手側の sample（`sysd-index-sample`、`sysd-cross-cutting-policy-sample`）を直す案である。本タスクでは変更していない。R5-4 と R5-5 は要判断のため、人または後続タスクで採否を決める。
- R5-1: R5 / 2. 重要フロー一覧、3. フロー詳細、4.1. 検知と責任、4.2. 管理記録への引渡し、5.2. 検証への引渡し / 取引の識別子をこの sample だけ「取引 ID」と書いており、clis-sample（7 か所）、sysd-cross-cutting-policy-sample（3 か所）、sysd-index-sample（1 か所）の「取引番号」と食い違う / 本文・表・mermaid の 14 か所を「取引番号」に置き換えた / vp-qe-kata-conformance（kata 相互と適用先）。[[specdojo:clis-sample|販売管理 CLI 仕様]] の操作で表示する取引番号と同じものを指す / -
- R5-2: R5 / 2. 重要フロー一覧、4.1. 検知と責任 / 「運用助言 OPS」が共通サンプル文脈の役割名「店舗運営アドバイザー」と、sysd-index-sample・sysd-cross-cutting-policy-sample の表記に合わない。ARC は役割名なしで出てくる / 「店舗運営アドバイザー OPS」にし、4.1 の表で ARC の初出を「技術メンター ARC」にした / vp-qe-kata-conformance。sample-authoring-standard の「共通登場人物」、sysd-cross-cutting-policy-sample の「ARC・技術メンター」「OPS・店舗運営アドバイザー」 / -
- R5-3: R5 / 1. 概要、5.1. 正本と変更影響 / 設計索引の架空の参照名が系列で揃っていない。本 sample と sysd-index-sample の命名（kinuya-&lt;接頭辞&gt;）では `kinuya-sysd-index` だが、sysd-cross-cutting-policy-sample は `kinuya-system-design-index` と書く / - / vp-qe-kata-conformance、vp-dev-change-impact。相手側の案: sysd-cross-cutting-policy-sample の `kinuya-system-design-index` を `kinuya-sysd-index` にそろえる。本 sample は sysd-index-sample の命名に合っているので直さない / -
- R5-4: R5 / 5.1. 正本と変更影響、5.3. 未決事項と後続作業 / 運用手順と判断記録の架空の参照名が系列で食い違う。本 sample は `kinuya-opr-sale-reconciliation` と `kinuya-opr-reprint`、判断記録 `KIN-DEC-01`／`KIN-DEC-02` と書く。sysd-index-sample は `kinuya-opr-recovery`・`kinuya-dec-recovery`、sysd-cross-cutting-policy-sample は `kinuya-recovery-procedure`・`kinuya-decision-log` と書く / - / vp-dev-change-impact。相手側の案: sysd-index-sample の「非機能・運用」「テスト・判断記録」の行に、照合と再印刷の 2 つの OPR、判断記録の帳簿と記録 ID の関係を足して名前をそろえる。本 sample の側で 1 つの OPR に寄せる案は、SU-03 の『二つの OPR』と業務の分け方を変えることになるため選ばなかった / 要判断
- R5-5: R5 / 1. 概要、5.1. 正本と変更影響 / sysd-index-sample の「関連ドキュメント導線」は重要フローを `kinuya-sysd-critical-flows`「未作成」としている。本 sample が `kinuya-sysd-index` に求める「会計保存・排他」「印字試行記録」の行も、sysd-index-sample の SSOT 一覧にない / - / vp-dev-change-impact。相手側の案: sysd-index-sample の「構成・システム設計」の行の `kinuya-sysd-critical-flows` の状態を、重要フローの例を参照できる扱いにする。SSOT 一覧の「DB schema・移行」の行の参照先に、排他方式と印字試行記録の保存先を足す。sample どうしは互いを架空の参照名として扱う書き方で揃っているため、直さない案もある / 要判断

## 4. 進め方と実践の型の適用

根拠とした資料は、同じ接頭辞の sample（`clis-sample`、`sysd-index-sample`、`sysd-cross-cutting-policy-sample`）と、Sample 記述標準の共通サンプル文脈である。食い違いのうち、この sample 側で直せるもの（取引番号、OPS の役割名、ARC の表記）は直して維持した。架空参照名の不一致は相手側の修正が必要なので、sample どうしが互いを架空名で扱う前提を踏まえ、案として残した。F001 と F002 は前の段で解消済みと確認し、再編集していない。frontmatter の `status` は変更していない。
