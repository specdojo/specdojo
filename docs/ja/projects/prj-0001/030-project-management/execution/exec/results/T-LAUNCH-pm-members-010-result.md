---
specdojo:
  id: prj-0001:xer-t-launch-pm-members-010
  type: exec-result
  task_id: T-LAUNCH-pm-members-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-members-010-plan.md
  started_at: "2026-06-28T04:23:50.682Z"
  completed_at: "2026-06-28T04:26:58.581Z"
  agent: codex-expert-edit-agent
  approach: bootstrap
  targets:
    - prj-0001:pm-members
    - pm-members-rulebook
    - pm-members-recipe
    - pm-members-sample
    - pm-members-template
---

# Edit Result

## 1. 実施内容

- 成果物 `pm-members.yaml` と参考資料一式（rulebook / recipe / sample / template）を実際に読み込み、`pm-organization.md`、`pm-roles.yaml`、`pm-roles-sample.yaml`、人と組織の定義標準、各 authoring standard と照合した。
- 成果物本体は、PO が実行主体、担当 Role code、agent 支援範囲、公開可否を承認判断できる粒度で既に成立していたため、内容は維持した。
- `pm-members-rulebook.md`、`pm-members-recipe.md`、`pm-members-sample.yaml` は、構造・必須項目・禁止事項・sample 文脈が相互に整合していたため維持した。
- `pm-members-template.yaml` は、project*id プレースホルダが `\_PRJ-0000*`となっており、同種`pm-roles-template.yaml`と`template-authoring-standard.md`の`_UPPER_SNAKE_` 記法から外れていたため、`_PROJECT_ID_` に修正した。
- 構造・必須項目・禁止事項は `pm-members-rulebook.md` を正とし、成果物・recipe・sample・template が `owner` / `roles` / `--by` の使い分け、agent に最終判断を委ねない方針、公開可能情報のみ記載する方針と矛盾しないことを確認した。
- Markdown result を `npx prettier --write` と `npx markdownlint` で整形・静的検査した。YAML 成果物・sample は、指定の `npm run validate:schema:file` が `tsx` の IPC 制約で `EPERM` となったため、同じ schema と AJV/js-yaml ロジックで検査し valid を確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/pm-members-template.yaml`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-members-010-result.md`

## 3. 申し送り

- `pm-members.yaml` は `status: draft` のまま据え置いた。`ready` への昇格は人間の PO が判断する。
- `pm-members.yaml` の agent は `roles: []` の汎用 agent として定義されている。実行時はタスク `owner` または plan で対象 Role 文脈を補う前提を、成果物本体と rulebook / recipe / template の双方で維持している。
- template（`pm-members-template.yaml`）はプレースホルダを含むため schema 検証対象外。今回修正した `_PROJECT_ID_` は template 標準の `_UPPER_SNAKE_` 記法に合わせた。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-members.schema.yaml --data <対象>` は、`tsx` が `/tmp/tsx-1000/14.pipe` を listen する段階で `EPERM` となった。schema 内容の未解消エラーではなく実行環境制約として扱い、`tools/docs/src/validate-yaml-schema.ts` と同じ AJV/js-yaml の検査処理を Node で実行して `pm-members.yaml` と `pm-members-sample.yaml` がどちらも valid であることを確認した。

## 4. 参考資料の活用

- `pm-organization.md` を確認し、実行主体・兼務割り当ては `pm-members.yaml` を正本とし、最終判断・公開可否・説明責任は人間 PO に残す方針を成果物評価の根拠にした。
- `pm-roles.yaml` と `pm-roles-sample.yaml` を確認し、`members[].roles` に使う Role code 語彙が PO/PM/BA/ARC/DEV/QE/UX/OPS と整合していることを確認した。
- 既存の `pm-members` 一式は、成果物本体・rulebook・recipe・sample が基準として機能する粒度を満たしていたため、作り直さず維持した。template のプレースホルダ記法だけを、同種 ready 文書 `pm-roles-template.yaml` の形に合わせて修正した。
- 同種 ready 文書として `pm-roles-rulebook.md` / `pm-roles-recipe.md` / `pm-roles-sample.yaml` / `pm-roles-template.yaml` を手本に、YAML 成果物のメタ項目、Role と Member の分離、プレースホルダの置き方を確認した。内容は転記せず、`pm-members` の実行主体台帳として一般化された規定・手順・例・雛形を維持した。
- 構造・必須項目・禁止事項は `pm-members-rulebook.md` を正とし、recipe は問いと手順、sample は完成例、template はプレースホルダ付き雛形として役割を分けた。矛盾時に rulebook を優先して修正が必要な箇所は、template の `_PROJECT_ID_` 記法以外にはなかった。
- 外部 Web 出典は使用していない。指定された依存文書、対象成果物、参考資料、同種 ready 文書で判断可能だった。
