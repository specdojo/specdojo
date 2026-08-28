---
specdojo:
  id: prj-0001:pjr-mwxs-uis-index-rulebook-bds-index-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: deferred
  priority: medium
  owner: BA
  registered_at: "2026-08-14T08:18:42Z"
  due_on: "2026-08-31"
  conclusion: "bootstrap approachへ委譲。user-interface-modelトラックがtml-rulebook.mdの定める順序でSchedule化され、sch-strategy-user-interface-model.yamlにuis-index/bds-indexのowner_rulesが定義された時点で、approach: bootstrapのタスクとして再開する"
  register_events:
    - v: 1
      id: reg_3a972b2305a9d5ea8622496bbfc967df
      ts: "2026-08-14T08:28:16Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs: dct-user-interface-modelを修正"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: uis-index / bds-index の実践の型（kata）一式の新設
        - field: description
          from: ""
          to: uis-index・bds-index 成果物向けのHub専用 rulebook が存在しない。bes-index-rulebook.md に倣い、rulebook だけでなく recipe・sample・template を含む kata 一式を新設する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: BA
        - field: registered
          from: ""
          to: "2026-08-14"
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
      legacy_commit: 45aa75fe144bb8c2305667e025b6cb9269a783d4
    - v: 1
      id: reg_bdd3a4a193d518014e2579ec63ad1868
      ts: "2026-08-15T06:37:33Z"
      action: defer
      actor: SpecDojo Test
      from_status: open
      to_status: deferred
      reason: "exec(register PJR-MWXS): bootstrap approachへ委譲しdeferする"
      changes:
        - field: status
          from: open
          to: deferred
        - field: conclusion
          from: "-"
          to: "bootstrap approachへ委譲。user-interface-modelトラックがtml-rulebook.mdの定める順序でSchedule化され、sch-strategy-user-interface-model.yamlにuis-index/bds-indexのowner_rulesが定義された時点で、approach: bootstrapのタスクとして再開する"
      legacy_commit: c430211d64527758970933f282f04b622428e91d
      previous_event_id: reg_3a972b2305a9d5ea8622496bbfc967df
---

# PJR-MWXS uis-index / bds-index の実践の型（kata）一式の新設

## 1. 概要

uis-index・bds-index 成果物向けのHub専用 rulebook が存在しない。bes-index-rulebook.md に倣い、rulebook だけでなく recipe・sample・template を含む kata 一式を新設する。

## 2. 完了条件

- `uis-index-rulebook`・`bds-index-rulebook` の rulebook・recipe・sample・template（計8ファイル）が作成されていること。
- 各 rulebook が「要点（SSOT）＋一覧表＋関連guide/referenceへのリンク」という Hub 構成になっており、`bes-index-rulebook.md` と章立ての考え方が揃っていること。
- `uis-index-rulebook` は `command-reference.md` の11コマンド群への導線を、`bds-index-rulebook` は gantt-chart・CPM・critical-path・Ready一覧など専用rulebookを持たない生成物への導線を持つこと（`gantt-chart` は元 `timeline` から改名した生成物であり、新設の `tml-`（トラック順序計画）とは別物のため対象外とする）。
- `dct-user-interface-model.yaml` の `uis-index`／`bds-index` エントリが参照する `rulebook` ID（`specdojo:uis-index-rulebook`／`specdojo:bds-index-rulebook`）と実ファイルが一致していること。
- `npm run -s lint:md` にエラーがないこと。
- `npm run docs:build` が成功すること。

## 3. 作業内容

<!-- prettier-ignore -->
| No  | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1   | `uis-index-rulebook.md` の作成（章立てはbes-index-rulebook.md準拠） | BA | open | 対象: `docs/ja/specdojo/rulebooks/uis-index-rulebook.md` |
| 2   | `uis-index-recipe.md` の作成 | BA | open | 対象: `docs/ja/specdojo/recipes/uis-index-recipe.md` |
| 3   | `uis-index-sample.md` の作成 | BA | open | 対象: `docs/ja/specdojo/samples/uis-index-sample.md` |
| 4   | `uis-index-template.md` の作成 | BA | open | 対象: `docs/ja/specdojo/templates/uis-index-template.md` |
| 5   | `bds-index-rulebook.md` の作成（章立てはbes-index-rulebook.md準拠） | BA | open | 対象: `docs/ja/specdojo/rulebooks/bds-index-rulebook.md` |
| 6   | `bds-index-recipe.md` の作成 | BA | open | 対象: `docs/ja/specdojo/recipes/bds-index-recipe.md` |
| 7   | `bds-index-sample.md` の作成 | BA | open | 対象: `docs/ja/specdojo/samples/bds-index-sample.md` |
| 8   | `bds-index-template.md` の作成 | BA | open | 対象: `docs/ja/specdojo/templates/bds-index-template.md` |
| 9   | `dct-user-interface-model.yaml` の `rulebook` 参照との整合確認、lint:md／docs:build 実行 | BA | open | 完了条件の検証コマンドを実行する |

## 4. 対応結果

bootstrap approachへ委譲するため、実装せず`register defer`とする。判断根拠は次のとおり。

- `docs/ja/specdojo/rulebooks/` 配下の既存「-index」Hub系rulebook（bes/sysd/sf/dct/ifx/nfr/opd/tsp/dmd/opr/itc/utc/etc/mip/cop/atc/stc/tsd の18件）は、専用のPJRチケットではなく、対応トラックがSchedule化された際の`approach: bootstrap`タスク（成果物本体とrulebook/recipe/sample/templateを同一タスクで一括整備する仕組み）で作成されたと考えられる。`uis-index`/`bds-index`が未作成なのも、他のdraftトラック（data-model・business-model等）と同様に`user-interface-model`トラックが未Schedule化なだけであり、特別な欠陥ではない。
- 実際に `specdojo exec plan --project prj-0001 --deliverable uis-index --approach bootstrap` を試行し、bootstrap approachが成果物本体・rulebook・recipe・sample・templateを一括整備する仕組みとして機能することを確認した。
- ただし現時点では、owner role解決（`sch-strategy-*.yaml`の`owner_rules`から`uis-index`/`bds-index`の`local_id`を引く仕組み）に必要な`sch-strategy-user-interface-model.yaml`が存在しないため、bootstrap実行時のplanで owner role・責務・レビュー観点が`_MISSING_`になることを確認した。この前提を満たすまで（`user-interface-model`トラックが`tml-rulebook.md`の定める順序でSchedule化されるまで）は、bootstrap実行を待つ必要がある。
- 追跡は本チケット（register）から `tml-index.yaml`（`user-interface-model`トラック、`catalog_status: draft`）へ引き継がれるため、本チケットをdeferしても作業自体が失われることはない。`sch-strategy-user-interface-model.yaml`作成時は、本チケットのowner（`BA`）と同じロールを`uis-index`/`bds-index`の`owner_rules`に設定することを想定する。
- レビューで判明した「timeline」表記の陳腐化（PJR-SEQCによる`timeline`→`gantt-chart`改名後も本チケットと`dct-user-interface-model.yaml`の`bds-index`note双方に残っていた）は、defer前に修正済み。

## 5. 関連ドキュメント

- [[prj-0001:dct-user-interface-model]]: `uis-index`／`bds-index` エントリの参照元カタログ
- [[specdojo:bes-index-rulebook]]: 章立ての参考にするHub型rulebookの先例
- [[specdojo:kata-guide]]: rulebook / recipe / sample / template の役割分担
- [[specdojo:command-reference]]: `uis-index` が導線とするCLIコマンド群
- [[specdojo:schedule-design-guide]]: `bds-index` が導線とするgantt-chart・CPM等の設計背景
- [[specdojo:schedule-operation-guide]]: `bds-index` が導線とするgantt-chart・CPM・Ready一覧の生成・運用手順
- [[prj-0001:tml-index]]: defer後の追跡先。`user-interface-model`トラックの`catalog_status`
- [[specdojo:ryu-guide]]: bootstrap approachの定義・進め方
