---
specdojo:
  id: prj-0001:pjr-ksgc-changelog-handoff-playbook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T04:04:24Z"
  derived_from:
    - PJR-EPQ3
---

# PJR-KSGC 運用メモの完了条件とリリースの手順を、CHANGELOG を個票の申し送りからまとめる形に直す

## 1. 概要

PJR-EPQ3 の決定に合わせ、運用メモの完了条件の書き方・衝突の対処・リリースの手順を直し、配布するオーケストレーターの本文の変更案を作る

## 2. 入力

- PJR-EPQ3（indie が決定、2026-11-08）: 各項目は CHANGELOG.md を変えず、個票の対応結果の「### CHANGELOG に書く事項」に区分と文案を書く。リリースの todo が close 済みの項目から集める。
- .agents/specdojo-orchestrator.agent.md は保護された設定で、4 つの環境の薄いラッパーと本文をそろえて保守している。executor は変更案を個票の対応結果と報告の handoff に書き、反映は利用者の承認のもと feature ブランチで行う。

## 3. 完了条件

- [[prj-0001:pm-orchestrator-playbook]] に、次を書いている。
  - 登録簿項目の完了条件では「CHANGELOG.md は変えず、個票の対応結果の `### CHANGELOG に書く事項` に区分と文案を書く。影響がなければ『なし』と書く」と指示する。
  - リリースの手順に、前のリリースの後に close した項目の個票からこの節を集め、CHANGELOG の版の節を書く段を足している。集める範囲の決め方（前のリリースの日時と close の記録）と、漏れを確かめる方法を書いている。
  - 並べて流す列の注意や、止まったときの対処の表にある CHANGELOG の衝突の記述を、新しいやり方に合わせて直している。新しいやり方の前に書かれた行が残る間の扱いも書いている。
- 配布するオーケストレーターの本文（`.agents/specdojo-orchestrator.agent.md` の「完了条件の書き方」と「止まったときの対処」）の変更案を、個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`.github/agents/` などの保護された設定は executor が変えない。
- CHANGELOG.md の既存の行は変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の `### CHANGELOG に書く事項` の節に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                                         | 担当   | 状態 | メモ |
| --- | ------------------------------------------------------------ | ------ | ---- | ---- |
| 1   | 運用メモの完了条件の書き方・衝突の対処・リリースの手順を直す | _TODO_ | open | -    |
| 2   | オーケストレーターの本文の変更案を書く                       | _TODO_ | open | -    |
| 3   | 検査を流し、対応結果に書く                                   | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-epq3-changelog-from-register-handoff]]
- 運用メモ: [[prj-0001:pm-orchestrator-playbook]]
