---
specdojo:
  id: prj-0001:pjr-cpa8-generated-list-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: generated-list-kata
  item_status: open
  priority: low
  registered_at: "2026-11-16T13:46:50Z"
---

# PJR-CPA8 登録簿と計画から生成する一覧の型を整える

## 1. 概要

登録簿や計画から生成する一覧の型 7 種類（pjr・pm-issue-log・pm-change-request-log・pm-risk-register・sch・tml・dct）を、生成の処理と合わせて整える

## 2. 入力

- 対象は pjr・pm-issue-log・pm-change-request-log・pm-risk-register・sch・tml・dct の 7 種類。grade は pm-risk-register が fail、ほかは needs-work
- 代表は登録簿・schedule・カタログから生成されるため、型を変えると生成の処理（コード）も変わる。PJR-960C ではこの理由で対象から外していた
- ほかの波と並行してよい（利用者が 2026-11-16 に承認）
- 2026-11-16 の grade（--target kata）で rulebook 112 種類のうち pass 63・needs-work 47・fail 1。進行中の型の epic（APA2・DD33・T88P・ERR7・960C・2GD6）は人の確定（140）で止まっている

## 3. 範囲（track と domain）

_TODO_: Frontmatter の `track` が担う範囲と対象 domain、対象外の境界を記載する。

## 4. 完了の判断の基準

- _TODO_: 子項目と schedule を確認して、人が完了を判断できる基準を記載する。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
