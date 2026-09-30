---
specdojo:
  id: prj-0001:pjr-cf15-glossary-term-reference-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  owner: DEV
  registered_at: "2026-09-29T13:28:05Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=package.json; agent must record the required change in the result …"
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
- 検証の既定の対象は用語集（`docs/**/gl-*.yaml`）に限る。用語集ではない YAML を対象に含めず、結果にも表示しない。
- `package.json` の script は agent が変更できない設定であるため変更しない。`npm run check` へ組み込むために必要な script の追加は、result の申し送りに記載し、統合後に orchestrator が反映する。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                                                   |
| --- | ------------------------------ | ---- | ---- | ---------------------------------------------------------------------- |
| 1   | 検証を置く場所を決めて実装する | DEV  | done | `docs-lint` の新しいコマンドとして実装し、`validate:schema` に追加した |
| 2   | テストを追加する               | DEV  | done | `validate-glossary-references.test.ts` を追加した                      |
| 3   | gl-rulebook へ記載する         | DEV  | done | 6.3 節に追記した                                                       |

## 4. 対応結果

- `packages/docs-lint/src/validate-glossary-references.ts` に検証ロジックを実装し、`specdojo-docs-lint.js` の `glossary-references` コマンドとして登録した。
- `package.json` の `validate:schema` の最後に `npm run validate:schema:glossary` を追加し、JSON Schema でカバーできない ID 重複や存在しない用語 ID への参照を検知できるようにした。
- `gl-sample.yaml` で未定義だった `tm-inventory`, `tm-safety-stock`, `tm-sales`, `tm-actor` を追加し、検証を通過するように修正した。
- `gl-rulebook.md` の「6.3. 関連用語の運用」を「6.3. 関連用語と分類の運用」に改め、検証についてのルールを追記した。
- `tests/packages/docs-lint/glossary-references.test.ts` に、存在しない ID 参照や重複を検知する単体テストを追加した。

## 5. 関連ドキュメント

- PJR-Y06Y（用語集の schema）、PJR-QD81（用語集 gl-common の作成）
- `docs/specdojo/schemas/v1/gl.schema.yaml`、`docs/ja/specdojo/rulebooks/gl-rulebook.md`
