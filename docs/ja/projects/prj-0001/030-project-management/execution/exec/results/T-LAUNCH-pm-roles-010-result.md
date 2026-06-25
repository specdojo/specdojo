---
id: prj-0001:xer-t-launch-pm-roles-010
type: exec-result
task_id: T-LAUNCH-pm-roles-010
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-pm-roles-010-plan.md
started_at: "2026-06-25T12:07:46.665Z"
completed_at: "2026-06-25T12:21:41.607Z"
agent: codex-expert-edit-agent
---
## 1. 実施内容

- `pm-roles.yaml` は既存の 8 Role code 構成を維持した。`PM`、`UX`、`OPS` の `project_note` から member nickname や具体的な割り当てに見える記述を外し、Role code 語彙と公開判断上の注意に寄せた。
- `pm-roles-rulebook.md` を ready 化し、recipe / sample / template 参照を追加した。既存 rulebook が `document` ブロックを推奨していた点は、実スキーマと既存 YAML のフラットな `id` / `type` / `status` 構造に合わせて修正した。
- `pm-roles-recipe.md` を新規作成し、問い、作成手順、深掘り手順、良い例 / 悪い例、レビュー観点を整理した。
- `pm-roles-sample.yaml` を rulebook と整合する最小完成例として更新し、具体的な member 割り当てではなく Role code の扱いと専任化条件が伝わる記述にした。
- `pm-roles-template.yaml` を新規作成し、`pm-roles.yaml` の骨組みと Role code ごとの `project_note` プレースホルダを配置した。さらに、同種で `status: ready` の YAML template（`pm-review-viewpoints-template.yaml`、`dct-*-template.yaml`）の確立済み慣行に倣い、template メタ項目を `id: pm-roles-template` / `type: template` / `status: draft` に揃え、`# Template:` ヘッダコメントと `_PRJ-0000_` プレースホルダ（scaffold 時に `project_id` へ置換）に統一した。
- `npm run -s lint:md`、`npm run -s lint:fm`（対象 markdown は警告なし）、`pm-roles.schema.yaml` による成果物 / sample 検証、`npm run -s build`、`node dist/specdojo.js catalog validate`、`node dist/specdojo.js exec validate --project prj-0001` を実行し、いずれも成功（exit 0）した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-roles.yaml`
- `docs/ja/specdojo/rulebooks/pm-roles-rulebook.md`
- `docs/ja/specdojo/recipes/pm-roles-recipe.md`
- `docs/ja/specdojo/samples/pm-roles-sample.yaml`
- `docs/ja/specdojo/templates/pm-roles-template.yaml`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-roles-010-result.md`

## 3. 申し送り

- `pm-members.yaml` 側では、今回維持した `PO` / `PM` / `BA` / `ARC` / `DEV` / `QE` / `UX` / `OPS` の Role code だけを `members[].roles` に使用すること。
- `pm-roles.yaml` には具体的な実行主体や兼務割り当てを戻さず、割り当て変更は `pm-members.yaml` で扱うこと。
- `exec validate` が `pm-roles-template` を `templates/pm-roles-template.md` として探索し WARN（exit 0、非致命）を出す。原因は `src/reference-materials.ts` の template 解決が `target_format` を無視し拡張子を `md` に固定している点（sample は `target_format` を反映して `.yaml` を解決）。YAML 成果物の template は sample と同様に `.yaml` が正のため template は `.yaml` で維持し、本タスク範囲外の CLI 修正（template 解決を `target_format` 反映に変更）を別タスクで対応すること。

## 4. 参考資料の活用

- 成果物本体は、対象成果物、既存 `pm-roles.yaml`、依存文書 [[prj-0001:pm-organization|組織定義]] を直接根拠として評価した。全 Role code は過不足なく存在していたため維持し、実行主体の割り当てに見える `po`、`ba-agent` の記述だけを修正した。
- 既存 `pm-roles-rulebook.md` と `pm-roles-sample.yaml` は、構造の骨格を活かして差分更新した。recipe と template は未整備だったため新規作成した。
- 同種で `status: ready` の [[pm-organization-rulebook|組織定義 作成ルール]]、[[pm-organization-recipe|組織定義 作成レシピ]]、[[pm-organization-sample|組織定義 sample]]、[[pm-organization-template|組織定義 template]] を、章構成、粒度、表、プレースホルダの置き方の手本として参照した。内容は転記せず、ロール定義用に一般化した。
- YAML template については、`status: draft` だが確立済みの YAML template 慣行を示す `pm-review-viewpoints-template.yaml` および `dct-*-template.yaml` を形（`# Template:` ヘッダ、`id: <name>-template`、`type: template`、`_PRJ-0000_` プレースホルダ）の手本とし、`pm-roles-template.yaml` のメタ項目をこの確立形へ揃えた。Role code 配列と `project_note` の `_TODO_` プレースホルダは成果物固有値を持ち込まない骨組みとして維持した。
- `pm-members-rulebook.md` と `pm-members-sample.yaml` は近接する YAML 台帳として確認したが、`status: draft` のため ready 手本としては扱わず、Role と Member の責務分離を確認する補助に留めた。
- 既存 rulebook の「`document` ブロックを使う」という記述は、実際の `pm-roles.schema.yaml` と対象成果物のフラット構造と矛盾していたため、rulebook 側を `id` / `type` / `status` / `version` / `project_id` / `roles` の構造へ修正した。以後の recipe / sample / template は修正後の rulebook を正として整合させた。
- 丸写しを避けるため、rulebook は構造・必須項目・禁止事項、recipe は作成手順と問い、sample は駄菓子屋きぬや文脈の完成例、template は `_TODO_` プレースホルダ付き骨組みに役割を分けた。
- 外部情報は使用しなかった。指定された成果物、依存文書、同種 ready 文書で判断可能であり、成果物内容の根拠範囲外となる Web 出典は追加していない。
