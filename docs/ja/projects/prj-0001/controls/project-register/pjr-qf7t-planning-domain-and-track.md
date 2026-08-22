---
specdojo:
  id: prj-0001:pjr-qf7t-planning-domain-and-track
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-22T12:25:02Z"
  due_on: "2026-08-31"
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
- `dct-index.yaml` の分類へ `planning` が追加され、索引ビューとサイドバーへ反映されている。
- `schedule build --track planning` と `exec refresh` が成功し、計画成果物のタスクが Ready として生成される。
- `npm run validate:schema`、`npm run validate:catalog`、`npm run lint:md` が成功する。

## 3. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ                                                                       |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------- |
| 1   | `dct-planning.yaml` を新設し、計画成果物の宣言と完了条件を定義する           | ARC  | open | kind の割り当ては PJR-WVNS の決定に従う                                    |
| 2   | `project-management` から計画成果物を移設する                                | ARC  | open | `tml-index`、`dct-index`、`sch-defaults`。移設後に重複が無いことを確認する |
| 3   | 着手済みトラックの assessment と strategy を登録する                         | ARC  | open | launch と data-flow のみ。未着手分は登録しない                             |
| 4   | Timeline へ `planning` トラックを追加する                                    | ARC  | open | 他トラックより先行する順序にする                                           |
| 5   | `sch-strategy-planning` を作成し、循環しない構成にする                       | ARC  | open | 自身の strategy を scope 外にするか `kind: control` とする                 |
| 6   | 索引へ `planning` を追加する                                                 | ARC  | open | プロジェクト成果物側のどのグループへ置くかもあわせて決める                 |
| 7   | `schedule build` と `exec refresh` で Ready タスクが生成されることを確認する | ARC  | open | 生成物（`kind: generated`）がタスク化されないことも確認する                |
| 8   | 関連ガイドと rulebook を更新する                                             | ARC  | open | Timeline / Schedule 設計ガイド、`dct-rulebook` の kind 運用                |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-wvns-planning-artifacts-catalog-scope|PJR-WVNS 計画成果物をカタログへ載せ、専用の planning ドメインとトラックで所有する]]
- 分類の正本: [[specdojo:docs-structure-guide|ドキュメント構成ガイド]]
- 生成の仕組み: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|PJR-STRG DCTとsch-strategyの決定論的ジェネレーター実装]]
- 移設元: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`
- Timeline: `docs/ja/projects/prj-0001/timeline/tml-index.yaml`
