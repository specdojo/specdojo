---
specdojo:
  id: prj-0001:pjr-0151-index-build-duplicate-id-error-detection
  type: project
  status: ready
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-07T12:00:00Z"
  conclusion: 多言語IDは同一論理ID＋言語スコープ解決に決定し、doc-index を言語スコープ対応に実装。標準へ反映済み。
---

# PJR-0151 specdojo index buildの重複ID「あと勝ち」をエラー検知に変更

## 1. 概要

src/doc-index.tsのID登録処理(scanFile/collectFromFields)は既存キーの存在チェックをせず、Markdown/YAML/ネストIDいずれも無条件上書き(あと勝ち)になっている。同一Unit内の重複IDをエラーにし、衝突したIDと全ファイルパスを表示し、Markdown/YAML/ネストIDを同じ基準で検証し、specdojo index buildと総合validateの両方で失敗させるようにする。あわせて多言語文書(docs/en等)を言語別インデックスにするか同一論理IDの言語variantとして扱うかを決定する

`src/doc-index.ts` のID登録処理（`scanFile`・`collectFromFields`）は既存キーの存在チェックを行わず、Markdown frontmatter・YAML top-level・ネストID（`nested_id_files`によるglossary等）のいずれも `entries[id] = ...` による無条件上書き（あと勝ち）になっている。`walkDir` のディレクトリ走査順（`readdirSync`、ソートなし）に依存するため、どちらが勝つかも決定論的でない。`specdojo index build` と総合validateの両方で重複IDをエラーとして検知するようにする。あわせて、`docs/en/` 等の多言語文書展開時にIDがどう扱われるべきか（言語別インデックス化 or 同一論理IDの言語variant）を決める。

## 2. 完了条件

- 同一SpecDojo Unit内でIDが重複した場合、`specdojo index build` がエラー終了する。
- エラー出力に、衝突したIDと、そのIDを持つ全ファイルパス（2件以上すべて）が表示される。
- Markdown frontmatter・YAML top-level・ネストID（`nested_id_files`の`collect_from`）が同一の重複判定基準で検証される。
- `specdojo index build` 単体実行時と、総合validate（`specdojo exec validate` 等、`build`パイプラインに含まれるindex-buildステップ）の両方で、重複があれば失敗する。
- 多言語文書のID方針（言語別インデックスにする／同一論理IDの言語variantとして扱う）が決定され、決定内容が `id-and-file-naming-standard` 等の該当設計書へ反映されている。
- 決定した方針に基づき、`docs/en/` 等の既存プレースホルダ構成が方針と矛盾しないことを確認している。

## 3. 作業内容

| No  | 作業                                                                     | 担当 | 状態 | メモ                                                 |
| --- | ------------------------------------------------------------------------ | ---- | ---- | ---------------------------------------------------- |
| 1   | 重複ID検知ロジックの設計・実装（Markdown/YAML/ネストIDを共通基準で検証） | ARC  | done | 言語スコープ対応の `addId` で共通検証                |
| 2   | エラーメッセージ（衝突ID・全ファイルパス表示）の実装                     | ARC  | done | 衝突ID・両ファイルパス・locale/mixed を明示          |
| 3   | `specdojo index build` 単体実行時のエラー化                              | ARC  | done | `DuplicateDocIdError` で exit 1                      |
| 4   | 総合validate（`exec validate`/`build`パイプライン）での失敗伝播の実装    | ARC  | done | `collectDocIndex` 経由で伝播                         |
| 5   | 多言語文書のID方針の検討・決定（言語別インデックス or 言語variant）      | ARC  | done | 同一論理ID＋言語スコープ解決に決定                   |
| 6   | 決定した方針の `id-and-file-naming-standard` 等該当設計書への反映        | ARC  | done | 標準に `2.4. 多言語文書のID方針` を追加              |
| 7   | 単体テスト追加（重複検知・エラーメッセージ・多言語方針の境界値）         | ARC  | done | `tests/src/doc-index.test.ts` に言語スコープ系を追加 |

## 4. 対応結果

- 多言語文書のID方針を「同一論理ID（言語中立）＋言語スコープでの重複検知・参照解決」に決定した。翻訳は同じ論理文書の言語違いとして同一 `id` を共有し、`[[id]]` 参照は言語を書かずに同一言語 variant へ解決する。純粋な言語別ID案は、参照が言語固有になり翻訳がリンクを共有できずID数も倍増するため不採用とした。
- 一意性の粒度を「Unit 内かつ同一言語サブツリー内で一意（言語をまたぐ同一IDは variant として許容）」に精緻化。ロケール集合は `.specdojo/index-config.yaml` の `locales` で宣言する（未宣言時は従来どおり Unit 全体で一意）。
- `src/doc-index.ts` を言語スコープ対応に改修。`addId` で「同一スコープ内の重複のみエラー」「言語中立と言語別の混在はエラー」を判定。出力 `doc-index.json` に既定言語の `entries`（後方互換）に加えて言語別 `localized`（id→{locale:path}）を追加。`replaceDocIndexRefs` に `lang` を追加し同一言語優先で解決。`index replace` はパスから言語を自動判定（`--lang` で上書き可）。
- `docs/specdojo/` 配下のスキーマは言語中立として全体一意を維持することを確認。実 `index build` は 774 件で成功（重複なし）。
- 標準 `id-and-file-naming-standard` に `2.4. 多言語文書のID方針（言語スコープ）` を追加し、`5.2. 参照解決ルール` に言語スコープ解決の注記を追加した。
- `docs/en/` は現在プレースホルダのみで、本方針と矛盾しない（言語別サブツリーとして自然に受け入れられる）。

## 5. 関連ドキュメント

- src/doc-index.ts
- [[id-and-file-naming-standard|ドキュメントIDおよびファイル命名標準]]
- [[command-reference|SpecDojoコマンドリファレンス]]
