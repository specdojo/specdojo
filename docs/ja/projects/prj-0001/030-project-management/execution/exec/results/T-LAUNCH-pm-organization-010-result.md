---
specdojo:
  id: prj-0001:xer-t-launch-pm-organization-010
  type: exec-result
  task_id: T-LAUNCH-pm-organization-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-organization-010-plan.md
  started_at: "2026-06-23T15:24:29.086Z"
  completed_at: "2026-06-25T09:54:45.753Z"
  agent: codex-expert-edit-agent
---

## 1. 実施内容

- `pm-organization.md` を、`prj-overview` の目的・スコープ・公開方針に基づく組織設計文書として補強した。PO が承認判断できるよう、個人・小規模運用、AI Agent の支援範囲、人間 PO への最終判断集約を明記した。
- `pm-roles.yaml` と `pm-members.yaml` を正本とする方針を維持しつつ、採用ロールと Schedule の `owner` 語彙の扱いを追加した。採用は責務語彙の採用であり、専任 member 配置ではないことを明確にした。
- `pm-organization-rulebook.md`、`pm-organization-recipe.md`、`pm-organization-sample.md`、`pm-organization-template.md` を、同じ 5 章構成へ揃えた。
- `pm-organization-sample.md` は駄菓子屋きぬや文脈の最小完成例として更新し、プロジェクト固有の人物名や具体 member 割り当てを複製しない形に一般化した。
- `npm run -s lint:md`、変更対象の `npx remark --quiet --frail`、`npm run -s build`、`node dist/specdojo.js catalog validate` を実行し、成功した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-organization.md`
- `docs/ja/specdojo/rulebooks/pm-organization-rulebook.md`
- `docs/ja/specdojo/recipes/pm-organization-recipe.md`
- `docs/ja/specdojo/samples/pm-organization-sample.md`
- `docs/ja/specdojo/templates/pm-organization-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-organization-010-result.md`

## 3. 申し送り

- `pm-roles.yaml` と `pm-members.yaml` の構造は本タスクでは変更していない。後続の `pm-roles` / `pm-members` タスクで、Role code 語彙と member の `roles` が今回の方針と整合していることを確認する。
- `npm run -s validate:catalog` は、`tsx` が `/tmp/tsx-1000/*.pipe` を listen しようとして sandbox の `EPERM` で失敗した。代替として build 後の `node dist/specdojo.js catalog validate` を実行し、catalog 検証は成功した。

## 4. 参考資料の活用

- 成果物本体は、直接根拠を `prj-overview` と対象成果物群に限定した。関連する設計標準は、Role / Member / `owner` の使い分けと記述上の制約確認に限って参照した。
- bootstrap として既存の `pm-organization.md`、rulebook、recipe、sample、template を評価した。小規模・兼務・人間 PO の最終判断という骨格は維持し、薄かった「採用ロールと owner 語彙」を追加した。
- 同種で `status: ready` の [[prj-scope-rulebook|プロジェクトスコープ 作成ルール]]、[[prj-scope-recipe|プロジェクトスコープ 作成レシピ]]、[[prj-scope-sample|プロジェクトスコープ sample]]、[[prj-scope-template|プロジェクトスコープ template]] を、章構成、粒度、表、プレースホルダの手本として参照した。内容は転記せず、組織定義用に一般化した。
- rulebook の構造・必須項目・禁止事項を正とし、recipe / sample / template をその構造に追従させた。丸写しを避けるため、rulebook は規定、recipe は問いと手順、sample は完成例、template はプレースホルダに役割を分けた。
- 外部情報は使用しなかった。指定された依存文書と既存の同種 ready 文書で判断可能であり、成果物内容の根拠範囲外となる Web 出典は追加していない。
