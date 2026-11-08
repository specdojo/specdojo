---
specdojo:
  id: prj-0001:pjr-ftrc-lint-fm-skip-gitignored-generated
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T15:04:22Z"
  derived_from:
    - PJR-STM9
---

# PJR-FTRC lint:fm が git の管理外の生成物まで検査して親の検証を落とさないようにする

## 1. 概要

lint:fm（remark の frontmatter 検査）が docs/**/*.md をすべて読み、.gitignore で管理外にした生成物（grade の一時ファイルなど）の schema の警告で --frail により失敗する。git の管理外の生成物を検査の対象から外す

## 2. 入力

- 2026-11-08、PJR-STM9 の executor が worktree で grade を流し、docs/ja/projects/prj-0001/execution/grade/generated/runs/ に一時ファイル（.gitignore の `docs/**/generated/*` で管理外）が残り、親の検証 lint-fm がその frontmatter の警告で失敗した。orchestrator が一時ファイルを消して --resume した（indie が承認）。
- .remarkignore は空で、lint:fm は node packages/docs-lint/bin/specdojo-docs-lint.js remark `"docs/**/*.{md,mdx}"` --quiet --frail で動く。
- 直し方（.remarkignore に足す、.gitignore を読む、docs-lint 側で除外する、など）は executor が決め、理由を個票の対応結果に書く。

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
