---
specdojo:
  id: prj-0001:pjr-qf45-mermaid-elk-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-22T22:18:08Z"
---

# PJR-QF45 Mermaid の既定のレイアウトを ELK に切り替え、図の絵文字の文字化けを直す

## 1. 概要

Mermaid 12 で ELK が同梱され既定になったが、docs-site の mermaid-config.json が dagre を明示している。ELK に切り替え、ノードの絵文字が文字化けする問題を直す。中心に集める図の描き方（architecture 図）も docs の書き方の文書に書く

## 2. 完了条件

- v0.4.3 の範囲とする（2026-10-23、利用者が承認）。
- `packages/docs-site/mermaid-config.json` の `layout` と `flowchart.layout` を `dagre` から `elk` に変える。個別の図で `config` により dagre を指定しているものはそのままとする。
- ノードの先頭の絵文字（`cdfd-*` の図の 🧑 など）が描画で文字化けする（四角に × の記号になる）問題を直す。`fontFamily` に絵文字のフォントを加え、描画する環境（本リポジトリの devcontainer と、`.github/workflows/deploy.yml` の GitHub Pages のビルド）に絵文字のフォント（`fonts-noto-color-emoji` など）を入れる。`.github/workflows/` は保護された設定のため、executor は変更案を result に書き、反映はオーケストレーターが行う。
- [[specdojo:docs-editing-guide]] の図の書き方に、次を書く。
  - 既定のレイアウトは ELK で、複雑な図でも層に分けて直角の配線になること。
  - 1 つの図の辺が 20 本前後を超える場合は、図を分けるか subgraph でまとめること。
  - 中心の図形に周りから矢印を集める図は `architecture` 図で、辺ごとに出入りする面（`T`・`B`・`L`・`R`）を指定して描けること。矢印にラベルを付けられるか、使える絵柄の種類を確かめて書く。
  - 格子に並べたい図は `block` 図で描けるが、図形が詰まりやすいので `space` で間を空けること。
  - `elk.stress` などの ELK の別の方式は、図形が重なるため使わないこと。
- executor の sandbox では Chromium を起動できないため、図の描画（`npm run docs:rebuild:mermaid`）は `requires_human` としてよい。描画の確認はオーケストレーターが行う。
- `npm run lint:md` と `npm run lint:ts` が通る。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（ドキュメントサイトの変更として）。

## 3. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ   |
| --- | ------------------------------------------------- | ---- | ---- | ------ |
| 1   | Mermaid を ELK に切り替え、絵文字の文字化けを直す | DEV  | open | v0.4.3 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:docs-editing-guide]]
- PJR-2ZMY（文書の編集ツールの方針、継続検討）
