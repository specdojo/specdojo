---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-cnd-specdojo-060-20261118t202030z-77df87eb
  type: exec-result
  task_id: T-KATA-SLIM-2-cnd-specdojo-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-cnd-specdojo-060/T-KATA-SLIM-2-cnd-specdojo-060-20261118T202030Z-77df87eb/plan.md
  started_at: "2026-11-18T20:20:39.764Z"
  completed_at: "2026-11-18T20:54:34.447Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - cnd-specdojo
    - specdojo:cnd-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/cnd-recipe.md` から、共通の運用の記述、未決事項台帳の列指定、rulebook と重複する判断基準の言い直し、および内部での重複した確認事項を削除し、内容をスリム化した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/cnd-recipe.md`: 共通の運用記述や `cnd-rulebook.md` と重複する判断基準（関係表の列、境界区分の列挙、双方向照合の指示など）を削除し、Recipe 記述標準に基づいた構成を維持しつつ、文字数を削減した。

## 3. 申し送り

- 変更ファイル: docs/ja/specdojo/recipes/cnd-recipe.md のみ。
- 文字数（空白除く）: 変更前 4199 → 変更後 2936（約 69.9%）。
- 根拠: 手本は PJR-7M9J の「他の recipe へ広げるときの一覧」と改訂済みの prj-charter-recipe.md。ほかに recipe-authoring-standard.md（章構成・参照禁止）と cnd-rulebook.md を読み、言い直しを特定した。言い直しとして外したのは、関係表の列、境界の 6 区分の列挙、図と定義表の双方向照合、再試行・復旧保証を推測で書かないこと、境界変更が他の図へ及ぶ影響の列挙。grade と condense の finding はなかった。
- 変更案（この段では直さない）1: cnd-template.md の「メモ / 将来課題」の表（担当ロール列、PJR の転送先と判断期限を求めるコメント）と、概要の `_TODO_`（作成担当・確認者・最終判断者の Role code）、改訂・廃止時の窓口の欄は共通の運用や台帳の列にあたる。rulebook の未確定事項の要件（論点・影響する要素と関係・当面の扱いと解消条件）に合わせ、列を「対象・論点」「影響範囲」「当面の扱い・解消条件」にして、役割と改訂・廃止の欄を外す案。
- 変更案 2: cnd-sample.md の概要冒頭にある役割ごとの確認分担（ARC・BA・DEV・QE・OPS・PO）の段落は共通の運用にあたるため、外すか短くする案。cnd-rulebook.md は変える点を見つけなかった。
- 適用外の検証: `npm run validate:history-links`（変更したのは recipe だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

Recipe 記述標準および `cnd-rulebook.md` を正として、recipe 内から「共通の運用の記述」「rulebook と重複する判断基準の言い直し」「冗長な確認の繰り返し」を特定して削除した。具体的には、関係表や境界区分の列指定、双方向照合などの詳細な指示を外し、Recipe 記述標準の 8 章構成を維持しつつ、文字数を約 70% まで削減することを目指し編集を行った。
