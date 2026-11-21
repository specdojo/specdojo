---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-sysd-critical-flows-060-20261118t195742z-fd0fd80d
  type: exec-result
  task_id: T-KATA-SLIM-2-sysd-critical-flows-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-sysd-critical-flows-060/T-KATA-SLIM-2-sysd-critical-flows-060-20261118T195742Z-fd0fd80d/plan.md
  started_at: "2026-11-18T19:57:51.624Z"
  completed_at: "2026-11-18T20:28:54.860Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - sysd-critical-flows
    - specdojo:sysd-critical-flows-recipe
---

# Edit Result

## 1. 実施内容

- recipe から共通の運用記述、rulebook の言い直し、および重複する確認事項を削除し、執筆に必要な「書く順番」「入力情報の取得元」「問いとコツ」に重点を置いた構成にスリム化した。
- 空白を除いた文字数を 3702 文字から 2582 文字（約 69.7%）へと削減した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/sysd-critical-flows-recipe.md`: 共通の運用記述（役割表、承認条件、改訂手順等）、rulebook と重複する判断基準の言い直し、およびレビュー観点や仕上げチェックで重複していた確認事項を削除し、レシピとしてのエッセンスに絞り込んだ。

## 3. 申し送り

- 文字数（空白を除く）: 変更前 3702、変更後 2582（69.7%）。
- template への変更案（未適用）: `docs/ja/specdojo/templates/sysd-critical-flows-template.md` の「未決事項と後続作業」の表の列（担当Role code・判断時期・登録先）は管理台帳の列なので、rulebook の要件（論点・依存・影響・当面の扱い・解消条件）に合わせる。「承認対象と公開前条件」の章と ready 昇格の `_TODO_` も共通の運用なので見直し候補。
- rulebook は見直したが、合わせて変える点はなかった。sample は確認していない。
- template への変更案（未適用）: docs/ja/specdojo/templates/sysd-critical-flows-template.md の「未決事項と後続作業」の表の列（担当Role code・判断時期・登録先）は管理台帳の列なので、rulebook の要件（論点・依存・影響・当面の扱い・解消条件）に合わせる。「承認対象と公開前条件」の章と ready 昇格の `_TODO_` も共通の運用なので見直し候補。
- 適用外の検証: `npm run validate:history-links`（変更は recipe のみで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

recipe-maintenance
