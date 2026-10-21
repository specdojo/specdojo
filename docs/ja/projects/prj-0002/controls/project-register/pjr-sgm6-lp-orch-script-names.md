---
specdojo:
  id: prj-0002:pjr-sgm6-lp-orch-script-names
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-19T21:18:30Z"
  completed_at: "2026-10-21T11:47:26Z"
  conclusion: LP の provider ごとの script の表を、codex は npm run orch:sol（orch:terra も追加）、antigravity は npm run orch:flash にした。orch:codex・orch:agy は残っていない
---

# PJR-SGM6 LP の orch の script の名前を model の系統の名前に改める

## 1. 概要

specdojo 本体で配布する orch の script の名前を、codex は orch:sol・orch:terra、antigravity は orch:flash に改める（prj-0001:PJR-16S0）。LP の「導入する」の provider ごとの script の表（src/components/sections/GetStarted.astro の orch:codex・orch:agy）を新しい名前に合わせる。本体の変更が公開されてから LP を変える

## 2. 完了条件

- specdojo 0.4.1 が npm に公開されている（2026-10-21 に公開済み）。
- `src/components/sections/GetStarted.astro` の provider ごとの script の表で、codex を `npm run orch:sol`（`orch:terra` も追加されます）、antigravity を `npm run orch:flash` にする。claude（`orch:opus`・`orch:sonnet`）と opencode（`orch:opencode`）は今のままとする。名前は公開された 0.4.1 の `specdojo init` が作る script に合わせる。
- 同じファイルの中に `orch:codex`・`orch:agy` が残っていない。
- LP のリポジトリの検証（`npm run build` と、LP で定義された lint）が通る。

## 3. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ                                                          |
| --- | ------------------------------------------------- | ---- | ---- | ------------------------------------------------------------- |
| 1   | provider ごとの script の表を新しい名前に合わせる | DEV  | done | `specdojo-lp:src/components/sections/GetStarted.astro` を更新 |

## 4. 対応結果

- `specdojo-lp:src/components/sections/GetStarted.astro` の provider ごとの script の表を更新し、codex を `npm run orch:sol`（`orch:terra` も追加されます）、antigravity を `npm run orch:flash` とした。
- claude（`orch:opus`・`orch:sonnet`）と opencode（`orch:opencode`）は変更していない。
- LP の Prettier、ESLint、静的ビルドが成功し、同ファイルに `orch:codex`・`orch:agy` が残っていないことを確認した。
- 残課題: なし。

## 5. 関連ドキュメント

- prj-0001:PJR-16S0（配布する orch の script の名前を改めた本体の項目）
