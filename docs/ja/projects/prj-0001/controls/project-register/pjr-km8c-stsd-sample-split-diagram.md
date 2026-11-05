---
specdojo:
  id: prj-0001:pjr-km8c-stsd-sample-split-diagram
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T10:45:25Z"
  derived_from:
    - PJR-3APD
    - PJR-00NY
  depends_on:
    - PJR-EAKN
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
---

# PJR-KM8C stsd の sample に、分割した状態遷移図の例を足す

## 1. 概要

3APD の段 6。stsd-mermaid-rulebook の分割の規則に沿った、通常系と例外系に分けた図の例を stsd-sample に足す

## 2. 入力

- PJR-Q9AW の磨き込みで、stsd-sample に図を分割した例がなく、分割の規則の適用の仕方を確かめられなかった

## 3. 完了条件

- [[specdojo:stsd-sample]] に、[[specdojo:stsd-mermaid-rulebook]] の分割の規則（PJR-EAKN で足した初期点の扱いを含む）に沿って、通常系と例外系に分けた状態遷移図の例がある。図の直前に、各図が扱う遷移 ID の範囲と共有する状態が書かれている。
- 例は sample の共通の文脈（駄菓子屋）に沿い、既にある状態一覧と遷移の説明と食い違わない。足した遷移があれば状態一覧と遷移の説明にも載っている。
- `npm run -s lint:mermaid` が通っている。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | 分割の規則と既存の sample を読み、例の形を決める | BA   | open | -    |
| 2   | 例を足し、検査を通す                             | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-sample]]: 手入れの対象
- [[specdojo:stsd-mermaid-rulebook]]: 従う規則
