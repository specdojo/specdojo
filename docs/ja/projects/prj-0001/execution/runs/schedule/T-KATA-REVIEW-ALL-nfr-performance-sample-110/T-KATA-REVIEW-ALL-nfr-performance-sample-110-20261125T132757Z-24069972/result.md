---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-performance-sample-110-20261125t132757z-24069972
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-performance-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-performance-sample-110/T-KATA-REVIEW-ALL-nfr-performance-sample-110-20261125T132757Z-24069972/plan.md
  started_at: "2026-11-25T13:28:08.120Z"
  completed_at: "2026-11-25T13:30:01.867Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-performance-sample
    - specdojo:nfr-performance-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）のレビューを行った。対象は `docs/ja/specdojo/samples/nfr-performance-sample.md` で、rulebook の目的、Sample 記述標準、`nfr-performance` の `done_criteria` と照らした。
- 要る内容の欠落も、要らない内容の混入も見つからなかった。このため sample は変更していない（`changes` は空）。
- plan に展開された F001（`vp-qe-verifiability`）は R4 の観点なので、R1 では直していない。R4 への申し送りを findings の No 2 に書いた。
- rulebook 内の食い違いを 1 件見つけた。rulebook は sample 以外なので変更せず、直す案だけを findings の No 3 に書いた。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | 全体（`docs/ja/specdojo/samples/nfr-performance-sample.md`） | rulebook の本文要件の 6 章と、記述ガイドが各章に求める項目はすべてそろっている。要らない内容（役割の割り当て、承認の進み具合、実装の詳細、人物名、rulebook の丸写し）もない。 | 変更なし | `specdojo:nfr-performance-rulebook` の「本文要件」「記述ガイド」「禁止事項」、`specdojo:sample-authoring-standard` の「記述ガイド」「禁止事項」、`nfr-performance` の `done_criteria` | - |
| 2 | R1（R4 へ申し送り） | 性能要件一覧の `nfr-perf-002`・`nfr-perf-004` の行と、測定・検証方法の章末の段落 | grade の F001（`vp-qe-verifiability`）は R4 の観点なので、R1 では直していない。ただし、2 つの要件の当面の扱い「値を記録するだけ」と、章末の文「基準が `_UNDECIDED_` の間は暫定の判定で pass / fail を決め」が食い違っている。 | R4 で、章末の文に「暫定の判定がない要件（`nfr-perf-002`・`nfr-perf-004`）は、基準が決まるまで未判定とし、測った値を記録する」を足すか、暫定の閾値を置く。 | rulebook の「記述ガイド」の性能要件一覧（基準だけで pass / fail を一意に判定できること）と未決事項（推測で確定しない） | 要判断 |
| 3 | R1 | rulebook `docs/ja/specdojo/rulebooks/nfr-performance-rulebook.md` の「本文要件」と「記述ガイド」の測定・検証方法の項 | 記述ガイドは測定・検証方法の表に「合格条件」を含めるよう求める。一方、本文要件の表では第 4 章の内容に合格条件が入っておらず、rulebook の中で食い違っている。sample は合格条件を章末の文で示し、表の列にはしていない。 | rulebook の本文要件の第 4 章の内容に「合格条件（基準の参照）」を足すか、記述ガイドから表に含める指示を外す。sample の外なので変更していない。 | rulebook の「本文要件」の表と「記述ガイド」の測定・検証方法の項 | 要判断 |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R4 では F001 を扱う。`nfr-perf-002`・`nfr-perf-004` の当面の扱いと、測定・検証方法の章末の文を揃える必要がある。
- rulebook の本文要件と記述ガイドの食い違い（合格条件）は、rulebook の担当段で判断する。
- No: 1 / 段: R1 / 箇所: 全体（`docs/ja/specdojo/samples/nfr-performance-sample.md`） / 指摘: rulebook の「本文要件」6章（概要、適用範囲・負荷条件、性能要件一覧、測定・検証方法、関連ドキュメント導線、未決事項）と、記述ガイドが各章に求める項目（業務影響、時間帯・同時操作数・処理件数・データ量とその根拠、外部依存の扱い、P95/P99 と単位・比較方向、測定環境・回数・判定時期、位置づけの必須導線、当面の扱いと直す要件ID）はすべてそろっている。要らない内容（役割の割り当て、承認の進み具合、実装の詳細、人物名、rulebook の丸写し）もない / 直した案: 変更なし / 根拠: `specdojo:nfr-performance-rulebook` の「本文要件」「記述ガイド」「禁止事項」、`specdojo:sample-authoring-standard` の「記述ガイド」「禁止事項」、dct-non-functional-requirements-template.yaml にある `nfr-performance` の `done_criteria`（技術制約・試験基準） / 印: なし
- No: 2 / 段: R1（R4 へ申し送り） / 箇所: 性能要件一覧の `nfr-perf-002`・`nfr-perf-004` の行と、測定・検証方法の章末の段落 / 指摘: grade の F001（`vp-qe-verifiability`）は kata-guide で R4 の観点なので、R1 では直さない。ただし、2つの要件の当面の扱い「値を記録するだけ」と、章末の文「基準が `_UNDECIDED_` の間は暫定の判定で pass / fail を決め」が食い違っている / 直した案: R4 で、章末の文に「暫定の判定がない要件（`nfr-perf-002`・`nfr-perf-004`）は、基準が決まるまで未判定とし、測った値を記録する」を足すか、暫定の閾値を置く / 根拠: rulebook の「記述ガイド」の性能要件一覧（基準だけで pass / fail を一意に判定できること）と未決事項（推測で確定しない） / 印: 要判断
- No: 3 / 段: R1 / 箇所: rulebook `docs/ja/specdojo/rulebooks/nfr-performance-rulebook.md` の「本文要件」と「記述ガイド」の測定・検証方法の項 / 指摘: 記述ガイドは測定・検証方法の表に「合格条件」を含めるよう求めるが、本文要件の表では第4章の内容に合格条件が入っておらず、rulebook の中で食い違っている。sample は合格条件を章末の文で示し、表の列にはしていない / 直した案: rulebook の本文要件の第4章の内容に「合格条件（基準の参照）」を足すか、記述ガイドから表に含める指示を外す。sample の外なので変更していない / 根拠: rulebook の「本文要件」の表と「記述ガイド」の測定・検証方法の項 / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（No plan, result, or ticket history file was changed in this task）

## 4. 進め方と実践の型の適用

根拠にしたのは、`specdojo:nfr-performance-rulebook` の「本文要件」「記述ガイド」「禁止事項」、`specdojo:sample-authoring-standard`、`nfr-performance` の `done_criteria` である。これらに対し、sample の 6 章（概要、適用範囲・負荷条件、性能要件一覧、測定・検証方法、関連ドキュメント導線、未決事項）が過不足なくそろっていることを確認し、現状の記述を維持した。F001 は R4 の観点なので未解消のまま R4 に任せる。次のアクションは、R4 で章末の文に未判定の扱いを足すか、暫定の閾値を置くことである。sample は変更していないため、再評価での構造劣化の確認は不要である。
