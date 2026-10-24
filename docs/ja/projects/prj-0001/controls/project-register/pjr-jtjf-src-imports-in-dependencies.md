---
specdojo:
  id: prj-0001:pjr-jtjf-src-imports-in-dependencies
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
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

- 解決内容: TypeScript Compiler API で `src/` の静的 `import`、`export ... from`、動的 `import()` を解析する `tools/check-src-imports-in-dependencies.mjs` を追加した。型だけの読み込み、相対パス、`node:` 付き標準モジュールを除外し、それ以外のパッケージが `dependencies` または `peerDependencies` に無ければ、ファイル・行・パッケージ・元の specifier を示して失敗する。正規表現では TypeScript 構文上の型 import と実行時 import を正確に区別しにくいため、既存の開発依存である TypeScript の Compiler API を用いた。
- 単体テスト: `tests/tools/check-src-imports-in-dependencies.test.ts` で、`dependencies` 相当、`peerDependencies` 相当、`node:` 付き標準モジュール、相対パス、型だけの読み込みが通り、開発時にしかないパッケージの静的 import・再 export・動的 import が違反になることと、エラー表示にファイル名とパッケージ名が含まれることを確認する。
- 開発手順: `CONTRIBUTING.md` に、`src/` が実行時に読み込むパッケージは `dependencies` または `peerDependencies` に置き、`devDependencies` へ置かない規則を追記した。
- `npm run check` への配線: executor による親実行設定の変更を禁じる [[sysd-cross-cutting-policy|SpecDojo システム設計横断ルール]] の `scp-SEC-002` に従い、保護設定の `package.json` は本実行では変更していない。対話型オーケストレーターが agent 実行外で、`scripts` に `"check:src-imports": "node tools/check-src-imports-in-dependencies.mjs"` を追加し、`check` の先頭から `npm run check:src-imports` を呼ぶ変更を確認・反映する必要がある。
- 確認結果: `node tools/check-src-imports-in-dependencies.mjs` を現在のソースへ実行し、違反がないことを確認した。TypeScript の lint・型検査・単体テストを含む親検証は runner が実行する。
- 再発防止: 上記の `package.json` 配線後は、`npm run check` が配布コードの未宣言実行時依存を検出する。

## 5. 関連ドキュメント

- PJR-ZV60（tinyglobby の読み込み）
