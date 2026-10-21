---
specdojo:
  id: prj-0002:pjr-h2a8-lp-devcontainer-preset
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-20T13:31:11Z"
---

# PJR-H2A8 LP の初期設定の手順に Dev Container の推奨 preset を入れる

## 1. 概要

specdojo 0.4.1 の init で Dev Container を選ぶと推奨の preset（tmux・emacs・vim・推奨の VS Code 拡張）が既定で入る（prj-0001:PJR-EN6M）。LP の「導入する」の初期設定の手順（src/components/sections/GetStarted.astro）に、Dev Container と推奨の preset を選ぶ答え方を加える。本体の 0.4.1 が公開されてから LP を変える

## 2. 完了条件

- specdojo 0.4.1 が npm に公開されてから着手する。
- LP の「導入する」の「初期設定する」の手順（`src/components/sections/GetStarted.astro`）で、Dev Container を作るかの質問に「はい」、推奨の preset を入れるかの質問に「はい（既定）」と答えればよいことを書く。
- 推奨の preset で入るもの（tmux・emacs・vim・推奨の VS Code 拡張）を短く書く。質問の文言と入るものは、公開された 0.4.1 の `init` と、本体の Quick Start ガイド（prj-0001:PJR-SVHF）に合わせる。
- 既存の手順の流れ（5 つの手順）と文の調子を変えない。
- LP のリポジトリの検証（`npm run build` と、LP で定義された lint）が通る。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ             |
| --- | ----------------------------------------------------- | ---- | ---- | ---------------- |
| 1   | 初期設定の手順に Dev Container の推奨 preset を加える | DEV  | open | 0.4.1 の公開の後 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- prj-0001:PJR-EN6M（推奨の preset を加えた本体の項目）
- prj-0001:PJR-SVHF（本体の Quick Start ガイドを推奨の preset に合わせる）
