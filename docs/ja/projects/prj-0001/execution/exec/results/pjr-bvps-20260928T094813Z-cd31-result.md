---
specdojo:
  id: prj-0001:xer-pjr-bvps-20260928t094813z-cd31
  type: exec-result
  task_id: PJR-BVPS
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-bvps-20260928T094813Z-cd31-plan.md
  started_at: "2026-09-28T09:48:13.046Z"
  completed_at: "2026-09-28T09:56:11.927Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- `grade list`（および `grade plan` / `apply` / `validate`）に `--rubric-outdated` オプションを追加し、保存済み grade 結果の `rubric` が現在の観点定義の `grade_rubric.id` と異なる文書、および `rubric` 未記録の文書を選択できるようにした（`isGradeRubricOutdated` に判定を分離、`--ungraded` との併用はエラー）。
- `tools/grade/run-per-document.sh` に `--rubric-outdated[=true|false]` を追加し、他の選択条件と和集合で対象を選ぶようにした。あわせて全件選択へフォールバックする判定を「いずれかの選択条件が有効か」に改め、従来 `--dependency-changed` 等を単独指定すると全件が選ばれていた不具合も修正した。`config.tsv` に `rubric_outdated` を追加し、選択規則の版を `selection-v5` に更新した。
- `job-grade-kata.yaml` / `job-grade-deliverable.yaml` に入力 `rubric_outdated`（既定 `false`）を追加し、`rtn-grade-recheck.yaml` / `rtn-grade-deliverable-recheck.yaml` で `rubric_outdated: "true"` を有効化した。既存の `limit`（kata 15 件、成果物 10 件）と Job 既定の評価者（`codex-expert-executor`）は変更していない。
- 単体テストを追加・更新した（`tests/src/grade-triggers.test.ts`：現行 rubric の結果は選ばれず旧 rubric・rubric 未記録の結果は選ばれること、サイドカー無し文書は選ばれないこと、`grade_rubric.id` 未定義や `--ungraded` 併用がエラーになることを検証。`tests/tools/grade-per-document.test.ts`：`--rubric-outdated` 単独指定時に全件でなく該当文書のみが選ばれること、真偽値以外を拒否することを検証）。
- `command-reference.md` と `routine-operation-guide.md` に、新条件と夜間の評価し直し運用、残件数の数え方を追記した。個票（`pjr-bvps-grade-rubric-outdated-selector.md`）の作業内容・対応結果セクションを実施内容で更新し、変更時点（2026-09-28）の残件数（kata 232 件: rulebook 99・recipe 11・sample 87・template 35、成果物 19 件）を記録した。
- executor 自身の検査（`npx tsx src/specdojo.ts grade list --rubric-outdated` 各種、`prettier`、`markdownlint`、`eslint`、`catalog validate`、`register build`、`index build`、`routine list`）はすべて passed。親 runner 検証（`test-unit` / `test-integration` / `validate-schema` / `typecheck`）もすべて passed で、ブロック要因は確認されなかった。

## 2. 変更ファイル

- `src/grade.ts`: `grade list` / `plan` / `apply` / `validate` に `--rubric-outdated` を追加し、判定関数 `isGradeRubricOutdated` を新設。サイドカーの `rubric` が現行 `grade_rubric.id` と異なる、または未記録の文書を選択し、サイドカー無し文書は対象外。`--ungraded` との併用と `grade_rubric.id` 未定義はエラーにした。
- `tools/grade/run-per-document.sh`: `--rubric-outdated[=true|false]` を追加し他条件との和集合選択に対応。全件フォールバック判定を「いずれかの選択条件が有効か」に修正（`--dependency-changed` 等単独指定時の全件選択バグを解消）。`config.tsv` に `rubric_outdated`、選択規則版を `selection-v5` に更新。
- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`: 入力 `rubric_outdated`（既定 `false`）を追加し、precondition・command に反映。`idempotency_key` の版を入力値込みで更新。
- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`: 入力 `rubric_outdated`（既定 `false`）を追加し、precondition・command に反映。`idempotency_key` の版を入力値込みで更新。
- `docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`: `rubric_outdated: "true"` を有効化。既存 `limit`（kata 15 件）と既定評価者は変更なし。
- `docs/ja/projects/prj-0001/routines/rtn-grade-deliverable-recheck.yaml`: `rubric_outdated: "true"` を有効化。既存 `limit`（成果物 10 件）と既定評価者は変更なし。
- `docs/ja/specdojo/references/command-reference.md`: `grade` コマンドおよび文書単位 grade pipeline の説明に `--rubric-outdated` 条件を追記。
- `docs/ja/specdojo/guides/routine-operation-guide.md`: grade の単段評価の説明に、旧 rubric 再評価の運用と残件数の数え方を追記。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-bvps-grade-rubric-outdated-selector.md`: 個票の作業内容（No.1〜3 を `done` に更新）と対応結果セクションを、実施した変更内容・テスト内容・変更時点の残件数（kata 232 件、成果物 19 件）で更新した。
- `tests/src/grade-triggers.test.ts`: `--rubric-outdated` の選択条件に関する単体テストを追加（現行 rubric 除外、旧 rubric・未記録の選択、サイドカー無し除外、`grade_rubric.id` 未定義・`--ungraded` 併用のエラー検証）。
- `tests/tools/grade-per-document.test.ts`: `run-per-document.sh` の `--rubric-outdated` 単独指定時の対象限定選択と、真偽値以外の拒否を検証するテストを追加。

## 3. 申し送り

- `tools/grade/run-per-document.sh --run-id bvps-dry --target deliverable --rubric-outdated --limit 10 --dry-run` は sandbox の承認制約により executor 側で直接実行しておらず `not_run`。この挙動は `tests/tools/grade-per-document.test.ts` でカバーされており、当該テストは親 runner の `test-unit` で passed 済みだが、必要であれば人手で dry-run を一度実行し出力を目視確認することを推奨する。
- `npm run check` は executor 側で実行されていない（`final_message` に明記）。親 runner の `test-unit` / `test-integration` / `validate-schema` / `typecheck` はいずれも passed だが、個票の完了条件に挙がる `npm run check` の成功は未確認のため、次アクションとして実行結果の確認を推奨する。
- 変更時点（2026-09-28）の旧 rubric 残件数は kata 232 件（rulebook 99、recipe 11、sample 87、template 35）、成果物 19 件。夜間ルーチンの `limit`（kata 15 件、成果物 10 件）のまま少しずつ評価し直す運用のため、全件解消までの日数見積りは result 側の申し送りとして残していない。必要なら別途見積る。

## 4. 進め方と実践の型の適用

登録簿個票（PJR-BVPS）の完了条件に沿って、`grade list` 系コマンドに保存済み結果の rubric 版が現行と異なる（または未記録の）文書を選ぶ `--rubric-outdated` 条件を追加し、`tools/grade/run-per-document.sh` と夜間ルーチン用 Job 定義（`job-grade-kata.yaml` / `job-grade-deliverable.yaml`）・routine 定義（`rtn-grade-recheck.yaml` / `rtn-grade-deliverable-recheck.yaml`）へ配線した。既存の `limit` と既定評価者は変更せず、単体テストとドキュメント（`command-reference.md` / `routine-operation-guide.md`）を追加・更新し、個票の作業内容・対応結果を実施内容で更新した。
