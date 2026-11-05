---
specdojo:
  id: prj-0001:xep-pjr-wsnd-20261105t121743z-ec25afd5
  type: exec-plan
  rulebook: none
  task_id: PJR-WSND
  name: "stsd-pilot の strategy と schedule を作り、段 9〜12 を schedule で流せるようにする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: PM
  approach: strategy-planning
  targets:
    - track:stsd-pilot
---

# Edit Plan: PJR-WSND Schedule strategy と track の生成

## 1. このフェーズで行うこと

3APD の段 9〜12（磨き込み・condense・review・確定）を schedule で流すため、track stsd-pilot の strategy を作り、schedule build で展開する

対象単位・参照資料・実行コマンド・完了条件は「個票の追加完了条件」に展開する。

- result: `docs/ja/projects/prj-0001/execution/exec/results/pjr-wsnd-20261105T121743Z-ec25afd5-result.md`

## 2. 完了手順

1. 参照する kata・既存カタログと個票を読み、追加完了条件の手順を実行する。
2. 共通規約に従って必要な整形・静的検査を行う。
3. 個票の作業内容・対応結果を更新し、実行記録に判断根拠・変更ファイル・検証結果を残す。pipeline の executor は result を編集せず報告へ記入する。

## 3. 異常終了の条件

- 入力不足、対象不明、解消できない判定事項、生成・検査失敗があれば停止し、理由と次のアクションを報告する。
- 登録簿と個票のステータスを変更しない。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 利用者は、段 9 以降を register の個票ではなく schedule で流す案を選んだ。本番の業務仕様の epic と同じ流し方を、この試行で確かめるため（2026-11-05）
- 段 8 の retrofit は register の個票（PJR-41B4・PJR-YQF1・PJR-RAPC・PJR-PYCY）で流しているため、schedule には retrofit-pass を入れない。stsd-task-execution は段 2〜4 を register で済ませた（PJR-1799・PJR-Q9AW・PJR-MC63）
- 標準の retrofit の profile は retrofit-pass → refine-pass → condense-pass → retrofit-review-pass → finalize-pass で、段 8〜12 と同じ順になる（src/schedule/strategy-profiles.ts）

## 個票の追加完了条件

次の生成手順・完了条件と、個票が定める追加条件を満たす。

### 作業単位と既存カタログ

対象: `track:stsd-pilot`（project: `prj-0001`）。既存カタログは読み取り、scope と依存関係の判断に取り込む。

- `prj-0001:dct-architecture`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-architecture.yaml`（domain: `architecture`）
- `prj-0001:dct-business-acceptance-criteria`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-acceptance-criteria.yaml`（domain: `business-acceptance-criteria`）
- `prj-0001:dct-business-model-bes`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bes.yaml`（domain: `business-model`）
- `prj-0001:dct-business-model-bps`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bps.yaml`（domain: `business-model`）
- `prj-0001:dct-business-model-br`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-br.yaml`（domain: `business-model`）
- `prj-0001:dct-current-state`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-current-state.yaml`（domain: `current-state`）
- `prj-0001:dct-data-flow`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml`（domain: `data-flow`）
- `prj-0001:dct-data-model-bdd`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-bdd.yaml`（domain: `data-model`）
- `prj-0001:dct-data-model-ccd`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-ccd.yaml`（domain: `data-model`）
- `prj-0001:dct-data-model-cdsd`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml`（domain: `data-model`）
- `prj-0001:dct-data-model-cld`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cld.yaml`（domain: `data-model`）
- `prj-0001:dct-data-model-stsd`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-stsd.yaml`（domain: `data-model`）
- `prj-0001:dct-external-interface-specs`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-external-interface-specs.yaml`（domain: `external-interface-specs`）
- `prj-0001:dct-glossary`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-glossary.yaml`（domain: `glossary`）
- `prj-0001:dct-impact-analysis`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-impact-analysis.yaml`（domain: `impact-analysis`）
- `prj-0001:dct-migration-planning`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-migration-planning.yaml`（domain: `migration-planning`）
- `prj-0001:dct-non-functional-requirements`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-non-functional-requirements.yaml`（domain: `non-functional-requirements`）
- `prj-0001:dct-operations`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-operations.yaml`（domain: `operations`）
- `prj-0001:dct-planning`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-planning.yaml`（domain: `planning`）
- `prj-0001:dct-project-definition`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-definition.yaml`（domain: `project-definition`）
- `prj-0001:dct-project-management`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`（domain: `project-management`）
- `prj-0001:dct-system-acceptance-criteria`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-acceptance-criteria.yaml`（domain: `system-acceptance-criteria`）
- `prj-0001:dct-system-design`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-design.yaml`（domain: `system-design`）
- `prj-0001:dct-system-functions`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-functions.yaml`（domain: `system-functions`）
- `prj-0001:dct-test-specs`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-test-specs.yaml`（domain: `test-specs`）
- `prj-0001:dct-user-interface-model`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-user-interface-model.yaml`（domain: `user-interface-model`）

### 参照する実践の型

- rulebook: `docs/ja/specdojo/rulebooks/sch-rulebook.md`
- recipe: `_MISSING_`
- sample: `_MISSING_`
- template: `_MISSING_`

### scope・intent の宣言と完了条件

1. `docs/ja/projects/prj-0001/timeline/tml-index.yaml` があれば対象 track の domains と依存・着手順を確認する。`timeline build` の register 由来の状態と既存カタログも確認する。
2. `docs/ja/projects/prj-0001/schedule/sch-strategy-stsd-pilot.yaml` に `scope.catalogs`（ID・リポジトリルートからのパス）、`scope.include_kinds` と `approach_rules` を宣言する。既存 scope の意図を保ち、各成果物の `local_ids` と `intent`（例: author-deliverable / bootstrap-kata-set / confirm-deliverable）、必要時の `kata_target` / `bootstrap_scope` を根拠付きで決める。
3. 主担当を `owner_rules` または生成時の `--owner` / `--default-owner` で明示する。`done_criteria.roles` を主担当と解釈しない。必要な kata の grade が不足なら先に評価し、不明な判断を推測で補わない。
   人の文脈記入から始める場合は `intent: draft-with-context` を選ぶ。必要な kata がすべて利用可能なら `draft` profile（context → draft → refine → condense → review → finalize）になる。context と finalize は human、他は agent とし、refine は `fully-guided` で磨き込む。
   context の担当者は `specdojo exec claim --project prj-0001 --task <context-task-id> --by <human>` で着手し、`specdojo deliverable scaffold --project prj-0001 --target <doc-id>` で雛形を作る。既存成果物は上書きしない。本文の `_CONTEXT_:` に固定前提・制約・調査や選定を任せる範囲を書く（例: `_CONTEXT_: 既存 API を維持し、認証方式の候補を調べて提案してほしい。`）。result に記入内容を残して `specdojo exec complete --project prj-0001 --task <context-task-id> --by <human>` で draft へ渡す。human 用の plan は生成しない。
4. `specdojo schedule strategy generate --project prj-0001 --track stsd-pilot` を実行し、scope・intent・担当・依存関係に関するエラーを解消する。既存 strategy の変更は差分を確認し、必要な場合だけ `--force` を指定する。
5. `specdojo schedule build --project prj-0001 --track stsd-pilot` を通し、`sch-track-stsd-pilot.yaml` が生成され、scope の成果物とタスクの対応・依存が一致することを確認する。
6. strategy と track の保存、scope 全件の intent と担当の解決、生成・検証の成功を完了基準とし、個票の作業内容・対応結果と実行記録へ判断と検証を記録する。カタログ本体と `tml-index.yaml` は変更しない。

- `docs/ja/projects/prj-0001/schedule/sch-strategy-stsd-pilot.yaml` があり、scope は `dct-data-model-stsd` の 5 件（`local_ids` で指定）である。`approach_rules` は、retrofit の 4 件（`stsd-register-entry`・`stsd-routine-run`・`stsd-deliverable`・`stsd-job-run`）を `reflect-implementation`、`stsd-task-execution` を `confirm-deliverable` とする。`schedule strategy generate` で作り、手で直した箇所は理由を YAML のコメントに書く。
- 4 件の phase set は `refine-pass` → `condense-pass` → `retrofit-review-pass` → `finalize-pass` の順で、`retrofit-pass` を含まない（段 8 は register で済ませるため）。`stsd-task-execution` は `retrofit-review-pass` → `finalize-pass` だけとする。
- 各 phase の `description` に、確定した Kata（PJR-PT5N）に従うことと、図は図の rulebook の閾値を超える場合だけ分けることを書いている。
- `npx specdojo schedule build --track stsd-pilot` が成功し、生成された `sch-track-stsd-pilot.yaml` に 4 件 × 4 段と 1 件 × 2 段の 18 タスクがある。
- `npx specdojo catalog validate` と `npm run -s validate:schema` が通っている。
- `tml-index.yaml` など、strategy と schedule のほかのファイルは変えていない。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`、`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。
- 冗長さの判定は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness` を正本とする。
- 同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲は書かず、既存の記述は削る・まとめる・参照に置き換える。
- 判断に要る背景・制約・例外・完了条件は残し、長さだけでは削らない。
