---
specdojo:
  id: prj-0001:xer-t-launch-pm-quality-management-plan-010
  type: exec-result
  task_id: T-LAUNCH-pm-quality-management-plan-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-quality-management-plan-010-plan.md
  started_at: "2026-06-25T14:38:12.171Z"
  completed_at: "2026-06-25T14:51:44.960Z"
  agent: codex-expert-edit-agent
---

## 1. 実施内容

- 品質管理計画を `pm-plan`、組織定義、ロール定義、RACI と整合する形で更新した。
- `pm-quality-management-plan-rulebook.md` を現行の Rulebook 記述標準に合わせ、recipe / sample / template 参照を宣言した。
- 未整備だった `pm-quality-management-plan-recipe.md` と `pm-quality-management-plan-template.md` を新規作成した。
- `pm-quality-management-plan-sample.md` を rulebook の章構成と共通サンプル文脈に合わせて再構成した。
- 成果物、rulebook、recipe、sample、template の章構成、必須表、禁止事項、Role code 表記を相互に揃えた。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-quality-management-plan.md`
- `docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md`
- `docs/ja/specdojo/recipes/pm-quality-management-plan-recipe.md`
- `docs/ja/specdojo/samples/pm-quality-management-plan-sample.md`
- `docs/ja/specdojo/templates/pm-quality-management-plan-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-quality-management-plan-010-result.md`

## 3. 申し送り

- 公開前チェックリストの正本形式、リンクチェック自動化、docs build の実行タイミングは未決事項として成果物本文に残した。
- `pm-quality-management-plan` の成果物別 RACI は既存の [[prj-0001:pm-raci|RACI]] では `QE` が `A/R` である。一方、本タスクの owner は `PM` のため、本文では PM が品質確認を計画・進捗・課題・リスク管理へ接続し、QE が品質確認、PO が最終判断を担う分担として整理した。

## 4. 参考資料の活用

- 変更前に、対象成果物、既存 rulebook、既存 sample、`pm-plan`、`pm-organization`、`pm-roles.yaml`、`pm-raci`、`pm-communication-plan`、各 authoring standard を確認した。
- 同種で `status: ready` の手本として、`pm-plan-rulebook.md`、`pm-plan-recipe.md`、`pm-plan-sample.md`、`pm-plan-template.md`、`pm-communication-plan-rulebook.md`、`pm-communication-plan-recipe.md`、`pm-communication-plan-template.md` を参照した。
- 成果物本体は既存内容を維持できる部分が多かったため、構造は維持しつつ、frontmatter の `based_on`、wiki link 記法、PM 観点の管理接続、未決事項を補強した。
- rulebook は既存の品質目標、レビュー、メトリクス、検査基準、是正の骨格を維持し、現行標準に合わせて `target_format`、recipe / sample / template、標準章構成、記述ガイド、禁止事項、参照章を追加した。
- recipe は rulebook の構造を再定義せず、品質管理計画を良くするための問い、深掘り手順、良い例 / 悪い例、レビュー観点に一般化した。
- sample は既存が薄く、rulebook の必須章と推奨表を満たしていなかったため、駄菓子屋販売管理システムの最小完成例として再構成した。
- template はプロジェクト固有値を入れず、rulebook の本文構成に対応する章、表、プレースホルダだけを配置した。
- 内容の根拠は、本 plan の対象文書、`depends_on` である `pm-plan`、および bootstrap で参照可能な同種 ready 文書に限定した。Web 出典は使用していない。

## 5. 検証

- `npm run -s lint:md`: 成功。
- `npx remark docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-quality-management-plan.md docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md docs/ja/specdojo/recipes/pm-quality-management-plan-recipe.md docs/ja/specdojo/samples/pm-quality-management-plan-sample.md docs/ja/specdojo/templates/pm-quality-management-plan-template.md docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-quality-management-plan-010-result.md --quiet --frail`: 成功。
- `npm run -s build`: 成功。
- `node dist/specdojo.js catalog validate`: 成功。
- `npm run -s lint:fm`: 失敗。既存の exec plan 群で `type` schema warning、既存 result 群で `status` / `approach` enum warning が出ている。本タスクで変更した対象ファイルに絞った `remark` 検証は成功。
- `npm run docs:build --silent`: 失敗。Mermaid SVG 生成時の Chromium 起動が `setsockopt: Operation not permitted` で失敗した。対象文書ではなくブラウザ起動権限の制約として扱う。
- `npm test`: 失敗。Vitest が `node_modules/.vite-temp` へ設定一時ファイルを書こうとして `EROFS: read-only file system` になった。
