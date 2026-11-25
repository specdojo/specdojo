---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sac-sample-120-20261125t232038z-ac570ab9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sac-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sac-sample-120/T-KATA-REVIEW-ALL-sac-sample-120-20261125T232038Z-ac570ab9/plan.md
  started_at: "2026-11-25T23:20:48.004Z"
  completed_at: "2026-11-25T23:26:54.736Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sac-sample
    - specdojo:sac-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `sac-sample` を確認した。「1. 概要」で対象・対象外の箇条書きを受入条件の対応表の前へ移し、rulebook の本文要件の順（何を合格とするか、範囲と対象外、根拠）にそろえた。
- 「2. 受入条件」の構成（各受入条件が前提・操作・期待結果・判定方法の 4 つの `####` で並ぶ形）は rulebook に沿うため、章の移動・分割・統合は行っていない。
- grade の F001 は観点が `vp-qe-verifiability` で R4 の担当のため、この段では直していない。F002 は R1 の後の版ですでに解消していた。
- `npx prettier --check` は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 1. 概要 | 対象・対象外の箇条書きが対応表と「下位」の間にあり、範囲を知る前に条件と根拠の表を読む順になっていた。 | 対象・対象外の 2 項目を対応表の前へ移した。表の受入条件 ID を使う「下位」の箇条は表の後に残した。 | `vp-arc-document-structure`。rulebook「本文要件」の 1. 概要の成立条件の順（何を合格とするか、範囲と対象外、根拠）。 | - |
| R2-2 | R2 | 1. 概要 | 対応表の「判定に使う基準」の列が 2.n.3 期待結果・2.n.4 判定方法と同じ内容を持ち、表と本文で基準を二重に置いている。 | - | `vp-arc-document-structure`。rulebook の概要の成立条件は出口条件・範囲・根拠で、基準の一覧は求めていない。ただし受入判断の一覧として役立ち、列の直前の文が仮置き値の扱いを説明しているため、列を削る案は採らずに残した。採るかは人が判断する。 | 要判断 |
| R2-3 | R2 | 2. 受入条件 | 各受入条件が `### 2.n. &lt;ID&gt; &lt;条件名&gt;` と前提・操作・期待結果・判定方法の 4 つの `####` で並び、rulebook の構成どおりで、移動・分割・統合は要らない。 | - | `vp-arc-document-structure`、`vp-qe-omissions-consistency` | - |
| R2-4 | R2 | 2.4.4. 判定方法 | F001（日次締めの合否の境界が「翌日の開店まで」だけで、閉店・開店の時刻が前提にない）は観点が `vp-qe-verifiability` で R4 の担当のため、この段では直さない。時刻をサンプル側で足すと、根拠の `nfr-performance-sample` にない閾値を加えることになり、rulebook の禁止事項「根拠のない閾値・要求の追加」に当たる。 | R4 の段へ渡す。直すなら相手側の `specdojo:nfr-performance-sample` の閉店後の条件（閉店から翌日の開店まで）に時刻か許容時間の暫定値を決めてから、2.4.1 前提に反映する。 | `vp-qe-verifiability`、rulebook の禁止事項 | - |
| R2-5 | R2 | 1. 概要 | F002（概要表の SAC-PERF-04 と 2.4 見出しの食い違い）は、R1 の後の版で表が「閉店後の日次締めを翌日の開店前に終える」になっており、すでに解消している。 | - | `vp-ux-language-consistency`（R3 の観点）。版を確かめただけで、新しく直したものはない。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sac-sample.md`: 「1. 概要」で、対象・対象外の 2 項目の箇条書きを受入条件の対応表の前へ移した。表の受入条件 ID を使う「下位」の箇条は表の後に残した。差分は 3 行の追加と 2 行の削除である。

## 3. 申し送り

- F001（日次締めの合否の境界が「翌日の開店まで」だけで時刻が前提にない）は R4 へ渡す。サンプル側で時刻を足すと、根拠の `nfr-performance-sample` にない閾値の追加になり、rulebook の禁止事項に当たる。直す場合は `specdojo:nfr-performance-sample` 側で閉店後の条件に時刻か許容時間の暫定値を決め、2.4.1 の前提へ反映する。
- R2-1: R2 / 1. 概要 / 対象・対象外の箇条書きが対応表と「下位」の間にあり、範囲を知る前に条件と根拠の表を読む順になっていた / 対象・対象外の 2 項目を対応表の前へ移し、表の受入条件 ID を使う「下位」の箇条は表の後に残した / `vp-arc-document-structure`（rulebook「本文要件」の 1. 概要の成立条件の順: 何を合格とするか・範囲と対象外・根拠） / -
- R2-2: R2 / 1. 概要 / 対応表の「判定に使う基準」の列が 2.n.3 期待結果・2.n.4 判定方法と同じ内容を持ち、表と本文で基準を二重に置いている / - / `vp-arc-document-structure`。rulebook の概要の成立条件は出口条件・範囲・根拠で、基準の一覧は求めていない。ただし受入判断の一覧として役立ち、列の直前の文が仮置き値の扱いを説明しているため、列を削る案は採らずに残した。採るかは人が判断する / 要判断
- R2-3: R2 / 2. 受入条件 / 各受入条件が `### 2.n. &lt;ID&gt; &lt;条件名&gt;` と前提・操作・期待結果・判定方法の 4 つの `####` で並び、rulebook の構成どおりで、移動・分割・統合は要らない / - / `vp-arc-document-structure`、`vp-qe-omissions-consistency` / -
- R2-4: R2 / 2.4.4. 判定方法 / F001（日次締めの合否の境界が「翌日の開店まで」だけで閉店・開店の時刻が前提にない）は観点が `vp-qe-verifiability` で R4 の担当のため、この段では直さない。時刻をサンプル側で足すと、根拠の `nfr-performance-sample` にない閾値を加えることになり、rulebook の禁止事項「根拠のない閾値・要求の追加」に当たる / - / R4 の段へ渡す。直すなら相手側の `specdojo:nfr-performance-sample` の閉店後の条件（閉店から翌日の開店まで）に時刻か許容時間の暫定値を決めてから、2.4.1 前提に反映する / -
- R2-5: R2 / 1. 概要 / F002（概要表の SAC-PERF-04 と 2.4 見出しの食い違い）は、R1 の後の版で表が「閉店後の日次締めを翌日の開店前に終える」になっており、すでに解消している / - / `vp-ux-language-consistency`（R3 の観点）。版を確かめただけで、新しく直したものはない / -

## 4. 進め方と実践の型の適用

参照する向きを成果物から sample に切り替え、R1 が直した版を読んだ。rulebook の本文要件の順（出口条件、範囲と対象外、根拠）と照らして章の順・粒度・表と本文の配置を確認し、ずれていた「1. 概要」の箇条書きの位置だけを直した。sample 以外は変更していない。根拠が不足する指摘や推測による改訂はなく、F001 は担当の段が異なるため見送り、F002 は確認のみで新しい修正はない。
