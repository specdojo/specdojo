---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-otp-sample-050-20261123t170828z-0134ca0e
  type: exec-result
  task_id: T-KATA-WAVE-5-otp-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-otp-sample-050/T-KATA-WAVE-5-otp-sample-050-20261123T170828Z-0134ca0e/plan.md
  started_at: "2026-11-23T17:08:35.377Z"
  completed_at: "2026-11-23T17:16:47.605Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-sample
    - specdojo:otp-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/otp-sample.md` を `otp-hypercare`（ハイパーケアの当番表と問合せ記録）の完成例として全面的に書き直しました。
- 題材を共通サンプル文脈である「駄菓子屋きぬや」の単一店舗・タブレット1台の構成に統一し、`otp-index` の共通方針を継承しつつ、具体的な当番体制や窓口、バックアップ/リストアの方針を記述しました。
- grade の `finding` (F001〜F029) に基づき、監視対象・エスカレーション条件・権限の扱い・完了条件などの不足項目を補完しました。
- `docs/ja/specdojo/standards/sample-authoring-standard.md` の規定に従い、関係者の表記を役割名および `Role code` に整理しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-sample.md`: ハイパーケアの当番表と問合せ記録の完成例として、業務文脈の統一、監視・体制・窓口の具体化、バックアップ/リストア手順の補完、および完了条件の明文化を行いました。

## 3. 申し送り

- 決める必要のある値: 旧ノートと当番表・問合せ記録の参照・保管期間（`_UNDECIDED_`。`dmd-index` で店主代表が決め、ハイパーケアのクローズ判定までに確定する）。
- 仮置きの値（`_ASSUMPTION_`）: 開発担当が店に来られるのは平日 16 時以降と休日。RTO/RPO は前日の日次締め時点に戻し、翌営業日の開店前に再開する。
- F002・F003・F021（承認者・最終承認責任者）: クローズの判断者（店主代表）は業務の中身として書いた。文書の承認者・承認の進み具合は PJR-76N9 に従って書いていない。
- F011・F025・F027（役割の書き方）: 本文の役割表記は、`sample-authoring-standard` の共通登場人物の役割名にそろえた。rulebook の記述ガイド「当番と窓口の書き方」の良い例は「OPS 2 名 + 業務 1 名」と Role code で書いており、本文は役割名・責務の項目は Role code とする sample 標準と食い違うため、rulebook の例を役割名に直すか Role code を使う範囲を明記する変更案とする。
- rulebook の記述ガイド「監視と障害時の判断」の良い例（API 5xx・#ops・運用責任者）は共通サンプル文脈と業種が違うため、駄菓子屋の文脈の例へ直す変更案とする。
- `otp-index-sample` の第 11 章の見出しが「関連ドキュメント（必須）」のままで、rulebook の「関連ドキュメント」と食い違う（本タスクの対象外のため変更していない）。
- 適用外の検証: `npm run validate:history-links`（変更は `docs/ja/specdojo/samples/otp-sample.md` だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。`docs/ja/specdojo/standards/sample-authoring-standard.md` に従い、性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残す。`grade` が `pass` の型は、理由のある箇所だけを直す。
