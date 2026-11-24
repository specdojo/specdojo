---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-access-control-sample-050-20261123t090507z-4c39bd3f
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-access-control-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-access-control-sample-050/T-KATA-WAVE-5-opd-access-control-sample-050-20261123T090507Z-4c39bd3f/plan.md
  started_at: "2026-11-23T09:05:16.317Z"
  completed_at: "2026-11-23T09:30:40.721Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-access-control-sample
    - specdojo:opd-access-control-sample
---

# Edit Result

## 1. 実施内容

- opd-access-control-sample を駄菓子屋きぬやの完成例として厚く書き直しました。
- grade による指摘 Findings F001〜F017 をすべて本文に反映し、共通サンプル文脈（店主代表、家族利用者代表等の役割、単一店舗の前提）と `Role code` に基づいた記述へと修正しました。
- 権限の付与・剥奪、棚卸しの具体的なルール、緊急権限（ブレークグラス）の運用、監査ログの保持方針、および関連ドキュメントへの導線を整備しました。
- 利用者が決定すべき事項として、`_UNDECIDED_` を用いて 2 点の未決定事項を残しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-access-control-sample.md`: grade による指摘（F001〜F017）に基づき、概要の業務的価値の説明、棚卸しの実施責任者や合否判定条件の明記、緊急権限の定義、および関連ドキュメント表（`opr-index` への導線を含む）の不足を補完しました。

## 3. 申し送り

- `_UNDECIDED_` を 2 点残した。どちらも `PO` が決める: `PO` に連絡がつかないときに緊急権限を使えるか、監査ログの保管先を記録の正本と分けるか。
- sample の例として決めた値（店番の予定表から外れて 3 か月で停止、無操作 10 分で自動ログアウト、漏えいの疑いから 15 分以内に停止、緊急権限は 24 時間で失効し延長は 1 回まで）が他の sample と食い違わないかを確認する。
- `based_on` は空のまま。`nfr-security-safety-sample` は中身がほとんどなく根拠にできない。権限の要件を持つように厚くすれば `based_on` に加えられる。
- rulebook への変更案: `opd-index` は差分元で `based_on` に載せないので, `opd-rulebook` の記述ガイド「関連ドキュメント導線（`opr` 等）」に, 差分元の `opd-index` を方針の行として導線の表に載せてよいと書く。
- `opr-access-control-sample` は「Ops Lead」「チケット」など一般企業の運用で書かれていて本書と合わない。共通サンプル文脈と `Role code` で書き直すタスクが要る。
- rulebook への変更案: `opd-index` は差分元で `based_on` に載せないので、opd-rulebook の記述ガイド「関連ドキュメント導線（`opr` 等）」に、差分元の `opd-index` を方針の行として導線の表に載せてよいと書く。
- `opr-access-control-sample` は「Ops Lead」「チケット」など一般企業の運用で書かれていて本書と合わない。共通サンプル文脈と Role code で書き直すタスクが要る。
- 適用外の検証: `npm run validate:history-links`（変更したのは samples 配下の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。`_UNDECIDED_` を用いて、利用者が決めるべき値を明示した実例とする。
