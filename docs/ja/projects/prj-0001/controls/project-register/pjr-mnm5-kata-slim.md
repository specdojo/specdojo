---
specdojo:
  id: prj-0001:pjr-mnm5-kata-slim
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-slim
  item_status: open
  priority: high
  owner: BA
  registered_at: "2026-11-17T14:12:51Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0T83
    - PJR-8S4T
  commit_type: docs
  commit_scope: kata
---

# PJR-MNM5 業務仕様までの型から文書の運用の記述を外し、簡潔にする

## 1. 概要

sld の試行（PJR-8S4T）の一覧で、プロジェクト定義・プロジェクト管理・業務仕様の 18 種類の型の rulebook と sample から運用の記述と同じ判断の言い直しを外す。schedule の track kata-slim で進める

## 2. 入力

- 利用者が 2026-11-17 に、業務仕様までの sample の記述の精度を今晩中に上げたいとして、todo ではなく schedule で進めることを選んだ。担当は BA、期限は 2026-11-30
- PJR-8S4T の試行で、sld-sample は空白を除いた文字数で約 60%、sld-rulebook は約 71% になり、結論は変えなかった。広げるときの「外す記述・残す記述・参照の形」の一覧は 8S4T の対応結果にある
- uis はカタログに代表の成果物がないため、この track に含めていない。代表にする画面を利用者が決めた後に足す

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
