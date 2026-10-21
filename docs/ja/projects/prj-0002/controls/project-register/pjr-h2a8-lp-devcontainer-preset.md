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

- specdojo 0.4.1 が npm に公開されている（2026-10-21 に公開済み）。
- LP の「導入する」の「初期設定する」の手順（`src/components/sections/GetStarted.astro`）で、Dev Container を作るかの質問に「はい」、推奨の preset を入れるかの質問に「はい（既定）」と答えればよいことを書く。
- 推奨の preset で入るもの（tmux・emacs・vim・推奨の VS Code 拡張）を短く書く。質問の文言と入るものは、公開された 0.4.1 の `init` と、本体の Quick Start ガイド（prj-0001:PJR-SVHF）に合わせる。
- 既存の手順の流れ（5 つの手順）と文の調子を変えない。
- LP のリポジトリの検証（`npm run build` と、LP で定義された lint）が通る。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                                                          |
| --- | ----------------------------------------------------- | ---- | ---- | ------------------------------------------------------------- |
| 1   | 初期設定の手順に Dev Container の推奨 preset を加える | DEV  | done | `specdojo-lp:src/components/sections/GetStarted.astro` を更新 |

## 4. 対応結果

- `specdojo-lp:src/components/sections/GetStarted.astro` の「初期設定する」に、Dev Container の質問へ y（はい）、推奨 preset の質問へ Enter（既定の「はい」）と答える手順を追加した。
- 推奨 preset で tmux・Emacs・Vim・推奨の VS Code 拡張と設定が入ることを、specdojo 0.4.1 の `init` と Quick Start ガイドに合わせて記載した。
- 会話版とコマンド版で共有する `initStep` だけを更新し、既存の「5 つの手順」の構成と文調を維持した。
- LP の整形、ESLint、静的ビルドを実行して確認した。
- 残課題: なし。

## 5. 関連ドキュメント

- prj-0001:PJR-EN6M（推奨の preset を加えた本体の項目）
- prj-0001:PJR-SVHF（本体の Quick Start ガイドを推奨の preset に合わせる）
