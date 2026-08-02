---
specdojo:
  id: prj-0001:pjr-0151-index-build-duplicate-id-error-detection
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0151 specdojo index buildの重複ID「あと勝ち」をエラー検知に変更

## 1. 概要

`src/doc-index.ts` のID登録処理（`scanFile`・`collectFromFields`）は既存キーの存在チェックを行わず、Markdown frontmatter・YAML top-level・ネストID（`nested_id_files`によるglossary等）のいずれも `entries[id] = ...` による無条件上書き（あと勝ち）になっている。`walkDir` のディレクトリ走査順（`readdirSync`、ソートなし）に依存するため、どちらが勝つかも決定論的でない。`specdojo index build` と総合validateの両方で重複IDをエラーとして検知するようにする。あわせて、`docs/en/` 等の多言語文書展開時にIDがどう扱われるべきか（言語別インデックス化 or 同一論理IDの言語variant）を決める。

## 2. 完了条件

- 同一SpecDojo Unit内でIDが重複した場合、`specdojo index build` がエラー終了する。
- エラー出力に、衝突したIDと、そのIDを持つ全ファイルパス（2件以上すべて）が表示される。
- Markdown frontmatter・YAML top-level・ネストID（`nested_id_files`の`collect_from`）が同一の重複判定基準で検証される。
- `specdojo index build` 単体実行時と、総合validate（`specdojo exec validate` 等、`build`パイプラインに含まれるindex-buildステップ）の両方で、重複があれば失敗する。
- 多言語文書のID方針（言語別インデックスにする／同一論理IDの言語variantとして扱う）が決定され、決定内容が `id-and-file-naming-standard` 等の該当設計書へ反映されている。
- 決定した方針に基づき、`docs/en/` 等の既存プレースホルダ構成が方針と矛盾しないことを確認している。

## 3. 作業内容

| No  | 作業                                                                     | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 重複ID検知ロジックの設計・実装（Markdown/YAML/ネストIDを共通基準で検証） | ARC  | open | -    |
| 2   | エラーメッセージ（衝突ID・全ファイルパス表示）の実装                     | ARC  | open | -    |
| 3   | `specdojo index build` 単体実行時のエラー化                              | ARC  | open | -    |
| 4   | 総合validate（`exec validate`/`build`パイプライン）での失敗伝播の実装    | ARC  | open | -    |
| 5   | 多言語文書のID方針の検討・決定（言語別インデックス or 言語variant）      | ARC  | open | -    |
| 6   | 決定した方針の `id-and-file-naming-standard` 等該当設計書への反映        | ARC  | open | -    |
| 7   | 単体テスト追加（重複検知・エラーメッセージ・多言語方針の境界値）         | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- src/doc-index.ts
- [[id-and-file-naming-standard|ドキュメントIDおよびファイル命名標準]]
- [[command-reference|SpecDojoコマンドリファレンス]]
