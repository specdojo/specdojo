---
specdojo:
  id: prj-0001:pjr-5en3-docs-lint-md-content-no-options
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T08:47:12Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2FV2
---

# PJR-5EN3 docs-lint の md-content を設定なしで使うと落ちる

## 1. 概要

remark/md-content を options なしで読み込むと options.schemas の読み取りで TypeError になるため、options がないときは空として扱う

## 2. 入力

- 2026-10-31 の 0.6.0 の配布物の試用で見つけた。空のリポジトリの .remarkrc.yaml に @specdojo/docs-lint/remark/md-content を options なしで書くと、TypeError: Cannot read properties of undefined (reading 'schemas') で全ファイルが Cannot process file になる
- 原因は packages/docs-lint/src/remark-md-content.ts の remarkMdContent が options.schemas を options の有無を確かめずに読むこと。0.3.1 から同じだが、0.4.0 の README は content schema の対象にかかわらず `_CONTEXT_:` を検出すると案内している
- 0.6.0（docs-lint 0.4.0）の公開の前に直す。修正はリリースのブランチ feature/prj-0001/release-v0.6.0 にも取り込む

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
