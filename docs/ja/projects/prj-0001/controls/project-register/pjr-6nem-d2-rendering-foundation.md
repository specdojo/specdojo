---
specdojo:
  id: prj-0001:pjr-6nem-d2-rendering-foundation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-10-31T14:15:05Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2ZMY
---

# PJR-6NEM D2 の図を描画・検査する基盤を用意する

## 1. 概要

PJR-2ZMY の決定（複雑な図は D2 で描く）を受け、文書のサイトのビルドで D2 のコードブロックを SVG に書き出し、Mermaid と同じく文書の検査と commit の hook で構文を検査できるようにする。Dev Container と CI に d2 の CLI を入れる

## 2. 入力

- PJR-2ZMY で、図は複雑さで使い分け、複雑な図は D2 で描くと決めた（2026-10-31、indie）
- D2 は MPL-2.0。配置のエンジンは同梱の dagre・ELK・TALA（2026-09-07 に MPL-2.0 で公開、D2 v0.9.0 に同梱）から選べる
- Mermaid は packages/docs-site/src/gen-mermaid-svg.ts で SVG にし、tools/lint-mermaid.mjs と lint:mermaid で検査している（PJR-B5TY）

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
