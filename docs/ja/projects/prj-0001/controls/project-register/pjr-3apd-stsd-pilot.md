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
    - PJR-0MR5
    - PJR-SJBV
---

# PJR-3APD 業務仕様の量産の流れをステータス定義（stsd）で試す

## 1. 概要

カタログの見直し → draft → 磨き込み → condense → 手入れか作り直しかの判断（人）→ Kata の手入れまたは bootstrap → Kata の確定（人）→ retrofit → 磨き込み → condense → review → 確定の流れを、ステータス定義（stsd、5 件）で 1 回通し、残りの業務仕様の epic に使えるかを確かめる

## 2. 入力

- 利用者の方針: cdfd ができたので、以降の業務仕様は現行の実装をベースに記述する。複数の epic を起票して順に実行する。Kata（rulebook・recipe など）が十分でないため、1 つ作って Kata を磨き込み、同じ種類の文書を一気に作る。いきなり bootstrap より draft を先に入れる（2026-11-04）
- 業務仕様の epic の順の案: 用語集（1）→ データモデル（bdd・cdsd・stsd・cld・ccd、32）→ 業務モデル（bps・br・bes、43）→ システム化機能・画面・外部 I/F（4）。カタログ（`dct-*.yaml`）は概念データフローの再編の前に作ったため、各 epic の最初に CDFD に合わせて見直す（catalog-planning）（2026-11-04）
- 冗長さは PJR-CYG0 の決定（予防・原因の振り分け・condense）で直す。condense は書き足しの最後の edit の後、review の前に置く。draft の直後は内容が発散しているため置かない（2026-11-04）
- 流れの各段: (1) カタログの見直し、(2) draft で代表の 1 件、(3) 磨き込み（fully-guided）、(4) condense、(5) 人が手入れか作り直しかを判断、(6) 手入れなら `*-maintenance`、作り直しなら Kata を消して bootstrap、(7) Kata の確定（人、ゲート）、(8) retrofit で残り 4 件を並列に作成、(9) 磨き込み、(10) condense、(11) review、(12) 確定（2026-11-04）
- 作り直しを選ぶ目安: 章立ての変更（章の追加・削除・分割）が半分を超える、図の表記を変える（Mermaid から D2 へ）、rulebook の規則の半分ほどが実物に合わず書き直しになる。どれにも当たらなければ手入れとする。register の bootstrap は rulebook が既にあると止まるため、作り直しでは先に Kata を消す。消すのは利用者の承認のもと feature ブランチで行う（2026-11-04）
- stsd の Kata は rulebook・図の rulebook（Mermaid）・recipe・sample・template がそろい、grade は 92〜100 点。grade は書き方の規範への適合だけを見るため、出来は代表の 1 件で判断する。prj-0001 に stsd の成果物はまだない（2026-11-04）

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
