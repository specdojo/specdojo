---
specdojo:
  id: prj-0001:pjr-z7gx-product-commit-message-template
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-31T02:42:46Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNMV
  depends_on:
    - PJR-TC62
---

# PJR-Z7GX プロダクトのリポジトリの commit と merge commit の書式を設定で選べるようにする

## 1. 概要

`repos[]` の `commit_subject_template` と `merge_message_template` で、プロダクトのリポジトリへ exec が積む commit の 1 行目と merge commit のメッセージを、運用に合わせて選べるようにする。

## 2. 入力

- PJR-BNMV の決定: commit の 1 行目は `repos[].commit_subject_template`（例: {type}({scope}): {title}）、merge commit は `repos[].merge_message_template`（既定は Merge branch '{branch}' into {target} に Refs を付けたもの）。本文の末尾の Refs: `<project-id>`:`<ID>` は常に付ける。設定がなければ今と同じ
- 対象はプロダクトのリポジトリだけ。SpecDojo の記録のリポジトリの記帳の commit（exec(register ...)）は変えない

## 3. 完了条件

- `specdojo.config.json` の `repos[]` に任意の `commit_subject_template` と `merge_message_template` を足し、schema と設定の読み込みの検証を更新する。
- テンプレートで使える変数は `{id}`・`{project}`・`{topic}`・`{type}`・`{scope}`・`{title}`・`{branch}`・`{target}` とする。`{type}` と `{scope}` は PJR-TC62 の関数で引く。`{scope}` が空のときに `{type}({scope}):` の括弧が残らない扱いは executor が決める。未知の変数は設定エラーにする。
- プロダクトのリポジトリへの commit の 1 行目と merge commit のメッセージにテンプレートを使う。本文の末尾の `Refs: <project-id>:<ID>` は、テンプレートにかかわらず常に付ける。1 行目の長さの上限は今の扱いを保つ。
- `commit_subject_template` を設定しないときは今と同じ `exec(register <ID>): <タイトル>` にする。`merge_message_template` を設定しないときの既定は、PJR-BNMV の決定のとおり `Merge branch '{branch}' into {target}` に `Refs:` を付けたものにするか、今の形を保つかを executor が決め、互換性への影響とあわせて理由を書く。
- SpecDojo の記録のリポジトリの記帳の commit（`exec(register ...)` の start・review・wait・merge など）は変えない。
- 単体テストを足す。対象は、テンプレートの展開、`{scope}` が空の場合、未知の変数のエラー、設定がない場合の互換、`Refs:` が常に付くこと。
- 実際のプロダクトのリポジトリ（一時ディレクトリの git）で `exec run --register` の統合を通し、commit と merge commit のメッセージがテンプレートどおりになることを確かめるテストを、統合テストとして足す。
- 設定リファレンスの `repos` のキーの表に書き、git-flow と GitHub flow の設定の例を載せる。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 保護された設定（`.specdojo/`・`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                           | 担当     | 状態 | メモ |
| --- | ------------------------------------------------------------------------------ | -------- | ---- | ---- |
| 1   | `repos[]` の schema と設定の検証にテンプレートを足す                           | executor | open | -    |
| 2   | プロダクト側の commit と merge commit にテンプレートを使い、テストと文書を足す | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bnmv-product-repo-git-workflow]]
- [[specdojo:specdojo-config-reference]]
- [[specdojo:command-reference]]
- [[prj-0001:pjr-tc62-item-commit-type-scope]]
