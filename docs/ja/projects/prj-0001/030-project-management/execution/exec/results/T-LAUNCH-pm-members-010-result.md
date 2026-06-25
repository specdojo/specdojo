---
id: prj-0001:xer-t-launch-pm-members-010
type: exec-result
task_id: T-LAUNCH-pm-members-010
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-pm-members-010-plan.md
started_at: "2026-06-25T12:25:26.714Z"
completed_at: "2026-06-25T15:06:23.602Z"
agent: codex-expert-edit-agent
---## 1. 実施内容

- `pm-members.yaml` は既存内容を評価し、実行主体と Role code の割り当てを維持したうえで、参照 rulebook として `rulebook: pm-members-rulebook` を明示し、`rules` に `owner` / `roles` / `--by` の使い分け、agent 委任範囲、公開制約を追記した。`indie` が `PO` / `PM` / `BA` / `ARC` / `DEV` / `QE` / `UX` / `OPS` を兼務し、各 edit/review agent は `roles: []` と `mode` / `proficiency` / `priority` / `capabilities` / `command` で実行候補として定義されており、`pm-organization.md` と `pm-roles.yaml` に整合している。
- `pm-members-rulebook.md` を ready 化し、recipe / sample / template 参照を追加した。既存 rulebook が `document` ブロックを推奨していた点は、実スキーマと既存 YAML のフラットな `id` / `type` / `status` 構造に合わせて修正した。サンプル参照は `target_format: yaml` に合わせて `../samples/pm-members-sample.yaml` へのリンクとした。
- `pm-members-recipe.md` を新規作成し、問い、作成手順、深掘り手順、良い例 / 悪い例、レビュー観点を整理した。
- `pm-members-sample.yaml` を rulebook と整合する最小完成例として更新し、人間の最終判断主体、Role 固定 agent、review agent、汎用 agent の粒度を示した。
- `pm-members-template.yaml` を新規作成し、`pm-members.yaml` の骨組みと `_TODO_` / `_PRJ-0000_` / agent command プレースホルダを配置した。
- bootstrap 方針に従い、`npm run -s lint:md`、`pm-members.schema.yaml` による成果物 / sample 検証、Role code 整合チェック、`npm run -s build`、`node dist/specdojo.js catalog validate`、`node dist/specdojo.js exec validate --project prj-0001` を実行した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-members-rulebook.md`
- `docs/ja/specdojo/recipes/pm-members-recipe.md`
- `docs/ja/specdojo/samples/pm-members-sample.yaml`
- `docs/ja/specdojo/templates/pm-members-template.yaml`
- `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-members.yaml`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-members-010-result.md`

## 3. 申し送り

- `pm-members.yaml` 側では、`members[].roles` に [[prj-0001:pm-roles|ロール定義]] の `roles[].code` に存在する Role code だけを使用すること。
- agent の `command` には認証情報、秘密鍵、トークン、個人環境に閉じたパスを含めないこと。
- `exec validate` は exit 0 で成功したが、`pm-roles-template` と `pm-members-template` を `.md` として探索する WARN が出る。YAML 成果物の template は `target_format: yaml` に合わせて `.yaml` が正のため、本タスクでは `pm-members-template.yaml` を維持した。
- `npm run -s validate:schema:file` は `tsx` が `/tmp` の IPC pipe を作成できず `EPERM` で実行不能だったため、同じ Ajv2020 設定を Node 直実行で再現して `pm-members.yaml` と `pm-members-sample.yaml` を検証した。
- `npm run -s lint:fm` は既存の exec plan/result 群の frontmatter 警告 18 件で exit 1 となった。今回追加・更新した rulebook / recipe / result に限定した `remark --quiet --frail` では警告なし。

## 4. 参考資料の活用

- 成果物本体は、対象成果物、依存文書 [[prj-0001:pm-organization|組織定義]]、[[prj-0001:pm-roles|ロール定義]]、`people-and-organization-definition-standard` を直接根拠として評価した。Role code の語彙、member の `roles`、agent の実行情報は整合していたため維持し、rulebook 参照と運用 `rules` を補った。
- 既存 `pm-members-rulebook.md` と `pm-members-sample.yaml` は、構造の骨格を活かして差分更新した。recipe と template は未整備だったため新規作成した。
- 同種で `status: ready` の [[pm-roles-rulebook|ロール定義 作成ルール]]、[[pm-roles-recipe|ロール定義 作成レシピ]]、[[pm-roles-sample|ロール定義 sample]]、[[pm-roles-template|ロール定義 template]] を、章構成、粒度、YAML 表現、プレースホルダの置き方の手本として参照した。内容は転記せず、メンバー定義用に一般化した。
- `pm-members-rulebook.md` の構造・必須項目・禁止事項を正とし、recipe は作成手順と問い、sample は駄菓子屋きぬや文脈の完成例、template は `_TODO_` プレースホルダ付き骨組みに役割を分けた。
- 丸写しを避けるため、rulebook には汎用的な構造と禁止事項、recipe には作成時の判断手順、sample には最小の具体例、template には成果物固有値を持ち込まない雛形だけを置いた。
- 外部情報は使用しなかった。指定された成果物、依存文書、同種 ready 文書、リポジトリ内スキーマで判断可能であり、成果物内容の根拠範囲外となる Web 出典は追加していない。
