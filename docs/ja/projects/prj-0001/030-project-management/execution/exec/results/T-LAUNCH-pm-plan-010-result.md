---
id: prj-0001:xer-t-launch-pm-plan-010
type: exec-result
task_id: T-LAUNCH-pm-plan-010
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-pm-plan-010-plan.md
started_at: "2026-06-25T12:25:22.402Z"
completed_at: "2026-06-25T14:26:26.329Z"
agent: codex-expert-edit-agent
---

## 1. 実施内容

- `pm-plan.md` を、PM が計画化、進捗確認、課題・リスク管理、変更管理に使う上位計画として更新した。
- `pm-organization.md` と `pm-roles.yaml` に合わせ、採用 Role code と実行主体の割り当てを分離した。
- `pm-raci.md` の `pm-plan` 行と整合するよう、`pm-plan` の責任分担を `PM` の `A/R` として記述した。
- `pm-plan-rulebook.md` を ready 化し、`recipe` / `sample` / `template` を frontmatter に宣言した。
- plan 上は `_MISSING_` だったが、ワークツリー上に存在する `pm-plan-recipe.md` と `pm-plan-template.md` を確認し、rulebook と整合する参考資料として維持した。
- `pm-plan-sample.md` を sample ID、駄菓子屋文脈、rulebook 準拠の最小完成例として更新した。
- `pm-plan.md` の関連ドキュメントは、`[[id|title]]` のリンク規約と markdownlint の表記制約を両立するため、表ではなく箇条書きで記述し、既存文書は project 修飾 ID で参照した。
- 前回中断により `blocked` のままだった result を、今回の再確認結果に基づいて `complete` に更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-plan.md`
- `docs/ja/specdojo/rulebooks/pm-plan-rulebook.md`
- `docs/ja/specdojo/recipes/pm-plan-recipe.md`
- `docs/ja/specdojo/samples/pm-plan-sample.md`
- `docs/ja/specdojo/templates/pm-plan-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-plan-010-result.md`

## 3. 申し送り

- `pm-plan.md` は `PM` の管理責務に集中させ、`PO` は最終判断が必要な変更、公開可否、スコープ・優先順位へ影響する判断に限定した。
- 個別の品質管理、コミュニケーション管理、Schedule、PJR の詳細突合は、本タスクの対象外として、導線と管理方針の記述に留めた。
- 初回公開判断は `_UNDECIDED_` として残した。後続の公開準備または review task で、公開範囲、検証結果、公開不適切情報の有無を確認する。

## 4. 参考資料の活用

- 成果物本体は、対象成果物 `pm-plan.md`、依存成果物 `pm-organization.md`、`pm-roles.yaml` を主根拠にした。`pm-plan` の RACI 行との整合確認のため、同じ bootstrap で ready 化済みの `pm-raci.md` も手本として参照した。
- bootstrap の手本として、同種で `status: ready` の `pm-organization-rulebook.md`、`pm-organization-recipe.md`、`pm-organization-sample.md`、`pm-organization-template.md` と、近接 PM 成果物の `pm-raci-rulebook.md`、`pm-raci-sample.md`、`pm-raci-template.md` を参照した。章構成、粒度、表、プレースホルダの置き方を手本にし、内容はプロジェクト管理計画用に一般化した。
- 既存の `pm-plan.md` は、管理方針、品質・リスク・課題管理、体制、報告、見直しの骨格を維持した。ただし、owner ロールが PM である本タスクに合わせ、判断者が `PO` に寄りすぎていた箇所を、PM の起案・整理・運用と PO の最終判断に分離した。
- 既存の `pm-plan-rulebook.md` は、構造の大枠を維持しつつ、recipe / sample / template への参照、PM 管理責務、Role code と実行主体の分離、管理台帳への接続、禁止事項を補強した。構造・必須項目・禁止事項は rulebook を正とし、recipe / sample / template を追従させた。
- `pm-plan-sample.md` は、既存が薄く sample ID も成果物 ID と重複していたため、`pm-plan-sample` に修正し、駄菓子屋文脈の完成最小例として再構成した。
- `pm-plan-recipe.md` は、rulebook の本文構成を重複定義せず、問い、深掘り、レビュー観点に集中した作成手順として確認した。
- `pm-plan-template.md` は、rulebook の標準構成に対応する章とプレースホルダを持つ雛形として確認した。
- 外部情報は使用しなかった。指定された対象文書、依存成果物、同種 ready 文書で判断可能だったため、Web 出典は追加していない。

## 5. 検証

- `npx markdownlint docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-plan.md docs/ja/specdojo/rulebooks/pm-plan-rulebook.md docs/ja/specdojo/recipes/pm-plan-recipe.md docs/ja/specdojo/samples/pm-plan-sample.md docs/ja/specdojo/templates/pm-plan-template.md docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-plan-010-result.md`: 成功
- `npm run -s lint:md`: 成功
- `npm run -s build`: 成功
- `npm run -s validate:catalog`: 失敗。`tsx` の IPC pipe 作成が `listen EPERM: operation not permitted /tmp/tsx-1000/14.pipe` で失敗したため、ビルド済み CLI で同等検証を実行した。
- `node dist/specdojo.js catalog validate`: 成功
- `npm run -s docs:build`: 失敗。Mermaid SVG 生成時に Chromium 起動が `setsockopt: Operation not permitted` で失敗した。対象文書ではなくブラウザ起動権限の制約として扱う。
- `npm test`: 失敗。Vitest が symlink 先の `node_modules/.vite-temp` へ設定一時ファイルを書こうとして `EROFS` になった。
- `npx vitest run --configLoader runner`: 失敗。30 ファイル中 26 ファイル、336 件中 321 件は通過したが、worktree 系テストが `spawnSync git EPERM` を中心に失敗し、in-place exec テスト 2 件も agent 実行結果の期待値未充足で失敗した。対象文書の lint / build / catalog 検証は成功しているため、環境制約を含む残リスクとして記録する。
