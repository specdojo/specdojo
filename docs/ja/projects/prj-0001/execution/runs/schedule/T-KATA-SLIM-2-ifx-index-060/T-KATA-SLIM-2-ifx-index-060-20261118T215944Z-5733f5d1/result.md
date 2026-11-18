---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-ifx-index-060-20261118t215944z-5733f5d1
  type: exec-result
  task_id: T-KATA-SLIM-2-ifx-index-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-ifx-index-060/T-KATA-SLIM-2-ifx-index-060-20261118T215944Z-5733f5d1/plan.md
  started_at: "2026-11-18T21:59:58.585Z"
  completed_at: "2026-11-18T22:34:36.768Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - ifx-index
    - specdojo:ifx-index-recipe
---

# Edit Result

## 1. 実施内容

- `ifx-index-recipe.md` から、共通の運用の記述（PO の採否・公開判断、管理担当と承認者、`schema`・整形検査を手順と検証節に入れること）、未決事項の管理台帳の列、`rulebook` と同じ判断の言い直し、および recipe 内で重複していた確認事項を削除した。
- 一方で、章を書く順番とその理由、入力情報の収集元（取り出し元と聞く相手）、各節における問いとコツ、深掘りの順序、および具体的で判断の差がわかる良い例と悪い例は維持し、内容を整理した。
- 結果として、空白と表の区切り行を除いた文字数を 4,353 字から 3,006 字（69.1%）へと削減し、recipe 記述標準に準拠した構成とした。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/ifx-index-recipe.md`: 共通運用の記述および `rulebook` と重複する判断基準などの冗長な記述を削除し、執筆上のコツや具体的な正誤例にフォーカスした内容にスリム化した。

## 3. 申し送り

- 大きさ: 空白（改行を含む）と表の区切り行を除いた文字数で 4,353 字から 3,006 字（69.1%）。測り方は PJR-7M9J と同じ。
- 迷った点: 冒頭コメントに一覧の管理担当と承認・公開判断者を書く旨は共通の運用とみなして外した。rulebook の「検証と引き渡しの判定」は受入の判定を扱うため recipe では言い直していない。
- rulebook・sample・template に合わせて直すべき点は見当たらず、変更案はない。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していない）
- 適用外の検証: `npm run validate:schema:file`（YAML ファイルを変更していない）

## 4. 進め方と実践の型の適用

recipe-maintenance
