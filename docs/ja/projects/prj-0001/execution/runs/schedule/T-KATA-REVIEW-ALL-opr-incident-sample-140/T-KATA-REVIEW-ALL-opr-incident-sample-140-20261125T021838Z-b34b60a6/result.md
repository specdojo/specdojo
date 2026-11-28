---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-incident-sample-140-20261125t021838z-b34b60a6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-incident-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-incident-sample-140/T-KATA-REVIEW-ALL-opr-incident-sample-140-20261125T021838Z-b34b60a6/plan.md
  started_at: "2026-11-25T02:18:47.594Z"
  completed_at: "2026-11-25T02:31:43.816Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-incident-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`opr-sample.md` の記載事実を schema、template、`pm-roles-sample.yaml`、`opd-*-sample`、分冊 sample と突き合わせた。誤りは見つからず、ファイルの差分はない（`changes` は空）。
- 確かめた主張は次の 12 種類で、いずれも正本と一致した。確かめの表は executor の handoff に 1 件ずつ記録されている。
- frontmatter の `type: operations`、`rulebook`、`based_on`、`supersedes`
- 参照 id（`opd-index-sample`、`opr-index-sample` と分冊 sample）
- 章見出し 1〜12 と表の列名
- ロールコード `OPS`、`DEV`、`PO`
- 営業時間と P1〜P3 の対応目標
- 監視の閾値
- RTO/RPO の仮扱いと監査ログの保管期間
- 変更種別ごとの承認者
- 再実行の上限
- 権限剥奪の時期
- 月次点検と問い合わせの応答目標
- `closing_date`、`run_id`、`ticket_id` などの業務上の識別子は、正本のない仮定のため確かめの対象外とした。
- plan に展開された finding の扱い:
- F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューから外す観点のため、R4 では扱わない。
- F002 は、概要の未決事項の表に「監査ログ以外の証跡の保管期間」の行があり、解消済み。
- F003 は、関連ドキュメント導線の表に分冊 8 件があり、`opr-incident-sample` も作成済みのため解消済み。この観点は R5 の担当である。
- runner 検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`validate:schema` が通った。それ以外は変更の種類により非適用だった。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5 への申し送り: 障害対応手順 P1 の一次対応「つけの新規記録を止め」は、OPD の「つけ残高を確認できない間は受けない」より範囲が広く読める。販売だけが記録できない P1 の場合に当たる。正しさの誤りではなく整合の論点として、R5 で確認する。
- R4 確かめの表: 1) frontmatter `type: operations` — 正本 docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml の deliverableType enum と opr-rulebook の「設定内容」— 一致。
- R4 確かめの表: 2) frontmatter の `rulebook`・`based_on`・`supersedes` — 正本 docs/specdojo/schemas/v1/common-frontmatter.schema.yaml（`based_on` 72 行・`supersedes` 75 行）と opr-rulebook — 一致。
- R4 確かめの表: 3) frontmatter と本文 wikilink の参照 id（opd-index-sample、opr-index-sample、opd-incident-management-sample、opr-incident/monitoring/backup-restore/batch/change/access-control/support-sample）— 正本 各 sample の frontmatter `id` — すべて実在で一致。
- R4 確かめの表: 4) 章見出し 1〜12 と各表の列名 — 正本 docs/ja/specdojo/templates/opr-template.md — 一致。
- R4 確かめの表: 5) ロールコード `OPS`（Operations / Release Manager）・`DEV`（Developer）・`PO`（Project Owner）— 正本 docs/ja/specdojo/samples/pm-roles-sample.yaml — 一致。
- R4 確かめの表: 6) 営業時間 10:00〜18:00、P1 15 分以内・30 分で紙の販売控えへ切替（判断は `PO`）、P2 当日閉店まで、P3 次の月次点検 — 正本 opd-index-sample.md の運用の範囲・前提、体制・責任分界、障害対応方針 — 一致。
- R4 確かめの表: 7) 死活 営業時間中 5 分無応答、夜間バックアップ 9:30 判定、死活の誤検知 月 3 件以上で閾値見直し — 正本 opd-index-sample.md の監視・アラート方針と opd-monitoring-sample.md 46・49・71 行 — 一致。
- R4 確かめの表: 8) RTO/RPO の仮扱い（翌営業日開店までに前日閉店時点へ）、監査ログ保管 1 年、閉店後 1 日 1 回取得 — 正本 opd-index-sample.md のバックアップ・リストア方針と権限・アカウント運用 — 一致。
- R4 確かめの表: 9) 変更種別ごとの承認者・時間帯・ロールバック条件（版の更新・価格一括変更は `PO`・閉店後、表示修正は `OPS`）— 正本 opd-index-sample.md の変更管理 — 一致。
- R4 確かめの表: 10) 再実行の上限（自動を含め 1 日 2 回、手動は 1 回まで）— 正本 opr-batch-sample.md 113 行 — 一致（OPD に値の正本はなく、分冊との照合）。
- R4 確かめの表: 11) 剥奪の時期（店番をやめた日、保守作業が終わった日のうち）— 正本 opd-access-control-sample.md 48・52 行 — 一致。
- R4 確かめの表: 12) 月次点検は最初の休業日、実施漏れは翌週、問い合わせの応答目標 — 正本 opd-index-sample.md の定期運用方針と問い合わせ運用方針 — 一致。
- R4 確かめの表: 13) `closing_date`・`run_id`・`ticket_id` などの業務上の識別子 — 正本なし（共通サンプル文脈の業務上の仮定）— 確かめの対象外。
- finding の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は kata-guide の「kata の観点の組」で kata の段のレビューから外す観点（kata の承認と ready 化は登録簿で追う）のため対応しない。F002 は概要の未決事項の表に「監査ログ以外の証跡の保管期間」の行があり解消済み。F003 は関連ドキュメント導線の表に分冊 8 件があり `opr-incident-sample` も作成済のため解消済み（観点は R5 の担当）。
- R5 への申し送り: 障害対応手順 P1 の一次対応「つけの新規記録を止め」は、OPD の「つけ残高を確認できない間は受けない」より範囲が広く読める（販売だけ記録できない P1 の場合）。正しさの誤りではなく整合の論点として R5 で確認する。
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/opr-sample.md`（変更した `*.md` / `*.ts` / `*.js` / `*.json` / `*.yaml` / `*.yml` ファイルがない）
- 適用外の検証: `npm run validate:history-links`（executor は plan / result / 個票を変更していない）

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R4 に従い、`opr-sample.md` の事実（frontmatter、参照 id、章構成、ロールコード、OPD・分冊由来の数値と条件）を schema、template、`pm-roles-sample.yaml`、`opd-*-sample`、`opr-batch-sample` と照合した。誤りは見つからなかったため、sample は変更せず維持した。正本のない業務上の識別子は、共通サンプル文脈の仮定として確かめの対象にしていない。F001 と F004 は kata の段のレビューで外す観点のため見送った。承認と ready 化は登録簿で追う。F002 と F003 は現行の記述で解消済みと確認した。前の段の指摘は繰り返していない。
