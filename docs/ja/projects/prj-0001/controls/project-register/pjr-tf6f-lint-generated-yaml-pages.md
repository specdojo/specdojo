---
specdojo:
  id: prj-0001:pjr-tf6f-lint-generated-yaml-pages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-22T03:12:37Z"
  derived_from:
    - PJR-RS2P
---

# PJR-TF6F YAML の成果物から作る表示のページが、統合の前の lint で古いまま検査される

## 1. 概要

表示のページは git の管理外で worktree の準備のときに作られ、executor が YAML を変えても親の検証の lint-md は古いページを見る。RS2P の誤りは統合の後の別の run で見つかった。

## 2. 入力

- 2026-11-22、RS2P が ifx-index.yaml のコメントを「# #」にし、以後の HCHH・BNAV の lint-md が止まった。
- 利用者の承認（2026-11-22、indie）で起票した。
- orchestrator の調べ（2026-11-22）: 表示のページは src/exec/worktree.ts の generateWorktreeArtifacts が worktree の準備のとき（依存の install の直後）に 1 回だけ作り、executor が YAML を変えた後も、--resume で統合先を取り込んだ後も作り直されない。
- orchestrator の調べ（2026-11-22）: lint-md-changed（tools/lint-changed.mjs）は HEAD からの差分と追跡していない `*.md`（--exclude-standard）だけを見るため、.gitignore にある表示のページは作り直しても検査されない。ページは YAML と同じ階層の generated/`<名前>.md`（src/docs/yaml-pages.ts）。
- 決定（2026-11-22、indie）: 作り直しは YAML を変えた run だけにする。難しさは hard、executor は opus-executor、代わりは sonnet-executor。PJR-MS7X の後に流す。

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
