---
specdojo:
  id: prj-0001:pjr-0qw0-result-markdownlint-default-config
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  registered_at: "2026-10-28T22:11:04Z"
  derived_from:
    - PJR-FMJ5
---

# PJR-0QW0 markdownlint の設定がない利用リポジトリで result の commit 前検査が MD013 で統合を止める

## 1. 概要

docs-lint を入れた利用リポジトリでは markdownlint の既定設定（MD013）が効き、日本語の result が必ず統合前に止まる。設定がなくても SpecDojo の規則で検査し、init が設定を作るようにする

## 2. 完了条件

- markdownlint の設定ファイルが無い利用リポジトリでも、`exec run --register` の result の commit 前検査（`assertResultMarkdownlint`）が、SpecDojo が result に求める規則で検査し、日本語の長い行（MD013）では止まらない。利用リポジトリに markdownlint の設定がある場合は、従来どおりそれを優先する。
- `init` と `config init` が、既存のファイルを上書きせずに、SpecDojo の文書規約に合う最小の `.markdownlint.yaml` を作る。既にある場合は変更しない。配布する pre-commit hook の markdownlint も、この設定で SpecDojo の生成物（個票・result など）を止めない。
- 設定の内容（無効にする規則の範囲、設定が無いときの既定の置き場所）は executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 関連するガイド・リファレンス（quick-start・設定リファレンスなど該当するもの）に、作られる設定と既存の利用リポジトリでの対処を書く。
- `CHANGELOG.md` の未公開の `## [0.5.0]` の節の `不具合修正` に追記する。公開済みの版の節は変えない。
- 単体テストで、設定が無いときに MD013 違反だけの result が通ること、設定があるときはそれを優先すること、`init` が設定を作り既存を上書きしないことを確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。

## 3. 作業内容

| No  | 作業                                         | 担当     | 状態 | メモ |
| --- | -------------------------------------------- | -------- | ---- | ---- |
| 1   | 設定が無いときの result 検査の規則を実装する | executor | open | -    |
| 2   | `init` / `config init` で設定を作る          | executor | open | -    |
| 3   | ガイド・CHANGELOG・テストを更新する          | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-fmj5-release-v0-5-0]]
- [[prj-0001:pjr-19hx-result-prettier-emphasis-mangling]]
