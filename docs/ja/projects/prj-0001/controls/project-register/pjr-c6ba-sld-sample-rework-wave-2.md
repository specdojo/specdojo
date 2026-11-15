---
specdojo:
  id: prj-0001:pjr-c6ba-sld-sample-rework-wave-2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T12:22:11Z"
  commit_type: docs
  commit_scope: kata
  approach: sample-maintenance
  targets:
    - specdojo:sld-sample
---

# PJR-C6BA sld の sample を grade の指摘で手直しする（kata-wave-2 の 2 回目）

## 1. 概要

保管場所一覧の sample を最新の grade の指摘で直す

## 2. 入力

- T-KATA-WAVE-2-sld-specdojo-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。型の rulebook は pass、sample は needs-work
- 最新の grade（specdojo.sld-sample）の major の指摘を取り込む。rulebook は変えない
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.sld-sample.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）。配る型のため、同じ日に orchestrator が 0.8.0 の前へ前倒しした（利用者が 0.8.0 に足す todo の選定と実行を依頼）

## 3. 完了条件

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の前に流す）: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.sld-sample.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target kata`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                               |
| --- | ------------------------------------------------------ | ---- | ---- | ------------------------------------------------------------------ |
| 1   | 最新の grade の指摘を取り込んで直す                    | ARC  | done | executor が実施（対応結果を参照）                                  |
| 2   | grade し直して結果を書く                               | ARC  | done | 2026-11-16 orchestrator が grade（sld-sample は needs-work 88 点） |
| 3   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | ARC  | open | 0.8.0 の後に流す                                                   |
| 4   | 直した後に grade し直して結果を書く（次の回）          | ARC  | open | orchestrator が流す                                                |

## 5. 対応結果

- 実施内容: 最新の grade（`specdojo.sld-sample`）の指摘 F001〜F018 を sample に反映した。rulebook は変えていない。共通サンプル文脈（駄菓子屋きぬや）を保った。
- 成果物: [[specdojo:sld-sample]]
- executor が決めた点と理由:
  - 仕入記録・在庫記録（F003・F009）: 全体概要（`cdfd-overview-sample`）では、仕入記録は現行が仕入ノート、在庫記録は店主の記憶で、どちらもシステム化後の保管先が `_UNDECIDED_` である。このため仕入ノートは店頭台帳保管棚に入れ、在庫記録は保管場所を持たないものとして「確認事項と変更影響」の `decision` で追跡することにした。
  - 母屋書庫・母屋金庫・外部退避媒体（F008・F018）: 移す先の場所として標準6列の行を足した。媒体の種類と保管先は推測で決めずに `_UNDECIDED_` のまま残した。
  - 保持期間（F007・F015）: 「恒久保持（3年間）」は根拠がなく矛盾しているため使わない。代わりに「保持期間は未決。決定まで全件を保持する」に揃えた。期間の年数は推測で書かず、`decision` として追跡する。
  - `data/sales/`（F011）: CLIS の記述に合わせ、販売実績のローカル控えと本部受付結果の置き場所として扱う。CDSD の販売記録に当たるのは会計確定・受付確認済みの取引だけと決めた。削除不可の理由は、照合の根拠であることと、正本の保存先が未決であることにした。
  - `data/summary/`・`tmp/`: CLIS に定義がないため `_ASSUMPTION_` の仮置きとした。再生成手順が整備されるまでは日次集計を削除しない。`receipts/` は CLIS に再出力の手段がないため、「再出力可能」という記述を取り下げた。
  - 商品の状態（F012）: STSD に合わせ、`sellable` は売場棚だけ、`return-pending` は検品不合格品だけとした。バックヤードの予備棚の行は削除した。売場から撤去した期限切れ・破損品は、STSD に対応する状態がないため撤去品保留箱（`_ASSUMPTION_`）に分け、STSD への状態追加を `change-request` に記録した。
- 残課題: `grade run --target kata` による再 grade は executor の sandbox では実行できない。runner または人が実行し、sample が pass になったかをこの欄に追記する。

再 grade の結果（2026-11-16、orchestrator が実行）: sld-sample は needs-work 88 点。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/` の `specdojo.sld-sample.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
