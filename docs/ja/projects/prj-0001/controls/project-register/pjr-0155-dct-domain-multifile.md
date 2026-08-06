---
specdojo:
  id: prj-0001:pjr-0155-dct-domain-multifile
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0155 dctカタログの1 domain複数ファイル分割（物理分割）対応

## 1. 概要

現行の dct カタログは、`catalog build` の出力が `domain` をキーに束ねられる都合上、`domain` 一意制約（`src/catalog.ts` の `validateCatalogDomains`）により 1 domain = 1 ファイルが前提となっている。`data-model` のように反復要素（業務データ辞書・概念モデルを業務領域ごとに複製）が多いカタログは単一ファイルが肥大化するため、論理 domain を維持したまま物理ファイルを分割できるよう、同一 `domain` を持つ複数 dct ファイルを build 時にマージ可能にする。

## 2. 完了条件

- 同一 `domain` を持つ複数 dct ファイルが `catalog build` 時に 1 つの domain カタログへ決定的な順序でマージされる。
- `validateCatalogDomains` が同一 `domain` の複数ファイルを ERROR とせず、マージ対象として許容する。
- `local_id` のプロジェクト内一意性検証が維持され、マージ後も重複を検出できる。
- `groups` のマージ規則（章の順序・`base_path` 継承・入れ子）が再現可能で、環境差で結果が変わらない。
- 既存の単一ファイル構成が後方互換で従来どおり動作する。

## 3. 作業内容

| No  | 作業                                                                                | 担当   | 状態 | メモ                                               |
| --- | ----------------------------------------------------------------------------------- | ------ | ---- | -------------------------------------------------- |
| 1   | 分割時の命名・マージ順序の設計方針確定（`dct-<domain>-<part>.yaml` 案の是非を含む） | _TODO_ | open | ファイル列挙順に依存しない決定規則を定義           |
| 2   | schema / rulebook の更新（同一 domain 複数ファイルの許可と命名規約の追記）          | _TODO_ | open | `dct.schema.yaml` と `specdojo:dct-rulebook`       |
| 3   | `validateCatalogDomains` をマージ許容へ変更                                         | _TODO_ | open | `src/catalog.ts`。重複 `local_id` 検出は維持       |
| 4   | `catalog build` / `catalog generate` を domain 単位のファイル横断マージへ改修       | _TODO_ | open | `src/catalog-build.ts` / `src/catalog-generate.ts` |
| 5   | テスト追加（マージ・順序・重複検出・後方互換）                                      | _TODO_ | open | `tests/src/` 配下                                  |
| 6   | 検証（`npm run build` / `lint:ts` / `validate:catalog`）                            | _TODO_ | open | -                                                  |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:dct-rulebook]]
- `docs/specdojo/schemas/v1/dct.schema.yaml`
- `src/catalog.ts`
- `src/catalog-build.ts`
- `src/catalog-generate.ts`
