---
specdojo:
  id: prj-0001:pjr-t4x7-docs-site-exclude-run-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  registered_at: "2026-11-17T05:12:32Z"
  derived_from:
    - PJR-9BY9
    - PJR-G85C
  commit_type: fix
  commit_scope: docs-site
---

# PJR-T4X7 run 単位の plan と result を文書サイトの対象から外し、docs:build のメモリ不足を直す

## 1. 概要

PJR-9BY9 で execution/runs/ へ移した plan・result が srcExclude とリンクの付け替えから外れ、docs:build が 8GB のヒープで止まる

## 2. 入力

- 2026-11-17 に orchestrator が npm run docs:build を流すと、約 19 分後にページの描画（rendering pages）で JavaScript heap out of memory になり SIGABRT で止まった。PJR-G85C の close 時は約 113 秒で通っていた
- packages/docs-site/.vitepress/config.mts の srcExclude は `docs/**/execution/exec/plans/**` と `docs/**/execution/exec/results/**` だけを外す。exec-record-links.ts の `EXEC_RECORD_PATH` も execution/exec/(plans|results)/ だけに一致する
- docs 配下の execution/runs/ には plan.md・result.md が 3,323 件あり、途中までの dist には execution/runs/ の HTML が 1,826 件出ていた

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
