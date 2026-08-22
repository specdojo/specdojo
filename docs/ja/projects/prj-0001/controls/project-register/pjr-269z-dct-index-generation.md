---
specdojo:
  id: prj-0001:pjr-269z-dct-index-generation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-22T00:20:50Z"
  due_on: "2026-08-31"
---

# PJR-269Z dct-index.md を dct-index.yaml から自動生成し、順序とグループ分割を宣言で制御する

## 1. 概要

dct-index.md は現在すべて人が編集しており、ドメイン一覧表の並び順とグループ分割を宣言的に制御できない。表の4列のうち domain とカタログへのリンクは dct-\*.yaml から導出できるが、名称・概要・並び順・グループの出典が存在しない。順序とグループはドメイン横断の編集意図であるため、各ドメインファイルへ分散させず dct-index.yaml に集約し、catalog build が generated/dct-index.md を生成する方式へ移行する。共通ルールの散文は register の pjr-index-template.md と同じ template 方式で保持する。

検討が必要な点と推奨案は次のとおり。

| 検討点                     | 推奨案                                                                                                                         | 理由                                                                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 共通ルールの散文の置き場所 | `dct-index-template.md` を新設して template 側に置く                                                                           | 散文を YAML の文字列に入れると prettier と markdownlint の対象から外れ、表記ルールの検査が効かなくなる。register が同じ課題を template 方式で解いており、方式を揃えられる                                     |
| `size` の正本              | `dct-index.yaml` のみを正本とし、`readSizeFromIndex` を削除する。フォールバックは設けない                                      | 生成物である Markdown を入力として読む依存の逆転を解消することが目的であり、互換パスを残すと目的の一部が達成されないまま固定化しやすい。移行対象は `prj-0001` の1件のみで、互換パスを常設する費用に見合わない |
| `size` 未解決時の挙動      | 新しい正本を案内するエラーで停止する。既定サイズへ暗黙にフォールバックしない                                                   | 現在の実装も未解決時は例外を投げて利用者を誘導しており、その方針を踏襲することで誤ったサイズで scaffold される事故を防げる                                                                                    |
| rulebook の更新範囲        | `dct-index-rulebook` を「`dct-index.yaml` の宣言項目」と「生成物の本文仕様」に分けて記述する                                   | 人が書く対象が YAML と template に変わるため、規範の適用先を明示しないと標準列の要求が生成器の仕様と二重管理になる                                                                                            |
| 既存参照の扱い             | doc id `prj-0001:dct-index` を生成物へ引き継ぎ、参照は wikilink へ統一する。相対リンクは `generated/dct-index.md` へ張り替える | `docs/**/generated/*` は gitignore 対象で、生成前はファイルが存在しない。id を保てば wikilink 参照は張り替え不要で、prj-charter などの既存参照が壊れない                                                      |

## 2. 完了条件

- `dct-index.yaml` が新設され、グループ、グループ内のドメイン順、ドメインの表示名、概要を宣言できる。schema による検証がある。
- `catalog build` が `dct-index.yaml` と実在する `dct-*.yaml` から `generated/dct-index.md` を生成する。
- 生成される一覧はグループごとに表が分割され、行順は `dct-index.yaml` の配列順と一致する。
- 物理分割された同一 domain の `dct-*.yaml`（`dct-data-model-cld.yaml` など）が複数あっても、ドメインごとに1行だけ出力される。
- `dct-index.yaml` に宣言があるのに `dct-*.yaml` が存在しない場合、および逆の場合を `catalog validate` が検出する。
- 生成物の列構成が `dct-index-rulebook` の `成果物カタログ一覧 の標準列` と一致する。
- 共通ルールの散文が template 側で維持され、生成のたびに失われない。
- `size` の正本が `dct-index.yaml` に一本化され、`readSizeFromIndex` と `dct-index.md` からの読み取りが実装から削除されている。`--size` も `dct-index.yaml` も解決できない場合は、新しい正本を案内するエラーで停止する。
- 既存の `dct-index` 参照（wikilink と相対リンク）が解決できる状態を維持している。
- `npm run typecheck`、`npm run test:unit`、`npm run lint:md`、`npm run validate:schema`、`npm run validate:catalog` が成功する。

## 3. 作業内容

| No  | 作業                                                                                     | 担当 | 状態 | メモ                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `dct-index.yaml` の項目設計と schema 追加                                                | ARC  | open | groups、domains、name、overview、size を宣言する                                                                                   |
| 2   | `dct-index-template.md` を新設し共通ルールの散文とスロットを定義する                     | ARC  | open | `pjr-index-template.md` と同じ view-slot 方式を踏襲する                                                                            |
| 3   | `catalog build` に index 生成を実装する                                                  | ARC  | open | グループごとの表分割と宣言順の反映、ドメイン単位の重複排除を含む                                                                   |
| 4   | `catalog validate` に宣言と実体の突き合わせを追加する                                    | ARC  | open | 宣言のみ、実体のみ、リンク先不在をエラーにする                                                                                     |
| 5   | `size` の正本を `dct-index.yaml` へ移し、`readSizeFromIndex` を削除する                  | ARC  | open | 互換フォールバックは設けない。未解決時は新しい正本を案内するエラーで停止する                                                       |
| 6   | 旧 `dct-index.md` を削除し、既存参照の張り替えと `dct-index-rulebook` の更新を行う       | ARC  | open | doc id `prj-0001:dct-index` を生成物へ引き継ぎ、wikilink を維持する。移行は対象1件のため手作業で行い、移行専用コマンドは追加しない |
| 7   | unit test を追加し、生成順序・グループ分割・分割ドメインの重複排除・検証エラーを検証する | ARC  | open | 同じ入力から同じ出力になる決定論性も確認する                                                                                       |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 生成対象の規範: [[specdojo:dct-index-rulebook|成果物カタログ（インデックス）作成ルール]]
- ドメイン別カタログの規範: [[specdojo:dct-rulebook|成果物カタログ（ドメイン別）作成ルール]]
- 現在の正本: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-index.md`
- 踏襲する生成方式: `docs/ja/specdojo/templates/pjr-index-template.md` と `src/register.ts` の `injectViewSlots`
- 変更対象の実装: `src/catalog.ts` の `readSizeFromIndex` と `buildCatalog`
