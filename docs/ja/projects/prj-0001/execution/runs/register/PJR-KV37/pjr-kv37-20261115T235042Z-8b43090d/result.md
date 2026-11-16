---
specdojo:
  id: prj-0001:xer-pjr-kv37-20261115t235042z-8b43090d
  type: exec-result
  task_id: PJR-KV37
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-KV37/pjr-kv37-20261115T235042Z-8b43090d/plan.md
  started_at: "2026-11-15T23:51:08.273Z"
  completed_at: "2026-11-16T00:27:31.853Z"
  agent: opus-executor
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
---

# Edit Result

## 1. 実施内容

- ifx-file-sample.md を 2026-11-16 の再 grade の major 指摘 F001〜F007 に沿って直した（販売実績控えスキーマへの明細追加、会計確定の書き込み順序と再開判定の追加、発注 CSV の未着確定と結果不明の区別）。rulebook は変えていない。YAML・JSON の各ブロックはエラーなく読める。個票の作業内容の表と対応結果も更新した。再 grade は orchestrator に引き継ぐ。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-file-sample.md`: 変更、+88 / -30 行

## 3. 申し送り

- 再 grade（`grade run --target kata`）は agent CLI の起動が要るため executor では流していない。orchestrator が流し、結果を PJR-KV37 の対応結果に追記して作業内容の表の 4 行目を閉じる。
- 決めた点: 会計確定は「控え（`pending`）→ `status: payment_requested` → 本部へ送信 → 印字 → `current-tx.json` 削除」の順に書く。`status` が `open` なら未送信と判定できるため。
- 決めた点: `payment_requested` からの取消は不可のままとし、`rejected` は原因を直して同じ `tx_id` で再送する。取消を許すと、状態ファイルがなく `rejected` の控えだけが残る組み合わせが生まれるため。
- 決めた点: 発注 CSV の受領確認は ACK が未確定のため、SFTP の一覧取得と問屋への電話確認にした。結果が不明のときは、未受領か取消済みを確かめてから電話発注する。
- 別の手直しで判断する: `specdojo:clis-sample` は 2 つのスキーマを今も未同梱の架空参照名としている（前回からの申し送り）。
- 人の確認が必要: `grade run --target kata`（agent CLI の起動が必要なため、orchestrator が再 grade して sample が pass か確認する）

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
