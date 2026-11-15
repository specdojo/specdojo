---
specdojo:
  id: prj-0001:pjr-d948-bds-sample-rework-wave-2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: UX
  registered_at: "2026-11-15T12:22:02Z"
  commit_type: docs
  commit_scope: kata
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
---

# PJR-D948 bds の sample を grade の指摘で手直しする（kata-wave-2 の 2 回目）

## 1. 概要

帳票の sample を最新の grade の指摘で直す

## 2. 入力

- T-KATA-WAVE-2-bds-progress-report-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。型の rulebook は pass、sample は needs-work
- 最新の grade（specdojo.bds-sample）の major の指摘を取り込む。rulebook は変えない

## 3. 完了条件

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込んで直す | UX   | done | -    |
| 2   | grade し直して結果を書く            | UX   | open | -    |

## 5. 対応結果

実施内容（2026-11-16、executor）:

- [[specdojo:bds-sample]] を grade（`specdojo.bds-sample`、needs-work）の F001〜F019 で直した。rulebook は変えていない。駄菓子屋の文脈は保った。
- 営業日の正本に日次締め記録（`cdsd-sample` の管理単位）を加え、見出しの「記録日数」を「営業日数」に改めた。休業日・販売 0 の営業日・記録漏れ（締めの販売件数との不一致）・締め未確定の日を区別し、締め記録を読めないときは報告を保留する（F009・F013）。
- 対象期間を月曜 0 時〜日曜 24 時に固定し、日曜休業の週の契機と全休の週の扱いを定めた。閉店処理の前提の `_ASSUMPTION_` は削除した（F007）。
- 明細は販売か欠品がある商品とし、販売 0 で欠品だけの週も明細に載せるよう例外を直した。注記に欠品の記録の有無を加えた（F006・F010・F014・F015）。
- 出力形式の前提と閲覧範囲（店内限定・個人情報なし）、問い合わせ先を加えた（F002・F008）。
- メモ / 将来課題に分類と引き継ぎ先の列を加え、限定受入の判断（F001）、作業順と担当（F003・F004）、索引 `bds-index` が未作成であること（F016）、変更時の影響と手順（F011・F019）を書いた。「同行レビュー担当」は QE に改めた（F017）。末尾に確定と公開の条件・文書検査・承認者を書いた（F012・F018）。

迷った点と決めた内容:

- 営業日の正本: 販売記録からは休業日と記録漏れを区別できないため、既存 sample で定義済みの日次締め記録を使った。新しい記録を発明しないため。
- 限定受入: 業務イベントが揃うまで、販売数と営業日数だけを受入の対象とし、欠品回数と補充候補は参考表示にする案を PO の判断事項として書いた。補充候補の基準が決まるまでは 1 回以上を候補とする。
- 文書検査のコマンド: rulebook は利用リポジトリの設定から決めるとしているため、「本リポジトリでは」と前置きして例示にとどめた。
- 引き継ぎ先の PJR はまだないので、`specdojo:pjr-bds-sales-events` などをバッククォートで仮置きした。

残課題:

- `grade run --target kata` での再 grade は実際の agent CLI を起動するため executor では実行していない。人間または runner が実行し、sample が pass になったかをここへ追記する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
