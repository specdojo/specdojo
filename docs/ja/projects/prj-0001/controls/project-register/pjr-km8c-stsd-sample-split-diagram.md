---
specdojo:
  id: prj-0001:pjr-km8c-stsd-sample-split-diagram
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

- 実施内容: executor（sol）が [[specdojo:stsd-sample]] の状態遷移図を、通常系（T-01〜T-03・T-05・T-07）と例外系（T-04・T-06・T-08）の 2 図に分けた（d2a5c360f）。各図の直前に担当する遷移 ID と共有状態（検品済み `inspected`）を書き、初期点は開始の遷移を持つ通常系だけに置いた。状態は 6 件、遷移は 8 件、遷移 ID はそのまま。
- 手入れの plan に載った grade の finding 2 件（F001・F002）も直した。T-01 の条件と図の開始の遷移に、状態一覧の成立条件と同じ「納品情報を発注内容へ照合」を足した。
- orchestrator の確認: 変わった Kata は `stsd-sample` だけで、成果物は変わっていない。親の検証（lint-mermaid を含む）はすべて通った。
- 残課題（段 7 で確かめる点）: sample の図が分割の例だけになり、1 つの図で書く例がなくなった。規模が閾値以下の stsd がほとんどなので、1 図の例も残すべきかは Kata の確定のときに判断する。

## 6. 関連ドキュメント

- [[specdojo:stsd-sample]]: 手入れの対象
- [[specdojo:stsd-mermaid-rulebook]]: 従う規則
