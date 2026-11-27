---
specdojo:
  id: prj-0001:pjr-ejff-prj-overview-ai-agent-conditional
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-27T10:15:38Z"
  due_on: "2026-11-30"
---

# PJR-EJFF prj-overview の AI Agent の役割を、業務に使う場合だけ書く条件付きにする

## 1. 概要

prj-overview-rulebook の前提条件の節が AI Agent の役割を常に求めるため、AI を業務に使わない駄菓子屋の sample にも成果物作成の補助の記述が入った。rulebook と template を条件付きに変え、sample から外す

## 2. 入力

- prj-overview-sample の 111 行目以降の AI Agent の記述は、2026-11-23 の T-KATA-WAVE-6-PROJECT-prj-overview-sample-050（3d569e81d2）で入った
- 元は prj-overview-rulebook の前提条件の節（2026-06-06、586769eb25）の「人間の判断責任、AI Agent の役割、…を明示します」と、prj-overview-template の 92 行目の導入文
- 利用者（indie）は、sample の文脈（駄菓子屋の販売管理）では成果物作成の AI Agent の話は関係ないと判断し、案 B（rulebook を AI Agent を業務に使う場合は役割を書く条件付きに変え、sample からは外す）を選んだ（2026-11-27）
- 条件付きの書き方の前例: prj-charter-template の「AI Agent を利用する場合は、支援対象の活動と委譲範囲を記述する。」
- 判断責任・公開方針・取捨選択方針の記述は残す

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
