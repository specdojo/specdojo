---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-index-sample-050-20261123t092437z-d583f05c
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-index-sample-050/T-KATA-WAVE-5-opr-index-sample-050-20261123T092437Z-d583f05c/plan.md
  started_at: "2026-11-23T09:24:46.878Z"
  completed_at: "2026-11-23T09:45:45.802Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-index-sample
    - specdojo:opr-index-sample
---

# Edit Result

## 1. 実施内容

- sample 文書（`docs/ja/specdojo/samples/opr-index-sample.md`）を、駄菓子屋きぬやの文脈に基づいた詳細な運用手順の完成例へと拡充しました。
- rulebook の構成（12 章構成）と見出しの命名規則、および `sample-authoring-standard.md` の記述基準に従い、構造および内容を再構成しました。
- grade による指摘事項（F001〜F024）に対応し、対象運用の範囲、利用者、業務の目的、および具体的な手順の構成を明記しました。
- frontmatter の `rulebook` 指定および見出しを、実際の `opr-index-rulebook.md` に合わせて修正しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-index-sample.md`: 共通サンプル文脈である「駄菓子屋きぬや」に合わせ、構成と内容を全面的に書き換えました。具体的には、作業の目的や対象者（店番担当・`_OPS_`・`_DEV_`）の明記、運用スコープの定義、および関連ドキュメントへの導線表の整備を行いました。また、`_opd-index-sample_` を参照する分冊構成（`_opr-incident_` 等）の提示を行い、rulebook に基づく適切なインデックス構成を実現しました。

## 3. 申し送り

- `_UNDECIDED_` のまま残した値（利用者が決める）: RTO/RPO とバックアップの保管期間、オフライン時の記録方法、営業時間外の緊急連絡手段、監査ログ以外の証跡の保管期間。
- 運用方針（`_opd-index-sample_`）に週次の作業がないため、3 章では週次点検を置かずその旨を明記した。rulebook の章名「日次/週次/月次」との関係を承認時に確認すること。
- rulebook 変更案: 必須章でも該当する周期（例: 週次）がない場合の記述例を記述ガイドに追加する。
- 既存の `_opr-incident-sample_` などの `_opr-_` 分冊 sample は汎用 Web サービス題材で `rulebook: opd-rulebook` のままなので、きぬや文脈への見直しを別タスクで行う必要がある。
- 運用方針（opd-index-sample）に週次の作業がないため、3 章では週次点検を置かずその旨を明記した。rulebook の章名「日次/週次/月次」との関係を承認時に確認すること。
- 既存の `opr-incident-sample` などの `opr-*` 分冊 sample は汎用 Web サービス題材で `rulebook: opd-rulebook` のままなので、きぬや文脈への見直しを別タスクで行う必要がある。

## 4. 進め方と実践の型の適用

rulebook の構成および `sample-authoring-standard.md` の規範に基づき、対象となる sample 文書を「駄菓子屋きぬや」の具体的な運用シナリオを反映した完成例として拡充しました。grade による指摘事項を解消しながら、未決定事項を `_UNDECIDED_` として残すことで、実用的なサンプルとしての厚みを持たせています。
