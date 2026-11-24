---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-backup-restore-sample-050-20261123t175912z-f1695af4
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-backup-restore-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-backup-restore-sample-050/T-KATA-WAVE-5-opr-backup-restore-sample-050-20261123T175912Z-f1695af4/plan.md
  started_at: "2026-11-23T17:59:16.818Z"
  completed_at: "2026-11-23T18:10:11.640Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opr-backup-restore-sample
---

# Edit Result

## 1. 実施内容

- opr-backup-restore-sample を `opr-rulebook` の 12 章構成に則り、完成例として厚くしました。
- Frontmatter の `rulebook` を `specdojo:opd-rulebook` から `specdojo:opr-rulebook` に修正しました。
- 演習における RTO/RPO ターゲットの判定基準、および目標を満たさない場合の判断・エスカレーションの表を追記しました。
- 利用者が決定すべき値（RTO, RPO, 保管期間など）は `_UNDECIDED_` として残しています。
- 既存の「毎日の確認」および「四半期の演習」の記述を、ルールに基づき「バックアップ確認・リストア手順」および「証跡」の章へ整理・統合しました。また、演習の頻度を `opd-index-sample` との整合性をとるため、四半期から月次へ修正しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-backup-restore-sample.md`: `opr-rulebook` の必須構成（概要、適用範囲・前提、定期点検、障害対応、アラート対応、証跡、関連文書導線など）を満たすよう、章構成の再編と加筆を行いました。演習の判定基準や、目標未達時の判断基準を明記するとともに、フロントマターの `rulebook` 指定を修正しました。

## 3. 申し送り

- 進め方と実践の型の適用: `rulebook` は `opr-rulebook` を構造の基準にし、章立ては `opr-template` の 12 章に合わせた。形式は `opr-sample` (`opr-index`) を参照し、値は `depends_on` の `opd-index-sample`・`opr-sample` と一致させた。`recipe` は `_MISSING_`。
- 既存記述の扱い: 毎日の確認・四半期の演習・証跡の既存記述は、バックアップ確認・リストア手順と証跡の章へ移した。演習の頻度は `depends_on` の `opd-index-sample`（復元の確認は月次）・`opr-sample` と矛盾していたため、四半期から月次に直した。本文の「参照: `../rulebooks/opr-rulebook.md`」は Frontmatter と重複し、本文での補完は `rulebook` に反するため削除した（`F019`）。「失敗があればチケット起票（P2）」は `opr-index` のアラート対応手順への参照に置き換えた。
- 利用者が決める値（`_UNDECIDED_`）: RTO（復元にかけてよい時間）、RPO（失ってよい記録の範囲）、バックアップの保管期間、検証用の環境へ戻した顧客・つけのデータの扱い（`_ASSUMPTION_` として演習の終了時に消すと仮置き）、各証跡の保管期間。RTO が決まるまでの合格条件「閉店 18:00 から翌日の開店前点検 9:45 までの 15 時間 45 分以内」は、`opd-index-sample` の「翌営業日の開店までに復元する」と `opr-sample` の営業時間から導いた仮の値である。
- grade の指摘のうち反映しなかったもの: `F003`・`F009`・`F022`（承認責任・承認者・`ready` 化の承認基準を求める指摘）は、PJR-76N9 と `sample-authoring-standard` の決まりにより、文書の役割の割り当てと承認の進み具合を本文に書かなかった。運用の中身として判断者（PO が復元・エスカレーション先を決める）は書いた。`F011` の運用コマンドとスクリプトのパラメータは、`rulebook` の禁止事項（長大なコマンド列を本文に貼らない）と宣言された資料に根拠がないため、操作の段階の記述にとどめた。`F017` の「## 6 とすべき」は 12 章構成にしたことで解消した。
- rulebook の変更案: `opr-rulebook` の本文要件は `opr-term` にも 12 章すべてを求めるが、記述ガイドのバックアップ確認・リストア手順に「演習で目標を満たさないときの判断の基準とエスカレーション」の要求がない。`done_criteria` に合わせて記述ガイドへ追加することを提案する。また、sibling の `opr-*-sample`（`incident`・`batch`・`change`・`monitoring`・`support`・`access-control`）も Frontmatter が `specdojo:opd-rulebook` のままで章が欠けているため、同じ手直しが必要である。
- 進め方と実践の型の適用: rulebook は opr-rulebook を構造の基準にし、章立ては opr-template の 12 章に合わせた。形式は opr-sample（opr-index）を参照し、値は `depends_on` の opd-index-sample・opr-sample と一致させた。recipe は `_MISSING_`。
- 既存記述の扱い: 毎日の確認・四半期の演習・証跡の既存記述は、バックアップ確認・リストア手順と証跡の章へ移した。演習の頻度は `depends_on` の opd-index-sample（復元の確認は月次）・opr-sample と矛盾していたため、四半期から月次に直した。本文の「参照: ../rulebooks/opr-rulebook.md」は Frontmatter と重複し、本文での補完は rulebook に反するため削除した（F019）。「失敗があればチケット起票（P2）」は opr-index のアラート対応手順への参照に置き換えた。
- 利用者が決める値（`_UNDECIDED_`）: RTO（復元にかけてよい時間）、RPO（失ってよい記録の範囲）、バックアップの保管期間、検証用の環境へ戻した顧客・つけのデータの扱い（`_ASSUMPTION_` として演習の終了時に消すと仮置き）、各証跡の保管期間。RTO が決まるまでの合格条件「閉店 18:00 から翌日の開店前点検 9:45 までの 15 時間 45 分以内」は、opd-index-sample の「翌営業日の開店までに復元する」と opr-sample の営業時間から導いた仮の値である。
- grade の指摘のうち反映しなかったもの: F003・F009・F022（承認責任・承認者・ready 化の承認基準を求める指摘）は、PJR-76N9 と sample-authoring-standard の決まりにより、文書の役割の割り当てと承認の進み具合を本文に書かなかった。運用の中身として判断者（PO が復元・エスカレーション先を決める）は書いた。F011 の運用コマンドとスクリプトのパラメータは、rulebook の禁止事項（長大なコマンド列を本文に貼らない）と宣言された資料に根拠がないため、操作の段階の記述にとどめた。F017 の「## 6 とすべき」は 12 章構成にしたことで解消した。
- rulebook の変更案: opr-rulebook の本文要件は opr-term にも 12 章すべてを求めるが、記述ガイドのバックアップ確認・リストア手順に「演習で目標を満たさないときの判断の基準とエスカレーション」の要求がない。`done_criteria` に合わせて記述ガイドへ追加することを提案する。また、sibling の `opr-*-sample`（incident・batch・change・monitoring・support・access-control）も Frontmatter が specdojo:opd-rulebook のままで章が欠けているため、同じ手直しが必要である。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ の sample だけで、docs/ja/projects/ に届かない）

## 4. 進め方と実践の型の適用

既存の成果物を `opr-rulebook` の要求事項と `done_criteria` に沿って磨き込み、完成例としての厚みを持たせる fully-guided アプローチを実施した。
