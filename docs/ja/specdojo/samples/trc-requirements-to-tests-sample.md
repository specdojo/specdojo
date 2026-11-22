---
specdojo:
  id: specdojo:trc-requirements-to-tests-sample
  type: project
  status: draft
  rulebook: specdojo:trc-requirements-to-tests-rulebook
  based_on:
    - specdojo:bac-sample
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
    - specdojo:atc-sample
    - specdojo:stc-sample
    - specdojo:stc-index-sample
  supersedes: []
---

# 駄菓子屋きぬや 要求とテストの対応（初期リリース）

## 1. 目的と適用範囲

本書は、テスト成果物の `relations.verifies` と「トレース」の表から生成した派生ビューであり、表を手で直さない。初期リリースで受入に必須の要求項目（現金販売の業務受入条件、成功基準と受入条件）と、それを検証する受入テスト・総合テストの対応を示す。

| 利用者         | 使う場面                                    | 本書で確かめること                                          |
| -------------- | ------------------------------------------- | ----------------------------------------------------------- |
| QE             | `atc-cash-sale`・`stc-cash-sale` のレビュー | 対応テストのない要求項目、`trace_key` の参照漏れ            |
| 店主代表（PO） | 初期リリースの受入判断                      | `充足` でない要求項目が残っていないか、受入を保留すべき項目 |
| PM             | ギャップの登録簿への転記                    | 「ギャップと対応方針」の各行と直す生成元の成果物            |

対象外は次のとおり。

- 成功基準 SC-02〜SC-06: 運用開始後の実績で判定する指標であり、テストで検証しないため。
- 性能試験・単体テスト: 初期リリースの受入判断に使わず、会計確定の応答は `stc-cash-sale` の 1 ケースだけで測る方針（[[specdojo:tsp-index-sample|テスト戦略・方針]]）のため。

## 2. トレース対象の前提

- 要求の母集団（8 件）:
  - [[specdojo:bac-sample|現金販売の業務受入条件]] の BAC-01〜BAC-03（3 件）。
  - [[specdojo:prj-success-criteria-and-acceptance-criteria-sample|成功基準と受入条件]] のうち初期リリースの受入に必須の SC-01・AC-01〜AC-04（5 件）。
- テストの抽出条件: `relations.verifies` に母集団の要求文書を 1 つ以上持つ受入テスト・総合テスト。加えて、[[specdojo:stc-index-sample|総合テストカタログ 概要]] に載る総合テストの「トレース」の表を走査し、`relations.verifies` を欠くテストを照合で拾う。
- 抽出したテスト: [[specdojo:atc-sample|受入テストカタログ: 店頭の現金販売]]（ローカル ID `atc-cash-sale`）、[[specdojo:stc-sample|総合テストカタログ: 店頭の現金販売]]（ローカル ID `stc-cash-sale`）。
- 生成の手段と生成日: 生成コマンドがないため、rulebook の「生成の手順」による手作業で 2026-05-11 に QE が生成した。
- 生成元の版: `main` の `4f9e2c1`。
- 確認の手順: 別の QE が同じ版で「生成の手順」をたどり、マトリクス・母集団外の参照・サマリの件数が本書と一致することを照合する。差分があれば生成元を確かめ、本書を直さずに再生成する。

## 3. トレースマトリクス

| 要求ID                                                      | 要求要約                                     | 対応テストID                                 | 充足状況 | ギャップ                                                                                                    | 備考                                               |
| ----------------------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `bac-sample BAC-01`                                         | 現金販売を確定して記録を照合する             | `atc-cash-sale TR-01`, `stc-cash-sale TR-01` | 一部充足 | `atc-cash-sale`・`stc-cash-sale` が `draft`。`stc-cash-sale` の `relations.verifies` に `bac-sample` がない | `atc-cash-sale`: `draft`, `stc-cash-sale`: `draft` |
| `bac-sample BAC-02`                                         | 在庫不足なら販売を確定せず確認へ戻る         | なし                                         | 未着手   | 対応テストがない（`atc-cash-sale`・`stc-cash-sale` は対象外とし、未作成の `*-sale-hold` へ委ねている）      | なし                                               |
| `bac-sample BAC-03`                                         | 必須情報が不足した購入を未確定のまま引き継ぐ | なし                                         | 未着手   | 対応テストがない（BAC-02 と同じく `*-sale-hold` へ委ねている）                                              | なし                                               |
| `prj-success-criteria-and-acceptance-criteria-sample SC-01` | 主要操作を迷わず完了できる                   | `atc-cash-sale TR-03`                        | 一部充足 | `atc-cash-sale` が `draft`                                                                                  | `atc-cash-sale`: `draft`                           |
| `prj-success-criteria-and-acceptance-criteria-sample AC-01` | 販売を記録できる                             | `atc-cash-sale TR-02`, `stc-cash-sale TR-02` | 一部充足 | `atc-cash-sale`・`stc-cash-sale` が `draft`。`stc-cash-sale` の `relations.verifies` に要求文書がない       | `atc-cash-sale`: `draft`, `stc-cash-sale`: `draft` |
| `prj-success-criteria-and-acceptance-criteria-sample AC-02` | 在庫とつけ残高を確認できる                   | なし                                         | 未着手   | 対応テストがない（`atc-cash-sale` は未作成の `atc-stock-credit-check` へ委ねている）                        | なし                                               |
| `prj-success-criteria-and-acceptance-criteria-sample AC-03` | 主要操作で重大な行き詰まりがない             | `atc-cash-sale TR-03`                        | 一部充足 | `atc-cash-sale` が `draft`                                                                                  | `atc-cash-sale`: `draft`                           |
| `prj-success-criteria-and-acceptance-criteria-sample AC-04` | 確認結果を追跡できる                         | `atc-cash-sale TR-04`                        | 一部充足 | `atc-cash-sale` が `draft`                                                                                  | `atc-cash-sale`: `draft`                           |

抽出したテストの `trace_key` はすべてケース表の `トレース` 列から参照されており、検証ケース未記載による `一部充足` はない。

母集団外の参照は次のとおり。

| 参照ID                                  | テストID              | ギャップ                                                                           |
| --------------------------------------- | --------------------- | ---------------------------------------------------------------------------------- |
| `atc-index-sample` 分割基準・合格基準   | `atc-cash-sale TR-05` | 確定前の取消を要求でなく索引の分割基準で検証しており、取消の要求項目が母集団にない |
| `stc-index-sample` 分配方針             | `stc-cash-sale TR-04` | `atc-cash-sale TR-05` と同じく、取消の要求項目が母集団にない                       |
| `ifx-cmd-sample`                        | `stc-cash-sale TR-03` | 要求でなく連携仕様を指す。要求との対応は「要求→仕様」のビューで扱う                |
| `tsp-index-sample` 総合テストの出口条件 | `stc-cash-sale TR-05` | 出口条件が BAC-01〜BAC-03 を挙げるが、BAC-02・BAC-03 を検証する総合テストがない    |

## 4. 充足状況サマリ

| 充足状況       | 件数 |
| -------------- | ---- |
| 充足           | 0    |
| 一部充足       | 5    |
| 未着手         | 3    |
| 合計           | 8    |
| 母集団外の参照 | 4    |

優先する要求項目と理由は次のとおり。

1. `bac-sample BAC-02`・`BAC-03`: 在庫不足や情報不足の購入を誤って確定すると販売記録と在庫が食い違い、店主不在の店番で起きても気づけない。初期リリースの受入に必須で、テストが 1 件もない。
2. `prj-success-criteria-and-acceptance-criteria-sample AC-02`: つけ残高の確認は常連客との金銭の照合に直結し、受入に必須でテストがない。
3. `bac-sample BAC-01`・`AC-01`: テストはそろっているが、`stc-cash-sale` の `relations.verifies` の欠落は文書単位の追跡から総合テストを外すため、`ready` にする前に直す。

## 5. ギャップと対応方針

| 対象                                                        | ギャップ                                       | 直す生成元の成果物と直し方                                                                                                                          | 解消の判定条件                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `bac-sample BAC-01`, `AC-01`                                | `stc-cash-sale` の `relations.verifies` がない | `stc-cash-sale` の `relations.verifies` に `bac-sample` と `prj-success-criteria-and-acceptance-criteria-sample` を加える                           | 再生成でギャップ列から `relations.verifies` の不足が消える                            |
| `BAC-01`, `SC-01`, `AC-01`, `AC-03`, `AC-04`                | 対応テストが `draft`                           | `atc-cash-sale`・`stc-cash-sale` を各カタログの `ready` 条件（判定に影響する前提の解消を含む）でレビューし、人が `ready` にする                     | 再生成で該当行が `充足` になる                                                        |
| `bac-sample BAC-02`, `BAC-03`                               | 対応テストがない                               | `atc-sale-hold`・`stc-sale-hold` を作成し、`relations.verifies` に `bac-sample`、「トレース」の表に BAC-02・BAC-03 とそれを参照するケースを持たせる | 再生成で両行が `一部充足` 以上になる                                                  |
| `prj-success-criteria-and-acceptance-criteria-sample AC-02` | 対応テストがない                               | `atc-stock-credit-check` を作成し、`relations.verifies` に要求文書、「トレース」の表に AC-02 とそれを参照するケースを持たせる                       | 再生成で `一部充足` 以上になる                                                        |
| `atc-cash-sale TR-05`, `stc-cash-sale TR-04`                | 取消の要求項目が母集団にない                   | BA が `bac-sample` へ確定前の取消の受入条件を追加し、店主代表（PO）が承認する。承認後に QE が両テストの「トレース」の表を新しい項目へ差し替える     | 再生成で母集団が 9 件になり、取消の行に両テストが載り、母集団外の参照から両行が消える |

担当と期限は PM が各行を PJR 登録候補として登録簿で追跡し、本書には持たない。実案件の PJR 個票は未同梱である。

## 6. 変更履歴と更新ルール

次のいずれかが起きたら、本書を直さずに「生成の手順」で再生成し、生成日と生成元の版を改める。

- 母集団の要求文書で項目が追加・削除された。
- 対応するテストが追加された、または `relations.verifies`・「トレース」の表・ケース表の `トレース` 列が変わった。
- 対応テストの `status` が変わった。

| 生成日     | 生成元の版 | 前回から充足状況が変わった要求項目                                                 | 契機                                        |
| ---------- | ---------- | ---------------------------------------------------------------------------------- | ------------------------------------------- |
| 2026-05-11 | `4f9e2c1`  | `prj-success-criteria-and-acceptance-criteria-sample AC-04`: `未着手` → `一部充足` | `atc-cash-sale` に TR-04 と照合ケースを追加 |
| 2026-04-27 | `b83d0a7`  | なし（初回生成）                                                                   | `atc-cash-sale`・`stc-cash-sale` の作成     |
