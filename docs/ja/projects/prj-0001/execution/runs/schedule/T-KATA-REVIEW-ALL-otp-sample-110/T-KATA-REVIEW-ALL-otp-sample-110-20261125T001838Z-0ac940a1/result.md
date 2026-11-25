---
specdojo:
  id: prj-0001:xer-t-kata-review-all-otp-sample-110-20261125t001838z-0ac940a1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-otp-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-otp-sample-110/T-KATA-REVIEW-ALL-otp-sample-110-20261125T001838Z-0ac940a1/plan.md
  started_at: "2026-11-25T00:18:49.172Z"
  completed_at: "2026-11-25T00:31:26.290Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-sample
    - specdojo:otp-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）のレビューを `docs/ja/specdojo/samples/otp-sample.md` に対して行った。足すべき内容はなく、`otp-index` の共通方針の値を書き写していた 2 か所を参照に置き換えた。
- 指摘は 4 件。R1-1 と R1-2 は sample を直した。R1-3 は対象固有の内容として維持し、要判断とした。R1-4 は R5 へ申し送った。
- executor の検証では prettier と markdownlint が成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。その他の runner 検査は変更種別により `not_applicable` である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-sample.md`: 1. 概要（hypercare）で、ハイパーケア期間の値（並行記録の 1 週間と正本切替から 2 週間）の書き写しを「`otp-index` に従う」に置き換えた。2. 監視/アラートの冒頭文で、`otp-index` の監視対象 5 つの括弧書きを削り、「`otp-index` の監視対象はそのまま使う。」とした。変更は 2 行の差し替えのみである。

## 3. 申し送り

- R1-3 は「要判断」である。問合せ記録の記入項目の表と当番表の記入例の表は rulebook の要件より多い。ただし対象（`otp-hypercare`）が当番と問合せ記録そのものなので残した。選ばなかった案は、完成例を最小にするために 2 つの表を削ること。
- R1-4 は R5 へ申し送る。10. 移行完了後のクローズ条件の前置きは「各条件を本書の記録のどこで測るか」を示すとしている。しかし `otp-index` の「記録が営業日の 90% 以上で続いている」の条件が表にない。直す案は、前置きを「本書の記録で測る条件」に限定するか、行を足して測定方法を日次締め記録とするか。
- R1-1: R1 / 1. 概要（hypercare） / ハイパーケアの期間の値（並行記録の 1 週間と正本切替から 2 週間）を書き写しており、rulebook の「`otp-index` の共通方針に従う項目は値を再掲しない」に反する / 括弧内を「`otp-index` に従う」に直した / `vp-qe-kata-conformance`（otp-rulebook の本文要件と禁止事項「`otp-index` の共通方針を再掲する」） / -
- R1-2: R1 / 2. 監視/アラート / 冒頭の文で `otp-index` の監視対象 5 つを括弧で書き並べており、共通方針の再掲になっている / 括弧を消し「`otp-index` の監視対象はそのまま使う。」とした / `vp-qe-kata-conformance`（otp-rulebook の禁止事項）、`vp-arc-single-responsibility` / -
- R1-3: R1 / 6. 問合せ窓口/一次対応、8. 初期増員体制（期間・当番・SLA） / 問合せ記録の記入項目の表と当番表の記入例の表は rulebook の要件より多い / - / `vp-po-purpose-alignment`。この sample の対象（`otp-hypercare`）は当番と問合せ記録そのものなので、対象固有の内容として残した。選ばなかった案は、完成例を最小にするために 2 つの表を削ること / 要判断
- R1-4: R1 / 10. 移行完了後のクローズ条件 / 前置きは「各条件を本書の記録のどこで測るか」を示すとしているが、`otp-index` の「記録が営業日の 90% 以上で続いている」の条件が表にない / - / 食い違いの扱いなので R5（`vp-qe-kata-conformance` の kata 相互）へ申し送る。直す案は、前置きを「本書の記録で測る条件」に限定するか、行を足して測定方法を日次締め記録とするか / -

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、対象 sample を otp-rulebook の本文要件と禁止事項（`otp-index` の共通方針を再掲しない）に照らして確かめた。判断の根拠は `vp-qe-kata-conformance`、`vp-arc-single-responsibility`、`vp-po-purpose-alignment` である。grade と condense の finding は plan に展開されていなかった。値の再掲だった 2 か所は参照に直し、それ以外の記述は維持した。迷った 1 件は「要判断」とし、1 件は R5 に回した。rulebook など sample 以外は変更していない。
