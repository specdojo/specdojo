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

| No  | 作業                                                                           | 担当 | 状態 | メモ                                                |
| --- | ------------------------------------------------------------------------------ | ---- | ---- | --------------------------------------------------- |
| 1   | 同名 group 結合のマージ規則を設計（結合キー・順序・入れ子・base_path 継承）    | ARC  | done | 同一階層の `name` 完全一致。先頭 group の属性を継承 |
| 2   | `mergeDomainCatalogs` を同名 group 結合へ拡張                                  | ARC  | done | 再帰結合を実装。無名・単一ファイル構造は維持        |
| 3   | テスト追加（同名結合・順序・入れ子・別名非結合・無名維持・重複検出・後方互換） | ARC  | done | `tests/src/catalog-merge.test.ts` に追加            |
| 4   | rulebook 3.1/3.2 の分割例・命名を種別分割に合わせて追記                        | ARC  | done | 種別接頭辞と同名 group 結合規則を追記               |
| 5   | data-model テンプレートを種別ごと（bdd/cdsd/sld/stsd/cld/ccd/cstd）へ再分割    | ARC  | done | 7ファイルへ分割し既存の成果物定義を維持             |
| 6   | 検証（`npm run build` / `lint:ts` / `lint:md` / `validate:catalog`）           | ARC  | done | 対象検査成功。全体テストの環境制約は対応結果に記録  |

## 4. 対応結果

- `mergeDomainCatalogs` は、ファイル名昇順で同一 domain の各パートを処理し、同一階層で `name` が完全一致する group を最初の章へ結合する。最初の group の章位置・`base_path`・`note`・`min_size` を維持し、後続の `deliverables` をファイル順・定義順で追記する。子 `groups` にも同じ規則を再帰適用する。
- 名前が異なる group と無名 group は結合せず、単一ファイル内の group 構造も変更しない。既存の domain 単位 `project_id` / `base_path` 整合検証とファイル横断 `local_id` 重複検出を維持した。
- data-model テンプレートを `bdd` / `cdsd` / `sld` / `stsd` / `cld` / `ccd` / `cstd` の7種別へ再分割した。scaffold と build を通した回帰テストで、5ファイルの `業務データ辞書` が1章、2ファイルの `概念モデル` が1章になることを確認した。
- `npm run build`、`npm run lint:ts`、`npm run lint:md`、data-model テンプレート7件の schema 検証、`catalog validate --project prj-0001`、対象テスト73件が成功した。全体テストは807件中784件が成功し、残る23件はサンドボックスがテスト内の子プロセス起動を `EPERM` で拒否する既知の実行環境制約により失敗した。変更対象のテスト失敗はない。

## 5. 関連ドキュメント

- [[specdojo:dct-rulebook|成果物カタログ（ドメイン別）作成ルール]]
- `src/catalog-build.ts`
- `tests/src/catalog-merge.test.ts`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-0155-dct-domain-multifile.md`
