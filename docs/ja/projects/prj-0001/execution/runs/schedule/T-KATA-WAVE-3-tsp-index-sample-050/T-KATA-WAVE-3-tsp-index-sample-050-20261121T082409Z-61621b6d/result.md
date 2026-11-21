---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-tsp-index-sample-050-20261121t082409z-61621b6d
  type: exec-result
  task_id: T-KATA-WAVE-3-tsp-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-tsp-index-sample-050/T-KATA-WAVE-3-tsp-index-sample-050-20261121T082409Z-61621b6d/plan.md
  started_at: "2026-11-21T08:24:21.518Z"
  completed_at: "2026-11-21T08:35:17.901Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsp-index-sample
    - specdojo:tsp-index-sample
---

# Edit Result

## 1. 実施内容

- sample ファイル `docs/ja/specdojo/samples/tsp-index-sample.md` を、共通サンプル文脈（駄菓子屋の販売管理システム）に基づいた具体的な完成例へと更新しました。
- `tsp-index-rulebook.md` の構成に従い、概要、テストレベル一覧、スコープ、入口／出口条件などの各章を、実際の業務シナリオ（BAC-01〜03、SC-01、AC-01〜AC-04）と接続する形で記述しました。
- 検証可能な品質基準として、放課後のピークタイムにおける処理性能などの具体的な値を定義しました。
- Prettier による整形、`markdownlint` による検証、および `docs:build` による静的解析がすべて成功していることを確認済みです。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsp-index-sample.md`: rulebook の章順に沿って、駄菓子屋の業務（会計確定の性能目標など）に基づいた具体的なテスト戦略・方針の完成例へと書き換えました。

## 3. 申し送り

- sac-sample と nfr-index-sample はまだ最小サンプルのままで条件 ID がない。そのため tsp-index-sample の総合テストの性能基準は『メモ / 将来課題』で仮置きした（放課後ピーク1時間60取引で会計確定の95%が2秒以内）。両 sample を厚くした後に出口条件を SAC/NFR の ID へつなぎ直す。
- rulebook への変更案: tsp-index-rulebook の記述ガイド（テスト環境・テストデータ、入口／出口条件、メモ / 将来課題）の良い例が決済I/F・日次売上1,000取引を前提にしており、共通サンプル文脈（現金販売のみ・単一店舗）とずれている。印刷連携や放課後ピークなど共通文脈に合う例へ差し替える案を result に記録する。
- F028（sample の保守手順・所有権）は rulebook の『共通の運用』と Sample 記述標準の『運用ルール』が受け持つため、本文に保守手順の章を足していない。F006 のリスク・依存関係はテストレベル一覧・スコープの対象外の表で扱い、rulebook の必須章にない独立したリスク表は置いていない。
- rulebook への変更案: tsp-index-rulebook の記述ガイド（テスト環境・テストデータ、入口／出口条件、メモ / 将来課題）の良い例が決済I/F・日次売上1,000取引を前提にしており、現金販売のみ・単一店舗という共通サンプル文脈とずれている。印刷連携や放課後ピークなど共通文脈に合う例へ差し替える案を result に記録する。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・pjr 個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは `*.md` だけで、`*.yaml` / `*.yml` は変更していない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ 配下の成果物には及んでいない）

## 4. 進め方と実践の型の適用

`tsp-index-rulebook.md` の構成に従い、既存の `docs/ja/specdojo/samples/tsp-index-sample.md` を、具体的なビジネス要求（BAC/SC/AC）に基づいた完成例へと厚くする作業を行いました。単なる項目説明ではなく、駄菓子屋の業務ルールを反映した具体的な値や条件を埋めることで、実例としての品質を確保しています。
