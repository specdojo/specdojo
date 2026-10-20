---
specdojo:
  id: prj-0001:pjr-2da0-host-e2e-usage-without-tsx
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-20T12:26:01Z"
  derived_from:
    - PJR-3RXY
---

# PJR-2DA0 ホストの devcontainer の E2E を tsx なしで動かす案内に直す

## 1. 概要

tools/e2e/devcontainer-host-e2e.ts の使い方の表示とガイドは node --import tsx で動かすよう案内しているが、ホストの Mac ではコンテナと共有する node_modules の esbuild が Linux 用のため tsx が動かない。スクリプトは Node の標準ライブラリしか使わず、Node 24 なら node で直接動くため、案内を node tools/e2e/devcontainer-host-e2e.ts に直す（2026-10-20、利用者がホストで流して確かめた）

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
