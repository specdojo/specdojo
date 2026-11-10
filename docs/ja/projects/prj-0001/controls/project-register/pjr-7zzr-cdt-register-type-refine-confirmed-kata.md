---
specdojo:
  id: prj-0001:pjr-7zzr-cdt-register-type-refine-confirmed-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T13:12:42Z"
  block_reason: "parent validation failed: test-integration"
  derived_from:
    - PJR-2GD6
    - PJR-T88P
  autopilot: approved
  approach: fully-guided
  targets:
    - prj-0001:cdt-register-type
---

# PJR-7ZZR 代表の cdt-register-type を、確定した型で磨き込む

## 1. 概要

business-specs-kata で確定した型（specdojo:cdt-rulebook と sample）に合わせて、代表の cdt-register-type を磨き込み、冗長さを整理する。review は schedule の review の段で流す

## 2. 入力

- 型一式の確定（2026-11-10、indie が決定）の後に、代表を磨き込みから流し直す。schedule の磨き込み・condense の段はゲートで bes・br・clis の段まで巻き戻すことになるため、register の todo で行う（orchestrator の判断、indie に報告）。
- 夜間の register の routine で流す（indie が承認）。review は T-BUSINESS-SPECS-REPS-cdt-register-type-090 を reopen 済みで、6:00 の exec cycle で流す。

## 3. 完了条件

- 代表の [[prj-0001:cdt-register-type]] を、確定した型 [[specdojo:cdt-rulebook]] と [[specdojo:cdt-sample]] に合わせて磨き込んでいる。型の本文要件の章立て・必須の項目・記述ガイドの判断の基準に沿い、型が禁止することを書いていない。
- 冗長さを整理している（判断に要る背景・制約・例外と意味は保ち、新しい内容を足さない）。
- 実装・schema・リファレンスと同じことを書かず、正本を参照する方針（PJR-2GD6）を保っている。
- 決められない点は `_UNDECIDED_` か `_ASSUMPTION_` のまま、理由（どの成果物がない、誰の判断が要る）を書いて残してよい。依存の成果物がないことを理由に未完了としない。
- これまでの review の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 型と、ほかの成果物とカタログを変えていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。

## 4. 作業内容

| No  | 作業                               | 担当   | 状態 | メモ |
| --- | ---------------------------------- | ------ | ---- | ---- |
| 1   | 確定した型と代表の文書を読み比べる | _TODO_ | open | -    |
| 2   | 磨き込みと冗長さの整理を行う       | _TODO_ | open | -    |
| 3   | 検査を流し、対応結果に書く         | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]、[[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[prj-0001:cdt-register-type]]
- 型: [[specdojo:cdt-rulebook]]
