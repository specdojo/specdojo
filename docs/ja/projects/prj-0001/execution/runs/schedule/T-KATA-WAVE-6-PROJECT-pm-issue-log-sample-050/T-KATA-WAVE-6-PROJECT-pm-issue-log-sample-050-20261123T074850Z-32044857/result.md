---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-issue-log-sample-050-20261123t074850z-32044857
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-050/T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-050-20261123T074850Z-32044857/plan.md
  started_at: "2026-11-23T07:48:59.040Z"
  completed_at: "2026-11-23T08:02:18.098Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-issue-log-sample
    - specdojo:pm-issue-log-sample
---

# Edit Result

## 1. 実施内容

- pm-issue-log-sample を、駄菓子屋きぬやの単独の課題ログの完成例として書き直しました。
- F001〜F020 の指摘事項をすべて sample 内で解消し、rulebook は変更していません。
- npx `prettier` による整形後、npx `markdownlint-cli2` のエラーは 0 件です。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-issue-log-sample.md`: 課題ログの完成例として、概要への詳細追記、優先度基準・期限設定ルール・エスカレーション先・更新責任者の記述、および statuse の値を rulebook に則った `high` や `in-progress` 等の形式へ修正を行いました。また、関連ドキュメントの参照をプロジェクト ID を用いた形式へ更新しました。

## 3. 申し送り

- F012 の『更新責任者』は今の `pm-issue-log-rulebook` の記述ガイドに見当たらないため、ステータスの更新を記録する Role を進捗レビューの表に書いて対応しました。この扱いでよいかは判断が要ります。
- sample に例として置いた値: 受入テスト 24 件、商品 30 件・常連顧客 10 件、表示倍率 125%、決定記録 `kinuya-decision-log` の DR-001（実体がないためバッククォートで仮置き）。関連 sample に根拠はありません。
- 初期リリース候補日は `pm-plan-sample` の U-03 に合わせて `_UNDECIDED_` で残しました。U-03 が決まったら、`high` の判定に使う候補日を確定する必要があります。
- 記載時点を 2026-04-07 に設定しました。IS-001 の期限が 2026-04-08 であるため、変更要求ログの sample の記載時点（2026-04-09）とは 2 日の差があります。
- `pm-risk-register-sample` が旧い書き方のまま（「高」「対応中」、「開発リード」、プロジェクト名の不一致）であるため、本課題ログと揃えて直すべきです。
- F012 の『更新責任者』は今の pm-issue-log-rulebook の記述ガイドに見当たらない。ステータスの更新を記録する Role を進捗レビューの表に書いて対応した。この扱いでよいかは判断が要る。
- sample に例として置いた値: 受入テスト 24 件、商品 30 件・常連顧客 10 件、表示倍率 125%、決定記録 `kinuya-decision-log` の DR-001（文書がないのでバッククォートで仮置き）。関連 sample に根拠はない。
- 初期リリース候補日は pm-plan-sample の U-03 に合わせて `_UNDECIDED_` で残した。U-03 が決まったら、`high` の判定に使う候補日を確定する。
- 記載時点を 2026-04-07 にした。IS-001 の期限が 2026-04-08 で、変更要求ログの sample の記載時点（2026-04-09）とは 2 日ずれる。
- pm-risk-register-sample が旧い書き方のまま（「高」「対応中」、「開発リード」、プロジェクト名の不一致）。課題ログと揃えて直す候補。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

rulebook に基づき、`docs/ja/specdojo/samples/pm-issue-log-sample.md` を、駄菓子屋きぬやのプロジェクトにおける単独の課題ログの完成例として、密度を上げて更新しました。F001〜F020 の findings に対応する形で、概要・優先度基準・期限・更新責任者・完了条件・関連ドキュメントの記述を補完・修正しました。
