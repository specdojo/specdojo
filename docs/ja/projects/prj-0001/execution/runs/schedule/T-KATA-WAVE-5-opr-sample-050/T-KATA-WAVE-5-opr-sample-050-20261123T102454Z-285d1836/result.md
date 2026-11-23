---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-sample-050-20261123t102454z-285d1836
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-sample-050/T-KATA-WAVE-5-opr-sample-050-20261123T102454Z-285d1836/plan.md
  started_at: "2026-11-23T10:25:05.603Z"
  completed_at: "2026-11-23T10:39:45.335Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/opr-sample.md` を `opr-template` の 12 章構成に従い、駄菓子屋きぬや 販売管理システムの `opr-index` 完成例として再構成しました。
- Frontmatter に `based_on` ( `specdojo:opd-index-sample` ) と `supersedes` を追加し、依存関係を明示しました。
- 各手順における判定基準や完了条件、および役割（`PO` 等）の明示を行い、`grade` の指摘事項（F003, F005, F006, F018, F025, F027, F028 等）を解消しました。
- 利用者が将来的に決定すべき値（RTO/RPO、保管期間など）を `_UNDECIDED_` として残し、記述の具体水準を担保しました。
- Prettier および `markdownlint` による静的検査をパスしています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: `opr-template` の構成に基づき、概要、手順適用範囲・前提、具体的な実行手順（点検・障害対応等）、判定基準、および関連ドキュメント導線を含む、実利的な `opr-index` の完成例として記述を大幅に拡充しました。

## 3. 申し送り

- F003・F025（draft から ready に進める基準・承認者・判断の段取り）は PJR-76N9 の決まりにより sample 本文に書いていない。文書の承認と留保は登録簿の個票で追う。
- 利用者が決める値: RTO/RPO、バックアップと各証跡の保管期間、オフライン時の記録方法、営業時間外の緊急連絡手段。決まったら、opd-index-sample・opr-index-sample・opr-sample の該当する章を同時に差し替える。
- `opr-sample`（opr-rulebook の sample）と `opr-index-sample`（opr-index-rulebook の sample）は中身がほぼ同じになった。役割を分ける（たとえば opr-sample を term の分冊の例にする）か一方へまとめるかを判断する必要がある。
- rulebook の変更案: opr-rulebook の sample 一覧にある `opr-incident-sample` は frontmatter の `rulebook` が `specdojo:opd-rulebook` で、`based_on` が project 修飾されていない。分冊の sample の rulebook 宣言と中身を opr-rulebook に合わせて見直す。
- F004・F028（承認の境界）は、運用作業の承認者（変更・権限付与は `PO`、停止・紙の控えへの切替判断は `PO`）を手順の表に Role code で書いて対応した。文書そのものの承認者は書いていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/opr-sample.md だけで、plan・result・個票は変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがないため）

## 4. 進め方と実践の型の適用

`opr-rulebook` の `opr-template` に基づき、不十分であった `opr-sample` に具体的な運用手順（点検、障害発生時の判断とアクション、証跡の管理など）の実例を肉付けしました。特に、`grade` で指摘された「判定基準の欠落」や「役割の不明瞭さ」を解消するため、具体的な条件と `PO` 等の役割コードを用いた記述を行っています。また、プロジェクトの将来的な決定事項として `_UNDECIDED_` を用いて値を残しており、完成例としての実用性と、将来の更新への備えを両立させています。
