---
specdojo:
  id: prj-0001:pjr-wytx-kata-slim-sample-template
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-slim-3
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-17T23:20:25Z"
  due_on: "2026-11-30"
  depends_on:
    - PJR-DJZD
---

# PJR-WYTX 全ての sample と template から文書の運用の記述と言い直しを外し、簡潔にする

## 1. 概要

PJR-DJZD で直した rulebook に合わせ、残りの sample と全ての template を kata-slim と同じ一覧で簡潔にする

## 2. 入力

- 利用者の要望（2026-11-18）: rulebook と recipe の見直しの後、全ての sample と template も見直す epic を起票して schedule で実行したい
- 利用者の決定（2026-11-18、orchestrator の推奨の案）: PJR-DJZD の後に流す。template は手本がないため、先に prj-charter の template で試行して一覧を作ってから schedule に入れる。対象の型の線引きは PJR-DJZD と同じ。schedule の track は kata-slim-3

## 3. 範囲（track と domain）

- track: `kata-slim-3`。対象の domain: `kata`（PJR-6998 の決定）。
- 対象の sample: これまでの波（第 1・2 波、業務仕様の型、プロジェクトの型）で中身を整えた 33 種類の sample。そのうち needs-work が残る bes の sample と cpd の sample（78 点）を含む。
- 対象の template: 全ての型の template。
- 対象外: 第 3〜6 波（PJR-ABY4・PJR-HJ3H・PJR-JZ2F・PJR-PYS2・PJR-SBGQ・PJR-G1M8）で sample を書き直す型の sample、PJR-CPA8 の型、非推奨の型（利用者の承認、2026-11-21）。
- br と sld の rulebook の needs-work は、この track の対象の rulebook ではないため、別の子の todo で扱う。

## 4. 完了の判断の基準

- 対象の sample と template が、kata-slim と同じ一覧で簡潔になり、人の確定まで終わっている。
- 対象の sample を `grade run --target kata` で評価し、pass になっている。pass にならないものは、理由と残す判断を対応結果に書いている。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
