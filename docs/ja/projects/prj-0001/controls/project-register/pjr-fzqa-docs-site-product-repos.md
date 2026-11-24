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

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
