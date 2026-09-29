---
specdojo:
  id: prj-0001:pjr-cf15-glossary-term-reference-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-09-29T13:28:05Z"
---

# PJR-CF15 用語集の relatedTerms と category が用語集内の ID を指すことを検証する

## 1. 概要

PJR-Y06Y で用語集の schema（`docs/specdojo/schemas/v1/gl.schema.yaml`）を作り、`gl-sample.yaml` と `gl-common.yaml` を `validate:schema` で検証できるようにした。ただし、次の参照は schema では表せず、未検証のままである。

- 各用語の `category` が、同じ用語集の中に存在する用語 ID（`tm-...`）を指すこと
- 各用語の `relatedTerms` の各要素が、同じ用語集の中に存在する用語 ID を指すこと

2026-09-29 の PJR-QD81 の評価で、`gl-common.yaml` の `category` が存在しない ID（`tm-data-store` など）を指していたことを orchestrator が手で見つけた。検証があれば機械的に検出できた。

## 2. 完了条件

- 用語集の `category` と `relatedTerms` が、同じ用語集の中に存在する用語 ID を指すことを検証する。検証を置く場所（`catalog validate`、`validate:schema` の後段、専用のコマンドなど）を決め、その理由を対応結果に記録する。
- 存在しない ID を指している場合は、用語集のファイル、用語 ID、参照先の ID を示してエラーにする。
- 同じ用語集の中で用語 ID が重複している場合もエラーにする。
- `npm run check` に含まれ、`gl-sample.yaml` と `gl-common.yaml` が検証を通る。
- 存在しない ID の参照と、ID の重複を検出する単体テストがある。
- `gl-rulebook.md` に、この検証があることが書かれている。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ |
| --- | ------------------------------ | ---- | ---- | ---- |
| 1   | 検証を置く場所を決めて実装する | DEV  | open | -    |
| 2   | テストを追加する               | DEV  | open | -    |
| 3   | gl-rulebook へ記載する         | DEV  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-Y06Y（用語集の schema）、PJR-QD81（用語集 gl-common の作成）
- `docs/specdojo/schemas/v1/gl.schema.yaml`、`docs/ja/specdojo/rulebooks/gl-rulebook.md`
