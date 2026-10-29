---
specdojo:
  id: prj-0002:pjr-7se0-lp-docs-lint
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  registered_at: "2026-10-29T14:22:37Z"
  derived_from:
    - PJR-HDTZ
---

# PJR-7SE0 specdojo-lp に docs-lint を入れて Markdown を検査できるようにする

## 1. 概要

@specdojo/docs-lint を devDependencies に加え、LP の Markdown の書式（lint:md）と設計文書の frontmatter（lint:fm）を検査する script と設定を置く

## 2. 完了条件

- `specdojo-lp` の devDependencies に `@specdojo/docs-lint` を加え、`package-lock.json` を更新する。
- `specdojo-lp` に `lint:md`（対象は `**/*.md`、`node_modules` などの生成物は除く）と `.markdownlint.yaml` を置き、`npm run lint:md` が通る。`.markdownlint.yaml` は `specdojo init` が生成する内容に合わせる。
- `specdojo-lp` に `lint:fm`（対象は `docs/**/*.md`）を置き、`npm run lint:fm` が通る。rulebook を解決できず動かない場合は `lint:fm` を見送り、理由を対応結果に書く。
- 検査を通すために文書を直した場合は、書式だけを直し、内容を変えない。
- `specdojo-lp` で `npm run build` が成功する。
- 変更は `specdojo-lp` の `feature/prj-0002/lp-docs-lint` で commit し、`develop` へ `--no-ff` で取り込む。`git push` は行わない。

## 3. 作業内容

| No  | 作業                                   | 担当         | 状態 | メモ |
| --- | -------------------------------------- | ------------ | ---- | ---- |
| 1   | docs-lint を入れ、script と設定を置く  | orchestrator | open | -    |
| 2   | 検査とビルドを通し、develop へ取り込む | orchestrator | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hdtz-lp-v0-5-0-update]]
