---
specdojo:
  id: prj-0001:pjr-wre7-omlx-context-64k
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-03T02:59:25Z"
---

# PJR-WRE7 oMLX の Ornith のコンテキストを 64K にする

## 1. 概要

Ornith-1.5（qwen3_5_moe）は 40 層中 10 層だけが通常の attention で、64K × 2 並列でも KV cache は約 2.7GB に収まる。tsd-omlx と tsd-omlx-opencode のコンテキストの既定を 32K から 64K にし、KV cache の見積もりと、メモリより prefill の時間と品質を見る判断の書き方に直す

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
