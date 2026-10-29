---
specdojo:
  id: prj-0001:pjr-sc8t-deliverable-type-index-cache
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: easy
  registered_at: "2026-10-29T13:15:19Z"
  derived_from:
    - PJR-484B
---

# PJR-SC8T deliverable_type の照合が rulebook の一覧をファイルごとに作り直し lint:fm が遅い

## 1. 概要

remark がファイルごとにプラグインを読み込み直すため、PJR-484B の照合が rulebook の一覧（約 0.34 秒）を毎回作り、lint:fm が 7 分かかって親の検証の上限に迫る。一覧をワークスペースごとに 1 回だけ作る

## 2. 入力

- 利用者の判断（案 A）: 一覧をワークスペースごとに 1 回だけ作って使い回し、修正は @specdojo/docs-lint 0.3.1 として公開する。版の変更と公開作業は本項目の後に orchestrator が別に行う。
- 観測: 何も動かしていない状態で npm run lint:fm が 421 秒。210 ファイルの remark で rulebook の glob が 186 回（作り直し 93 回）呼ばれ、50 秒のうち約 30 秒を占めた。親の検証の上限は 10 分で、PJR-JSEY の lint-fm が 2 回時間切れになった。

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
