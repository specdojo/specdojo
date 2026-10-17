---
specdojo:
  id: prj-0001:pjr-z4pm-src-small-cycles
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:45:20Z"
  due_on: null
---

# PJR-Z4PM review と grade、docs と catalog の循環をほどく

## 1. 概要

review から grade/result と、docs から catalog/build の 1 件ずつの依存を直す。 PJR-QQKY の決定に基づく。動作は変えない

## 2. 完了条件

[[prj-0001:pjr-qqky-src-feature-cycles]] の決定の 4 に基づく。1 件ずつの依存で生じている 2 組の循環をほどく。2026-10-18 時点の循環のもとは次のとおり。

| 組                 | 一方の向き                                                                   | 循環を作っている向き                                                                                     |
| ------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `grade` ⇄ `review` | `grade` → `review/types`（`ReviewViewpointsDoc`・`GradeRubric`。6 ファイル） | `src/review/grade.ts` → `src/grade/result.ts`（`GradeResult` の型と関数）                                |
| `catalog` ⇄ `docs` | `catalog` → `docs/*`（12 件）                                                | `src/docs/yaml-pages.ts` → `src/catalog/build.ts`（`isDctTemplateCatalog`・`renderCatalogTemplateBody`） |

条件:

- `src/review/grade.ts` が `src/grade/` を import しないようにする。`GradeResult` の型と、`review/grade.ts` が使う関数を、`review` か `src/shared/` へ移すか、`review/grade.ts` 自体を `grade` へ移す。どれにしたかと理由を result に書く。
- `src/docs/yaml-pages.ts` が `src/catalog/` を import しないようにする。`isDctTemplateCatalog`・`renderCatalogTemplateBody` を `docs` か `src/shared/` へ移すか、依存の向きを逆にする。どれにしたかと理由を result に書く。
- 移した後に、`grade` ⇄ `review` と `catalog` ⇄ `docs` の循環がないことを数えて result に書く。`src/shared/` が他の機能を import しない規則（[[prj-0001:pjr-x8y9-src-dependency-direction-rules]]）を守る。
- 移すだけにし、動作は変えない。分割の前後で `grade`・`yaml-pages`・`catalog` とそのサブコマンドの `--help` の出力が一致する。
- 本件は `src/exec/` を変えない（並行して動く PJR-BHMH と重ならないようにするため）。
- 作業を終える前に、`npm run lint:md` と `npm run lint:fm` を実行して通す（コードを変える場合は `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` も通す）。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | `review` → `grade/result` の依存をなくす | DEV  | open | -    |
| 2   | `docs` → `catalog/build` の依存をなくす  | DEV  | open | -    |
| 3   | 2 組の循環がないことを数える             | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqky-src-feature-cycles]]: 決定。
- [[prj-0001:pjr-wset-src-feature-direction-rules]]: 循環のなくなった組の規則。
