---
specdojo:
  id: prj-0001:xep-pjr-stm9-20261108t140157z-f0277a9b
  type: exec-plan
  rulebook: none
  task_id: PJR-STM9
  name: "業務仕様の代表の schedule（business-specs-reps）を作る"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  approach: strategy-planning
  targets:
    - track:business-specs-reps
---

# Edit Plan: PJR-STM9 Schedule strategy と track の生成

## 1. このフェーズで行うこと

代表 8 件を対象にした sch-strategy-business-specs-reps.yaml を作り、作成・磨き込み・condense・review・確定（人）の段で schedule build する

対象単位・参照資料・実行コマンド・完了条件は「個票の追加完了条件」に展開する。

- result: `docs/ja/projects/prj-0001/execution/runs/register/PJR-STM9/pjr-stm9-20261108T140157Z-f0277a9b/result.md`

## 2. 完了手順

1. 参照する kata・既存カタログと個票を読み、追加完了条件の手順を実行する。
2. 共通規約に従って必要な整形・静的検査を行う。
3. 個票の作業内容・対応結果を更新し、実行記録に判断根拠・変更ファイル・検証結果を残す。pipeline の executor は result を編集せず報告へ記入する。

## 3. 異常終了の条件

- 入力不足、対象不明、解消できない判定事項、生成・検査失敗があれば停止し、理由と次のアクションを報告する。
- 登録簿と個票のステータスを変更しない。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 対象: bdd-register-entry・ccd-project-planning・cdt-register-type・br-task-selection-strategy・bes-task-ready-selected と、PJR-V6RB でカタログに足す sf・uis・ifx の各 1 件（indie が決定）。
- agent の review の段を残す（indie が決定）。段の並びは schedule strategy generate --dry-run で先に確かめる。

## 個票の追加完了条件

次の生成手順・完了条件と、個票が定める追加条件を満たす。

### 作業単位と既存カタログ

対象: `track:business-specs-reps`（project: `prj-0001`）。既存カタログは読み取り、scope と依存関係の判断に取り込む。

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
- `prj-0001:dct-data-model-cdt`: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdt.yaml`（domain: `data-model`）
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

1. `docs/ja/projects/prj-0001/controls/project-register` の対象 track を担う epic の domains と depends_on を確認する。範囲は既存 strategy の scope、epic の domains、互換用 tml-index.yaml の順で解決する。`dashboard build` のカタログ検出と既存カタログも確認する。
2. `docs/ja/projects/prj-0001/schedule/sch-strategy-business-specs-reps.yaml` に `scope.catalogs`（ID・リポジトリルートからのパス）、`scope.include_kinds` と `approach_rules` を宣言する。既存 scope の意図を保ち、各成果物の `local_ids` と `intent`（例: author-deliverable / bootstrap-kata-set / confirm-deliverable）、必要時の `kata_target` / `bootstrap_scope` を根拠付きで決める。
3. 主担当を `owner_rules` または生成時の `--owner` / `--default-owner` で明示する。`done_criteria.roles` を主担当と解釈しない。必要な kata の grade が不足なら先に評価し、不明な判断を推測で補わない。
   人の文脈記入から始める場合は `intent: draft-with-context` を選ぶ。必要な kata がすべて利用可能なら `draft` profile（context → draft → refine → condense → review → finalize）になる。context と finalize は human、他は agent とし、refine は `fully-guided` で磨き込む。
   context の担当者は `specdojo exec claim --project prj-0001 --task <context-task-id> --by <human>` で着手し、`specdojo deliverable scaffold --project prj-0001 --target <doc-id>` で雛形を作る。既存成果物は上書きしない。本文の `_CONTEXT_:` に固定前提・制約・調査や選定を任せる範囲を書く（例: `_CONTEXT_: 既存 API を維持し、認証方式の候補を調べて提案してほしい。`）。result に記入内容を残して `specdojo exec complete --project prj-0001 --task <context-task-id> --by <human>` で draft へ渡す。human 用の plan は生成しない。
4. `specdojo schedule strategy generate --project prj-0001 --track business-specs-reps` を実行し、scope・intent・担当・依存関係に関するエラーを解消する。既存 strategy の変更は差分を確認し、必要な場合だけ `--force` を指定する。
5. `specdojo schedule build --project prj-0001 --track business-specs-reps` を通し、`sch-track-business-specs-reps.yaml` が生成され、scope の成果物とタスクの対応・依存が一致することを確認する。
6. strategy と track の保存、scope 全件の intent と担当の解決、生成・検証の成功を完了基準とし、個票の作業内容・対応結果と実行記録へ判断と検証を記録する。カタログ本体と `tml-index.yaml` は変更しない。

- `docs/ja/projects/prj-0001/schedule/sch-strategy-business-specs-reps.yaml` を、`schedule strategy generate --project prj-0001 --track business-specs-reps` で作っている。対象（`scope.catalogs[].local_ids`）は次の 8 件だけである。
  - `bdd-register-entry`・`ccd-project-planning`・`cdt-register-type`・`br-task-selection-strategy`・`bes-task-ready-selected`
  - `sf-task-execution`・`ifx-cmd-ai-provider-cli`（PJR-V6RB）と `clis-exec-commands`（PJR-8J47 で `uis-exec-commands` から付け替える）
- 各対象の段が、作成 → 磨き込み（fully-guided）→ 冗長さの整理（condense）→ agent の review → 確定（人）の順になっている。`approach_rules` の `intent` は、対象がまだない成果物を型から作る `author-deliverable` を基本とし、生成の結果がこの並びにならない場合は、どの intent を選んだかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 書き込みの前に `--dry-run` で差分を確かめ、`schedule build --project prj-0001 --track business-specs-reps` で `sch-track-business-specs-reps.yaml` を作っている。
- ほかの track の strategy・track と `sch-milestones.yaml` のうち business-specs-reps と関係のない項目を変えていない。
- `specdojo exec validate --project prj-0001 --schedule-only`・`npm run validate:schema`・`npm run lint:md` が通っている。
- schedule のタスクの実行（`exec run --auto`）はこの項目では行わない。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
