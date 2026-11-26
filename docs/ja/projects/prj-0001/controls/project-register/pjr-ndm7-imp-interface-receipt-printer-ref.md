---
specdojo:
  id: prj-0001:pjr-ndm7-imp-interface-receipt-printer-ref
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-26T21:00:58Z"
  due_on: "2026-11-30"
---

# PJR-NDM7 imp-interface-sample の印字の波及先を ifx-cmd-sample の参照にする

## 1. 概要

型のレビュー T-KATA-REVIEW-ALL-imp-interface-sample-150 の R5-4 で、imp-interface-sample の「影響詳細一覧」の「確定済みレシートの印字」の備考にある波及先 `ifx-cmd-receipt-printer` が、ifx-index-sample に名前のない仮の ID と指摘された。ifx-index-sample は ready の正本のため変えず、本書の波及先を `ifx-cmd-sample` の参照に寄せる（indie の判断、2026-11-26）。

## 2. 入力

- T-KATA-REVIEW-ALL-imp-interface-sample-150 の R5-4 で、波及先 ifx-cmd-receipt-printer が ifx-index-sample にない仮の ID と指摘された（2026-11-26）
- R5-4 は、ready の ifx-index-sample を変えず、本書の波及先を ifx-cmd-sample の参照に寄せる案 (b) にする（indie の判断、2026-11-26）
- R5-1（照会 API 停止時の障害波及を高にした直し）は 150 の直しのまま確定し、追加の作業はしない（indie の判断、2026-11-26）
- 担当 BA・期限 2026-11-30 は indie の指示（2026-11-26）

## 3. 完了条件

- `docs/ja/specdojo/samples/imp-interface-sample.md` の「影響詳細一覧」の「確定済みレシートの印字」の備考から、仮の ID `ifx-cmd-receipt-printer` をなくし、波及先を `[[specdojo:ifx-cmd-sample|...]]` の wikilink で示している。表示名は sample の H1 に合わせる。
- `docs/ja/specdojo/samples/imp-interface-sample.md` に `ifx-cmd-receipt-printer` が残っていないことを grep で確かめている。
- `ifx-index-sample` とほかの sample・rulebook は変えていない。imp-interface-sample の変更は上の箇所だけにとどめている。
- 表の列がずれていない（セル内の `|` を `\|` でエスケープしている）。
- `npm run lint:fm`・`npm run -s lint:md` が通る。
- 個票の対応結果に、変更した箇所と、grep と検査の結果を書いている。

## 4. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                          |
| --- | -------------------------------------------------------- | ---- | ---- | ----------------------------- |
| 1   | 印字の波及先を `ifx-cmd-sample` の wikilink に置き換える | BA   | open | `ifx-index-sample` は変えない |
| 2   | grep と検査を流し、対応結果に書く                        | BA   | open | -                             |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
