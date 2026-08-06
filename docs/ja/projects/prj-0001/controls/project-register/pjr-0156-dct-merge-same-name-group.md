---
specdojo:
  id: prj-0001:pjr-0156-dct-merge-same-name-group
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0156 dctカタログmergeの同名group結合対応

## 1. 概要

PJR-0155 で実装した dct カタログの物理分割マージ（`mergeDomainCatalogs`）は、同一 `domain` の各ファイルの `groups` をファイル順に連結するだけで、同名 group を1章へ結合しない（`src/catalog-build.ts`）。このため成果物種別ごとにファイルを分割すると、`業務データ辞書`・`概念モデル` などの章見出しがファイル数だけ重複する。種別ごと物理分割（data-model テンプレートの再分割）を成立させ、rulebook の業務領域分割例（`dct-data-model-sales.yaml`／`-buy.yaml`）も正しく描画するため、マージ時に同一 `domain` 内の同名 group を1章へ結合できるようにする。

## 2. 完了条件

- 同一 `domain` の複数 dct ファイルに現れる同名 group が、マージ後に1つの章へ結合される（`業務データ辞書` が5ファイルに分散しても1章になる）。
- group 内の `deliverables` の順序が、ファイル名昇順→ファイル内定義順で決定的に決まり、環境差で変わらない。
- 入れ子 group（親 `groups`／子 `groups`）でも同名 group の結合が階層的に一貫する。
- 名前が異なる group は結合されず、別章として保持される。無名 group の既存挙動（見出しなし連結）は変わらない。
- 結合後も `local_id` のプロジェクト内一意性検証が維持され、重複を検出できる。
- 既存の単一ファイル構成・現状の group 単位分割が後方互換で従来どおり動作する。

## 3. 作業内容

| No  | 作業                                                                           | 担当   | 状態 | メモ                                           |
| --- | ------------------------------------------------------------------------------ | ------ | ---- | ---------------------------------------------- |
| 1   | 同名 group 結合のマージ規則を設計（結合キー・順序・入れ子・base_path 継承）    | _TODO_ | open | 分割軸は種別ごとで確定                         |
| 2   | `mergeDomainCatalogs` を同名 group 結合へ拡張                                  | _TODO_ | open | `src/catalog-build.ts`。連結から名前キー結合へ |
| 3   | テスト追加（同名結合・順序・入れ子・別名非結合・無名維持・重複検出・後方互換） | _TODO_ | open | `tests/src/catalog-merge.test.ts`              |
| 4   | rulebook 3.1/3.2 の分割例・命名を種別分割に合わせて追記                        | _TODO_ | open | `specdojo:dct-rulebook`                        |
| 5   | data-model テンプレートを種別ごと（bdd/cdsd/sld/stsd/cld/ccd/cstd）へ再分割    | _TODO_ | open | 各ファイルは該当種別のみ・group 名を維持       |
| 6   | 検証（`npm run build` / `lint:ts` / `lint:md` / `validate:catalog`）           | _TODO_ | open | -                                              |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:dct-rulebook]]
- `src/catalog-build.ts`
- `tests/src/catalog-merge.test.ts`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-0155-dct-domain-multifile.md`
