---
specdojo:
  id: prj-0001:pjr-g8m9-kata-wikilink-resolution
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T03:50:08Z"
  due_on: "2026-10-31"
  completed_at: "2026-09-23T07:31:06Z"
  block_reason: "checkpoint failed: git worktree failed: Preparing worktree (new branch 'exec/prj-0001-PJR-G8M9') Updating files:  50% (2325/4638)\rUpdating files:  51% (2366/4638)\rUpdating files:  52% (2412/4638)\rUpda…"
  conclusion: index build が resolver 由来の package kata も走査し、利用リポジトリと package をスコープで分けて重複判定するようにした。eject 後も index build が成功する。
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
| 1   | `index build` の走査範囲を resolver 由来へ広げる          | DEV  | done | `node_modules` を直接指定しない  |
| 2   | 重複判定へスコープの概念を導入する                        | DEV  | done | 同一スコープ内は従来どおりエラー |
| 3   | eject 後も `index build` が成功することをテストで確認する | DEV  | done | 回帰しやすい箇所                 |
| 4   | `catalog validate` の整合を取る                           | DEV  | done | 参照中 ID を不正としない         |

## 4. 対応結果

- `index build` と fresh index を使う検証処理が、利用リポジトリの `docs/` に加えて resolver 由来の package 内 rulebook / standard / recipe / sample / template を走査するようにした。`node_modules` 全体は走査しない。
- 利用リポジトリと package を別スコープで収集し、各スコープ内の ID 重複を全衝突パス付きでエラーにした。両スコープ間の同一 ID は利用リポジトリ側を採用するため、eject 後もエラーにならない。
- package 側だけにある ID の解決、kata 対象外ディレクトリの除外、未解決 ID、eject による上書き、package 内 3 ファイルの重複を単体テストで確認した。
- [[specdojo:practice-system-composition-guide]] に npm package 参照、eject、ID インデックスのスコープと優先規則、docs サイトを別責務とする境界を追記した。

### 4.1. オーケストレーターによる検証

kata を持たない一時リポジトリで通し確認した。

| 操作                                    | 結果                                  |
| --------------------------------------- | ------------------------------------- |
| `index build`（eject 前）               | 312 entries。package 側の kata を解決 |
| `kata eject --id specdojo:pjr-rulebook` | 成功                                  |
| `index build`（eject 後）               | 312 entries、重複エラーなし           |

`DuplicateDocIdError` との衝突が起きないことを確認した。これが本項目の核心だった。

`node_modules/specdojo` を実際に配置した構成でも確認し、解決結果が次のとおりリポジトリ相対になることを確認した。

```text
eject 済み : docs/ja/specdojo/rulebooks/pjr-rulebook.md
参照中     : node_modules/specdojo/docs/ja/specdojo/rulebooks/dct-rulebook.md
```

`src/doc-index.ts` の差分に `node_modules` のハードコードが無いことを確認した（決定 1）。

補足として、開発リポジトリの CLI を外部ディレクトリから実行し `SPECDOJO_PACKAGE_ROOT` を指定しない場合は、参照中の ID が絶対パスになる。[[prj-0001:pjr-ypns-kata-resolution]] で決めた「リポジトリ外へ解決された場合は絶対パス」の規則どおりであり、npm 導入時は `node_modules` がリポジトリ内にあるため発生しない。

### 4.2. 実行経路

初回実行は worktree 作成の checkpoint で失敗した。理由に `git worktree add` の進捗表示が入り、`block_reason` の切り詰めで原因行が失われたため、[[prj-0001:pjr-tr8g-git-failure-reason-progress]] で失敗理由の整形を先に行った。手動では worktree 作成が 4 秒で成功し再現しなかったため一過性と判断し、worktree を撤去して再実行したところ完走した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-fkn1-kata-distribution-method]]
- [[prj-0001:pjr-ypns-kata-resolution]]
- [[specdojo:practice-system-composition-guide]]
- [[prj-0001:pjr-0151-index-build-duplicate-id-error-detection]]
- [[specdojo:docs-structure-guide]]
