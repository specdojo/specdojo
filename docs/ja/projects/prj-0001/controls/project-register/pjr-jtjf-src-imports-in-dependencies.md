---
specdojo:
  id: prj-0001:pjr-jtjf-src-imports-in-dependencies
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-24T09:54:09Z"
  derived_from:
    - PJR-ZV60
---

# PJR-JTJF 配布するコードが dependencies にないパッケージを読み込んでも検査で気づけない

## 1. 課題内容

PJR-ZV60 で src が tinyglobby を読み込んだが devDependencies にしかなく、npm から入れたリポジトリで init などが落ちた。本リポジトリでは開発用の依存として入っているため、テストでも検証でも気づけなかった。src が読み込むパッケージがすべて dependencies にあることを npm run check で確かめる

## 2. 影響範囲

| 観点         | 影響                                                                  |
| ------------ | --------------------------------------------------------------------- |
| スコープ     | `src/` の読み込みと `package.json` の `dependencies`、`npm run check` |
| スケジュール | 大。配布物が利用者のリポジトリで起動できなくなる                      |
| コスト       | 利用者が原因を調べる手間と、修正の版を出す手間                        |
| 品質         | 公開する版が、利用者の環境で動かない                                  |
| 関係者       | specdojo の利用者全員                                                 |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 本リポジトリでは開発用の依存（`devDependencies`）と、ほかのパッケージの依存が `node_modules` にそろっているため、`src/` が `dependencies` にないパッケージを読み込んでも、テストと検証が通る |
| 対応策   | `src/` が読み込むパッケージが `dependencies`（と Node の標準モジュール）だけであることを、`npm run check` の中で確かめる                                                                     |
| 依存事項 | なし                                                                                                                                                                                         |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                       |

### 3.1. 完了条件

- v0.4.5 の範囲とする（2026-10-24、利用者が承認）。
- `src/` の TypeScript が読み込むパッケージ（静的な `import`・`export ... from`・動的な `import()`、型だけの読み込みは除く）が、`package.json` の `dependencies` か `peerDependencies`、または Node の標準モジュール（`node:` 付き）であることを確かめる検査を加え、`npm run check` から流れるようにする。やり方（ESLint の規則、または小さな検査のスクリプトと単体テスト）と理由を result に書く。依存を増やす場合は、`package.json` は保護された設定のため、変更案を result に書く（反映はオーケストレーター）。
- 検査は、`dependencies` にないパッケージを読み込んだ場合に、ファイルとパッケージの名前を示して失敗する。今の develop（`tinyglobby` を `dependencies` に移した後）では通る。
- 単体テストで、`dependencies` にあるもの・Node の標準モジュール・型だけの読み込み・相対パスは通り、`devDependencies` にしかないものは失敗することを確かめる。
- [[specdojo:docs-structure-guide]] か、本リポジトリの開発の手順の文書のどちらか 1 か所に、配布するコードが読み込めるのは `dependencies` だけであることを書く。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- 利用者から見た動きは変わらないため、CHANGELOG には書かない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- PJR-ZV60（tinyglobby の読み込み）
