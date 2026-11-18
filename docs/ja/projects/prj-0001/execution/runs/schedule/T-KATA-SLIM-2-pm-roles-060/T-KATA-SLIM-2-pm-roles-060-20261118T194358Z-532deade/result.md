---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-roles-060-20261118t194358z-532deade
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-roles-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-roles-060/T-KATA-SLIM-2-pm-roles-060-20261118T194358Z-532deade/plan.md
  started_at: "2026-11-18T19:44:05.484Z"
  completed_at: "2026-11-18T20:17:59.416Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:pm-roles
    - specdojo:pm-roles-recipe
---

# Edit Result

## 1. 実施内容

- recipe (`docs/ja/specdojo/recipes/pm-roles-recipe.md`) から、rulebook と重複する判断基準の言い直しや共通の運用記述、構造検査などを削除し、執筆に必要なコツや手順に絞ってスリム化した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-roles-recipe.md`: rulebook と重複する判断基準の言い直し、構造検査、共通運用（status 昇格や承認手順等）を削除。執筆順序、入力ソース、聞き方のコツ、深掘り手順に絞って記述し、空白除き文字数を 3,566 字から 2,279 字（63.9%）に削減した。

## 3. 申し送り

- 大きさ: PJR-7M9J と同じ測り方（空白を除き、表の区切り行を除く）で 3,566 字から 2,279 字（63.9%）。区切り行を含むと 3,870 字（9,376 B）から 2,582 字（6,469 B）（66.7%）。
- F001（schema の検証コマンドが示されていない）: レビュー観点の「スキーマ適合」の行を外した。検証コマンドと終了コード 0 の確認は rulebook の「変更時の追従と完了判断」が持つため、recipe では言い直さない。
- F002（Role code を変えたあとの追従手順がない）: 追従の手順は rulebook の「変更時の追従と完了判断」が持つため書き写さず、recipe の `roles` の節に、コードを変える前に使っている下流の文書と使い手を聞き、責務の移り先を決めるコツだけを置いた。
- 変更案: rulebook・sample・template は合わせて直す点がなかった。
- 適用外の検証: `npm run validate:schema:file`（変更したのは `*.md` の recipe だけで、`*.yaml` / `*.yml` を変更していない）
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/recipes/pm-roles-recipe.md だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

recipe-maintenance
