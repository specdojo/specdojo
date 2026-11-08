---
specdojo:
  id: prj-0001:pjr-2gd6-business-specs-reps
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: business-specs-reps
  domains:
    - data-model
    - business-model
    - system-functions
    - user-interface-model
    - external-interface-specs
  item_status: open
  priority: medium
  registered_at: "2026-11-08T00:29:22Z"
  derived_from:
    - PJR-3APD
---

# PJR-2GD6 業務仕様の種類ごとに代表の文書を 1 件ずつ作る

## 1. 概要

業務仕様（データモデル・業務モデル・システム化機能・画面・外部 I/F）の種類ごとに代表の文書を 1 件ずつ、schedule で作成・磨き込み・condense・review・確定まで進める。実装と重なる種類は、型の手入れで schema・型・リファレンスの参照に寄せてから作る

## 2. 入力

- 利用者の方針: stsd をすべて作るのではなく、業務仕様の文書を種類別に代表の文書を一通り作る。schedule で実行する（2026-11-08、indie が決定）。
- 各代表は作成・磨き込み（fully-guided）・condense・agent の review・確定（人）まで進める（案 B と review の段を残す、indie が決定）。
- 代表: bdd-register-entry・ccd-project-planning・cdt-register-type（旧 cld）・br-task-selection-strategy・bes-task-ready-selected と、カタログに足す sf・uis・ifx の各 1 件。
- 実装と同じことを 2 回書かない: bdd は schema を正として参照し、ccd は属性を主キーだけにして関連に絞る。cdt・ifx-cmd・sf も参照に寄せる（indie が決定）。br・bps の分け方は PJR-FQZ5 で決め、決まるまでは今の型のまま作る。
- 分類一覧の略号は ccd と紛れるため cld から cdt に変える（indie が決定）。
- schedule の --auto --parallel は PJR-HQVE を直してから使う（indie が決定）。

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
