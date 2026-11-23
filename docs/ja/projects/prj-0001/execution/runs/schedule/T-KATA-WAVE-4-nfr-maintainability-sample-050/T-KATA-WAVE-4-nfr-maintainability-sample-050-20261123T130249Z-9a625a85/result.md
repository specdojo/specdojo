---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-maintainability-sample-050-20261123t130249z-9a625a85
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-maintainability-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-maintainability-sample-050/T-KATA-WAVE-4-nfr-maintainability-sample-050-20261123T130249Z-9a625a85/plan.md
  started_at: "2026-11-23T13:03:10.653Z"
  completed_at: "2026-11-23T13:25:15.137Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-maintainability-sample
    - specdojo:nfr-maintainability-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/nfr-maintainability-sample.md` を `nfr-maintainability-rulebook.md` の規定する 5 章構成（概要、適用範囲・前提条件、保守性要件一覧、測定・検証方法、関連ドキュメント導線）に基づき、駄菓子屋「きぬや」の具体的数値を用いた完成例として厚くした。
- frontmatter に `part_of` ( `specdojo:nfr-index-sample` ) と `based_on` ( `specdojo:opd-index-sample` ) を追加した。
- 保守性要件（`nfr-mnt-001`〜`005`）に、集計方法・期間を含む具体的な判定基準を記述した。値には、判断が必要な項目について `_UNDECIDED_` を用いて残している。
- Prettier および `markdownlint-cli2` による整形と検査を完了した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-maintainability-sample.md`: rulebook の必須構成に従って再構成し、駄菓子屋の運用（営業時間や切替基準など）に基づいた具体的な要件と測定基準を記述した。一部の決定すべき値は `_UNDECIDED_` としている。

## 3. 申し送り

- `_UNDECIDED_` のまま残した値（PO の判断が要る）: (1) P1 障害の MTTR の上限（`nfr-mnt-003`。可用性の RTO を超えない値で決める）、(2) 商品マスタ・価格変更の変更リードタイムの上限（`nfr-mnt-004`）。決まるまでは測った値の報告だけ行い、pass / fail を判定しない。
- rulebook の変更案: 本書の位置づけ、測定・検証方法の記述ガイド、関連ドキュメント導線は、閾値の判断の記録先を `dec-*` としている。しかし `specdojo:dec-sample` は deprecated で、登録簿の decision へ移っている。sample では「登録簿の decision」と書いたので、rulebook の `dec-*` 参照も登録簿の decision に置き換える必要がある。
- rulebook の変更案: `based_on` に監視・ログ・Runbook の水準の根拠となる文書を書くよう求めているが、`opd-monitoring-sample`・`opr-incident-sample`・`opr-change-sample` はまだ薄い最小サンプルで具体値を持たない。今回は値を持つ `opd-index-sample` だけを `based_on` にした。`opr-*` の sample を厚くするときは、`nfr-mnt-001`（一次切り分け 30 分）と `nfr-mnt-002`（翌営業日 10:00 までの切り戻し）に所要時間・訓練の基準を揃える必要がある。
- sample の本文に足さなかった grade の指摘: F005（承認・公開の責任）、F006（作業項目・役割の割り当て・スケジュール）、F011（確認担当者と合意対象）は、文書の役割の割り当てと承認の進み具合を sample の本文に書かないという PJR-76N9 の決まりに当たるため対応しなかった。再評価で同じ指摘が出る場合は、viewpoint 側で sample を対象外にするよう見直すことを提案する。保守作業を担う役割（OPS・DEV・PO・店番担当）は、文書の中身として適用範囲・前提条件に書いた。
- 兄弟の `nfr-*-sample`（`availability`、`performance`、`index` など）は旧形式の 38 行の最小サンプルのままで、RTO/RPO なども持たない。`nfr-availability-sample` を厚くするときは、RTO を `nfr-mnt-001`・`002`・`003` と矛盾しない値にする必要がある。
- `_UNDECIDED_` のまま残した値（PO の判断が要る）: (1) P1 障害の MTTR の上限（nfr-mnt-003。可用性の RTO を超えない値で決める）、(2) 商品マスタ・価格変更の変更リードタイムの上限（nfr-mnt-004）。決まるまでは測った値の報告だけ行い、pass / fail を判定しない。
- rulebook の変更案: 本書の位置づけ、測定・検証方法の記述ガイド、関連ドキュメント導線は、閾値の判断の記録先を `dec-*` としている。しかし specdojo:dec-sample は deprecated で、登録簿の decision へ移っている。sample では「登録簿の decision」と書いたので、rulebook の `dec-*` 参照も登録簿の decision に置き換える必要がある。
- rulebook の変更案: `based_on` に監視・ログ・Runbook の水準の根拠となる文書を書くよう求めているが、opd-monitoring-sample・opr-incident-sample・opr-change-sample はまだ薄い最小サンプルで具体値を持たない。今回は値を持つ opd-index-sample だけを `based_on` にした。`opr-*` の sample を厚くするときは、nfr-mnt-001（一次切り分け 30 分）と nfr-mnt-002（翌営業日 10:00 までの切り戻し）に所要時間・訓練の基準を揃える必要がある。
- 兄弟の `nfr-*-sample`（availability、performance、index など）は旧形式の 38 行の最小サンプルのままで、RTO/RPO なども持たない。nfr-availability-sample を厚くするときは、RTO を nfr-mnt-001・002・003 と矛盾しない値にする必要がある。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` がない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ のみで docs/ja/projects/ に及ばない）

## 4. 進め方と実践の型の適用

rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。ドラフト状態の sample を、判断基準や測定方法を含む具体的な記述へと更新し、`_UNDECIDED_` を用いることで、後続の意思決定が必要な箇所を明示する。
