---
specdojo:
  id: prj-0001:pjr-ftrc-lint-fm-skip-gitignored-generated
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T15:04:22Z"
  block_reason: "parent validation failed: test-integration, test-unit"
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

- `npm run lint:fm` が、`.gitignore` で管理外にした `docs/**/generated/` の下の生成物（grade の一時ファイルなど）を検査しない。どの方法で外すかは executor が決め、理由を個票の対応結果に書いている。
- git で管理している文書（管理下の `generated/` を含む）は、今までどおり検査される。外したことで検査が抜ける文書がないことを、外す前と後の対象の数などで確かめ、個票の対応結果に書いている。
- 管理外の生成物を置いた状態で `npm run lint:fm` が通ることを、テストか手順で確かめている。
- `package.json` など保護された設定を変える必要がある場合は、executor は変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:fm`・`npm run lint:md`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当   | 状態 | メモ |
| --- | ------------------------------------------------ | ------ | ---- | ---- |
| 1   | lint:fm の対象の決まり方を読み、外す方法を決める | _TODO_ | open | -    |
| 2   | 管理外の生成物を外し、確かめる                   | _TODO_ | open | -    |
| 3   | 検査を流し、対応結果に書く                       | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-stm9-business-specs-reps-strategy]]
