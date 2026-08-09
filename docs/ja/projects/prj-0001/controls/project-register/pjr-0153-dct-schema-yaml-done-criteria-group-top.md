---
specdojo:
  id: prj-0001:pjr-0153-dct-schema-yaml-done-criteria-group-top
  type: project
  status: deprecated
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: rejected
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-04T12:00:00Z"
  conclusion: 既存dctは全件で成果物ごとにdone_criteriaを個別記述しており、group/topレベルの共通デフォルトは設計方針（成果物内容に即した検証可能な条件）と逆行するため見送り。dct-data-flow.yaml側の重複はdone_criteriaの個別化で解消済み
---

# PJR-0153 dct.schema.yaml: done_criteria のデフォルト指定(group/top)を可能にする

## 1. 概要

done_criteria を local_id 単位だけでなく、group 単位およびトップレベルでデフォルトとして指定できるようにスキーマを拡張する。

現在 `done_criteria` は成果物（`local_id`）単位で定義されていますが、共通の完了条件を効率的に管理するため、グループ単位およびトップレベルでのデフォルト指定を可能にするよう `dct.schema.yaml` を拡張します。これにより、重複した記述を削減し、一貫性のある完了基準の定義を実現します。

## 2. 完了条件

- `dct.schema.yaml` において、トップレベルおよび `Section`（グループ）定義に `done_criteria` プロパティが追加され、バリデーションが正常に通ること。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------ | ---- | ---- | ---- |
| 1   | スキーマ構造の分析とデフォルト値の継承方針の策定             | ARC  | open | -    |
| 2   | `dct.schema.yaml` のトップレベルへ `done_criteria` を追加    | ARC  | open | -    |
| 3   | `dct.schema.yaml` の `Section` 定義へ `done_criteria` を追加 | ARC  | open | -    |
| 4   | スキーマの妥当性検証（バリデート）                           | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- `[[docs/specdojo/schemas/v1/dct.schema.yaml]]`
