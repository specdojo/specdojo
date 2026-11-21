---
specdojo:
  id: prj-0001:pjr-g1m8-kata-wave-6-project
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-wave-6-project
  domains:
    - kata
  item_status: open
  priority: medium
  registered_at: "2026-11-21T03:04:51Z"
  derived_from:
    - PJR-6998
---

# PJR-G1M8 型の整備 第 6 波（プロジェクトの型の残り）

## 1. 概要

プロジェクトの型の残り 8 種類（prj-charter・prj-issues-and-approach・prj-overview・prj-scope・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria・pm-communication-plan・pm-members）を、sample を代表にして整える

## 2. 入力

- 対象: prj-charter・prj-issues-and-approach・prj-overview・prj-scope・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria・pm-communication-plan・pm-members の 8 種類
- PJR-6998 の決定（2026-11-21、indie）: kata ドメイン（dct-kata.yaml）に sample を成果物として載せ、sample を代表にして型を整える
- 2026-11-21 の洗い直し（tmp の一覧ではなく個票に要点を残す）: これまでの波で rulebook と sample の中身を整えていない 74 種類のうち、第 3〜5 波と PJR-CPA8 に入らない残りをこの epic を含む第 6 波の 3 件に割り振った。rulebook はどれも ready で grade は pass だが、PJR-960C の対象外で中身を整えていない。sample は prj-charter・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria が needs-work（76〜85）。pm-members は sample がない
- 段の組み方: rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定（利用者の承認、2026-11-21）。対象と順番は、2026-11-21 から opus で流している grade（run id regrade-kata-2026-11-21）の結果で見直す

## 3. 範囲（track と domain）

- track: `kata-wave-6-project`。対象の domain: `kata`（`dct-kata.yaml`、PJR-6998 の決定）。
- 対象の型: prj-charter・prj-issues-and-approach・prj-overview・prj-scope・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria・pm-communication-plan・pm-members の 8 種類。
- 代表の文書は、その型の sample（駄菓子屋の共通の文脈）とする。prj-0001 の製品の成果物は作らない。
- 段: rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定。template はこの track では扱わず、PJR-WYTX（kata-slim-3）で扱う。
- 対象外: 上に挙げていない型、非推奨の型。pm-members は sample を作るかを最初の子の todo で決める。
- track の中の順番: grade（2026-11-21、opus）で needs-work・fail の型を先に流し、pass の型を後に流す。先に流した結果を見て、後の型の進め方を直す。
- pass の型の直し方: grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に残す（利用者の承認、2026-11-21。範囲は絞らない）。

## 4. 完了の判断の基準

- 対象の型すべてで、rulebook と sample が人の確定まで終わり、`status` が ready になっている。
- 対象の型の rulebook と sample を `grade run --target kata --kata <name>` で評価し、pass になっている。pass にならない型は、理由と残す判断を対応結果に書いている。
- `dct-kata.yaml` に対象の型の sample が載り、`catalog validate` が通る。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
