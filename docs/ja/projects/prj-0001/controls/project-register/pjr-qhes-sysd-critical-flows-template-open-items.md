---
specdojo:
  id: prj-0001:pjr-qhes-sysd-critical-flows-template-open-items
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
  registered_at: "2026-11-22T23:35:35Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-325Y
  commit_type: docs
  commit_scope: kata
---

# PJR-QHES sysd-critical-flows-template の未決事項の表に当面の扱いと影響の列を足す

## 1. 概要

PJR-325Y の後の grade で、未決事項と後続作業の表に rulebook が省略を禁じる当面の扱いと影響の列がないことが major になった。minor 3 件とあわせて template を直す

## 2. 入力

- 2026-11-22 の grade（opus-review-executor）で sysd-critical-flows-template は needs-work 90。major は未決事項の表の列の不足で、325Y の前からある
- 担当 Role code の列を足す指摘は、PJR-76N9 の決まりとぶつかるので採らない（利用者の決定、2026-11-23）

## 3. 完了条件

- `sysd-critical-flows-template` の「未決事項と後続作業」の表に、rulebook が省略を禁じる「受入や運用への影響」と「当面の扱い」の列（または記入の目印）を足す。sample の表と列をそろえる。
- 図の記入指示に、rulebook の「本文要件」が求める「要求の受付と業務の完了を分ける」条件を足す。
- frontmatter の雛形の `part_of` を、所属するシステム設計索引を記入できるプレースホルダにする（`based_on` と同じ書き方）。
- フロー ID を指す列名（「ID」「Flow ID」「フロー」）を 1 つにそろえる。sample と食い違えば、変更案を個票の対応結果に書く。
- 「担当 Role code」の列は足さない（PJR-76N9 の決まりで、成果物に役割の割り当てを書かないため。利用者の決定、2026-11-23、indie）。
- 直すのは template だけとする。rulebook・recipe・sample は変えず、合わせて直すべき点は変更案として個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
