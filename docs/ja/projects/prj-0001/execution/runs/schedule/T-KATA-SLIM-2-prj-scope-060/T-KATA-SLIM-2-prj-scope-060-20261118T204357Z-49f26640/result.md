---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-prj-scope-060-20261118t204357z-49f26640
  type: exec-result
  task_id: T-KATA-SLIM-2-prj-scope-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-prj-scope-060/T-KATA-SLIM-2-prj-scope-060-20261118T204357Z-49f26640/plan.md
  started_at: "2026-11-18T20:44:04.050Z"
  completed_at: "2026-11-18T21:21:09.843Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:prj-scope
    - specdojo:prj-scope-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/prj-scope-recipe.md` を更新し、文書の運用の記述および `rulebook` と重複する判断基準の言い直しを削除しました。
- Finding F001 〜 F010 に対応し、「境界の判断基準」と「スコープ変更方針」の 2 章を条件付き（任意）とし、仕上げチェックに公開適性の確認項目を追加しました。
- 空白と表の区切り行を除いた文字数を 3,698 字から 2,526 字（約 68.3%）に削減しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/prj-scope-recipe.md`: 運用の記述と `rulebook` と重複する判断基準の言い直しを削除し、Finding F001 〜 F010 に基づく構成の見直しおよび仕上げチェック項目の追加を実施した。

## 3. 申し送り

- 文字数の前後（空白と表の区切り行を除く）: 3,698 字から 2,526 字（68.3%）。区切り行を含めると 4,003 字から 2,825 字、バイト数は 11,747 B から 7,910 B。
- F005・F009・F010（委譲先の文書 ID を明示する指摘）は、後続の文書 ID を書かず、委譲先の指定そのものを外して対応した。指定は `rulebook` と同じ判断の言い直しで、Recipe 記述標準は本文に `rulebook` と同じ規則を置くことを禁じているため。再評価で残る場合は、Recipe 記述標準とどちらを優先するかを利用者が決める。
- rulebook・sample・template に合わせて直すべき点はなかった。
- F005・F009・F010（委譲先の文書 ID を明示する指摘）は、後続の文書 ID を書かず、委譲先の指定そのものを外して対応した。指定は rulebook と同じ判断の言い直しで、Recipe 記述標準は本文に rulebook と同じ規則を置くことを禁じているため。再評価で残る場合は、Recipe 記述標準とどちらを優先するかを利用者が決める。
- 適用外の検証: `npm run validate:history-links`（変更したのは recipe だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

`prj-scope-recipe.md` において、Recipe 記述標準および `rulebook` の正本性を重視し、重複する運用記述や判断基準を徹底的に排除しました。具体的には、共通の運用フロー（昇格・承認等）や、`rulebook` で定義済みの列指定・必須観点の言い換えを削除し、成果物の章名による参照に置き換えています。また、Finding に基づき、任意章を必須とする矛盾を解消し、公開適性チェックを導入することで linter および規範への適合性を高めました。
