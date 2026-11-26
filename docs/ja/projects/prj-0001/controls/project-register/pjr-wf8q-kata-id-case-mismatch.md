---
specdojo:
  id: prj-0001:pjr-wf8q-kata-id-case-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-26T12:39:02Z"
  due_on: "2026-11-30"
---

# PJR-WF8Q 型の ID 表記の食い違いを直す（rulebook の大文字と schema の小文字、imp 系 sample の古い ID）

## 1. 概要

imp 系 rulebook が based_on に大文字の PJR-XXXX を求め schema と食い違う。rulebook を小文字の形にそろえ、4 つの sample の古い ID cr-2026-004 を pjr-c4a1 に直す。

sample も、imp-data だけが直してある（`based_on` は `pjr-c4a1`、本文は `PJR-C4A1`）。imp-business・imp-interface・imp-test・imp-operations の 4 つは、古い ID の `cr-2026-004` のままである。

方針は、schema を変えず、rulebook を schema に合わせる（indie の判断、2026-11-26）。schema の大文字を許す案は、他の規範との整合が取れないため採らない。

## 2. 入力

- T-KATA-REVIEW-ALL-imp-interface-sample-140 で lint-fm-changed が `based_on` の大文字の PJR-C4A1 で落ちた（2026-11-26）
- imp-business・imp-test・imp-operations の sample が cr-2026-004 を参照している
- 担当 DEV・期限 2026-11-30 は indie の指示（2026-11-26）

## 3. 完了条件

- 5 つの imp 系 rulebook（imp-business・imp-data・imp-interface・imp-test・imp-operations）の Frontmatter の説明で、`based_on` には変更要求の個票 ID を小文字（`pjr-xxxx`）で書くと明記している。
  - 本文の記載では `PJR-XXXX` と書くこと、転記先の登録項目 ID の書き方（`PJR-XXXX`）は変えないことも書いている。
  - imp-business と imp-test の「変更要求 ID」「変更要求」の書き方を、ほかの 3 つと同じ「変更要求の個票 ID」にそろえている。
- 4 つの sample（imp-business・imp-interface・imp-test・imp-operations）の `cr-2026-004` を、imp-data と同じ形に直している。
  - `based_on` は `pjr-c4a1`、本文は `PJR-C4A1` とする。
  - `docs/ja/specdojo/samples/` に `cr-2026-004` が残っていないことを grep で確かめている。
- schema と template（`dct-impact-analysis-template.yaml` を含む）は変えていない。変える必要が見つかった場合は、案を個票の対応結果に書いて止まる。
- 次の検査が通る。
  - `npm run lint:fm`（5 つの sample を含む）
  - `npm run -s lint:md`
  - 変更したファイルへの `npm run validate:history-links`
- rulebook と sample の変更は、上の箇所だけにとどめている。ほかの章は書き換えていない。
- 個票の対応結果に、変更したファイルと、grep と検査の結果を書いている。

## 4. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ                         |
| --- | ----------------------------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | 5 つの imp 系 rulebook の `based_on` の説明を小文字の形にそろえる | DEV  | open | 本文の `PJR-XXXX` は変えない |
| 2   | 4 つの sample の `cr-2026-004` を `pjr-c4a1`・`PJR-C4A1` に直す   | DEV  | open | imp-data と同じ形            |
| 3   | grep と検査を流し、対応結果に書く                                 | DEV  | open | -                            |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
