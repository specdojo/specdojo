---
specdojo:
  id: prj-0001:pjr-960c-project-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: project-kata
  domains:
    - project-management
    - project-definition
  item_status: open
  priority: medium
  owner: PM
  registered_at: "2026-11-12T15:35:10Z"
  derived_from:
    - PJR-T88P
---

# PJR-960C プロジェクトの型（pm-plan など 7 種類）を標準の章立てと厚さに整える

## 1. 概要

代表の文書があるプロジェクトの型 7 種類を、代表を手本に rulebook と sample を磨き込み、grade で pass にする

## 2. 入力

- indie の優先順の 3 番目（2026-11-12 承認）。今晩の業務仕様の型（PJR-ERR7）が順調なら、昼も同じ流れで続ける（indie の依頼、2026-11-13）
- 代表が登録簿から生成される一覧の型（pm-risk-register・pm-issue-log・pm-change-request-log・pjr）は、生成の処理に関わるため外す。gl は用語集の確定の後に足す

## 3. 範囲（track と domain）

- track `project-kata`。対象は、代表の文書があるプロジェクトの型 7 種類（pm-plan・pm-organization・pm-roles・pm-raci・pm-quality-management-plan・prj-assumptions-constraints-dependencies・prj-comparison-of-alternatives）。代表は prj-0001 の同名の文書。
- schedule は、rulebook の見直し（040）→ sample の手直し（050）→ agent の review（090）→ 人の確定（140）。intent は `improve-kata`（`kata_target: rulebook`）。sample の段は PJR-ERR7 にならって足した。
- 対象外: 代表が登録簿から生成される一覧の型（pm-risk-register・pm-issue-log・pm-change-request-log・pjr）は生成の処理に関わるため別に扱う。gl は用語集の確定（PJR-6XQ4）の後に足す。代表の文書そのものは変えない。

## 4. 完了の判断の基準

- 7 種類の rulebook と sample が grade で pass になり、確定（`-140`）で人が確かめている。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
