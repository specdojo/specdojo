---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-critical-flows-sample-140-20261126t063249z-7315152f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-critical-flows-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-critical-flows-sample-140/T-KATA-REVIEW-ALL-sysd-critical-flows-sample-140-20261126T063249Z-7315152f/plan.md
  started_at: "2026-11-26T06:33:00.650Z"
  completed_at: "2026-11-26T06:41:21.158Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-critical-flows-sample
    - specdojo:sysd-critical-flows-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample に書かれた事実の主張を `ifx-cmd-sample.yaml`、`ifx-cmd.schema.yaml`、`clis-sample.md`、`prj-overview-sample.md`、`stsd-sample.md`、`sysd-index-sample.md`、rulebook、template と突き合わせた。誤りは見つからず、sample は変更していない（`changes` は空）。
- 展開された F001（「検証への引渡し」表の確認状況・不足の解消先の列）と F002（「照合待ち」の定義）は、前の段の直しで解消していた。
- 確かめた主張は、`type: architecture`、最大 5 件、自動再送しない、受付照合による回復、`execution` と `error_handling` のキー、印字の再試行条件、重複排除なしなどで、すべて正本と一致した。確かめられなかった主張は架空の参照名で、共通サンプル文脈とも食い違わないため確かめの対象外とした。
- 設計索引の扱いと印字確認の担当者の用語に、R5 へ回す食い違いが 2 件ある。どちらの文書を正とするかは決められなかったので直していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 1. 概要、5.1. 正本と変更影響（設計索引の参照） | 設計索引の sample（`specdojo:sysd-index-sample`）は同梱されているが、本 sample は `kinuya-sysd-index` を「未同梱の架空参照名」としている。逆に `sysd-index-sample.md` の 75 行は、重要フローの文書 `kinuya-sysd-critical-flows` を「未作成」としている。 | R5 で、本 sample の参照を [[specdojo:sysd-index-sample\|システム設計索引]] に替えるか、設計索引側の「未作成」を直すかを決める。 | 突き合わせ先は `docs/ja/specdojo/samples/sysd-index-sample.md` の 1〜20 行と 75 行。どちらを正とするかは R4 では決められなかった。 | 要判断 |
| R4-2 | R4 | 3.2. 確定後のレシート保存と印字回復 | 印字の失敗時に紙面を確かめる人を、`ifx-cmd-sample.yaml` は「店頭利用者」、本 sample は「店番担当」と書いている。 | R5 で用語集と照らし、どちらにそろえるかを決める。 | 用語の食い違い。 | 要判断 |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R4-1: R4 / 1. 概要（設計索引・状態用語の定義先）、5.1. 正本と変更影響 / 設計索引の sample（specdojo:sysd-index-sample）は同梱されているが、本 sample は `kinuya-sysd-index` を「未同梱の架空参照名」としている。逆に sysd-index-sample.md の 75 行は重要フローの文書 `kinuya-sysd-critical-flows` を「未作成」としている / - / 突き合わせ先は docs/ja/specdojo/samples/sysd-index-sample.md の 1〜20 行と 75 行。R5（`vp-qe-kata-conformance`、kata 相互）で、本 sample の参照を [[specdojo:sysd-index-sample|システム設計索引]] に替えるか、設計索引側の「未作成」を直すかを決める。どちらの文書を正とするかを決められなかったので直さなかった / 要判断
- R4-2: R4 / 確かめの表 / 次の主張を正本と突き合わせ、すべて一致した。type: architecture（rulebook の `deliverable_type`）、最大 5 件（rulebook の全体方針）、自動再送しない（clis-sample.md 124 行）、受付照合での回復と再送の条件（clis-sample.md 110・116 行）、ファイル削除や確定前の取消をしない（clis-sample.md 109 行）、印字の失敗で会計を維持して保存済みレシートだけ再印刷する（clis-sample.md 111 行、ifx-cmd-sample.yaml の idempotency）、exit 0 と対象取引の報告による印字完了の判定、送信前のビジー（`transient_failure`）に限った再試行（`error_handling.retry.on_categories`）、重複排除なし（idempotency.guaranteed: false）、報告の不正やタイムアウトは結果不明で自動再印刷しない（`malformed_output_action`、`timeout_action`）、execution と `error_handling` のキー（ifx-cmd.schema.yaml 224・264 行）、USB の同期印字（ifx-cmd-sample.yaml の ASSUMPTION）、「まず記録する」（prj-overview-sample.md 42 行）、schema の参照名（clis-sample.md 62・77・78 行）、`kinuya-stsd-sale` は未同梱（stsd-sample.md は商品の状態だけを扱う） / - / `vp-arc-technical-constraints`、`vp-qe-verifiability` / -
- R4-3: R4 / 確かめの表（確かめられない主張） / `ifx-api-kinuya-sales.yaml`、`kinuya-opr-sale-reconciliation`、`kinuya-opr-reprint`、`KIN-DEC-01`・`KIN-DEC-02` は架空の参照名で、本文も未同梱と明記している。正本がなく、共通サンプル文脈とも食い違わないため、確かめの対象外とした / - / R4 の plan（正本のない仮定は確かめの対象にしない） / -
- R4-4: R4 / 展開された grade の finding / F001（「検証への引渡し」の確認状況・不足の解消先の列）と F002（「照合待ち」の定義が本部受付後の保存未完了を含む）は、前の段の直しで解消している。表の 5 行すべてに所在・網羅・実施状況・解消先があり、概要 20 行の定義は itc-kinuya-cf-03 と合う / - / `vp-qe-kata-conformance`、`vp-ux-language-consistency` / -
- R4-5: R4 / 3.2. 確定後のレシート保存と印字回復 / 印字の失敗時に紙面を確かめる人を、ifx-cmd-sample.yaml は「店頭利用者」、本 sample は「店番担当」と書いている / - / 用語の食い違いなので R5 で用語集と照らし、どちらにそろえるかを決める / 要判断
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/sysd-critical-flows-sample.md`（このタスクではどのファイルも変更していない（git status は runner 管理の pipeline-state.json だけ）。Prettier の適用条件（変更した md/ts/js/json/yaml がある）を満たさない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実（コマンド、キー、既定値、挙動、参照名）を schema、関連 sample、rulebook、template と照合した。誤りがなかったため記述は維持し、sample は編集していない。正本のない架空参照名（`ifx-api-kinuya-sales.yaml`、`kinuya-opr-sale-reconciliation`、`kinuya-opr-reprint`、`KIN-DEC-01`、`KIN-DEC-02`）は、plan の方針どおり確かめの対象外とした。F001・F002 は前の段で解消済みと確認した。設計索引の扱いと用語の 2 件は、正本を決める根拠が不足するため推測で直さず、R5 へ申し送った。
