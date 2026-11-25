---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-operations-sample-110-20261125t132655z-fc38cec7
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-operations-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-operations-sample-110/T-KATA-REVIEW-ALL-nfr-operations-sample-110-20261125T132655Z-fc38cec7/plan.md
  started_at: "2026-11-25T13:27:06.454Z"
  completed_at: "2026-11-25T13:34:39.209Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-operations-sample
    - specdojo:nfr-operations-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの R1（目的の過不足）として nfr-operations-sample を確認し、rulebook の「位置づけ」にある `dec-*` が「関連ドキュメント導線」の表に欠けていたため、1 行を足した。
- ほかの章は rulebook と `done_criteria` を満たすため変更していない。
- rulebook の修正が必要な F003 は、この段では rulebook を変更できないため案を handoff に残した。F001・F004 は kata のレビューでは使わない観点なので対象外とした。F002 は R4 の観点なので次の段へ渡した。
- executor の検査（prettier、markdownlint）と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed だった。その他の検査は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | docs/ja/specdojo/samples/nfr-operations-sample.md の「関連ドキュメント導線」の表 | rulebook の「位置づけ」にある `dec-*`（基準値や対象外の設計判断）が、導線の表に入っていない。rulebook の「記述ガイド」は、「位置づけ」の文書すべてを表でつなぐよう求めている。 | 「設計判断 / `dec-*` / 基準値の見直しと対象外の判断の根拠」の行を、受入条件の行の次に足した。`dec-sample` は deprecated のため wikilink にせず、バッククォートで仮置きした。 | [[specdojo:nfr-operations-rulebook]] の「位置づけ」と「記述ガイド」の「関連ドキュメント導線」、[[specdojo:sample-authoring-standard]] の「内容充実化（薄いドキュメント防止）」 | 直した |
| 2 | R1 | docs/ja/specdojo/rulebooks/nfr-operations-rulebook.md の「全体方針」の `_UNDECIDED_`（grade の F003） | rulebook に「sample は本文要件の 5 章に揃っていない」とあるが、今の sample は 5 章にそろっており、記述が古い。 | rulebook はこの段で変えられないため、案だけ示す。該当の文を「`recipe`・`template` の要否は未判断である。同じ構成を NFR 分冊で共通の template にできるかの判断を、本書を `ready` にする前提条件とする。」に書き換える。 | `vp-qe-kata-conformance`、sample の見出し 5 章と rulebook の「本文要件」の表 | 要判断 |
| 3 | R1 | grade の F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`） | どちらも kata のレビューでは使わない観点に当たる。 | sample は変えていない。kata の承認と ready 化は登録簿で追う。 | [[specdojo:kata-guide]] の「kata の観点の組」 | 対象外 |
| 4 | R1 | grade の F002（`vp-qe-verifiability`、`nfr-ops-003` の基準が `_UNDECIDED_` のまま） | 観点が R4 に当たるため、この段では扱わない。 | R4 の段で、暫定値を `_ASSUMPTION_` として置くかを判断する。 | [[specdojo:kata-guide]] の「kata の観点の組」 | 次の段へ渡す |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-operations-sample.md`: 「関連ドキュメント導線」の表に、設計判断（`dec-*`）の行を 1 行追加した。基準値の見直しと対象外の判断の根拠を示す行で、受入条件の行の次に置いた。`dec-sample` は deprecated のため wikilink にせず、バッククォートで仮置きした。

## 3. 申し送り

- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/nfr-operations-sample.md の「関連ドキュメント導線」の表 / 指摘: rulebook の「位置づけ」にある `dec-*`（基準値や対象外の設計判断）が、導線の表に入っていない。rulebook の「記述ガイド」の「関連ドキュメント導線」は「位置づけ」の文書すべてを表でつなぐよう求めている / 直した案: 「設計判断 / `dec-*` / 基準値の見直しと対象外の判断の根拠」の行を、受入条件の行の次に足した。`dec-sample` は deprecated のため wikilink にせず、バッククォートで仮置きした / 根拠: [[specdojo:nfr-operations-rulebook]] の「位置づけ」と「記述ガイド」の「関連ドキュメント導線」、[[specdojo:sample-authoring-standard]] の「内容充実化（薄いドキュメント防止）」 / 印: 直した
- No: 2 / 段: R1 / 箇所: docs/ja/specdojo/rulebooks/nfr-operations-rulebook.md の「全体方針」の `_UNDECIDED_`（grade の F003） / 指摘: rulebook に「sample は本文要件の 5 章に揃っていない」とあるが、今の sample は 5 章にそろっており、記述が古い / 直した案（rulebook はこの段で変えられないため、案だけ示す）: 該当の文を「`recipe`・`template` の要否は未判断である。同じ構成を NFR 分冊で共通の template にできるかの判断を、本書を `ready` にする前提条件とする。」に書き換える / 根拠: `vp-qe-kata-conformance`、sample の見出し 5 章と rulebook の「本文要件」の表 / 印: 要判断（`ready` にする前提条件そのものを変えるため）
- No: 3 / 段: R1 / 箇所: grade の F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`） / 指摘: どちらも kata のレビューでは使わない観点に当たる / 直した案: sample は変えていない。kata の承認と ready 化は登録簿で追う / 根拠: [[specdojo:kata-guide]] の「kata の観点の組」 / 印: 対象外
- No: 4 / 段: R1 / 箇所: grade の F002（`vp-qe-verifiability`、`nfr-ops-003` の基準が `_UNDECIDED_` のまま） / 指摘: 観点が R4 に当たるため、この段では扱わない / 直した案: R4 の段で、暫定値を `_ASSUMPTION_` として置くかを判断する / 根拠: [[specdojo:kata-guide]] の「kata の観点の組」 / 印: 次の段へ渡す

## 4. 進め方と実践の型の適用

根拠として nfr-operations-rulebook の「位置づけ」と「記述ガイド」、sample-authoring-standard の「内容充実化（薄いドキュメント防止）」、kata-guide の「kata の観点の組」を使った。rulebook の「位置づけ」の文書をすべて導線の表でつなぐ要件に対し、`dec-*` だけが欠けていたので足した。ほかの章は rulebook の本文要件 5 章と整合しているため維持した。F001・F004 は kata のレビューでは使わない観点なので扱わず、F002 は R4 の観点なので次の段へ渡した。F003 は rulebook 側の修正が要るため、sample は変えず案だけ示した（要判断）。
