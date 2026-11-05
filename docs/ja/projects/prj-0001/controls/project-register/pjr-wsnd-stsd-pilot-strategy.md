---
specdojo:
  id: prj-0001:pjr-wsnd-stsd-pilot-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: PM
  registered_at: "2026-11-05T11:47:44Z"
  derived_from:
    - PJR-3APD
  approach: strategy-planning
  targets:
    - track:stsd-pilot
---

# PJR-WSND stsd-pilot の strategy と schedule を作り、段 9〜12 を schedule で流せるようにする

## 1. 概要

3APD の段 9〜12（磨き込み・condense・review・確定）を schedule で流すため、track stsd-pilot の strategy を作り、schedule build で展開する

## 2. 入力

- 利用者は、段 9 以降を register の個票ではなく schedule で流す案を選んだ。本番の業務仕様の epic と同じ流し方を、この試行で確かめるため（2026-11-05）
- 段 8 の retrofit は register の個票（PJR-41B4・PJR-YQF1・PJR-RAPC・PJR-PYCY）で流しているため、schedule には retrofit-pass を入れない。stsd-task-execution は段 2〜4 を register で済ませた（PJR-1799・PJR-Q9AW・PJR-MC63）
- 標準の retrofit の profile は retrofit-pass → refine-pass → condense-pass → retrofit-review-pass → finalize-pass で、段 8〜12 と同じ順になる（src/schedule/strategy-profiles.ts）

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
