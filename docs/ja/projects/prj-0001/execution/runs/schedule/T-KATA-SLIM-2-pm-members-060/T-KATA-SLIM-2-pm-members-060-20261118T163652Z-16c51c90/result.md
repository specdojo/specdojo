---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-members-060-20261118t163652z-16c51c90
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-members-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-members-060/T-KATA-SLIM-2-pm-members-060-20261118T163652Z-16c51c90/plan.md
  started_at: "2026-11-18T16:37:01.764Z"
  completed_at: "2026-11-18T17:07:25.846Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:pm-members
    - specdojo:pm-members-recipe
---

# Edit Result

## 1. 実施内容

- Recipe 記述標準に基づき `docs/ja/specdojo/recipes/pm-members-recipe.md` を改訂し、文書の運用に関する記述および rulebook の判断基準の言い直しを排除しました。
- 空白を除いた文字数を 1,966 字から 1,373 字（約 69.8%）に削減しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-members-recipe.md`: Recipe 記述標準の 8 章構成へ再編し、運用の記述（仕上げチェックの構造検査や承認フロー等）および rulebook の重複記述（必須フィールドの指定、禁止事項の言い換え等）を削除しました。一方で、情報の収集元、執筆順序とその理由、聞き方のコツ、深掘りの順序、具体例などの実践的な知見を整理して残しました。

## 3. 申し送り

- 大きさ: 前 1,966 字、後 1,373 字（69.8%）。空白（改行を含む）と表の区切り行を除いた文字数で、PJR-7M9J と同じ測り方。
- F001〜F009（`title`・`status`・`version`・`type`・`rulebook`・`display_name`・`scheduler_strategy`・`persona` の書式・nickname の許容文字が漏れているという指摘）は、Recipe 記述標準の「rulebook の構造・必須項目を recipe 側で再定義しない」と、この段の「判断の言い直しを外す」に従い、項目を足さなかった。原因だった一部の項目だけを並べた記述（全体の作成手順の 1、深掘りの問いの項目名）を外して対処した。解消の確認は統合のあとの grade で行う。
- 外した記述: 仕上げチェックの構造の検査（schema 検証、全員が `type: human`、必須フィールドがそろう）、ロール定義と照合して割り当てる手順の言い直し、禁止事項を言い換えた問い（agent 用フィールド、改名、`migrate-members --dry-run`）、レビュー観点と完了チェックの重複。
- 残した・足した記述: 作成前に集める情報の取り出し元の列、書く順番とその理由（最終判断を担う人を先に決める、使用中の nickname を集めてから名前を決める）、聞き方のコツ（本人に公開の可否を聞く、上位成果物は写さず参照に置き換える）、深掘りの順序、良い例 / 悪い例。章の構成は 6 章から Recipe 記述標準の 8 章へそろえた。
- rulebook・sample・template への変更案: なし。
- 成果物の観察（変更なし）: prj-0001 の `pm-members.yaml` の `rules` に、agent の起動設定（`command_template`・command の上書き）や `stage_role` についての行が残っている。rulebook の「運用ルール」の範囲（project 固有の制約に限る）を超えるため、別の項目で見直すとよい。
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown の recipe だけで、`*.yaml` / `*.yml` の変更がない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

Recipe 記述標準および本タスクの指示に従い、rulebook と重複する判断基準や共通の運用記述を徹底的に排除し、執筆者が実際に迷う点や判断のコツに焦点を当てた構成へとスリム化しました。具体的には、必須項目の列挙などの「正本の再掲」を削除し、代わりに「どの順番で書くべきか」「どう問いかけるべきか」という実践的なガイドラインを維持・強化しています。
