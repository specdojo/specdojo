---
specdojo:
  id: prj-0001:xer-t-kata-review-all-etc-sample-140-20261125t020644z-a4f4af27
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-etc-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-etc-sample-140/T-KATA-REVIEW-ALL-etc-sample-140-20261125T020644Z-a4f4af27/plan.md
  started_at: "2026-11-25T02:06:53.727Z"
  completed_at: "2026-11-25T02:19:23.286Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-sample
    - specdojo:etc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`etc-sample.md` に書かれた事実を ifx-cmd-sample、clis-sample、etc-index-sample、tsp-index-sample、etc-rulebook と突き合わせた。
- 不一致が4件あり、`etc-sample.md` で直した。それ以外の主張は正本と一致した。
- F002・F005・F003・F007 は、前の段または既存のケースで解消済みであることを確認した。
- F001 は kata の段のレビューで使わない観点のため扱っていない。F006 はサンプル間の値の整合の問題で、本タスクでは解消していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-sample.md`: R4 の確かめで見つけた不一致4件を直した。(1) `et-receipt-print-failure-handling-010` の期待値と観測点に印字状態 `unknown` を追加した（ifx-cmd-sample の `error_handling.timeout_action` に合わせた）。(2) `et-receipt-print-contract-040` の印刷要求回数を 0 に修正した（終了コード 5 のため、ifx-cmd-sample の `exit_codes` と、終了コード 2 のケース 050 の回数 0 に合わせた）。(3) TR-02 の備考を実際のキー `streams.stdout` に修正した。(4) TR-05 の備考の章名を etc-index-sample の「外部結合テスト共通の境界/依存/環境の扱い」に修正した。13行追加・13行削除。

## 3. 申し送り

- 確かめの表は、executor の handoff 第1項目に14件ある。不一致は4件（上記の直し）、一致は9件、確かめられなかったのは1件。確かめられなかった主張は、stderr のパスの利用者名をマスクすること。ifx-cmd の `log_policy` は秘密値のマスクだけを定めるため、サンプル内の仮定として維持した。
- F006 は未解消。ifx-cmd-sample の `timeout_seconds: 30`・`retry.max_attempts: 3` と、etc-index-sample の応答待ち10秒・自動再送なしが食い違っている。本書は `_UNDECIDED_` で明示している。R5 または ifx-cmd-sample 側で値をそろえる判断が要る。
- etc-index-sample の「ケース表の共通カラム」の記入例と合格基準の例が、無応答を「印刷失敗の警告」と書いている。本書の「結果不明の警告」と印字状態 `unknown` に合わせて直す必要がある（R5）。
- etc-index-sample の観点の型「ET で扱う範囲の非機能（印刷応答待ちの上限遵守）」に当たる観点も、該当しない理由の1行も本書にない。R1・R5 で確かめる。
- R4 確かめの表（reporter が result の実施内容に表として記入する）: 1) failure-handling-010 の印字状態の欠落 / 正本 docs/ja/specdojo/samples/ifx-cmd-sample.yaml の `error_handling.timeout_action` / 読み取り / 不一致 / 「印字結果不明として通知」→ 期待値と観測点に印字状態 `unknown` を追加。2) contract-040 の「印刷要求回数 1」 / 正本 ifx-cmd-sample.yaml の `exit_codes` の 5（デバイスへのアクセス権なし）と exit 2 のケース 050 の回数 0 / 読み取り / 不一致 / 0 に修正。3) TR-02 の備考 `stdout` / 正本 ifx-cmd-sample.yaml / 読み取り / 不一致 / 実際のキー `streams.stdout` に修正。4) TR-05 の備考の章名 / 正本 docs/ja/specdojo/samples/etc-index-sample.md / 読み取り / 不一致 / 「外部結合テスト共通の境界/依存/環境の扱い」に修正。5) 入口が `shell: false`・stdin なし / ifx-cmd の `command.shell` と `streams.stdin.mode` / 一致。6) 終了コード 0・1・2・5 と印字状態の扱い / ifx-cmd の `exit_codes`・`malformed_output_action` / 一致。7) 用紙切れ時に receipt-print は 1・状態 `unknown`、販売 CLI は 0 / ifx-cmd の `permanent_failure` と clis-sample の「印字未完了」の行 / 一致。8) パス receipts/receipt-YYYYMMDD-NNNN.txt と data/sales/TX-YYYYMMDD-NNNN.json / clis-sample の出力情報 / 一致。9) TR-01 の合格率 100% と CI ジョブ kinuya-ci-sales-recovery / tsp-index-sample / 一致。10) TR-03 の `execution.idempotency` / ifx-cmd / 一致。11) TR-04 の章名「代表的な表示と利用者の次の手」 / clis-sample / 一致。12) 応答待ち10秒・自動再送なし / etc-index-sample / 一致（ifx-cmd との食い違いは本書の `_UNDECIDED_` に記載済み）。13) `case_id` と `perspective_key` の形式 / docs/ja/specdojo/rulebooks/etc-rulebook.md / 一致。14) stderr のパスの利用者名をマスクする / ifx-cmd の `log_policy` は秘密値のマスクだけを定める / 確かめられない（サンプル内の仮定として維持）。
- F002・F005（終了コード 2 のケースがない）: ケース `et-receipt-print-contract-050`（終了コード 2、`failed`、印刷要求回数 0）が既にあり解消済み。
- F003・F007: 前の段で直っていることを確認した（030 の主語は `receipt-print`、`unknown` のケースは「結果不明の警告」）。
- F001（`vp-pm-control-reporting`）: kata-guide の「kata の観点の組」で、kata の段のレビューでは使わない観点のため扱っていない。
- F006（ifx-cmd-sample の 30秒・再試行3回と etc-index の 10秒・自動再送なしの食い違い）: サンプル間の整合の問題で R5 の観点に当たる。ifx-cmd-sample か etc-index-sample の値をそろえる判断が要る。本書は `_UNDECIDED_` で明示済み。
- 相手側の修正案: etc-index-sample の「ケース表の共通カラム」の記入例と合格基準の例が、無応答を「印刷失敗の警告」と書いている。本書の「結果不明の警告」と印字状態 `unknown` に合わせて直す（R5）。
- R1・R5 で確かめる事項: etc-index-sample の観点の型「ET で扱う範囲の非機能（印刷応答待ちの上限遵守）」に当たる観点も、該当しない理由の1行も本書にない。

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R4 に従い、sample の事実（終了コード、印字状態、キー名、パス、章名、応答待ち、再送）を正本のサンプル・rulebook と突き合わせた。誤りは `etc-sample.md` の差分で直した。F002・F005 は終了コード 2 のケース `et-receipt-print-contract-050` が既にあり、F003・F007 は前の段で直っていた。F001 は、kata-guide の「kata の観点の組」により、kata の段のレビューでは使わない観点なので扱っていない。F006 は R5 または ifx-cmd-sample 側の判断に回した。根拠のない推測での改訂はしていない。frontmatter の `status` は `draft` のまま据え置いた。検査は、executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ts 系の検査、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit` は変更種別により対象外。
