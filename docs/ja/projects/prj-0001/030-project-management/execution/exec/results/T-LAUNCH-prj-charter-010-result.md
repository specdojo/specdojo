---
specdojo:
  id: prj-0001:xer-t-launch-prj-charter-010
  type: exec-result
  task_id: T-LAUNCH-prj-charter-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-prj-charter-010-plan.md
  started_at: "2026-06-25T12:46:16.663Z"
  completed_at: "2026-06-25T12:59:05.727Z"
  agent: codex
  approach: bootstrap
---

## 1. 実施内容

- `prj-charter` を [[prj-0001:prj-overview|プロジェクト概要]] と [[prj-0001:prj-stakeholder-register|ステークホルダー登録簿]] に照合し、PO が立ち上げ認可、権限委譲、公開判断、予算枠を判断できる構成へ再整理した。
- `prj-charter-rulebook` を ready 化し、target format、recipe、sample、template を Frontmatter で宣言した。構造は、認可対象、目的、ハイレベルスコープ、成果物、成功基準、初期ステークホルダー、権限委譲、前提・制約、GO / Not GO、承認、未決事項を正本として定義した。
- 未整備だった `prj-charter-recipe` と `prj-charter-template` を新規作成し、`prj-charter-sample` は駄菓子屋の販売管理システムという共通文脈で最小完成例へ更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/020-project-definition/prj-charter.md`
- `docs/ja/specdojo/rulebooks/prj-charter-rulebook.md`
- `docs/ja/specdojo/recipes/prj-charter-recipe.md`
- `docs/ja/specdojo/samples/prj-charter-sample.md`
- `docs/ja/specdojo/templates/prj-charter-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-charter-010-result.md`

## 3. 申し送り

- 予算枠、初回承認日、OSS ライセンス方針、初期公開範囲、GO / Not GO 判断日は、直接根拠文書に確定値がないため `_UNDECIDED_` として残した。詳細計画または PO 承認時に確定する。
- `npm run -s lint:md`、変更対象の `npx remark --quiet --frail`、`npm run -s build`、`node dist/specdojo.js catalog validate` は成功した。
- `npm run -s lint:fm` は既存の exec plan/result Frontmatter 警告で終了コード 1 になった。変更対象の成果物、rulebook、recipe、sample、template は個別 remark 検証で警告なし。
- `npm run -s validate:catalog` は、`tsx` が `/tmp/tsx-1000/*.pipe` を listen しようとして sandbox の `EPERM` で失敗した。代替として build 後の `node dist/specdojo.js catalog validate` を実行し、catalog 検証は成功した。

## 4. 参考資料の活用

- bootstrap として、成果物本文の内容根拠は [[prj-0001:prj-overview|プロジェクト概要]] と [[prj-0001:prj-stakeholder-register|ステークホルダー登録簿]] に限定した。既存の `docs-structure-guide` 由来のゲート詳細や後続文書の詳細参照は、成果物本文の根拠から外し、憲章として必要な GO / Not GO 観点へ一般化した。
- 既存の成果物、rulebook、sample は評価の結果、rulebook が recipe/template を未宣言で、成果物本文と sample も現行 rulebook の 13 章構成に一致していなかったため修正した。recipe と template は未作成だったため新規作成した。
- 同種の `status: ready` 文書である `prj-stakeholder-register` と `prj-scope` の rulebook、recipe、sample、template を、章番号、表の粒度、Frontmatter、プレースホルダの置き方の手本として参照した。固有内容は転記していない。
- 構造、必須項目、禁止事項は [[prj-charter-rulebook]] を正とした。recipe は問い・深掘り・レビュー、sample は完成最小例、template はプロジェクト固有値を含まない骨組みとして役割を分離した。Web 出典は使用していない。
