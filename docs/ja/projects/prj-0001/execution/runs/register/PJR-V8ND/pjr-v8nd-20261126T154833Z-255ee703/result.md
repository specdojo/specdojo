---
specdojo:
  id: prj-0001:xer-pjr-v8nd-20261126t154833z-255ee703
  type: exec-result
  task_id: PJR-V8ND
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V8ND/pjr-v8nd-20261126T154833Z-255ee703/plan.md
  started_at: "2026-11-26T15:48:34.373Z"
  completed_at: "2026-11-26T15:54:03.120Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- register add の dry-run で出る ID が仮であることを出力で示し、`--commit -m` の `{id}` を実際の項目 ID へ置き換えるようにした。これにより commit メッセージの Refs が実際の ID と食い違う問題を解消する。
- 直し方は `{id}` 差し込み記号を選んだ。Refs には他項目も正当に書けるため、食い違いの検出は誤検知が避けられないと判断した。
- executor が実行した単体テスト 2 ファイル 27 件は通過した。runner の検証では `npm run test:unit` が失敗した。失敗は `tests/src/exec/plans.test.ts` の「Plan conventions version not found」で、変更したファイルとの関係は evidence から確認できない。
- `npm run lint:ts`、`npm run typecheck`、`npm run validate:schema`、`npm run test:integration`（関連テストのみ）は通過した。

## 2. 変更ファイル

- `src/register/create-commands.ts`: register add の dry-run 出力に、表示された ID が仮であることを示す注記を追加した。
- `src/register/register.ts`: `--commit -m` のメッセージ中の `{id}` を、実際に起票された項目 ID へ置き換える処理を追加した。
- `tests/src/register/commit-message.test.ts`: `{id}` が実際の項目 ID に置換されることを検証する単体テストを追加・更新した。
- `tests/src/register/section.test.ts`: 変更に合わせて register の章関連テストを更新した。

## 3. 申し送り

- `npm run test:unit` が `tests/src/exec/plans.test.ts` で失敗している（Plan conventions version not found）。本変更との因果は evidence から確認できないため、原因の切り分けが必要。
- オーケストレーター本文は保護された設定のため未変更。変更案は executor の `handoff` と個票の対応結果に記載済み。
- 手段は {id} 差し込み記号を選択。Refs には他項目も正当に書けるため、食い違い検出は誤検知が避けられないと判断した。
- オーケストレーター本文（保護）への変更案: register add の commit メッセージ手順に「dry-run の ID は仮。Refs には実際の ID か {id} を書く。起票後の出力 Created: ... (added PJR-XXXX) から ID を読む」を足す。反映は利用者の承認のもとで行う。
- CHANGELOG に書く事項: 区分 Fixed。register add --dry-run の ID が仮であることを出力で示し、--commit -m の {id} を実際の項目 ID へ置き換えるようにした（PJR-V8ND）。個票の対応結果に記載済み。
- 統合の後に、オーケストレーターが実際の run を流して動きを確かめてから close する。

## 4. 進め方

dry-run の ID が仮であることを出力に注記し、commit メッセージの `{id}` を起票後の実際の ID へ置換する方式を採った。単体テストを追加し、個票の対応結果に理由と CHANGELOG 文案を記録した。
