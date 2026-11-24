---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-index-sample-130-20261124t220137z-a9504062
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-index-sample-130/T-KATA-REVIEW-ALL-atc-index-sample-130-20261124T220137Z-a9504062/plan.md
  started_at: "2026-11-24T22:01:47.068Z"
  completed_at: "2026-11-24T22:12:56.454Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-index-sample
    - specdojo:atc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `atc-index-sample.md` に文の直しを入れた。F003（家族利用者代表の Role code 追記）、TSP・ST の初出の正式名の追記、合格基準と判定の流れの主語の明示を行った。
- F001（`vp-qe-omissions-consistency`）と F002（`vp-qe-kata-conformance`）は R3 の観点ではない。executor の報告では、読んだ版ですでに解消していたため、R3 では扱っていない。
- executor が実行した整形と markdownlint は成功した。runner 実行の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-index-sample.md`: 読みやすさの観点で11行を直した。関係者の表の家族利用者代表を「家族利用者代表（UX）」に直して Role code を揃えた（F003）。TSP と ST は初出に正式名を足した。合格基準では、BA が Fail のケースと同じ `atc-&lt;term&gt;` の P0 全件を再試験し、その後に PO が再判定すると主語を明示した。判定の流れでは、nickname を判定の記録に残す主語として「PO は」を足した。意味や判断に要る背景・例外・制約は変えていない。

## 3. 申し送り

- R3-1 は「要判断」。F003 は `PO` 業務助言を勧めていたが、`pm-members-sample.yaml` では `family-user-representative` の roles が `[UX]` だった。`PO` 業務助言は Role code ではないため、「家族利用者代表（UX）」を採った。この判断の確認が必要。
- R3-6 は「要判断」。対象外・除外理由（共通）の表のセルにある UT・IT・ET・NFR には正式名がない。正式名を足すとセルが長くなる。この系列の sample も略語を正式名なしで使っている。テスト系列の用語集に合わせて直すかは R5 で決める。
- `ifx-file-sample.md` の「家族利用者代表（`PO` 業務助言）」は、`pm-members-sample.yaml` の roles `[UX]` と食い違う。直すかは R5 か別タスクで決める。
- R3-1: R3 / 本ドキュメントの目的と適用対象（関係者の表） / 家族利用者代表の行だけ Role code がなく、列見出し「関係者（Role code）」と表記が揃わない（F003） / 「家族利用者代表（UX）」にした / `vp-ux-language-consistency`、F003。迷った理由: F003 は `ifx-file-sample` に合わせて `PO` 業務助言を勧めていたが、名簿の正本 `pm-members-sample.yaml` では `family-user-representative` の roles が `[UX]` であり、`PO` 業務助言は Role code ではないため採らなかった / 要判断
- R3-2: R3 / 本ドキュメントの目的と適用対象 / TSP が正式名なしで本文に繰り返し出る / 初出の wikilink の後に「（TSP）」を足した / W8 / -
- R3-3: R3 / 本ドキュメントの目的と適用対象 / ST が正式名なしで本文に繰り返し出る / 初出を「総合テスト（ST）」にした / W8 / -
- R3-4: R3 / 合格基準 / 修正版の再試験と再判定を誰が行うかが書かれておらず、「Fail のケースと、同じ…」の係りも読み違えやすい / 「BA が Fail のケースに加えて同じ `atc-&lt;term&gt;` の P0 全件を再試験し、その後に PO が再判定する」にした / W1、W5 / -
- R3-5: R3 / 判定の流れ / nickname を判定の記録に残す主語が書かれていない / 文頭に「PO は」を足した / W1 / -
- R3-6: R3 / 対象外・除外理由（共通） / 表のセルの UT・IT・ET・NFR に正式名がない / - / W8。迷った理由: 正式名を足すとセルが長くなり、この系列の sample でも略語を正式名なしで使っている。テスト系列の用語集に合わせて直すかは R5 で決める / 要判断
- 参考: F001（`vp-qe-omissions-consistency`）と F002（`vp-qe-kata-conformance`）は R3 の観点ではなく、読んだ版ではすでに解消していた（`取引照合の保証` の主に立てる term は `atc-sale-hold` だけ、分配表の観点名は `主要操作の自力完了の成立`）。R3 では扱っていない。
- 相手側の文書: `ifx-file-sample.md` の「家族利用者代表（`PO` 業務助言）」は `pm-members-sample.yaml` の roles `[UX]` と食い違う。直すかは R5 か別タスクで決める。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

plan の sample-maintenance に沿い、R3（読みやすさ）に当たる指摘だけを扱った。F003 は規範を確認して Role code を追記した。名簿の正本と食い違う `PO` 業務助言は採らず、`UX` にして要判断とした。F001 と F002 は読んだ版で解消済みと確認し、改訂していない。W1・W5・W8 に当たる文の直しを加えた。意味と判断に要る背景は維持した。未解消の指摘はなく、迷った 2 件（R3-1、R3-6）は handoff に残した。
