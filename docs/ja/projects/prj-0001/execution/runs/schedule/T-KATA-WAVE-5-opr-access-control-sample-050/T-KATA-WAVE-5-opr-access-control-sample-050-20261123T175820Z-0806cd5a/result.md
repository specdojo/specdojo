---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-access-control-sample-050-20261123t175820z-0806cd5a
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-access-control-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-access-control-sample-050/T-KATA-WAVE-5-opr-access-control-sample-050-20261123T175820Z-0806cd5a/plan.md
  started_at: "2026-11-23T17:58:22.253Z"
  completed_at: "2026-11-23T18:12:32.146Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opr-access-control-sample
---

# Edit Result

## 1. 実施内容

- `opr-access-control-sample` を `opr-rulebook` の構成に従い、共通サンプル文脈（駄菓子屋きぬや 販売管理システム）を用いて大幅に拡充した。
- Frontmatter の `rulebook` を `specdojo:opr-rulebook` へ修正し、適用範囲・対象外（特権アカウント）・申請条件・棚卸し・緊急停止・緊急権限・証跡などの必須要素を値で埋めた。
- 既存の表を `opr-rulebook` の要求に合わせ、「付与・区分の変更・剥奪」の手順として再構成し、所要時間や完了条件、証跡の項目を追加した。
- 用語の表記揺れ（`付与/剥奪` から `付与・剥奪` への変更など）や、ロール名の標準化を実施した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-access-control-sample.md`: `opr-rulebook` の必須章構成（概要、適用範囲・前提、棚卸し、緊急停止、緊急権限、証跡、関連ドキュメント導線）を実装し、駄菓子屋の文脈に沿った具体的な運用手順を提供した。また、利用者が決定すべき事項を `_UNDECIDED_` として残している。

## 3. 申し送り

- `opr-sample`（`opr-index` 相当）の「アカウント付与・剥奪手順」は「緊急権限は置かない」「`DEV` が付与・無効化する」としており、方針の `opd-access-control-sample`（緊急権限あり、アカウントの作成・停止・区分の変更は運用の区分＝`OPS`）と食い違う。本書は OPD に合わせたため、`opr-sample` を合わせて直す必要がある。
- F023（ready 化の前提と承認者）は PJR-76N9 の決まり（sample 本文に文書の役割の割り当てと承認の進み具合を書かない）に従い本文へ足していない。登録簿の個票で追うか、型の側で扱うかを判断してほしい。
- F024 は、改訂の契機（「関連ドキュメント導線」の末尾）と模擬の手順（「証跡」の末尾）で満たした。文書の定期レビューの担当は、PJR-76N9 に従い書いていない。
- 既存本文の「- 参照: `../rulebooks/opr-rulebook.md`」の行を削除した。rulebook は Frontmatter で宣言済みで、rulebook の必須要素にも `done_criteria` にも寄与しないため。既存の手順 5 行の表は「アカウント付与・剥奪手順」の「付与・区分の変更・剥奪」へ移し、期限・完了条件・証跡を加えた。ロール名 Support/Ops・Ops Lead・Ops は Role code と役割名に置き換えた。
- 利用者が決める値として `_UNDECIDED_` で残したもの: `PO` に連絡がつかないときの緊急権限、`OPS` に 15 分以内に連絡がつかないときのアカウント停止の代行、監査ログの保管先の分離、権限変更記録・棚卸し記録の保管期間、ホスティング環境と課題管理の管理者アカウントの手順の置き場所。
- `_ASSUMPTION_` として残したもの: 販売管理システムが期限付きの権限変更と 10 分の自動ログアウトを備えること、アカウントと権限区分が記録の正本と同じデータベースにあり復元で戻ること。棚卸しの所要時間 30 分は sample 上の仮定。
- rulebook の変更案: 6.9 の節名「アカウント付与/剥奪手順」を template の「アカウント付与・剥奪手順」に表記をそろえる。また「申請を受け付ける条件」と「対象外の特権アカウント」を rulebook の 6.2 または 6.9 で要求として明記すると、`done_criteria` と型が一致する。

## 4. 進め方と実践の型の適用

既存の `opr-access-control-sample` をベースに、`opr-rulebook` が求める必須要素（概要、適用範囲、棚卸し、緊急停止、緊急権限、証跡、関連ドキュメント導線）をすべて補完する形で拡充を行った。業務文脈は「駄菓子屋きぬや」の販売管理システムに統一し、具体的な手順や条件を記述した。一方で、決定が必要な値については `_UNDECIDED_` を用いて保留し、将来的な決定のために論点を残している。
