---
specdojo:
  id: prj-0001:xer-t-kata-review-all-otp-index-sample-150-20261124t233510z-53924293
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-otp-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-otp-index-sample-150/T-KATA-REVIEW-ALL-otp-index-sample-150-20261124T233510Z-53924293/plan.md
  started_at: "2026-11-24T23:35:18.969Z"
  completed_at: "2026-11-24T23:48:12.632Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-index-sample
    - specdojo:otp-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `otp-index-sample` を、同じ接頭辞の個別 sample、`mip-index-sample`、`based_on` の参照先と照合し、食い違い 2 件を sample 側で直した。
- 指摘 R5-1 と R5-2 は `otp-index-sample` 側で修正した。R5-3 と R5-4 は相手側（`otp-sample`）の問題なので変更せず、直す案を handoff に残した。
- grade finding F001 は前の段までに解消済みであることを確認した。
- executor の検査（prettier、markdownlint）と runner の検査（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は成功した。変更種別により非適用の検査は実行していない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-index-sample.md`: 8. 初期増員体制の表の前の文を、ハイパーケアは `mip-index` のとおり正本切替から 2 週間とし、並行記録の 1 週間も同じ体制の表で扱う書き分けに直した。3. バックアップ/リストアのリストア責任者の項目に「戻す手順は `opr-backup-restore` に置く」を足し、11. 関連ドキュメントに `opr-backup-restore` を追加した。差分は 3 行追加、2 行削除。

## 3. 申し送り

- 指摘 R5-3（要判断）: 相手側の `docs/ja/specdojo/samples/otp-sample.md` の 1. 概要で「ハイパーケアの期間（並行記録の 1 週間と正本切替から 2 週間）」と書かれており、`mip-index-sample` や修正後の `otp-index-sample` と食い違う。変更はしていない。直す案は「ハイパーケアの期間（正本切替から 2 週間）と、その前の並行記録の 1 週間に」と書き分けること。`mip-index` を「並行記録を含めて 3 週間」に広げる案もあるが、`based_on` で上流の `mip-index` を正とし、この案は選ばなかった。根拠は `vp-qe-kata-conformance`。
- 指摘 R5-4: 相手側の `docs/ja/specdojo/samples/otp-sample.md` の 2. 監視/アラート（店番メモの補記漏れの備考）にある「店番メモは障害時とバッテリー切れの間に使う」が、`otp-index-sample` の 6. 問合せ窓口/一次対応・7. 障害対応フロー（P1 ではノートへ切り替える）と、`otp-sample` 自身の 4. 権限/アカウント移行（ノートへ書くのは P1 の障害の間だけ）と食い違う。変更はしていない。直す案は備考を「店番メモはバッテリー切れの間と、P1 以外で記録できない操作に使う（P1 の間はノートに書く）」にすること。根拠は `vp-qe-kata-conformance`。
- R5-1: R5 / 8. 初期増員体制（期間・当番・SLA） / 表の前の文「ハイパーケアの期間ごとに」が並行記録の 1 週間をハイパーケアに含めて読め、`mip-index-sample` の「移行後ハイパーケア方針」（期間は正本切替から 2 週間）と食い違う / ハイパーケアは `mip-index` のとおり正本切替から 2 週間とし、並行記録の 1 週間も同じ体制の表で扱うと書き分けた / `vp-qe-kata-conformance`（`based_on` の `mip-index-sample` を正とした） / -
- R5-2: R5 / 3. バックアップ/リストア、11. 関連ドキュメント（必須） / 個別の sample（`otp-sample`）がリストア手順の参照先にしている `opr-backup-restore` への導線が index になく、index から辿れない / リストア責任者の項目に「戻す手順は `opr-backup-restore` に置く」を足し、関連ドキュメントに `opr-backup-restore` を足した / `vp-qe-kata-conformance`（kata 相互）、`vp-dev-change-impact` / -
- R5-3: R5 / otp-sample.md の 1. 概要（hypercare） / 「ハイパーケアの期間（並行記録の 1 週間と正本切替から 2 週間）」が `mip-index-sample`（正本切替から 2 週間）と、直した後の `otp-index` と食い違う / - / 相手側の `docs/ja/specdojo/samples/otp-sample.md` を直す案: 「ハイパーケアの期間（正本切替から 2 週間）と、その前の並行記録の 1 週間に」と書き分ける。`vp-qe-kata-conformance`。迷った理由: `mip-index` の側を「並行記録を含めて 3 週間」に広げる案もあるが、`based_on` で上流にあたる `mip-index` を正とし、その案は選ばなかった / 要判断
- R5-4: R5 / otp-sample.md の 2. 監視/アラート（店番メモの補記漏れの備考） / 「店番メモは障害時とバッテリー切れの間に使う」が、`otp-index` の 6. 問合せ窓口/一次対応・7. 障害対応フロー（P1 ではノートへ切り替える）と、`otp-sample` 自身の 4. 権限/アカウント移行（ノートへ書くのは P1 の障害の間だけ）と食い違う / - / 相手側の `docs/ja/specdojo/samples/otp-sample.md` を直す案: 備考を「店番メモはバッテリー切れの間と、P1 以外で記録できない操作に使う（P1 の間はノートに書く）」にする。`vp-qe-kata-conformance` / -
- R5-5: R5 / 11. 関連ドキュメント（必須） / grade finding F001（5. 運用手順の変更点の参照先 `opr-sales` などが関連ドキュメントにない）は、前の段（`T-KATA-REVIEW-ALL-otp-index-sample-140` まで）で `opr-sales`・`opr-credit`・`opr-daily-closing`・`opr-shift-handover` が足され、解消済みと確かめた / - / `vp-qe-omissions-consistency` / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/otp-index-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

根拠は、`otp-index-sample` の `based_on` にある `mip-index-sample`、同じ接頭辞の個別 sample（`otp-sample`）、grade finding F001 の観点 `vp-qe-omissions-consistency` と、整合の観点 `vp-qe-kata-conformance`、`vp-dev-change-impact` である。構造・必須項目は rulebook を正とし、上流・下流で食い違うときは `based_on` の上流（`mip-index-sample`）を正とした。修正した記述は 2 点で、ハイパーケア期間の表現（R5-1）と `opr-backup-restore` への導線（R5-2）である。F001 の `opr-sales`・`opr-credit`・`opr-daily-closing`・`opr-shift-handover` への導線は、前の段ですでに関連ドキュメントに足されていたため、追加の修正はしていない。相手側の `otp-sample` の食い違い 2 件（R5-3、R5-4）は、このタスクの変更対象外なので直さず、案を handoff に記録した。frontmatter の `status` は `draft` のまま変更していない。
