---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-monitoring-sample-050-20261123t171036z-6193de6f
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-monitoring-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-monitoring-sample-050/T-KATA-WAVE-5-opd-monitoring-sample-050-20261123T171036Z-6193de6f/plan.md
  started_at: "2026-11-23T17:10:38.737Z"
  completed_at: "2026-11-23T17:24:06.478Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opd-monitoring-sample
---

# Edit Result

## 1. 実施内容

- opd-monitoring-sample を駄菓子屋きぬやの共通サンプル文脈に基づいた、opd-index の差分としての完成例へ書き換えました。
- 監視対象を一般的な Web サービスから、店頭端末・記録データ・バックアップといった共通文脈の業務価値に紐づく内容に置き換え、grade の指摘 F001〜F018 を解消しました。
- 監視手段、通知手段、初動の時限と完了条件、および閾値の見直し方法を記述し、関連ドキュメントとしての `opr-index` や `opr-monitoring` への導線を整備しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-monitoring-sample.md`: 監視の対象を共通文脈の業務（店頭販売・在庫・つけ記録）に合わせて具体化し、指標・閾値・通知手段・初動の時限と完了条件を追記しました。また、`opd-index` や `opr-monitoring` などの関連文書への導線を整備しました。

## 3. 申し送り

- `PO` が決める必要のある値: 営業時間外の通知をすぐ受けるか、死活の監視に外部の監視サービスを使うかとその費用額、営業時間内の稼働率の目標（`opd-index` と共通）。sample では `_UNDECIDED_` と決まるまでの扱いを書いて残した。
- 宣言された資料に根拠がなく executor が置いた値: 外部の死活監視サービスを無料の範囲で使い 1 分ごとに確かめる（`_ASSUMPTION_` 付き）、バックアップの成功記録を開店 30 分前の 9:30 に確かめる、死活の通知から 10 分以内に初動を終える、死活の誤検知が月 3 件以上で閾値の変更案を作る。後の 3 つは仮置きの印を付けずに本文に入っているので、関連する sample（`opr-monitoring-sample` など）との整合を確かめる必要がある。
- 既存記述の扱い: Web サービス運用の 3 行（API・DB レプリカ・Batch）は共通サンプル文脈の禁止事項に当たるため、`opd-index-sample` の監視対象 3 つに置き換えた。本文の「参照: rulebook」の行は必須要素にも `done_criteria` にも寄与しないため削除した。`opr-batch` の行は `opd-index` にバッチ監視がないため削除し、`opr-monitoring` で扱う形にした。
- 参照した文書: `opd-rulebook`、`opd-index-sample`、`opd-access-control-sample`（形式の参照に限る）、`sample-authoring-standard`、`prj-overview`。`opd-incident-management-sample` と `opr-*-sample` は宣言されていないため本文を読まず、存在と ID だけを確かめた。導線ではバッククォートの仮置きで書いた。
- PJR-76N9 の決まり: 文書の役割の割り当てや承認の進み具合は本文に書いていない。閾値の変更に `PO` の承認が要ることは、運用の変更管理の中身として書いた。
- rulebook の変更案: 差分の章の中で、測定元・通知の手段・初動の時限と完了条件をどこまで具体化するかの良い例を、`opd-rulebook` の「差分を持つ章」の記述ガイドに足すとよい。

## 4. 進め方と実践の型の適用

既存の成果物を `opd-rulebook` および `sample-authoring-standard` に基づいて磨き込み、共通サンプル文脈における完成例として厚くしました。具体的には、監視対象を業務価値に結びつけ、通知・初動の詳細を記述することで、`opd-index` の差分としての具体性を高めました。
