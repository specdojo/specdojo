---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-reliability-sample-140-20261126t050853z-fb839f42
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-reliability-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-reliability-sample-140/T-KATA-REVIEW-ALL-nfr-reliability-sample-140-20261126T050853Z-fb839f42/plan.md
  started_at: "2026-11-26T05:09:03.514Z"
  completed_at: "2026-11-26T05:17:44.271Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-reliability-sample
    - specdojo:nfr-reliability-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`nfr-reliability-sample` の主張を rulebook、schema、`based_on` の sample、参照先の sample と突き合わせた。確かめた主張に誤りはなかった。
- grade の F001（`vp-qe-verifiability`）に対し、基準が `_UNDECIDED_` の `nfr-rel-001` と `nfr-rel-004` の備考へ、基準値を決める契機を足した。
- `nfr-rel-001` の備考には、試用期間の終了時に試用中の件数から基準値を決め、`dec-reliability-criteria` に記録することを `_ASSUMPTION_` として書いた。`nfr-rel-004` の備考は、基準値を `nfr-rel-001` と同じ時期に決める旨に改めた。
- runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed だった。他の検査は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 3. 信頼性要件一覧 / `nfr-rel-001` | 基準が `_UNDECIDED_: ○○% 以下` で、基準を決める期限や契機がなく、pass と fail を判定できない（grade F001）。 | 備考に「`_ASSUMPTION_:` 試用期間の終了時に試用中の件数から基準値を決め、`dec-reliability-criteria` に記録する」を足した。 | vp-qe-verifiability。前提条件の「障害率の見込みは試用期間の実績から判断する」と、`dec-reliability-criteria` の目的に合わせた。 | 要判断 |
| R4-2 | R4 | 3. 信頼性要件一覧 / `nfr-rel-004` | 基準 `_UNDECIDED_: ○○ 時間以上` にも、決める契機がない（grade F001）。 | 備考を「決まるまでは回数を記録するだけとし、基準値は `nfr-rel-001` と同じ時期に決める」にした。 | vp-qe-verifiability | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-reliability-sample.md`: 信頼性要件一覧の `nfr-rel-001` と `nfr-rel-004` の備考を修正した（7 行追加、7 行削除）。基準値を決める契機を明記し、pass と fail を判定できるようにする狙いである。

## 3. 申し送り

- `nfr-rel-001` の備考に足した「試用期間の終了時」という契機は `_ASSUMPTION_` であり、正本のある値ではない。人が妥当性を判断する必要がある（R4-1 は要判断）。
- `sac-reliability`、`stc-reliability`、`dec-reliability-criteria` は未作成の文書をバッククォートで仮置きしたものである。実在は確かめられていない。
- R4-1: R4 / 3. 信頼性要件一覧 / `nfr-rel-001` の基準が `_UNDECIDED_: ○○% 以下` で、基準を決める期限・契機がなく pass・fail を判定できない（grade F001） / 備考に「`_ASSUMPTION_:` 試用期間の終了時に試用中の件数から基準値を決め、`dec-reliability-criteria` に記録する」を足した / vp-qe-verifiability。前提条件の「障害率の見込みは試用期間の実績から判断する」と、関連ドキュメント導線の `dec-reliability-criteria` の目的に合わせた。暫定の数値基準を置く案は、正本のない数値を作ることになるため選ばなかった / 要判断
- R4-2: R4 / 3. 信頼性要件一覧 / `nfr-rel-004` の基準 `_UNDECIDED_: ○○ 時間以上` も同様に決める契機がない（grade F001） / 備考を「決まるまでは回数を記録するだけとし、基準値は `nfr-rel-001` と同じ時期に決める」にした / vp-qe-verifiability / -
- 確かめの表（R4）: No1 主張=frontmatter の `type: requirement`・`rulebook`・`part_of`・`based_on`（Frontmatter） / 正本=docs/ja/specdojo/rulebooks/nfr-reliability-rulebook.md、docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml / 確かめ方=読み取り / 結果=一致 / 根拠=rulebook の推奨 Frontmatter 項目、schema 8行目の requirement
- 確かめの表（R4）: No2 主張=章構成 1〜5 と要件一覧の列 `id`・`内容`・`指標`・`基準`・`備考` / 正本=nfr-reliability-rulebook.md の本文構成と記述ガイド / 確かめ方=読み取り / 結果=一致 / 根拠=rulebook 55〜61行と77行
- 確かめの表（R4）: No3 主張=要件 ID `nfr-rel-001`〜`005` / 正本=rulebook のファイル命名・ID規則 / 確かめ方=読み取り / 結果=一致 / 根拠=`nfr-rel-&lt;連番&gt;`
- 確かめの表（R4）: No4 主張=記録を営業日の 90% 以上で続ける目標（1. 概要） / 正本=docs/ja/specdojo/samples/prj-overview-sample.md / 確かめ方=grep / 結果=一致 / 根拠=78行 運用定着 営業日の90%以上
- 確かめの表（R4）: No5 主張=ACD-A02 通信断の頻度と影響は未確認、ACD-D03 オフライン時の記録方法は未決（2. 適用範囲・前提条件） / 正本=prj-assumptions-constraints-dependencies-sample.md / 確かめ方=grep / 結果=一致 / 根拠=26行・45行
- 確かめの表（R4）: No6 主張=対象時間帯 10:00〜18:00 が可用性要件と同じ / 正本=nfr-availability-sample.md / 確かめ方=grep / 結果=一致 / 根拠=36行・62行
- 確かめの表（R4）: No7 主張=wikilink 先（nfr-index・nfr-availability・prj-overview・prj-assumptions-constraints-dependencies・opd-monitoring・opd-incident-management・opr-incident の各 sample）がある / 正本=docs/ja/specdojo/samples/ / 確かめ方=ls / 結果=一致 / 根拠=全ファイルがある。nfr-index-sample の44行に信頼性の分冊がある
- 確かめの表（R4）: No8 主張=判定する Role code `OPS`・`QE`、agent を判定者にしない（4. 測定・検証方法） / 正本=docs/ja/specdojo/defaults/pm-review-viewpoints.yaml、rulebook 記述ガイド 6.4 / 確かめ方=grep / 結果=一致 / 根拠=role: QE、role: OPS がある
- 確かめの表（R4）: No9 主張=少なくとも 1 件はテストで判定し、`sac-*`・`stc-*` を示す / 正本=rulebook 記述ガイド 6.4 / 確かめ方=読み取り / 結果=一致 / 根拠=`nfr-rel-002`・`003`・`005` がテストで、検証先が `stc-reliability`
- 確かめの表（R4）: No10 主張=`sac-reliability`・`stc-reliability`・`dec-reliability-criteria` / 正本=なし（未作成の文書をバッククォートで仮置き） / 確かめ方=読み取り / 結果=確かめられない / 根拠=実在を確かめるには、対応する sample か適用先の成果物が要る。業務の数値（10・30・59 秒、各 10 件など）は正本のない仮定のため対象外とした

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿って実施した。frontmatter、章構成、要件 ID、他の sample との数値や参照先、Role code、検証方法について、主張ごとの確かめを行った。結果は一致が 9 件、確かめられないものが 1 件（未作成文書の仮置き）だった。F001 は備考へ基準値を決める契機を加えて対応した。暫定の数値基準を置く案は、正本のない数値を作ることになるため採らなかった。status は `draft` のまま据え置いた。
