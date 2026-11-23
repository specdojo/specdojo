---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-dmd-index-sample-080-20261123t074753z-a354d7cc
  type: exec-result
  task_id: T-KATA-WAVE-5-dmd-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-dmd-index-sample-080/T-KATA-WAVE-5-dmd-index-sample-080-20261123T074753Z-a354d7cc/plan.md
  started_at: "2026-11-23T07:47:55.344Z"
  completed_at: "2026-11-23T07:58:30.301Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:dmd-index-sample
  condense_records:
    - location: 3. `run_id` 規約 導入文の「次の表は、採番から参照までの決まりを示す。」
      category: table-prose
      action: delete
      reason: 表の内容を予告するだけの文で、表自体が項目と決まりを示している。意味は変わらない。
      cause:
        type: document
    - location: 4. 検証の共通方針 導入文の「次の表は、種別ごとに何と何を比べ、何を満たせば合格とするかを示す。」
      category: table-prose
      action: delete
      reason: 表の列見出し（種別・比べるもの・合格基準）の言い換えで、判定の決まりは表に残る。
      cause:
        type: document
    - location: 5. 対象一覧 導入文の「次の表で両者の対応と、移さない理由を示す。」
      category: table-prose
      action: delete
      reason: 表の最終列「`mip-index` との対応・除外の理由」の見出しの繰り返し。`mip-index` の行を受けるという関係の説明は残した。
      cause:
        type: document
    - location: 2. 共通方針 冪等性・抽出方式の各項目
      category: repetition
      action: retain
      reason: 洗い替えの条件・取り込み直しの期限・フル抽出の根拠は判断に要る制約であり、重複していない。
      cause:
        type: document
    - location: 4. 検証の共通方針 許容差・証跡・合否の箇条
      category: table-prose
      action: retain
      reason: 表にない許容差の根拠、保管先、判定者の参照を補う内容で、表との二重説明ではない。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 3 件の `table-prose` を削除し、文書の冗長さを整理しました。
- 削除対象は、各表の内容を予告する導入文や、見出しの言い換えとしての説明文です。
- 「2. 共通方針」および「4. 検証の共通方針」に含まれる、判断に要る制約や補足情報は、意味と必須情報を維持するため保持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-index-sample.md`: 表の内容を予告する導入文や、見出しの言い換えといった冗長な説明（`table-prose`）を削除し、文書を簡潔に整理しました。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| ``3. `run_id` 規約 導入文の「次の表は、採番から参照までの決まりを示す。」`` | `table-prose` | `delete` | `表の内容を予告するだけの文で、表自体が項目と決まりを示している。意味は変わらない。` | `document` |
| `4. 検証の共通方針 導入文の「次の表は、種別ごとに何と何を比べ、何を満たせば合格とするかを示す。」` | `table-prose` | `delete` | `表の列見出し（種別・比べるもの・合格基準）の言い換えで、判定の決まりは表に残る。` | `document` |
| `5. 対象一覧 導入文の「次の表で両者の対応と、移さない理由を示す。」` | `table-prose` | `delete` | ``表の最終列「`mip-index` との対応・除外の理由」の見出しの繰り返し。`mip-index` の行を受けるという関係の説明は残した。`` | `document` |
| `2. 共通方針 冪等性・抽出方式の各項目` | `repetition` | `retain` | `洗い替えの条件・取り込み直しの期限・フル抽出の根拠は判断に要る制約であり、重複していない。` | `document` |
| `4. 検証の共通方針 許容差・証跡・合否の箇条` | `table-prose` | `retain` | `表にない許容差の根拠、保管先、判定者の参照を補う内容で、表との二重説明ではない。` | `document` |
