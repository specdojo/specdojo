---
specdojo:
  id: prj-0001:pjr-xxbc-result-approach-section-rename
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-XXBC result の「実践の型の活用」を「進め方と実践の型の適用」へ改称する

## 1. 概要

edit result テンプレート `docs/ja/specdojo/templates/xer-template.md` の第4章「実践の型の活用」を「進め方と実践の型の適用」へ改称し、これを参照する plan テンプレートおよびテストの文言を追随させる。

同章が記入を求めている内容は `approach` に従った進め方の記録であり、実践の型（rulebook / recipe / sample / template）の活用に限定されない。たとえば `retrofit` では参照した実装パス・抽出した現在動作・未確認範囲を、`freeform` では実践の型より優先した実例やプロジェクト文脈を記録させる。後者は実践の型を使わなかった記録であり、「実践の型の活用」という名称とは向きが逆になる。名称と記入内容の不一致は、agent が章の趣旨を取り違えて記入範囲を狭める要因になるため、内容を包含する名称へ改める。

章そのものは廃止しない。plan テンプレートが判断根拠・逸脱の記録先として明示的に参照しており、実施内容・変更ファイルでは代替できない追跡情報を保持しているためである。

## 2. 完了条件

- `xer-template.md` の第4章見出しが「進め方と実践の型の適用」になっている。
- 第4章の本文が、`approach` に沿った進め方の記録と実践の型の適用状況の双方を求める記述になっている。
- `実践の型の活用` を参照している plan テンプレート10ファイルの文言が新名称へ追随している。
- `tests/src/exec-results.test.ts` の該当アサーションが新名称で成功する。
- 名称が内容と合っている章（`xrr-template.md` の「実践の型との整合確認」、`xer-human-bootstrap-finalize-template.md` の「実践の型の確認」）は変更していない。
- `npm run lint:md`、`npm test` が成功する。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                   |
| --- | --------------------------------------------------- | ---- | ---- | ------------------------------------------------------ |
| 1   | `xer-template.md` の見出しと本文の改称              | ARC  | open | 本文も進め方と実践の型の双方を求める記述へ調整する     |
| 2   | plan テンプレート10ファイルの参照文言の追随         | ARC  | open | 参照は合計27箇所。文脈に応じて自然な日本語へ整える     |
| 3   | `tests/src/exec-results.test.ts` のアサーション更新 | ARC  | open | human finalize に載せない検証（2箇所）も新名称へ       |
| 4   | 変更対象外の章に手を入れていないことの確認          | ARC  | open | review result と human finalize の章は名称と内容が一致 |
| 5   | 検証（`npm run lint:md` / `npm test`）              | ARC  | open | テンプレートとテストの変更は pre-commit の `test` 対象 |

## 4. 対応結果

-

## 5. 参考情報

### 5.1. 変更対象ファイル

- `docs/ja/specdojo/templates/xer-template.md`（見出しと本文）
- `docs/ja/specdojo/templates/xep-bootstrap-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-fully-guided-template.md`（4箇所）
- `docs/ja/specdojo/templates/xep-recipe-guided-template.md`（4箇所）
- `docs/ja/specdojo/templates/xep-freeform-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-recipe-maintenance-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-rulebook-maintenance-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-sample-maintenance-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-template-maintenance-template.md`（3箇所）
- `docs/ja/specdojo/templates/xep-template.md`（1箇所）
- `tests/src/exec-results.test.ts`（2箇所）

### 5.2. 変更対象外

| ファイル                                   | 章                   | 据え置く理由                                    |
| ------------------------------------------ | -------------------- | ----------------------------------------------- |
| `xrr-template.md`                          | 実践の型との整合確認 | review result が実践の型そのものと照合する章    |
| `xer-human-bootstrap-finalize-template.md` | 実践の型の確認       | human finalize が実践の型の整備状況を確認する章 |

既存の result 履歴ファイルは履歴として蓄積されたものであり、遡及的な改称は行わない。

### 5.3. 名称の選定理由

採用する名称は「進め方と実践の型の適用」とする。`approach` の訳語として plan テンプレートが既に「進め方」を用いており語彙が揃うこと、「適用」が進め方と実践の型の双方へ自然に係ることによる。検討した代替案は「実践の型と進め方の活用」および「進め方と実践の型の記録」である。
