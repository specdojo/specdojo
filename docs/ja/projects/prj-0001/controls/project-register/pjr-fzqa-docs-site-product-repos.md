---
specdojo:
  id: prj-0001:pjr-fzqa-docs-site-product-repos
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-24T13:58:26Z"
  due_on: "2026-11-30"
  commit_type: feat
  commit_scope: docs-site
---

# PJR-FZQA 文書サイトに repos で宣言したプロダクトのリポジトリの文書を取り込む

## 1. 概要

repos を分けた構成で、プロダクトのリポジトリの docs/ja/product/ を文書サイトに取り込み、project の文書と行き来できるようにする

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- product の文書の読ませ方は、サイトのビルドに repos の product の文書を取り込む案 2 にする（利用者の判断、2026-11-24）
- 担当は DEV、期限は 2026-11-30、executor は opus（利用者、2026-11-24）

## 3. 完了条件

- 文書サイトのビルド（`@specdojo/docs-site`）が、`.specdojo/specdojo.config.json` の各 project の `repos` を読み、宣言したリポジトリの `docs/ja/product/` を `/ja/product/<リポジトリ名>/` に取り込む。パスは `.specdojo/specdojo.local.config.json` の差し替えも反映する。project のリポジトリ自身の `docs/ja/product/` とは場所を分け、ぶつからないようにする。
- サイドバーに、リポジトリごとの product の節を出す。project の文書から、取り込んだ product の文書への wikilink（`[[id]]`）が解決される。doc index の扱い（取り込んだ文書の id をどう解決するか）を決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 宣言したリポジトリが見つからないとき（CI で checkout していないときなど）は、警告を出して飛ばし、ビルドは止めない。`repos` を宣言していない project（prj-0001 など）では、今のサイトの出力が変わらない。
- 単体テストを足す（取り込み、場所の分け方、リポジトリが見つからないときの警告、`repos` がないときに変わらないこと）。
- docs-site のガイドと設定リファレンスに、取り込みの動きと、product のリポジトリを checkout して公開する workflow の例を書く。private のリポジトリを取り込むと公開のサイトに出ることも注意として書く。
- `.github` などの保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。`packages/docs-site/package.json` の版も変えない（リリースで上げる）。
- 統合の後に、オーケストレーターが repos を宣言した試しのリポジトリでサイトをビルドし、product のページが出ることを確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                    | 担当               | 状態 | メモ                                                                |
| --- | ----------------------------------------------------------------------- | ------------------ | ---- | ------------------------------------------------------------------- |
| 1   | `repos` を読み product の文書をステージングへ取り込む処理を足す         | DEV                | done | `packages/docs-site/.vitepress/product-repos.ts`・`kata-staging.ts` |
| 2   | サイドバーの節と doc index の補いを `config.mts` に組み込む             | DEV                | done | 試しの workspace で設定を読み込み、節と `[[id]]` の解決を確かめた   |
| 3   | 単体テストを足す                                                        | DEV                | done | `tests/packages/docs-site/product-repos.test.ts`（14 件）           |
| 4   | docs-site のガイド・設定リファレンス・README を更新する                 | DEV                | done | workflow の例と private のリポジトリの注意を含む                    |
| 5   | 統合の後に repos を宣言した試しのリポジトリでサイトをビルドして確かめる | オーケストレーター | open | executor の範囲外。統合の後にオーケストレーターが行う（完了条件）   |

## 5. 対応結果

### 5.1. 実施内容

- `packages/docs-site/.vitepress/product-repos.ts` を足した。`.specdojo/specdojo.config.json` の全 project の `repos` を読み、`.specdojo/specdojo.local.config.json` の `repos[]` の差し替えと追加を反映する。パスの解決は CLI と同じ規則（linked worktree では `SPECDOJO_LOCAL_CONFIG` か本体の作業ツリーのローカル設定、複数リポジトリの exec の project worktree では隣の `<task>/<name>/`）にした。
- 宣言したリポジトリの `docs/ja/product/` を閲覧用ツリーの `docs/ja/product/<name>/` へ複製し、`/ja/product/<name>/` で配信する。`kata-staging.ts` の `stageBundledKata` に `productRepos` の選択肢を足し、取り込んだファイルを掃除の対象から外した。外したリポジトリの文書は次の起動で消える。
- リポジトリ・`docs/ja/product/` が無いとき、project のリポジトリ自身に `docs/ja/product/<name>/` があるとき、名前が規則に合わないときは警告して飛ばし、ビルドは続ける。
- `config.mts` で、リポジトリごとのサイドバーの節（キー `/ja/product/<name>/`、見出し「プロダクト: `<name>`」）を作り、トップ（`/ja/`）の入口にも足した。表示名は project 自身の product と同じ表（`PRODUCT_SEGMENT_TEXT` など）で日本語にする。`index.md` が無いリポジトリには入口のページを閲覧用ツリーにだけ置く。
- `repos` が無いときは取り込みの処理が何もせず、サイドバー・doc index・ページの出力は変わらない（表示名の読み取りとページの存在確認は、workspace に無いときだけステージングを見る）。
- 単体テスト `tests/packages/docs-site/product-repos.test.ts` を足した（取り込み、場所の分け方、見つからないときの警告、`repos` が無いときに変わらないこと、ローカル設定、doc id の表、サイドバーの節）。
- `docs/ja/specdojo/guides/docs-editing-guide.md` に「プロダクトのリポジトリの文書を取り込む」、`docs/ja/specdojo/references/specdojo-config-reference.md` に「文書サイトへの取り込み」を足し、`packages/docs-site/README.md` にも要点を書いた。CI の workflow の例と、private のリポジトリが公開のサイトに出る注意を含む。

### 5.2. 決めたこと

- doc index の扱い: 取り込んだ文書の id は `.specdojo/doc-index.json` に入れず、docs-site がビルド時に取り込んだ Markdown の frontmatter（`specdojo.id`、無ければトップレベルの `id`）から読み、サイト内の索引にだけ補う。理由は、`specdojo index build` は project のリポジトリの索引で agent・plan も使うため、サイトの都合でプロダクトのパスを混ぜると影響が広いこと、checkout していないリポジトリがあっても索引の作り直しなしでサイトだけ変わること。
- id の衝突: project の索引に同じ id があれば project 側を優先し、警告する。リポジトリどうしの衝突は先に出たほうを使う。`:` を含まない id には `<name>:<id>` の別名も付け、衝突しても project の文書から引けるようにした。
- YAML の文書は、yaml-pages が生成した表示用ページ（`generated/<name>.md`、同じ id を持つ）を取り込んだときだけ引ける。表示用ページは git 管理外のため、CI では product のリポジトリで生成しないと出ない。
- 同じ `name` を複数の project が宣言したときは、project ID の順で先の宣言を使う。
- `dev` 中のプロダクト側の編集は同期しない（起動し直しで反映）。範囲を絞るため。

### 5.3. 残課題

- 取り込んだ文書が `docs/ja/product/` の外（`../../projects/...` など）を相対リンクで指すと、閲覧用ツリーでは 1 階層深くなるため dead link になり、ビルドが止まる。`ignoreDeadLinks` は参照元のページで絞れないため今回は手を入れていない。試しのビルドで問題になれば別項目で扱う。
- 統合の後の、repos を宣言した試しのリポジトリでのサイトのビルドはオーケストレーターが行う（作業内容の 5）。
- 保護された設定の変更は要らない。`packages/docs-site/package.json` の版と `CHANGELOG.md` は変えていない。

### 5.4. CHANGELOG に書く事項

- 区分: Added（`@specdojo/docs-site`）
- 行の文案: 文書サイトのビルドが、project の `repos` で宣言したプロダクトのリポジトリの `docs/ja/product/` を `/ja/product/<リポジトリ名>/` に取り込み、リポジトリごとのサイドバーの節を出すようにした。project の文書から取り込んだ文書へ `[[id]]`（または `[[<リポジトリ名>:<id>]]`）でリンクできる。見つからないリポジトリは警告して飛ばす（PJR-FZQA）。

## 6. 関連ドキュメント

- [[specdojo:docs-editing-guide|ドキュメント編集ガイド]]
- [[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]]
