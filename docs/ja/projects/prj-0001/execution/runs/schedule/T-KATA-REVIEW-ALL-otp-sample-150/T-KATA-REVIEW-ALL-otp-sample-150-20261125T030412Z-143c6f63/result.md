---
specdojo:
  id: prj-0001:xer-t-kata-review-all-otp-sample-150-20261125t030412z-143c6f63
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-otp-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-otp-sample-150/T-KATA-REVIEW-ALL-otp-sample-150-20261125T030412Z-143c6f63/plan.md
  started_at: "2026-11-25T03:04:21.762Z"
  completed_at: "2026-11-25T03:17:44.157Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-sample
    - specdojo:otp-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、`otp-sample.md` を `otp-index-sample`・`mip-index-sample`・`cop-sample`・`dmd-index-sample`・`opr-support-sample`・`opr-backup-restore-sample`・`otp-rulebook`・共通サンプル文脈・用語集と照合した。
- `otp-sample.md` の 4 か所で食い違い 5 件を直した。
- 相手側を直すべき点 1 件（R5-6）は変更せず、案を handoff に残した。
- R5-5 と R5-6 には「要判断」の印を付けた。
- runner 検証では lint-md-changed、lint-fm-changed、lint-mermaid、lint-d2、test-docs、validate-schema が passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-sample.md`: R5 の整合修正（14 行追加・14 行削除）。「7. 障害対応フロー」では、復旧見込みの延長の数え方を `otp-index` の延長規則に合わせ、報告の終了条件を `otp-index` の報告の段に合わせた。「10. 移行完了後のクローズ条件」では、日次締めの差異と記録の継続は日次締め記録で測ると明記し、表は本書で測る条件に絞った。「8. 初期増員体制（期間・当番・SLA）」では、SLA の括弧書きを `otp-index` の SLA は P1・P2 だけと直した。「6. 問合せ窓口/一次対応」では、店番が操作の質問に答える上書きの理由を足した。

## 3. 申し送り

- R5-6 は相手側の文書を直す案で、要判断。`otp-index-sample` は USB メモリへのバックアップを前提にしている。`opr-backup-restore-sample` はホスティング環境の夜間バックアップを前提にしており、系列の間で方式が食い違う。どちらを正とするかは `mip-index` と運用方針の前提によるため、本タスクでは決めていない。`opr` の側に揃える場合は、`otp-index-sample` の保管先とリストアの検証を書き換え、本書の「同じ USB メモリへ保存する」も合わせて直す。
- R5-5 も要判断。店番が操作の質問に答える範囲は、上書きの理由を足して残した。ただし、一次対応の担い手の追加にとどまるなら、上書きではなく具体化とみなす余地がある。
- R5-1: R5 / 7. 障害対応フロー / 復旧見込みの行の「続けた日数だけハイパーケアの延長に数える」が、`otp-index` の延長規則（満たさない条件があれば 1 週間延ばして同じ判定をやり直す）とも、本書の「クローズ条件と判定日は変えない」とも食い違う / ノートだけの営業の日は、`otp-index` のクローズ条件の記録の継続で、記録が続かなかった営業日に数えると直した / vp-qe-kata-conformance（`otp-index-sample` のクローズ条件、`otp-rulebook` の禁止事項「`otp-index` の共通方針を理由なく矛盾させる」） / -
- R5-2: R5 / 7. 障害対応フロー / 「報告は…解決日を書いた時点で終わる」が、`otp-index` の報告の段の次へ進む条件（店主代表が報告を読み、通常の記録へ戻すと決めた）を上書きして読める / 「`otp-index` の報告の段に加え、問合せ記録に P1 として書き、店主代表が解決日を書く」に直した / vp-qe-kata-conformance（`otp-index-sample` の障害対応フローの表） / -
- R5-3: R5 / 10. 移行完了後のクローズ条件 / 表の前の文が「各条件を本書の記録で測る」とあるのに、表は `otp-index` の 4 条件のうち P1 と P3 の 2 条件しか扱っていない / 日次締めの差異と記録の継続は `otp-index` のとおり日次締め記録で測ると書き、表は問合せ記録で測る条件と本書が足す条件だけを示すとした / vp-qe-kata-conformance、vp-dev-change-impact（`otp-index-sample` のクローズ条件の 4 項目） / -
- R5-4: R5 / 8. 初期増員体制（期間・当番・SLA） / 正本切替から最初の 3 営業日の SLA の括弧書き「`otp-index` は 3 営業日続いたら上げる」が、`otp-index` の SLA ではなく P3 のエスカレーション条件と比べている / 「（`otp-index` の SLA は P1・P2 だけ）」に直した / vp-qe-kata-conformance（`otp-index-sample` の初期増員体制の表「P1・P2 とも当日の閉店後までに開発担当が対応」） / -
- R5-5: R5 / 6. 問合せ窓口/一次対応 / 店番が「よくある問合せ」の操作の質問に答える範囲は、`otp-index` の営業時間中の一次対応（店主代表）の上書きにあたるのに理由がない / 上書きの理由（店主代表が不在の時間も、操作の質問で客を待たせないため）を足した / `otp-rulebook` の正本参照と責務境界・禁止事項、vp-qe-kata-conformance / 要判断（迷った理由: 一次対応の担い手の追加であり、優先度分類やエスカレーションの差分ではないため、上書きではなく具体化とみなす余地もある。選ばなかった案: 直さずに残す）
- R5-6: R5 / 3. バックアップ/リストア / 本書は `otp-index` に従い USB メモリへのバックアップを前提にしているが、リストア手順の参照先の `opr-backup-restore-sample` はホスティング環境のデータベースの夜間バックアップを前提にしており、サンプルの系列の間でバックアップの方式が食い違う / - / 相手側の文書: `otp-index-sample` の「バックアップ/リストア」（保管先が USB メモリ）と `opr-backup-restore-sample` の対象・使用手段（ホスティング環境）。直す案: どちらかの前提に揃える。`opr` の側に揃える場合は、`otp-index-sample` の保管先とリストアの検証をホスティング環境のバックアップに書き換え、本書の「同じ USB メモリへ保存する」も合わせて直す。vp-dev-change-impact / 要判断（迷った理由: どちらを正とするかは `mip-index` と運用方針の前提によって決まり、本タスクの範囲で決められない。選ばなかった案: 本書だけを `opr` の側に揃える案は、`otp-index` と食い違うため採らなかった）
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/otp-sample.md だけで、plan・result・個票などの履歴ファイルを変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿い、参照の向きを「成果物 → sample」に切り替えて `otp-sample.md` を見直した。根拠にしたのは次の資料である。 - `otp-index-sample`、`mip-index-sample`、`cop-sample`、`dmd-index-sample`、`opr-support-sample`、`opr-backup-restore-sample` - `otp-rulebook`（正本参照の規則、責務境界、禁止事項「`otp-index` の共通方針を理由なく矛盾させる」） - 共通サンプル文脈、用語集 観点は `vp-qe-kata-conformance` と `vp-dev-change-impact` である。構造・必須項目・禁止事項で矛盾があった箇所は rulebook を正とした。 維持した記述は次のとおり。 - `otp-index` と整合する記述 - 前の段が直した版の記述 相手側（`otp-index-sample`、`opr-backup-restore-sample`）は変更していない。 plan に展開された grade の finding と、成果物から届いた Kata が原因の finding は、どちらもなかった。frontmatter の `status` は `draft` のまま据え置いた。
