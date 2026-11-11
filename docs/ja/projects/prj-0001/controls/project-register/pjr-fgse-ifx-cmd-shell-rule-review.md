---
specdojo:
  id: prj-0001:pjr-fgse-ifx-cmd-shell-rule-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-09T03:21:10Z"
  derived_from:
    - PJR-2GD6
  autopilot: approved
---

# PJR-FGSE ifx-cmd の型の shell: false の決まりに、雛形で外部の CLI を起動する場合の扱いを足すか見直す

## 1. 概要

ifx-cmd-rulebook は command.shell に false を求めるが、SpecDojo は exec-defaults.yaml の起動コマンドの雛形（"$(cat)" などシェルの置き換え）で AI provider CLI を shell: true で起動している。雛形で起動する場合の例外を型に足すか、実装を shell を使わない形に変えるかを見直す

## 2. 入力

- 2026-11-09、代表の ifx-cmd-ai-provider-cli の磨き込みで、型（shell: false）と実装（src/exec/run/agent.ts の shell: true）の食い違いが出た。代表は今の実装どおり shell: true とし理由を書く、型の見直しは別の todo にする（indie が推奨どおりと決定）。

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
