---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sf-index-sample-110-20261125t150919z-0967cef2
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sf-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sf-index-sample-110/T-KATA-REVIEW-ALL-sf-index-sample-110-20261125T150919Z-0967cef2/plan.md
  started_at: "2026-11-25T15:09:28.950Z"
  completed_at: "2026-11-25T15:17:55.193Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sf-index-sample
    - specdojo:sf-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `sf-index-sample` の未決事項を2点修正しました。Q-01 には、業務・接点の対応が概念データフロー図の業務プロセス領域を根拠とした暫定であることを追記しました。Q-03 には、影響する機能を機能 ID（`SF-INV-01`、`SF-INV-03`、`SF-CLS-02`）で明記しました。
- grade の finding F001〜F004 は R1 の観点外です。executor は他段に委ねており、本段では扱っていません。
- 検証は executor の markdownlint が通り、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通りました。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 4. 未決事項（Q-01） | 業務・接点の対応を暫定としているのに、暫定対応の根拠が示されていません。rulebook は暫定対応とその根拠を示すよう求めています。 | 論点に「概念データフロー図の業務プロセス領域を根拠とした暫定」と根拠を追記しました。 | vp-qe-kata-conformance（種別の責務）、`specdojo:sf-index-rulebook` の「6.4. 未決事項」 | - |
| R1-2 | R1 | 4. 未決事項（Q-03） | 影響する機能を機能 ID でなく名前（補充依頼支援・月次集計）だけで示しており、rulebook の「影響する機能 ID」の要件を欠いています。 | `SF-INV-01`（`sf-inventory` 候補）、`SF-INV-03`、`SF-CLS-02` の ID を明記しました。 | vp-qe-kata-conformance（種別の責務）、`specdojo:sf-index-rulebook` の「本文要件」「6.4. 未決事項」 | - |
| R1-3 | R1 | docs/ja/specdojo/templates/dct-system-functions-template.yaml（成果物カタログ雛形） | 雛形の `sf-index` の `rulebook` が `specdojo:sf-rulebook` になっており、sf-index-rulebook と sf-index-sample の宣言と食い違っています。 | sample 外のため未変更です。直す案は、雛形の `sf-index` の `rulebook` を `specdojo:sf-index-rulebook` にすることです。 | vp-qe-kata-conformance。選ばなかった案は、雛形が個別仕様の rulebook を意図して流用しているとみなして維持することです。その意図は確かめられませんでした。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-index-sample.md`: 「未決事項」の表を修正しました。Q-01 には暫定対応の根拠（概念データフロー図の業務プロセス領域）を追記し、Q-03 には影響する機能を機能 ID で明記しました。変更は5行の追加と5行の削除です。

## 3. 申し送り

- grade の finding F001（`vp-pm-control-reporting`）は kata の段のレビューでは使わない観点のため、この段では扱っていません。F002 と F004 は R5、F003 は R2 に委ねています。これらは再評価で確認が必要です。
- R1-1: R1 / 4. 未決事項（Q-01） / 業務・接点の対応を暫定としているが、暫定対応の根拠が示されていない（rulebook の「全体方針」と「6.4. 未決事項」は暫定対応とその根拠を示すよう求めている） / 論点に「概念データフロー図の業務プロセス領域を根拠とした暫定」と根拠を追記した / vp-qe-kata-conformance（種別の責務）、specdojo:sf-index-rulebook「6.4. 未決事項」 / -
- R1-2: R1 / 4. 未決事項（Q-03） / 影響する機能を機能 ID でなく名前（補充依頼支援・月次集計）だけで示しており、rulebook の「影響する機能 ID」の要件を欠く / `SF-INV-01`（`sf-inventory` 候補）、`SF-INV-03`、`SF-CLS-02` の ID を明記した / vp-qe-kata-conformance（種別の責務）、specdojo:sf-index-rulebook「本文要件」「6.4. 未決事項」 / -
- R1-3: R1 / -（成果物カタログ雛形） / docs/ja/specdojo/templates/dct-system-functions-template.yaml の `sf-index` の `rulebook` が `specdojo:sf-rulebook` になっており、sf-index-rulebook / sf-index-sample の宣言と食い違う / -（sample 外のため未変更。相手側の案: 雛形の `sf-index` の `rulebook` を `specdojo:sf-index-rulebook` にする） / vp-qe-kata-conformance。選ばなかった案は、雛形が個別仕様の rulebook を意図して流用しているとみなして維持すること。その意図を確かめられなかった / 要判断
- R1 で扱わなかった grade の finding: F001（`vp-pm-control-reporting`）は kata の段のレビューでは使わない観点（kata-guide「kata の観点の組」）。F002（`vp-dev-change-impact`）と F004（`vp-qe-kata-conformance` の kata 相互）は R5、F003（`vp-qe-omissions-consistency`）は R2 に委ねる。

## 4. 進め方と実践の型の適用

rulebook の「全体方針」と「6.4. 未決事項」を正として、暫定対応には根拠を、影響する機能には機能 ID を示すよう sample を直しました。sample 以外は変更していません。成果物カタログ雛形の `rulebook` 宣言の食い違いは、sample 外のため直さず、案として findings に残しました。
