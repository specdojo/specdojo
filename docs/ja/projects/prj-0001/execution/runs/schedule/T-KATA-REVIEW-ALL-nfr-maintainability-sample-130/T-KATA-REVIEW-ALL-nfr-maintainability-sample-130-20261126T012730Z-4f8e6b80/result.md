---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-maintainability-sample-130-20261126t012730z-4f8e6b80
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-maintainability-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-maintainability-sample-130/T-KATA-REVIEW-ALL-nfr-maintainability-sample-130-20261126T012730Z-4f8e6b80/plan.md
  started_at: "2026-11-26T01:27:41.315Z"
  completed_at: "2026-11-26T01:35:37.180Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-maintainability-sample
    - specdojo:nfr-maintainability-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、保守性要件の完成例 `nfr-maintainability-sample` の概要の文を直した。主語を明示し、長い文を 2 文に分け、指示語「これ」を具体的な主語に置き換えた。
- grade の F002 に対応し、`nfr-mnt-001` の原因の範囲の「通信」を rulebook の用語定義に合わせて「外部」に直した。
- grade の F001 は、今の版で `nfr-mnt-004` にすでに閾値が入っていたため解消済みと判断し、変更しなかった。この指摘は R1・R5 の観点で、R3 の対象外でもある。未決が残るのは `nfr-mnt-003` だけである。
- 整形、`markdownlint-cli2`、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` はいずれも通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | 1. 概要（対象・目的） / 冒頭の文 | 冒頭の文が長く、切り分けと切り戻しを終える主語がない。 | 「…続けられるようにする。そのため、…紙の販売控えへ切り替える前に `OPS` と `DEV` が切り分けと切り戻しを終える。」の 2 文に分けた。 | W1、W3（主語は「適用範囲・前提条件」の役割の行に沿わせた） | - |
| R3-2 | R3 | 1. 概要（対象・目的） / 「これは…目的に応えるための要件である」 | 「これ」が指す先が曖昧。 | 「本書の要件は、…という目的に応える。」にした。 | W4、W2 | - |
| R3-3 | R3 | 3. 保守性要件一覧 / `nfr-mnt-001` | 原因の範囲「アプリ・データ・端末・通信」が rulebook の用語定義「アプリ・データ・端末・外部」とずれている（grade F002）。 | 「通信」を「外部」に直した。 | `vp-ux-language-consistency`、W8 | - |
| R3-4 | R3 | 3. 保守性要件一覧 / `nfr-mnt-004`（grade F001） | `nfr-mnt-004` が `_UNDECIDED_` という指摘は、今の版ですでに閾値が入っており解消済み。未決は `nfr-mnt-003` だけである。 | - | `vp-qe-kata-conformance`（R1・R5 の観点で R3 の対象外。再評価で解消を確かめる） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-maintainability-sample.md`: 概要の冒頭の長い文を 2 文に分け、`OPS` と `DEV` が切り分けと切り戻しを終えるという主語を明示した。「これは…要件である」の指示語を「本書の要件は…に応える」に置き換えた。`nfr-mnt-001` の原因の範囲を「アプリ・データ・端末・通信」から「アプリ・データ・端末・外部」に直し、rulebook の用語に合わせた。差分は 2 行の追加と 2 行の削除である。

## 3. 申し送り

- F001 は再評価で解消を確かめる必要がある。`nfr-mnt-003` に未決が残っているため、rulebook の「中核の要件は未決に回さない」との整合も併せて確認する。
- R3-1: R3 / 1. 概要（対象・目的） / 冒頭の文が長く、切り分けと切り戻しを終える主語がない / 「…続けられるようにする。そのため、…紙の販売控えへ切り替える前に `OPS` と `DEV` が切り分けと切り戻しを終える。」の 2 文に分けた / W1、W3（主語は「適用範囲・前提条件」の役割の行に沿わせた） / -
- R3-2: R3 / 1. 概要（対象・目的） / 「これは…目的に応えるための要件である」の「これ」が指す先が曖昧 / 「本書の要件は、…という目的に応える。」にした / W4、W2 / -
- R3-3: R3 / 3. 保守性要件一覧 / `nfr-mnt-001` の原因の範囲「アプリ・データ・端末・通信」が rulebook の用語定義「アプリ・データ・端末・外部」とずれている（grade F002） / 「通信」を「外部」に直した / `vp-ux-language-consistency`、W8 / -
- R3-4: R3 / 3. 保守性要件一覧 / grade F001（`nfr-mnt-004` が `_UNDECIDED_`）は今の版ですでに閾値が入っており解消済み。未決は `nfr-mnt-003` だけ / - / `vp-qe-kata-conformance`（R1・R5 の観点で R3 の対象外。再評価で解消を確かめる） / -
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票は変えていないため）

## 4. 進め方と実践の型の適用

grade の finding F001 と F002 を修正要件として読み、W1〜W4 と W8 のチェック項目、および `vp-ux-language-consistency` に照らして文を直した。F002 は rulebook の用語定義（アプリ・データ・端末・外部）を正として「通信」を「外部」にそろえた。F001 は現行版で閾値が入っており解消済みだった。観点も R3 の対象外のため、sample は変えず、再評価での確認に回した。意味と判断に要る背景・例外・制約は変えていない。
