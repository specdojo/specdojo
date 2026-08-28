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
  register_events:
    - v: 1
      id: reg_833c692f7c4d9f622232b3f1647ba424
      ts: "2026-08-04T22:16:04Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs: PJR-0153を起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: "dct.schema.yaml: done_criteria のデフォルト指定(group/top)を可能にする"
        - field: description
          from: ""
          to: 現在 `done_criteria` は成果物（`local_id`）単位で定義されていますが、共通の完了条件を効率的に管理するため、グループ単位およびトップレベルでのデフォルト指定を可能にするよう `dct.schema.yaml` を拡張します。これにより、重複した記述を削減し、一貫性のある完了基準の定義を実現します。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: b7c4076ff1b8a003f3d648e62fbc09db60edfeab
    - v: 1
      id: reg_4b439b728ce25797132bd5b0ad066fee
      ts: "2026-08-09T10:55:22Z"
      action: reject
      actor: SpecDojo Test
      from_status: open
      to_status: rejected
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: rejected
        - field: description
          from: 現在 `done_criteria` は成果物（`local_id`）単位で定義されていますが、共通の完了条件を効率的に管理するため、グループ単位およびトップレベルでのデフォルト指定を可能にするよう `dct.schema.yaml` を拡張します。これにより、重複した記述を削減し、一貫性のある完了基準の定義を実現します。
          to: done_criteria を local_id 単位だけでなく、group 単位およびトップレベルでデフォルトとして指定できるようにスキーマを拡張する。
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
        - field: conclusion
          from: "-"
          to: 既存dctは全件で成果物ごとにdone_criteriaを個別記述しており、group/topレベルの共通デフォルトは設計方針（成果物内容に即した検証可能な条件）と逆行するため見送り。dct-data-flow.yaml側の重複はdone_criteriaの個別化で解消済み
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_833c692f7c4d9f622232b3f1647ba424
    - v: 1
      id: reg_f27e88212c4b68c75001f49b1a93a46e
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: rejected
      to_status: rejected
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-04"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_4b439b728ce25797132bd5b0ad066fee
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
