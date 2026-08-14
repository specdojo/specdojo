---
specdojo:
  id: prj-0001:pjr-mwxs-uis-index-rulebook-bds-index-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-08-14T08:18:42Z"
  due_on: "2026-08-31"
---

# PJR-MWXS uis-index / bds-index の実践の型（kata）一式の新設

## 1. 概要

uis-index・bds-index 成果物向けのHub専用 rulebook が存在しない。bes-index-rulebook.md に倣い、rulebook だけでなく recipe・sample・template を含む kata 一式を新設する。

## 2. 完了条件

- `uis-index-rulebook`・`bds-index-rulebook` の rulebook・recipe・sample・template（計8ファイル）が作成されていること。
- 各 rulebook が「要点（SSOT）＋一覧表＋関連guide/referenceへのリンク」という Hub 構成になっており、`bes-index-rulebook.md` と章立ての考え方が揃っていること。
- `uis-index-rulebook` は `command-reference.md` の11コマンド群への導線を、`bds-index-rulebook` は timeline・CPM・critical-path・Ready一覧など専用rulebookを持たない生成物への導線を持つこと。
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

-

## 5. 関連ドキュメント

- [[prj-0001:dct-user-interface-model]]: `uis-index`／`bds-index` エントリの参照元カタログ
- [[specdojo:bes-index-rulebook]]: 章立ての参考にするHub型rulebookの先例
- [[specdojo:kata-guide]]: rulebook / recipe / sample / template の役割分担
- [[specdojo:command-reference]]: `uis-index` が導線とするCLIコマンド群
- [[specdojo:schedule-design-guide]]: `bds-index` が導線とするtimeline・CPM等の設計背景
- [[specdojo:schedule-operation-guide]]: `bds-index` が導線とするtimeline・CPM・Ready一覧の生成・運用手順
