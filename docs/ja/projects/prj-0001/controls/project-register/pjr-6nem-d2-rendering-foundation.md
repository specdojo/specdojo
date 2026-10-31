---
specdojo:
  id: prj-0001:pjr-6nem-d2-rendering-foundation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-10-31T14:15:05Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: lint-ts"
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

1. 文書のサイトのビルドで、`d2` のコードブロックを SVG に書き出して表示する。Mermaid の `packages/docs-site/src/gen-mermaid-svg.ts` と同じ流れに置く。配置のエンジンの既定は ELK とする。
2. D2 の構文を検査する script（名前は executor が決め、理由を個票の対応結果に書く）を用意し、`check`・lefthook・親の検証に組み込む。PJR-B5TY の Mermaid の検査にならう。
3. Dev Container と CI に `d2` の CLI を入れる。版は固定する。`d2` が無い環境では、原因を示して失敗する。
4. 正しい D2 と誤った D2 の両方について、ビルドと検査のテストを足す。
5. 書き方の文書に、図の使い分けの基準（PJR-2ZMY の決定）を書く。
6. CHANGELOG の `[Unreleased]` の節に追記する。公開済みの節は変えない。
7. 終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通す。あわせて親の検証も通す。
8. `package.json`・`.specdojo/` 配下・agent の定義などの保護された設定を変える必要がある場合は、自分では変えず、案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもとで行う。

## 4. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 完了条件に沿って描画・検査・Dev Container・文書を変更する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2zmy-document-editing-toolset]]
- [[prj-0001:pjr-b5ty-mermaid-syntax-lint]]
