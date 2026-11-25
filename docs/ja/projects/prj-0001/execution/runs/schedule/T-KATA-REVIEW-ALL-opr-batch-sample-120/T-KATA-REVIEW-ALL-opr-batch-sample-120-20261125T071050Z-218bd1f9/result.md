---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-batch-sample-120-20261125t071050z-218bd1f9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-batch-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-batch-sample-120/T-KATA-REVIEW-ALL-opr-batch-sample-120-20261125T071050Z-218bd1f9/plan.md
  started_at: "2026-11-25T07:10:59.205Z"
  completed_at: "2026-11-25T07:25:38.627Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-batch-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として、plan の編集対象 `docs/ja/specdojo/samples/opr-sample.md` を opr-template と opr-rulebook の章構成に照らして確認した。構成の差分を 2 件直した。
- 「バッチ再実行・失敗時対応」の再実行上限を独立した項目に分けた。「アカウント付与・剥奪手順」の緊急権限の段落には見出し語を付けた。
- `opr-batch-sample.md` は plan の編集対象に含まれないため変更していない。構成の不一致は handoff に残した。
- runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed になった。executor の `prettier --check` も passed になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: 「バッチ再実行・失敗時対応」で、再実行に埋もれていた上限の文を「上限:」の項目に分けた。並びは失敗検知、再実行、上限、重複防止、上限到達時の順で、template と rulebook に対応する。「アカウント付与・剥奪手順」では、緊急権限の段落の先頭に「緊急権限:」を付け、「棚卸し:」と形を揃えた。

## 3. 申し送り

- plan に展開された finding F001〜F004 は R2 の観点ではないため、この段では扱っていない。executor は次のように整理している。F001 と F004 は kata の段のレビューで使わない観点にあたる。F002 は R4 の観点にあたる。F003 は R1 で解消を確認済みである。
- `opr-batch-sample.md` の構成の不一致（R2-4〜R2-6）は、対象外のため未反映である。反映するには、別タスクとして `opr-batch-sample.md` を編集対象に切り替える必要がある。
- No=R2-1 / 段=R2 / 箇所=opr-sample.md「バッチ再実行・失敗時対応」 / 指摘=「再実行」の項目に再実行上限が埋もれており、template と rulebook の並び（失敗検知、再実行条件、再実行上限、重複防止、エスカレーション）と項目が対応していない / 直した案=上限の文を「上限:」の項目に分け、検知→再実行→上限→重複の防止→上限到達時の順にした（反映済み） / 根拠=`vp-arc-document-structure`（opr-template「バッチ再実行・失敗時対応」、opr-rulebook 記述ガイド「バッチ再実行・失敗時対応」） / 印=-
- No=R2-2 / 段=R2 / 箇所=opr-sample.md「アカウント付与・剥奪手順」 / 指摘=手順の後の段落のうち「棚卸し:」だけに見出し語があり、緊急権限の段落と形が揃っていない / 直した案=緊急権限の段落の先頭に「緊急権限:」を付けた（反映済み） / 根拠=`vp-arc-document-structure`（opr-rulebook 記述ガイド「アカウント付与/剥奪手順」の棚卸し・緊急権限） / 印=-
- No=R2-3 / 段=R2 / 箇所=対象の解決 / 指摘=タスク名は `opr-batch-sample` のレビューだが、plan の編集対象は rulebook の sample 宣言の先頭から `opr-sample.md` に解決されている。R1（R1-7）と同じ状況で、plan に従ったため `opr-batch-sample.md` は変更していない / 直した案=- / 根拠=plan「根拠となる成果物と編集対象」 / 印=要判断
- No=R2-4 / 段=R2 / 箇所=opr-batch-sample.md「手順適用範囲・前提」 / 指摘=表の行名が `連絡経路` で、template の `連絡先` と違う / 直した案=行名を `連絡先` に改める（sample 以外ではなく対象外の sample のため未反映） / 根拠=`vp-arc-document-structure`（opr-rulebook「記述ガイド」で表の列名・行は template に従う） / 印=-
- No=R2-5 / 段=R2 / 箇所=opr-batch-sample.md「障害対応手順」 / 指摘=表の列（優先度・本書で該当する条件・対応・判断者）が template の 6 列（優先度・初動目標・切り分け・一次対応・復旧・エスカレーション）と違う / 直した案=template の列に揃えるか、`opr-index` を参照して差分だけを書く理由を表の前の 1 文に明示する（未反映） / 根拠=`vp-arc-document-structure`、opr-template「障害対応手順」 / 印=要判断
- No=R2-6 / 段=R2 / 箇所=opr-batch-sample.md「アラート対応手順」 / 指摘=template は確認・暫定対応・恒久対応・誤検知の 4 段階の表（手順・完了条件・証跡）だが、本文は箇条書きで完了条件と証跡の列がない / 直した案=template の 4 段階の表にし、各段の完了条件と証跡（障害記録など）を書く（未反映） / 根拠=`vp-arc-document-structure`、`vp-qe-omissions-consistency`（opr-template「アラート対応手順」） / 印=-
- No=R2-7 / 段=R2 / 箇所=plan の finding F001〜F004 / 指摘=F001（`vp-po-decision-readiness`）・F004（`vp-ops-release-readiness`）は kata の段のレビューで使わない観点、F002（`vp-qe-verifiability`）は R4 の観点、F003 は解消済み（R1 で確認済み）。いずれも R2 の観点ではないため扱っていない / 直した案=- / 根拠=kata-guide「kata の観点の組」 / 印=-

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として実施した。根拠にした規範は opr-template、opr-rulebook の記述ガイド、`vp-arc-document-structure` である。章の順と項目の並びが template と rulebook に沿っているかを確認し、沿っていない 2 箇所を直した。それ以外の記述は構成が整合しているため維持した。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | `opr-sample.md` バッチ再実行・失敗時対応 | 再実行の項目に上限が埋もれ、template と rulebook の並びに対応していない | 上限を「上限:」の項目に分け、検知、再実行、上限、重複防止、上限到達時の順にした（反映済み） | `vp-arc-document-structure`（opr-template、opr-rulebook 記述ガイド） | - | | R2-2 | R2 | `opr-sample.md` アカウント付与・剥奪手順 | 「棚卸し:」だけに見出し語があり、緊急権限の段落と形が揃っていない | 緊急権限の段落の先頭に「緊急権限:」を付けた（反映済み） | `vp-arc-document-structure`（opr-rulebook 記述ガイド） | - | | R2-3 | R2 | 対象の解決 | タスク名は `opr-batch-sample` のレビューだが、plan の編集対象は `opr-sample.md` に解決されている。R1（R1-7）と同じ状況で、plan に従い `opr-batch-sample.md` は変更していない | - | plan「根拠となる成果物と編集対象」 | 要判断 | | R2-4 | R2 | `opr-batch-sample.md` 手順適用範囲・前提 | 表の行名が「連絡経路」で、template の「連絡先」と違う | 行名を「連絡先」に改める（対象外のため未反映） | `vp-arc-document-structure`（opr-rulebook 記述ガイド） | - | | R2-5 | R2 | `opr-batch-sample.md` 障害対応手順 | 表の列が template の 6 列と違う | template の列に揃えるか、`opr-index` を参照して差分だけを書く理由を表の前に 1 文で示す（未反映） | `vp-arc-document-structure`、opr-template「障害対応手順」 | 要判断 | | R2-6 | R2 | `opr-batch-sample.md` アラート対応手順 | template は 4 段階の表（手順・完了条件・証跡）だが、本文は箇条書きで完了条件と証跡の列がない | 4 段階の表にし、各段の完了条件と証跡を書く（未反映） | `vp-arc-document-structure`、`vp-qe-omissions-consistency` | - | | R2-7 | R2 | plan の finding F001〜F004 | R2 の観点ではない。F001 と F004 は kata の段で使わない観点、F002 は R4、F003 は解消済み | - | kata-guide「kata の観点の組」 | - |
