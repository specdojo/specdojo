---
specdojo:
  id: prj-0001:pjr-g8m9-kata-wikilink-resolution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T03:50:08Z"
  due_on: "2026-10-31"
---

# PJR-G8M9 eject されていない kata の wikilink と index build の解決方針を決めて実装する

## 1. 概要

[[prj-0001:pjr-fkn1-kata-distribution-method]] の第 3 段階。kata を `node_modules` から参照する構成では、利用者の成果物に書かれた `[[specdojo:xxx-rulebook]]` の実体がリポジトリ外になる。`index build` は `docs/` 配下を走査して ID インデックスを作るため、eject されていない kata の ID が未解決になる。

影響を受けるのは、成果物 frontmatter の `rulebook` / `based_on`、本文の wikilink、および利用者が VitePress で docs サイトを作る場合のリンク解決である。

### 1.1. 決定済みの方針

実装前に次を決めた。executor はこの方針から選び直さない。

| No  | 決めること                     | 内容                                                                                                                                                                                |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 走査範囲                       | resolver が返す package ルート配下の kata ディレクトリだけを対象にする。`node_modules` をパスとして直接指定しない                                                                   |
| 2   | 重複判定                       | 同一スコープ内（利用リポジトリ内どうし、package 内どうし）の ID 重複は従来どおりエラー。利用リポジトリと package に同じ ID がある場合は上書きとして扱い、利用リポジトリ側を採用する |
| 3   | 未解決時                       | どちらにも無い ID は従来どおりエラーとする。公開サイト URL への退避は行わない                                                                                                       |
| 4   | docs サイト                    | 本項目では扱わない。`@specdojo/docs-site` のビルド前ステージングとして別項目で実装する                                                                                              |
| 5   | バージョン別公開サイトへの退避 | 採らない                                                                                                                                                                            |

決定 2 が必須の理由は、[[prj-0001:pjr-0151-index-build-duplicate-id-error-detection]] で同一 Unit 内の ID 重複を `DuplicateDocIdError` によるエラー終了へ変更したことにある。package 側を単純に走査対象へ加えると、kata を 1 つ eject した時点で同じ ID が 2 箇所に存在し `index build` が失敗する。eject は正常な操作であるため、スコープの概念を重複判定へ導入する必要がある。PJR-0151 が「あと勝ち」を禁じたのは走査順に依存して非決定になるためであり、スコープに基づく明示的な優先規則はその趣旨に反しない。

決定 3 で公開サイト URL への退避を採らない理由はバージョン不整合である。公開サイトは常に最新だが、利用者の `package-lock.json` は特定バージョンに固定されている。規範文書のリンク先が手元の kata と食い違うと、どちらが正か判断できなくなる。

決定 1 の補足として、`node_modules` を再帰的に走査すると他パッケージの文書を拾い、pnpm では symlink 経由で `.pnpm` ストアへ入り込む。対象は resolver が返す package ルート配下に限定する。PJR-YPNS で導入した `specdojoPackageRootDir()` と `specdojoDirectoryPaths()` を使う。

## 2. 完了条件

- `index build` が resolver 由来の package ルート配下 kata ディレクトリも走査し、eject されていない kata の ID を解決できる。
- 同一スコープ内の ID 重複は従来どおりエラーになり、衝突した ID と全ファイルパスが表示される。
- 利用リポジトリと package に同じ ID がある場合はエラーにならず、利用リポジトリ側が採用される。kata を 1 つ eject しても `index build` が成功する。
- どちらにも無い ID は従来どおりエラーになる。
- 成果物 frontmatter の `rulebook` に参照中の kata ID を書いても `catalog validate` が通る。
- 決定内容が [[specdojo:practice-system-composition-guide]] または関連ガイドへ反映されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                             |
| --- | --------------------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | `index build` の走査範囲を resolver 由来へ広げる          | DEV  | open | `node_modules` を直接指定しない  |
| 2   | 重複判定へスコープの概念を導入する                        | DEV  | open | 同一スコープ内は従来どおりエラー |
| 3   | eject 後も `index build` が成功することをテストで確認する | DEV  | open | 回帰しやすい箇所                 |
| 4   | `catalog validate` の整合を取る                           | DEV  | open | 参照中 ID を不正としない         |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-ypns-kata-resolution]]
- [[specdojo:practice-system-composition-guide]]
- [[prj-0001:pjr-0151-index-build-duplicate-id-error-detection]]
- [[specdojo:docs-structure-guide]]
