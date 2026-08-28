---
specdojo:
  id: prj-0001:pjr-qf7t-planning-domain-and-track
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-22T12:25:02Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-22T13:14:45Z"
  conclusion: planning ドメインと planning トラックを新設し、tml-index・dct-index・sch-defaults を project-management から移設した。着手済み3トラックの assessment と strategy を work、sch-track と sch-milestones を generated として登録し、sch-strategy-planning は control として循環を回避した。schedule build で計画成果物8件がタスク化され、生成物と control はタスク化されないことを実機で確認した。
  register_events:
    - v: 1
      id: reg_ccbb757b301069ffbe5093b6519c7e50
      ts: "2026-08-22T12:28:15Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): 計画成果物のカタログ設計を決定として起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: planning ドメインとトラックを新設し、計画成果物をカタログとScheduleへ載せる
        - field: description
          from: ""
          to: PJR-WVNS の決定に基づき、計画成果物を所有する planning ドメインと planning トラックを新設する。tml-index、dct-index、sch-defaults などを project-management から移設し、着手済みトラックの sch-assessment と sch-strategy を登録する。sch-track と sch-milestones は generated として登録し、`dct-<domain>.yaml` と generated 配下の表示用生成物は登録しない。planning トラック自身の strategy は循環を避けるため scope から外すか control として扱う。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-22"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: ac987294fa662defee8311be380cefc6855200e2
    - v: 1
      id: reg_76f2238ae85bcc6088f1e10757f53252
      ts: "2026-08-22T12:32:19Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-QF7T): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 05b8efa31cd83e2d27fff9d6a13bfc2fe813ab27
      previous_event_id: reg_ccbb757b301069ffbe5093b6519c7e50
    - v: 1
      id: reg_748f650dc4666d939353717ebea86df7
      ts: "2026-08-22T12:59:05Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-QF7T): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: b65b70a888272de5bbd1230f26a7b62ca9c3b471
      previous_event_id: reg_76f2238ae85bcc6088f1e10757f53252
    - v: 1
      id: reg_1302565fbe7a6d33cb821d48fe995969
      ts: "2026-08-22T13:14:45Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-QF7T): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-22"
        - field: conclusion
          from: "-"
          to: planning ドメインと planning トラックを新設し、tml-index・dct-index・sch-defaults を project-management から移設した。着手済み3トラックの assessment と strategy を work、sch-track と sch-milestones を generated として登録し、sch-strategy-planning は control として循環を回避した。schedule build で計画成果物8件がタスク化され、生成物と control はタスク化されないことを実機で確認した。
      legacy_commit: 6cbc4e244965edb8cc25eb2d19b055c84090301c
      previous_event_id: reg_748f650dc4666d939353717ebea86df7
---

# PJR-QF7T planning ドメインとトラックを新設し、計画成果物をカタログとScheduleへ載せる

## 1. 概要

PJR-WVNS の決定に基づき、計画成果物を所有する planning ドメインと planning トラックを新設する。tml-index、dct-index、sch-defaults などを project-management から移設し、着手済みトラックの sch-assessment と sch-strategy を登録する。sch-track と sch-milestones は generated として登録し、`dct-<domain>.yaml` と generated 配下の表示用生成物は登録しない。planning トラック自身の strategy は循環を避けるため scope から外すか control として扱う。

## 2. 完了条件

- `dct-planning.yaml`（`domain: planning`）が新設され、計画成果物が宣言されている。
- `tml-index`、`dct-index`、`sch-defaults` が `project-management` から `planning` へ移設され、重複登録が無い。
- 着手済みトラック（`catalog_status: primary`）の `sch-assessment-<track>` と `sch-strategy-<track>` が `kind: work` で登録されている。未着手トラックの分は登録しない。
- `sch-track-<track>` と `sch-milestones` が `kind: generated` で登録され、`sch-strategy-<track>` への依存が宣言されている。
- `dct-<domain>.yaml` そのものと `generated/` 配下の表示用生成物は登録されていない。
- Timeline に `planning` トラックが追加され、他トラックより先行する順序になっている。
- `sch-strategy-planning` が作成され、`planning` トラック自身の strategy が循環しない構成になっている（scope 外または `kind: control`）。
- `dct-index.yaml` の分類へ `planning` が追加され、索引ビューとサイドバーへ反映されている。配置はプロジェクト成果物の配下に新設したサブグループとし、既存サブグループへは含めない。
- `schedule build --track planning` と `exec refresh` が成功し、計画成果物のタスクが Ready として生成される。
- `npm run validate:schema`、`npm run validate:catalog`、`npm run lint:md` が成功する。

## 3. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ                                                                                         |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------- |
| 1   | `dct-planning.yaml` を新設し、計画成果物の宣言と完了条件を定義する           | ARC  | done | PJR-WVNS に従い work / control / generated を分類した                                        |
| 2   | `project-management` から計画成果物を移設する                                | ARC  | done | `tml-index`、`sch-defaults` と既存 Schedule 定義を移設し、`dct-index` を planning へ登録した |
| 3   | 着手済みトラックの assessment と strategy を登録する                         | ARC  | done | primary の planning / launch / data-flow のみ登録し、assessment 骨組みを生成した             |
| 4   | Timeline へ `planning` トラックを追加する                                    | ARC  | done | planning を wave 1、launch 以降を後続 wave とした                                            |
| 5   | `sch-strategy-planning` を作成し、循環しない構成にする                       | ARC  | done | strategy 自身を `kind: control` とし、scope は `kind: work` に限定した                       |
| 6   | 索引へ `planning` を追加する                                                 | ARC  | done | プロジェクト成果物直下へ独立した「計画」サブグループを追加し、サイドバー表示名も登録した     |
| 7   | `schedule build` と `exec refresh` で Ready タスクが生成されることを確認する | ARC  | done | planning の work 8 件を track へ展開し、先頭タスクが Ready になることを確認した              |
| 8   | 関連ガイドと rulebook を更新する                                             | ARC  | done | Timeline / Schedule / 文書構成ガイドと DCT の kind 運用を更新した                            |

## 4. 対応結果

- `dct-planning.yaml` を新設し、計画入力を `work`、planning strategy 自身を `control`、track と milestones を `generated` として登録した。`dct-project-management.yaml` から旧登録を除去し、重複を解消した。
- Timeline の先頭に planning トラックを追加し、launch と後続トラックの wave を繰り下げた。`dct-index.yaml` には既存サブグループと分離した「計画」を追加した。
- primary の planning / launch / data-flow について assessment を生成し、planning strategy と track を新設した。planning strategy は自身を scope に含めず、8 件の work 成果物だけをタスク化する。
- `exec refresh` が `schedule/assessments/` を再帰的に Schedule 入力として誤読する問題を修正し、専用サブディレクトリを除外する単体テストを追加した。
- 関連ガイド、DCT rulebook、VitePress サイドバーを更新した。残課題はない。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-wvns-planning-artifacts-catalog-scope|PJR-WVNS 計画成果物をカタログへ載せ、専用の planning ドメインとトラックで所有する]]
- 分類の正本: [[specdojo:docs-structure-guide|ドキュメント構成ガイド]]
- 生成の仕組み: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|PJR-STRG DCTとsch-strategyの決定論的ジェネレーター実装]]
- 移設元: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`
- Timeline: `docs/ja/projects/prj-0001/timeline/tml-index.yaml`
