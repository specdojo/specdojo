---
specdojo:
  id: prj-0001:pjr-z4pm-src-small-cycles
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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
| 1   | `review` → `grade/result` の依存をなくす | DEV  | done | -    |
| 2   | `docs` → `catalog/build` の依存をなくす  | DEV  | done | -    |
| 3   | 2 組の循環がないことを数える             | DEV  | done | -    |

## 4. 対応結果

- `GradeResult` の型および `src/review/grade.ts` が利用する関数（`gradeContentHash`・`gradeFindingDisplayMessage`・`gradeResultPathForDocument`・`parseGradeResult` 等）を `src/shared/grade-result.ts` へ抽出し、`src/grade/result.ts` から再 export した。`src/review/grade.ts` の import 先を `src/shared/grade-result.js` へ変更し、`src/review/` から `src/grade/` への依存を 0 件に解消した。`src/exec/` を変更しない制約のため `review/grade.ts` 自体は移動せず、型・共通関数を `src/shared/` へ移した。
- `isDctTemplateCatalog`・`renderCatalogTemplateBody` およびその描画処理（`renderSections`・`renderTable`・`renderDoneCriteria` 等）を `src/shared/catalog-render.ts` へ、パス解決処理（`resolveBasePath` 等）を `src/shared/catalog-paths.ts` へ移し、`src/catalog/` 側からは再 export して後方互換性を維持した。`src/docs/yaml-pages.ts` の import 先を `src/shared/catalog-render.js` へ変更し、`src/docs/` から `src/catalog/` への依存を 0 件に解消した。
- 変更後の依存関係を数え、`src/review/` → `src/grade/`（0 件）、`src/docs/` → `src/catalog/`（0 件）となり、2 組の循環（`grade` ⇄ `review`、`catalog` ⇄ `docs`）が完全に解消されたことを確認した。また `src/shared/` は他の機能を一切 import しておらず、[[prj-0001:pjr-x8y9-src-dependency-direction-rules]] の規則を守っている。
- 変更前後で `grade`・`yaml-pages`・`catalog` および各サブコマンド計 14 件の `--help` 出力を取得・比較し、完全一致することを確認した。
- `src/exec/` 配下のファイルは一切変更していない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqky-src-feature-cycles]]: 決定。
- [[prj-0001:pjr-wset-src-feature-direction-rules]]: 循環のなくなった組の規則。
