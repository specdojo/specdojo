---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-dmd-sample-050-20261123t083237z-1042ddf1
  type: exec-result
  task_id: T-KATA-WAVE-5-dmd-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-dmd-sample-050/T-KATA-WAVE-5-dmd-sample-050-20261123T083237Z-1042ddf1/plan.md
  started_at: "2026-11-23T08:32:49.277Z"
  completed_at: "2026-11-23T08:54:44.640Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-sample
    - specdojo:dmd-sample
---

# Edit Result

## 1. 実施内容

- sample ファイルを「駄菓子屋きぬや」の業務文脈（顧客台帳とつけ残高の移行）に合わせて全面的に書き換え、指示されたすべての `finding` (F001〜F019) に対応しました。
- 具体的には、題材を数百万件の受注データから小規模な常連客ノートの転記へと変更し、技術的な前提（S3/ジョブ基盤から端末内への変更）や検証項目（件数照合の追加、合格基準の理由明記、確認者の役割明記）を修正しました。
- また、`dmd-index-sample` との整合性をとり、除外条件の整理や、主キーの採番扱い、テーブル名の変更補足などの詳細を記述しました。
- 最終的に `prettier` による整形と `markdownlint-cli2` による検証を行い、問題がないことを確認しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-sample.md`: 共通サンプル文脈「駄菓子屋きぬや」の業務（顧客台帳とつけ残高の移行）に基づき、内容を全面的に刷新しました。`finding` で指摘された、移行対象の設定、所要時間見積の算出前提、データの除外条件の定義、検証時の確認者や合格基準の記述、技術的な配置場所、および主キーの扱いについて、実例として厚みを持たせて記述しています。

## 3. 申し送り

- 未決事項: 切替日の臨時休業の開始時刻と、そのうち顧客台帳とつけ残高に充てる時間（性能/所要時間見積の章で `_UNDECIDED_`）。正午の開店に間に合うかの判定に要るため、店主代表が移行リハーサルの結果を見て決める。
- F006 の対応: `dmd-index-sample` は除外の条件を取り消し線だけとしているため、旧 sample の「3 年経過」の除外は削除した。経過年数で除社しないことと、判定は書き写す時点の記入で行うことを明記した。
- rulebook の変更案: 記述ガイド「ログ/再実行性」の推奨表の例「S3/ログ基盤/DB」は小規模な題材と合わないので、「端末内の作業フォルダ/ログ基盤」など一般的な表現にするとよい。
- rulebook の変更案: 本文要件の見出し「関連ドキュメント」と、`dmd-index-sample` の「関連ドキュメント（必須）」で表記が揺れている。どちらかにそろえるか確認が必要。
- F006 の対応: `dmd-index-sample` は除外の条件を取り消し線だけとしているため、旧 sample の「3 年経過」の除外は削除した。経過年数で除外しないことと、判定は書き写す時点の記入で行うことを明記した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/dmd-sample.md だけで、plan・result・個票などの履歴ファイルを変更していないため）

## 4. 進め方と実践の型の適用

指示された `finding` (F001〜F019) をすべて解消することを目的として、`docs/ja/specdojo/samples/dmd-sample.md` を「駄菓子屋きぬや」の具体的な業務内容（顧客台帳とつけ残高の移行）に即した完成例として書き直しました。題材の不整合を解消し、技術的制約や検証手順、データの扱いに関する詳細を、rulebook の記述ガイドに沿って補完しました。
