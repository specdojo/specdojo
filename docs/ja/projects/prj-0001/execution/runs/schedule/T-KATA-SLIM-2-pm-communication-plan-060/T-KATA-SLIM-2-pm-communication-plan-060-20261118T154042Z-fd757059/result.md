---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-communication-plan-060-20261118t154042z-fd757059
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-communication-plan-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-communication-plan-060/T-KATA-SLIM-2-pm-communication-plan-060-20261118T154042Z-fd757059/plan.md
  started_at: "2026-11-18T15:40:48.096Z"
  completed_at: "2026-11-18T16:12:03.476Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:pm-communication-plan
    - specdojo:pm-communication-plan-recipe
---

# Edit Result

## 1. 実施内容

- `pm-communication-plan-recipe` を改訂し、rulebook の内容を言い直していた記述（列の指定、観点の列挙、禁止事項の言い換えなど）や、構造の検査、重複する確認項目を削除しました。
- 同時に grade result の finding (F001〜F004) に対応するため、レビュー観点を表形式へ変更し、4.5節（見直し条件と未決事項）の追加、各節への「問い」の導入、具体例の拡充を行いました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-communication-plan-recipe.md`: rulebook の言い直しや重複記述を削除し、finding に基づく改善（レビュー観点の表形式化、4.5節の追加、問いと具体例の導入）を適用しました。

## 3. 申し送り

- 大きさ: 空白と表の区切り行を除くと 1,594 字から 1,519 字（95.3%）。区切り行を含むと 1,719 字・4,484 B から 1,751 字・4,582 B。7 割以下の目安に届かないのは、元の recipe がもともと短いことと、grade の finding（F002: 4.5 節の追加、F003: 問いと例の追加、F004: レビュー観点の表）が記述の追加を求めているため。7 割まで削ると Recipe 記述標準の「各必須章に具体項目 3 つ以上」と finding の要求を満たさなくなる。今の大きさを受け入れるかどうかを人が判断する。
- 外した記述: 一次対応と最終判断を区別する列の指定、エスカレーションを分ける観点の列挙（当事者価値・費用・品質・公開）、「必要に応じて」で終わらせない・関係者名簿を再掲しないという禁止事項の言い換え、仕上げチェックの構造の検査（機会・エスカレーション・情報取扱いがある）、レビュー観点・良い例・仕上げチェックで重なっていた確認、全体の作成手順の言い直し。元の recipe には、役割の表、status の昇格と承認、公開の承認条件、改訂と廃止の手順、文書品質の検査、未決事項の管理台帳の列はなかった。
- finding への対応: F001 と F004 はレビュー観点を「観点」と「確認内容」の表にし、確認内容を判定できる文にした。F002 は 4.5 見直し条件と未決事項の節を足した。F003 は各節に問いを 2 つずつ置き、良い例 / 悪い例にエスカレーションの行を足した。
- rulebook・sample・template に変更案はない。ただし rulebook の「6.5 見直し条件と未決事項」は見直しのきっかけを列挙しているため、recipe ではそれを言い直さず、問いの形にした。
- 適用外の検証: `npm run validate:history-links`（変更したのは recipe だけで、plan・result・個票を変えていない）

## 4. 進め方と実践の型の適用

recipe-maintenance
