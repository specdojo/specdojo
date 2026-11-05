---
specdojo:
  id: prj-0001:pjr-abbm-evidence-refs-quality
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T22:52:17Z"
  derived_from:
    - PJR-PSXJ
---

# PJR-ABBM 根拠にならない evidence_refs を警告し、見直しの段で本体のファイルを確かめる

## 1. 概要

catalog validate が存在しないパスと re-export だけのファイルを指す evidence_refs を警告し、catalog-planning の手順に本体のファイルの確認を足す

## 2. 入力

- 由来: PJR-PSXJ の決定（A 案）。候補 (2) の置き換えと (3)〜(5) は対象外（2026-11-06）
- orchestrator の調査: 成果物 203 件のうち 93 件に `evidence_refs` があり参照は 181 件。src/exec/exec.ts は 2 行の re-export で 56 回引かれている（2026-11-06）

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
