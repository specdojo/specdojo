---
specdojo:
  id: prj-0001:pjr-3apd-stsd-pilot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: stsd-pilot
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-03T23:51:57Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-CYG0
  depends_on:
    - PJR-1BRQ
---

# PJR-3APD 業務仕様の量産の流れをステータス定義（stsd）で試す

## 1. 概要

draft → editorial-review → Kata の手入れ → Kata の確定（人）→ retrofit → editorial-review → 磨き込みの流れを、ステータス定義（stsd、5 件）で 1 回通し、残りの業務仕様の epic に使えるかを確かめる

## 2. 入力

- 利用者の方針: cdfd ができたので、以降の業務仕様は現行の実装をベースに記述する。複数の epic を起票して順に実行する。Kata（rulebook・recipe など）が十分でないため、1 つ作って Kata を磨き込み、同じ種類の文書を一気に作る。いきなり bootstrap より draft を先に入れる。冗長な記述は editorial-review で抜き出し、Kata が原因のものは Kata の手入れに回す（2026-11-04）
- 業務仕様の epic の順の案: 用語集（1）→ データモデル（bdd・cdsd・stsd・cld・ccd、32）→ 業務モデル（bps・br・bes、43）→ システム化機能・画面・外部 I/F（4）。カタログ（`dct-*.yaml`）は概念データフローの再編の前に作ったため、各 epic の最初に CDFD に合わせて見直す（catalog-planning）（2026-11-04）
- 流れの各段: (1) draft で代表の成果物を 1 つ、(2) editorial-review、(3) `*-maintenance` で Kata が原因の指摘を反映、(4) Kata の確定（人、ゲート）、(5) retrofit で残りを実装から並列に作成、(6) editorial-review、(7) fully-guided でこの文書だけの指摘を反映。Kata が原因の指摘がたまれば (3) へ戻す（2026-11-04）

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
