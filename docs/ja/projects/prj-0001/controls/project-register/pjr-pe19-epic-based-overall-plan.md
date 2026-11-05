---
specdojo:
  id: prj-0001:pjr-pe19-epic-based-overall-plan
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-05T22:54:36Z"
  derived_from:
    - PJR-VYSC
---

# PJR-PE19 timeline を非推奨にし、全体計画を epic から作る

## 1. 概要

epic に domains を持たせ、dashboard の全体計画・strategy の範囲・カタログの検出を epic から作り、tml-index.yaml と timeline build を非推奨にする

## 2. 入力

- 由来: PJR-VYSC の決定。timeline の概念を非推奨にし、全体計画を epic から作る（2026-11-06）
- orchestrator の調査: tml-index.yaml は順序・依存のほか、track と domain の対応（strategy の範囲・catalog-scaffold の検出）、`catalog_status`（register から導出済み）、`planned_start_date` と推定日数、epic と strategy-planning の track の確認に使われている。稼働日のカレンダーは sch-defaults.yaml にある（2026-11-06）

## 3. 完了条件

- epic の frontmatter に任意の `domains`（文字列の配列）を足す（`docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`）。epic 以外の項目に書くとエラーにする。`register add --type epic` で `--domain` を繰り返し指定でき、`register update` で置き換えられる。
- `dashboard build` の全体計画（ガント）を epic から作る。順序は epic の `depends_on`。期間は、完了した epic が着手から完了まで、進行中の epic が着手から `due_on` まで、未着手の epic が先行の epic の終わりから `due_on` まで。稼働日は `sch-defaults.yaml` のカレンダーで数える。出力は `execution/generated/` の下に置く。
- _UNDECIDED_: `due_on` がない epic の期間の表し方。executor が決め、理由を個票の対応結果に書く。
- strategy の生成とカタログの検出（`catalog-scaffold`）は、track の範囲を、既存の strategy の scope、その track を担う epic の `domains`、`tml-index.yaml`（あれば）の順で決める。
- epic の起票と strategy-planning の track の確認を、`tml-index.yaml` にあるかから、epic どうしで track が重複しないことと、strategy-planning の対象 track を担う epic があることに変える。
- 互換: `tml-index.yaml` があれば今までどおり読み、非推奨の警告を 1 回出す。`timeline build` のコマンドと `timeline_path` の設定キーは残し、非推奨の警告を出す。
- `register build` が、epic の `depends_on` の循環と、epic どうしの track の重複をエラーにする。
- 単体テストを足す（`domains` の検証、期間の 3 つの規則、範囲の解決の優先順、古い `tml-index.yaml` の読み込みと警告、循環の検出、track の重複の検出）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run validate:schema` が通り、親の検証が通る。
- CHANGELOG は未公開の版の節に、非推奨と移行の方法を書き、公開済みの版の節を変えない。
- 保護された設定（`package.json`・agent の定義・`exec-defaults.yaml` など）は変えない。変更が要る場合は、案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- 文書・Kata・prj-0001 のデータは変えない（PJR-JM29 で扱う）。

## 4. 作業内容

| No  | 作業                                                        | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------------- | -------- | ---- | ---- |
| 1   | epic のスキーマと CLI に `domains` を足す                   | executor | open | -    |
| 2   | dashboard の全体計画を epic から作る                        | executor | open | -    |
| 3   | strategy の範囲・カタログの検出・track の確認を epic へ移す | executor | open | -    |
| 4   | 非推奨の警告と検査を足す                                    | executor | open | -    |
| 5   | テストと CHANGELOG を足す                                   | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- PJR-VYSC: 由来の decision
- PJR-JM29: 後続の文書の todo
