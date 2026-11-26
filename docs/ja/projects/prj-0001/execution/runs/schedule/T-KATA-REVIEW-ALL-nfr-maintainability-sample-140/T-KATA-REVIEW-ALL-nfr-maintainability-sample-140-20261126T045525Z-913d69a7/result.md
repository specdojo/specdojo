---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-maintainability-sample-140-20261126t045525z-913d69a7
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-maintainability-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-maintainability-sample-140/T-KATA-REVIEW-ALL-nfr-maintainability-sample-140-20261126T045525Z-913d69a7/plan.md
  started_at: "2026-11-26T04:55:35.178Z"
  completed_at: "2026-11-26T05:03:57.791Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-maintainability-sample
    - specdojo:nfr-maintainability-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、保守性要件の sample に書かれた事実を、schema・関連 sample・rulebook と突き合わせた。確かめた主張は 11 件で、不一致は 1 件だった。
- 不一致は「関連ドキュメント導線」の受入判定の行である。この行は、性能の受入条件である `sac-sample` を保守性要件の判定基準の参照元として書いていた。そのため、`sac-*` のバッククォート表記と、月次点検で確かめる旨の記述に直した。
- grade の F001（`nfr-mnt-004` が `_UNDECIDED_`）と F002（「通信」と「外部」の表記の違い）は、前の段で直っていた。今回の版で再確認した。
- 整形と検査の結果は次のとおり。`prettier`、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は成功した。変更の種類に該当しない検査は `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | docs/ja/specdojo/samples/nfr-maintainability-sample.md「関連ドキュメント導線」の受入判定の行 | `sac-sample`（システム受入条件）が `nfr-mnt-001`・`002`・`005` の判定基準を参照すると書いていた。実際の `sac-sample` は性能の受入条件で、参照するのは `nfr-perf-*` だけである。`nfr-index-sample` も、保守性の検証は「なし」で月次点検の記録で確かめるとしている。 | `sac-*` のバッククォート表記にし、「保守性の受入条件は置かず月次点検で確かめる。置くときは同じ値で参照する」に直した。 | `sac-sample` の 26〜31 行、`nfr-index-sample` の 77・84 行 | minor/vp-qe-verifiability（修正済み） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-maintainability-sample.md`: 「関連ドキュメント導線」の受入判定の行を直した。性能の受入条件である `sac-sample` への wikilink を外し、`sac-*` のバッククォート表記にした。説明は「保守性の受入条件は置かず月次点検で確かめる。置くときは同じ値で参照する」に変えた。表の幅は整形で揃えた。

## 3. 申し送り

- 確かめられなかった主張はない。
- [minor/vp-qe-verifiability] docs/ja/specdojo/samples/nfr-maintainability-sample.md の「関連ドキュメント導線」の受入判定の行：`[[specdojo:sac-sample|システム受入条件]]` が `nfr-mnt-001`・`002`・`005` の判定基準を参照すると書いていたが、`sac-sample` は性能の受入条件で、参照するのは `nfr-perf-*` だけである。`nfr-index-sample` の導線の表（77・84 行）でも、保守性の検証は `（なし）` で月次点検の記録で確かめるとしている。rulebook が必須とする `sac-*` への導線は残し、`sac-*` のバッククォート表記と「保守性の受入条件は置かず月次点検で確かめる。置くときは同じ値で参照する」に直した。
- R4 の確かめの表（No / 主張 / 正本 / 確かめ方 / 結果 / 根拠）：1 frontmatter のキー `part_of`・`based_on`・`supersedes` / `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` / grep / 一致 / 69〜75 行。2 `type: requirement` / `deliverable-frontmatter.schema.yaml`・rulebook / 読み取り / 一致 / schema 8 行、rulebook 58 行。3 `rulebook: specdojo:nfr-maintainability-rulebook` / rulebook の frontmatter / 読み取り / 一致 / 3 行。4 導線の 6 件の sample ID / 各 sample の frontmatter / grep / 一致 / すべての `id` が存在する。5 営業時間 10:00〜18:00 / `opd-index-sample` / grep / 一致 / 34 行。6 P1 から 30 分で紙の販売控えへの切替を判断 / `opd-index-sample` / grep / 一致 / 97 行。7 変更と切り戻しは閉店後、切り戻しは `DEV` / `opd-index-sample` / grep / 一致 / 108〜113 行。8 監視はホスティング環境の死活 / `opd-index-sample` / grep / 一致 / 85〜89 行。9 営業日の 90% 以上で記録を継続 / `opd-index-sample` / grep / 一致 / 48 行。10 RTO の正本は可用性要件で未決 / `nfr-availability-sample` / grep / 一致 / `nfr-avl-002`。11 受入判定の導線 / `sac-sample`・`nfr-index-sample` / grep / 不一致（直した） / `sac-sample` 26〜31 行は `nfr-perf-*` だけ、`nfr-index-sample` 77・84 行。
- grade の F001（`nfr-mnt-004` が `_UNDECIDED_`）と F002（「通信」と「外部」の表記の違い）は、前の段で直っていた。現在の版は、`nfr-mnt-004` に「要求日の翌営業日の 10:00 まで」の閾値があり、範囲の表記も rulebook の用語定義と同じ「アプリ・データ・端末・外部」である。

## 4. 進め方と実践の型の適用

根拠にしたのは、sample の frontmatter から辿れる rulebook、`common-frontmatter.schema.yaml`、`deliverable-frontmatter.schema.yaml`、関連 sample（`opd-index-sample`、`nfr-availability-sample`、`nfr-index-sample`、`sac-sample`）である。frontmatter のキー、`type`、`rulebook`、導線の sample ID、営業時間、30 分の切替判断、閉店後の変更と切り戻し、監視の対象、記録の継続率、RTO の正本は、正本と一致した。受入判定の導線は、`sac-sample` が `nfr-perf-*` だけを扱い、`nfr-index-sample` も保守性の検証を月次点検としていることと食い違っていた。rulebook が必須とする `sac-*` への導線は残し、記述だけを直した。F001 と F002 は解消済みのため、追加の変更はしていない。
