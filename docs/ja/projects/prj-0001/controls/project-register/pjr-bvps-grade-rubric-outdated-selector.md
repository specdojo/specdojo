---
specdojo:
  id: prj-0001:pjr-bvps-grade-rubric-outdated-selector
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T03:43:11Z"
---

# PJR-BVPS 旧 rubric の grade 結果を選ぶ条件を追加し夜間に少しずつ評価し直す

## 1. 概要

PJR-K351 で、grade の rubric を `grade-rubric-v2`（9 category、`pass_score` 75）に改め、対象の観点を 28 に広げた（定義は `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`）。既存の grade 結果は旧 rubric（v1、4 category、8〜12 観点）で付けたもので、点数を v2 と比べられない。

`grade list` の選択条件（`--changed-only`・`--dependency-changed`・`--rulebook-changed`・`--unreviewed`・`--ungraded`・`--incomplete` など）は、どれも結果の rubric の版を見ない。PJR-Z47X の個票でも、`changed_only` は観点定義と rubric の変更を検出しないと整理した。そのため、夜間の定期実行（`rtn-grade-recheck`・`rtn-grade-deliverable-recheck`）では、旧 rubric の結果が評価し直しの対象にならない。

2026-09-28 に手動で全件を評価し直し始めたが、codex・claude・agy の利用上限で中断した。完了したのは 49 件（成果物 26、rulebook 8、sample 5、recipe 10）である（74fddb03）。利用者は、評価し直しを急がず、夜間の余った利用枠で少しずつ進めると判断した。

## 2. 完了条件

- `grade list` に、保存されている結果の `rubric` が現在の rubric の id と異なる文書を選ぶ条件（例: `--rubric-outdated`）がある。
- `tools/grade/run-per-document.sh` が、その条件を受け取って選択に使える。
- `job-grade-kata.yaml` と `job-grade-deliverable.yaml` にこの条件の入力があり、`rtn-grade-recheck.yaml` と `rtn-grade-deliverable-recheck.yaml` で有効になっている。既存の `limit`（kata 15 件、成果物 10 件）の範囲で、夜間に少しずつ評価し直す。
- 夜間の評価者は、各 Job 定義の既定（codex-expert-executor）のままとする。手動で評価し直した結果の評価者（成果物は codex、rulebook は claude、sample は agy 経由の claude、recipe は agy）は、そのまま残す。
- 旧 rubric の結果がどれだけ残っているかを、`grade list` の条件で数えられる。変更時点の件数を対応結果に記録する。
- 条件の判定を確かめる単体テストがある（現在の rubric の結果は選ばれず、旧 rubric の結果と、rubric の記録がない結果は選ばれる）。
- `command-reference.md` と `routine-operation-guide.md` に、条件と夜間の評価し直しの運用が書かれている。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                |
| --- | --------------------------------------------------------- | ---- | ---- | ------------------- |
| 1   | `grade list` に旧 rubric の結果を選ぶ条件を追加する       | DEV  | done | `--rubric-outdated` |
| 2   | `run-per-document.sh` と Job 定義・routine に入力を加える | DEV  | done | `rubric_outdated`   |
| 3   | テストとガイドへの記載を追加する                          | DEV  | done | -                   |

## 4. 対応結果

- `grade list`（および `grade plan` / `apply` / `validate`）に `--rubric-outdated` を追加した（`src/grade.ts`）。grade result サイドカーの `rubric` が、解決済みの観点定義の `grade_rubric.id` と異なる文書と、`rubric` が空の文書を選ぶ。サイドカーがない文書は選ばない（`--ungraded` の対象であり、両者の併用は入力エラー）。観点定義に `grade_rubric.id` がない場合は入力エラーとする。判定は `isGradeRubricOutdated` に分けた。
- `tools/grade/run-per-document.sh` に `--rubric-outdated[=true|false]` を追加し、`grade list --rubric-outdated` の結果をほかの条件と和集合で選ぶ。あわせて、全件選択へ落ちる判定を「いずれかの選択条件が有効か」で行うよう改めた。従来は `--changed-only`・`--ungraded`・`--incomplete` だけを見ており、`--dependency-changed` などだけを指定すると全件が選ばれた。Run の設定（`config.tsv`）に `rubric_outdated` を加え、選択規則の版を `selection-v5` に上げた。
- `job-grade-kata.yaml` と `job-grade-deliverable.yaml` に入力 `rubric_outdated`（既定 `false`）を加え、precondition と command に反映した。`idempotency_key` の版を上げ、入力値を含めた。`rtn-grade-recheck.yaml` と `rtn-grade-deliverable-recheck.yaml` で `rubric_outdated: "true"` を有効にした。`limit`（kata 15 件、成果物 10 件）と評価者（Job 定義の既定の `codex-expert-executor`）は変えていない。手動で評価し直した結果の評価者は変更していない。
- 変更時点（2026-09-28）で `grade list --rubric-outdated` が選んだ件数は、Kata 232 件（rulebook 99、recipe 11、sample 87、template 35）、成果物 19 件である。
- テストを追加した。`tests/src/grade-triggers.test.ts` で、現在の rubric の結果は選ばれず、旧 rubric と rubric の記録がない結果は選ばれること、サイドカーのない文書は選ばれないこと、`grade_rubric.id` がない場合と `--ungraded` との併用がエラーになることを確かめる。`tests/tools/grade-per-document.test.ts` で、`--rubric-outdated` だけを指定したときに全件ではなく該当文書だけを選ぶことと、真偽値以外を拒否することを確かめる。
- `command-reference.md` の `grade` と文書単位の grade pipeline の説明、`routine-operation-guide.md` の grade の単段評価に、条件と夜間の評価し直しの運用、残件数の数え方を書いた。

## 5. 関連ドキュメント

- PJR-K351（rubric v2）、PJR-Z47X（`changed_only` の検出範囲）、PJR-N03W（定期実行の契機）
- [[specdojo:routine-operation-guide]]
- `src/grade.ts`、`tools/grade/run-per-document.sh`、`docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`、`docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`
