---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-bac-task-completion-005-20261115t042641z-ed4dd7ad
  type: exec-result
  task_id: T-KATA-WAVE-2-bac-task-completion-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-2-bac-task-completion-005/T-KATA-WAVE-2-bac-task-completion-005-20261115T042641Z-ed4dd7ad/plan.md
  started_at: "2026-11-15T04:26:43.108Z"
  completed_at: "2026-11-15T05:06:26.755Z"
  agent: sol-executor
  execution: agent
  approach: bootstrap
  targets:
    - bac-task-completion
    - specdojo:bac-rulebook
    - specdojo:bac-sample
---

# Edit Result

## 1. 実施内容

- 代表成果物である「業務受入条件（タスクの評価と完了）」を新規作成し、併せて実践の型（`rulebook`, `recipe`, `sample`, `template`）の一式を整備しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bac-rulebook.md`: 標準の7章構成へ整理し、章ごとの判断基準・良い例・悪い例を追加しました。また、完成例の章と旧式のメタ情報例を削除し、Frontmatter の3種（`recipe`, `sample`, `template`）を実在する ID で宣言しました。
- `docs/ja/specdojo/samples/bac-sample.md`: 説明用の薄い記述から、共通サンプル文脈（現金販売・在庫不足・入力不足と再開）を用いた具体的な完成例へと作り直しました。
- `docs/ja/product/050-business-acceptance-criteria/bac-task-completion.md`: 代表成果物として新規作成。独立評価、既存結果の再利用、評価不能、評価中の変更、完了記録、未充足時の再計画、鮮度不足、評価者の独立性、判断権限の9シナリオについて、根拠・前提・操作・期待結果・判定方法を記述しました。
- `docs/ja/specdojo/recipes/bac-recipe.md`: 業務シナリオの選択・停止・再開の掘り下げにおける品質差を解消するため、作成手順として新規作成しました。
- `docs/ja/specdojo/templates/bac-template.md`: 同系統で共有可能な定型の3章構成を雛形として提供するため、新規作成しました。

## 3. 申し送り

- 変更ファイル: docs/ja/product/050-business-acceptance-criteria/bac-task-completion.md を新規作成。独立評価、既存結果の再利用、評価不能、評価中の変更、完了記録、未充足時の再計画、鮮度不足、評価者の独立性、判断権限の9シナリオに、根拠・前提・操作・期待結果・判定方法を記述した。
- 変更ファイル: docs/ja/specdojo/rulebooks/bac-rulebook.md を改訂。業務行為と観測可能な期待結果という既存方針を維持し、標準の7章へ整理した。完成例の章と旧式のメタ情報例を削除し、章ごとの判断基準・良い例・悪い例を追加した。docs/ja/specdojo/samples/bac-sample.md は説明用の薄い記述から、共通サンプル文脈の現金販売・在庫不足・入力不足と再開を示す完成例へ作り直した。117行で clis-sample.md（132行）に近い厚さとした。
- 変更ファイル: docs/ja/specdojo/recipes/bac-recipe.md と docs/ja/specdojo/templates/bac-template.md を新規作成。kata-guide の作成条件に基づき、業務シナリオの選択・停止・再開の掘り下げには書き手による品質差があるため recipe を必要と判断した。同系統で共有できる定型の3章構成があるため template も必要と判断した。rulebook と sample も必要であり、不要と判断した型はない。rulebook frontmatter の3種を実在する ID で宣言した。
- 手本と整合: ready の br-rulebook.md, br-recipe.md, br-sample.md, br-template.md を構造・粒度・記法の手本とした。ready の BAC 成果物は見つからず、代表成果物は指定された2件の BPS とプロジェクト受入条件、prj-overview の文脈から構成した。内容要件は rulebook、骨組みは template、問いと深掘りは recipe、完成例は sample に分担した。代表固有の grade・finding は汎用の型へ複写せず、sample は販売業務へ一般化した。追加の記法 rulebook は必要としない。
- 仕上げの4操作を1巡実施した。不要記述は旧 sample の説明用章と rulebook の大量の完成例を削除した。重複は完成例を sample、メタ情報の型・構造を標準と schema への参照へ集約した。可読性のため評価者の独立性と完了判断の権限を別シナリオへ分割した。論理整合では3章構成、シナリオの項目、見出し連番、評価と完了判断の責務分離をそろえた。観点別の自己レビュー・修正ループは行っていない。
- 未確定の業務前提: 代表試行の対象・参加者・証跡と費用・作業時間上限は根拠から確定できないため、代表成果物のメモに確認事項として残した。PO・BA は試行具体化前に対象を決め、PO・PM は試行前に上限を承認する。sample の販売条件と数値は学習用の仮定と明示し、未同梱の架空参照、記録不能時の判断待ちを区別した。実案件の業務判断・承認は確定していない。内部資料で記述できたため Web 出典はない。
- 成果物カタログの対象は既に `rulebook: specdojo:bac-rulebook` を宣言しており、修正不要と判断した。カタログ、保護設定、grade サイドカー、runner 管理ファイルは変更していない。pipeline の役割分担に従い result は作成・更新していない。reporter は本報告の変更内容・型の要否・手本・仕上げ操作・未確定前提を result の必須セクションへ記録すること。
- 手本と整合: ready の br-rulebook.md、br-recipe.md、br-sample.md、br-template.md を構造・粒度・記法の手本とした。ready の BAC 成果物は見つからず、代表成果物は指定された2件の BPS とプロジェクト受入条件、prj-overview の文脈から構成した。内容要件は rulebook、骨組みは template、問いと深掘りは recipe、完成例は sample に分担した。代表固有の grade・finding は汎用の型へ複写せず、sample は販売業務へ一般化した。追加の記法 rulebook は必要としない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown 5文書のみで、変更した YAML・YML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の成果物変更は docs/ja/product/ と docs/ja/specdojo/ 配下のみで、docs/ja/projects/ 配下は変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、既存 plan、result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

まず実践の型の必要性を判断し、`recipe` と `template` を新規作成し、既存の `rulebook` と `sample` を整備することで、成果物と整合した一式を構築しました。`ready` 状態の `br-rulebook.md` 等を構造の手本とし、代表成果物は `depends_on` の BPS 等の文脈から作成しました。最後に仕上げの4操作（不要削除、重複統合、可読性分割、論理整合確認）を行い、品質を向上させました。
