---
specdojo:
  id: prj-0001:pjr-6v3d-bps-sample
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-09-26T05:30:46Z"
---

# PJR-6V3D bps-sample の業務ロジックの不整合と存在しない参照先を解消する

## 1. 概要

`bps-sample.md` は [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]] で作り直され、blocker は解消したが `needs-work`（64 点、major 4 件）である。残る指摘は業務ロジックの不整合と用語の未定義であり、rulebook や template の問題ではない。sample 自体の品質として解消する。

## 2. 事実

### 2.1. grade の推移

| 時点   | verdict      | score | findings                    |
| ------ | ------------ | ----- | --------------------------- |
| 変更前 | `fail`       | 61    | blocker 1、major 4、minor 2 |
| 変更後 | `needs-work` | 64    | blocker 0、major 4、minor 4 |

「サンプルとして機能していない」という blocker は解消した。score は 3 点の改善にとどまる。

### 2.2. 残る major 4 件

| 観点                          | 指摘                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vp-qe-omissions-consistency` | 終了点は「補充依頼の確定」だが `S-04` と受入観点は「仕入グループの受領」まで要求し、`E-03` は受領失敗で未確定へ戻す。**確定の定義が 3 通りある** |
| `vp-qe-verifiability`         | `E-03`（判断根拠記録失敗、仕入グループ受領失敗）に対応する検証・受入観点がない                                                                   |
| `vp-ux-language-consistency`  | 「補充基準」「補充必要数」「基準数量」「数量」の関係が未定義で、`S-02` の基準数量が閾値・算出値・依頼数量のどれか区別できない                    |
| `vp-qe-kata-conformance`      | 参照先 `cdfd-uc-replenishment` の `H-01` との整合（`2.3.` を参照）                                                                               |

### 2.3. 参照先は誤りではない

`bps-sample.md` は `cdfd-uc-replenishment` と `cdfd-purchasing` を参照する。どちらも `docs/ja/product/` に実在しないが、**誤りではない**。

`cdfd-uc-sample.md` に次の記述がある。

```text
本書は…ケース `C-02`「欠品から補充まで」について…定める概念仕様である。
product 成果物として作成する場合の ID は `cdfd-uc-replenishment` とする。
```

架空の駄菓子屋プロジェクトにおける成果物 ID であり、sample 間で一貫している。`sample-authoring-standard.md` も「リンクはファイルがある場合に記載し、ない場合はバッククォートで仮置きする」と定めており、現在の記法は規約に適合する。

**解消すべきは参照の有無ではなく、`H-01` の要求との整合である。** `cdfd-uc-sample.md` は `H-01` で商品台帳を「補充基準と発注単位の判定根拠にする」と定めるが、`bps-sample.md` は発注単位の決定を対象外としている。

### 2.4. 役割名が共通登場人物と対応していない

`vp-ux-language-consistency` の minor 指摘である。`bps-sample.md` は補充不要記録の受け手を「在庫担当」とするが、`sample-authoring-standard.md` の共通登場人物に「在庫担当」はない。定義されているのは「店主代表」（算野きぬ、`shop-owner`）などである。

標準は「本文、表の表示名、ステークホルダー名には役割名を使用する」と定める。共通登場人物にない役割を新設する場合は、標準側へ追加するか既存の役割へ寄せる。

## 3. 完了条件

- 補充依頼の「確定」の定義が 1 つに定まっている。終了点、`S-04`、受入観点、`E-03` が同じ定義を指す。
- `E-03` に対応する検証・受入観点がある。保留記録、非確定・未受領状態、再開後の成果を第三者が判定できる。
- 「補充基準」「補充必要数」「基準数量」「数量」の関係が定義され、入力から補充依頼まで統一されている。
- `cdfd-uc-sample.md` の `H-01` が要求する発注単位との関係が整理されている。対象外とするなら `H-01` 側との整合を説明するか、`cdfd-uc-sample.md` を見直す。
- 役割名が `sample-authoring-standard.md` の共通登場人物と対応している。存在しない役割を使っていない。
- 前提条件と `S-01`・`S-02` の重複が解消され、確認時点と不成立時の遷移が一箇所で読める。
- grade を再実行し、blocker と major が解消している。
- `npm run -s lint:md` が通過している。

## 4. 検討事項

### 4.1. sample 間の整合をどこまで求めるか

`bps-sample.md` と `cdfd-uc-sample.md` は同じ架空プロジェクトを題材とするため、grade は整合を判定する。sample 全体で業務内容が一貫している必要があり、1 つの sample を直すと他へ波及しうる。

`vp-qe-kata-conformance` の指摘を解消する方法は 2 つある。

| 案  | 内容                                             | 影響                       |
| --- | ------------------------------------------------ | -------------------------- |
| 1   | `bps-sample.md` に発注単位の扱いを追加する       | `bps-sample.md` のみ       |
| 2   | `cdfd-uc-sample.md` の `H-01` から発注単位を外す | 他の sample へ波及する恐れ |

**案 1 を起点とする。** sample 間の正本関係では、横断順序を定める `cdfd-uc-sample.md` が上位にあたる。

### 4.2. 共通登場人物への役割追加

「在庫担当」のような役割が業務上必要であれば、`sample-authoring-standard.md` の共通登場人物へ追加する。個別 sample で独自の役割名を使わない。

## 5. 作業内容

| No  | 作業                                      | 担当 | 状態 | メモ                             |
| --- | ----------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | 「確定」の定義を 1 つに定める             | BA   | open | 終了点、`S-04`、受入観点、`E-03` |
| 2   | `E-03` の検証・受入観点を追加する         | BA   | open |                                  |
| 3   | 数量に関する用語を定義し統一する          | BA   | open | 4 語の関係                       |
| 4   | `H-01` の発注単位との関係を整理する       | BA   | open | 案 1 を起点                      |
| 5   | 役割名を共通登場人物へ対応させる          | BA   | open | 標準への追加要否を判断           |
| 6   | 前提条件と処理ステップの重複を解消する    | BA   | open |                                  |
| 7   | grade を再実行して major の解消を確認する | QE   | open | 変更前 64 点との比較             |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]
- [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]]
- `docs/ja/specdojo/samples/bps-sample.md`
- `docs/ja/specdojo/samples/cdfd-uc-sample.md`
- `docs/ja/specdojo/standards/sample-authoring-standard.md`
