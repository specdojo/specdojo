---
specdojo:
  id: prj-0001:xer-pjr-v8nd-20261126t154833z-255ee703
  type: exec-result
  task_id: PJR-V8ND
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V8ND/pjr-v8nd-20261126T154833Z-255ee703/plan.md
  started_at: "2026-11-26T15:48:34.373Z"
  completed_at: "2026-11-26T16:21:09.854Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- register add の dry-run に仮 ID の注記を足し、--commit -m の {id} を実際の項目 ID に置換するようにした。単体テストを追加し、個票の対応結果を記入した。

## 2. 変更ファイル

- `src/register/create-commands.ts`: 変更、+10 / -1 行
- `src/register/register.ts`: 変更、+11 / -4 行
- `tests/src/register/commit-message.test.ts`: 変更、+13 / -0 行
- `tests/src/register/section.test.ts`: 変更、+2 / -0 行

## 3. 申し送り

- 手段は {id} 差し込み記号を選択。Refs には他項目も正当に書けるため、食い違い検出は誤検知が避けられないと判断した。
- オーケストレーター本文（保護）への変更案: register add の commit メッセージ手順に「dry-run の ID は仮。Refs には実際の ID か {id} を書く。起票後の出力 Created: ... (added PJR-XXXX) から ID を読む」を足す。反映は利用者の承認のもとで行う。
- CHANGELOG に書く事項: 区分 Fixed。register add --dry-run の ID が仮であることを出力で示し、--commit -m の {id} を実際の項目 ID へ置き換えるようにした（PJR-V8ND）。個票の対応結果に記載済み。
- 統合の後に、オーケストレーターが実際の run を流して動きを確かめてから close する。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
