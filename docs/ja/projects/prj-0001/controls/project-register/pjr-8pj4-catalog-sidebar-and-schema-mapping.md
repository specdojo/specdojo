---
specdojo:
  id: prj-0001:pjr-8pj4-catalog-sidebar-and-schema-mapping
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: ARC
  registered_at: "2026-08-22T05:59:01Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-22T05:59:47Z"
  conclusion: サイドバー表示名を dct-index.yaml の name を正本とする内容のみの表示へ変更し、dct-index と dct-plan の schema をエディタの yaml.schemas へ関連付けて汎用パターンから extglob で除外した。schema 追加時に package.json と .vscode/settings.json の両方を更新する旨を document-metadata-standard へ追記した。
---

# PJR-8PJ4 成果物カタログのサイドバー表示名と新規 schema のエディタ関連付けを整える

## 1. 概要

サイドバーは親ノードが成果物カタログであるにもかかわらず、各アイテムも成果物カタログを繰り返していた。また大半のアイテムは生成物 H1 由来のためドメイン slug 表記だった。あわせて PJR-269Z で追加した dct-index.schema.yaml が .vscode/settings.json の yaml.schemas に登録されておらず、dct-index.yaml が汎用の dct.schema.yaml で検証されてエディタ上でエラーになっていた。表示名は dct-index.yaml の name を正本として内容だけを表示し、schema は専用マッピングを追加して汎用パターンから除外する。

## 2. 完了条件

- 成果物カタログ配下のサイドバー項目が、親ノードと重複する接頭辞を持たず、内容だけを表示する。
- 表示名は `dct-index.yaml` の `name` を正本とし、宣言にドメインを追加すればサイドバーへ自動的に反映される。
- `dct-index.yaml` がエディタ上で `dct-index.schema.yaml` により検証され、汎用の `dct.schema.yaml` によるエラーが出ない。
- ドメイン別カタログ（`dct-<domain>.yaml`）はエディタ上で従来どおり `dct.schema.yaml` により検証される。
- `dct-plan-<domain>.yaml` も専用 schema へ関連付けられ、将来生成したときに同じ問題が起きない。
- 新しい schema を追加したときに `package.json` と `.vscode/settings.json` の両方を更新する旨が standard に明記されている。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                                                                    |
| --- | -------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------- |
| 1   | サイドバーの表示名を内容のみに変更する             | ARC  | done | `dct-index.yaml` の `name` を使い、無い場合は接頭辞除去にフォールバック |
| 2   | 新規 schema をエディタの `yaml.schemas` へ登録する | ARC  | done | `dct-index` と `dct-plan` の専用マッピングを追加                        |
| 3   | 汎用パターンから新規 schema の対象を除外する       | ARC  | done | extglob `docs/**/dct-!(index\|plan-*).yaml` を使用                      |
| 4   | 適用状況をエディタで確認する                       | ARC  | done | 不正キーを一時追加し、両ファイルで検証が効くことを確認                  |
| 5   | 再発防止のルールを standard へ追記する             | ARC  | done | `document-metadata-standard` の `バリデーション` へ追記                 |

## 4. 対応結果

orchestrator が exec を介さず直接実装した。

- `.vitepress/config.mts` に、成果物カタログ配下のリンクだけを対象とする表示名解決を追加した。`dct-<domain>` の `domain` をキーに `dct-index.yaml` の `name` を引き、見つからない場合は既存表示名から「成果物カタログ」の接頭辞を除去する。YAML パーサは持ち込まず、`- domain:` と直後の `name:` の対応だけを読む軽量な実装とした。
- 実際のサイドバー生成結果を確認し、20 件すべてが内容のみの日本語表示になることを確認した。
- `.vscode/settings.json` に `dct-index.schema.yaml` と `dct-plan.schema.yaml` の専用マッピングを追加し、汎用の `dct.schema.yaml` は extglob で両者を除外するようにした。
- 当初 extglob は使えないと判断したが、これは誤りだった。バンドル内に同名クラスが2つあり、`yaml.schemas` の照合に使われるのは picomatch を用いる YAML schema サービス側だった。picomatch は extglob を完全にサポートする。利用者による実機確認で誤りが判明し、picomatch でパターンを検証して裏付けた。
- 再発防止として、`document-metadata-standard` の `バリデーション` へ、スキーマ追加時の登録先を置き場所別に明記した。`docs/specdojo/schemas/v1/`（言語中立）は `package.json` の検証 script と `.vscode/settings.json` の `yaml.schemas`、Frontmatter 用なら `.remarkrc.yaml` の `schemaRules`。`docs/ja/specdojo/schemas/v1/`（言語別の本文構成検証）は `.remarkrc.yaml` の `remark-md-content` の `schemas`。あわせて `schemaRules` が最初に一致したスキーマだけを適用すること、汎用パターンとの重なりは extglob で除外すること、適用確認の方法も記載した。

残課題はない。

## 5. 関連ドキュメント

- 表示名の正本を宣言化した項目: [[prj-0001:pjr-269z-dct-index-generation|PJR-269Z dct-index.md を dct-index.yaml から自動生成し、順序とグループ分割を宣言で制御する]]
- 再発防止を追記した規範: [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]
- 変更したファイル: `.vitepress/config.mts`、`.vscode/settings.json`
