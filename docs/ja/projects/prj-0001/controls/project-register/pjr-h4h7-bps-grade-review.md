---
specdojo:
  id: prj-0001:pjr-h4h7-bps-grade-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: QE
  registered_at: "2026-09-26T02:13:29Z"
---

# PJR-H4H7 成果物評価の BPS を作成し grade と review の関係を定義する

## 1. 概要

[[prj-0001:pjr-2zvs-grade-review-integration]] で確定した grade と review の関係を、業務プロセス仕様として記述する。個票の決定は経緯を含むため設計の正本にならない。BPS を正本とし、`cdfd-*` の修正とテンプレート改訂はこれを根拠に展開する。

## 2. 記述する設計

[[prj-0001:pjr-2zvs-grade-review-integration]] の `最終結論（2026-09-26）` が正であり、本項目はそれを業務プロセスとして展開する。要点は次のとおり。

| 経路   | 判定対象     | 出力           | 問い                     |
| ------ | ------------ | -------------- | ------------------------ |
| grade  | 成果物       | grade・finding | この文書の品質はどうか   |
| review | タスクの成果 | verdict        | この作業を完了してよいか |

- 評価は grade が 1 回だけ行う。review は文書を再評価しない。
- 評価の実行者は editor から独立する。runner が実行する。
- 観点は 28 件を共通とする。`continuous` は廃止する。
- 鮮度は `content_hash` で保証する。review 時点で最新でなければ実行する。
- review phase は評価を持たないため Do から Action へ移す。

## 3. 対象の成果物

カタログ `dct-business-model-bps.yaml` に BPS が 29 件定義されており、いずれも未作成である。本項目に該当するのは次の 2 件。

| local_id                             | 該当範囲                   |
| ------------------------------------ | -------------------------- |
| `bps-task-review-finalize`           | review と完了処理          |
| `bps-reporting-monitoring-detection` | 監視・検出（grade の評価） |

**カタログの分割が今回の結論と整合するかを確認する。** review が Action へ移るため、`bps-task-review-finalize` の範囲と、grade を `bps-reporting-*` 側に置く妥当性を見直す。分割の変更が必要な場合はカタログを更新する。

## 4. 完了条件

- 対象の BPS が `bps-rulebook.md` に準拠して作成されている。
- grade と review の判定対象、入力、出力、実行主体、起動条件が読み取れる。
- 評価が 1 回であることと、その保証方法（`content_hash`）が記述されている。
- review が文書を再評価しないことと、grade を事実として受け取ることが記述されている。
- editor と評価実行者の独立が記述されている。
- 例外（grade が最新でない、評価不能、対象が評価中に変更された）の扱いが記述されている。
- カタログの分割が結論と整合している。不整合があれば更新されている。
- `done_criteria` を満たしている。
- `npm run -s lint:md` と `npm run docs:build` が通過している。

## 5. 前提

| 前提                                     | 項目                                                           |
| ---------------------------------------- | -------------------------------------------------------------- |
| BPS の記述規約が standard 準拠であること | [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]] |
| sample / template が実例として使えること | [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]       |

**両方の完了を待つ。** 規約が確定しないまま書くと、規約確定後に書き直しになる。

## 6. この BPS を根拠に展開する項目

作成後に起票する。

| 対象                                           | 変更内容                                                  |
| ---------------------------------------------- | --------------------------------------------------------- |
| `cdfd-overview` / `cdfd-check` / `cdfd-action` | review の所属を Do から Action へ。grade と review の関係 |
| `xrp-*` テンプレート                           | 観点で評価する指示 → grade を確認して判断する指示         |
| `xrr-*` テンプレート                           | 観点別結果の記録 → 判断とその根拠の記録                   |
| `sch-strategy-*.yaml`                          | `review` phase の位置づけ                                 |

## 7. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                        |
| --- | ---------------------------------------- | ---- | ---- | --------------------------- |
| 1   | 前提 2 項目の完了を待つ                  | QE   | open | T3NN、8TEN                  |
| 2   | カタログの分割が結論と整合するか確認する | BA   | open | 2 件の範囲と配置            |
| 3   | BPS を作成する                           | QE   | open | rulebook と template に従う |
| 4   | `done_criteria` の充足を確認する         | QE   | open | grade で判定                |
| 5   | 展開する項目を起票する                   | QE   | open | `cdfd-*`、`xrp-*`、`xrr-*`  |

## 8. 対応結果

-

## 9. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]]
- [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bps.yaml`
- `docs/ja/specdojo/rulebooks/bps-rulebook.md`
