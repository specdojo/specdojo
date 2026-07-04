---
specdojo:
  id: prj-0001:xer-t-launch-pm-plan-130
  type: exec-result
  task_id: T-LAUNCH-pm-plan-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-plan-130-plan.md
  started_at: "2026-06-29T19:11:28.875Z"
  completed_at: "2026-06-30T15:14:57.296Z"
  agent: claude-edit-agent
  approach: template-maintenance
---

# Edit Result

## 1. 実施内容

- 見直し対象の [[pm-plan-template|プロジェクト管理計画 テンプレート]] を読み込み、章構成（1〜7）が [[pm-plan-rulebook|プロジェクト管理計画 作成ルール]] §5 本文構成・各章の推奨サブセクションと一致していることを確認した。章構成自体に欠落はなく、変更していない。
- 完成版成果物 [[prj-0001:pm-plan|プロジェクト管理計画]]、その編集履歴（`T-LAUNCH-pm-plan-070-I01`〜`080-I02`）、review result（`T-LAUNCH-pm-plan-090`）、直前の rulebook-maintenance（`T-LAUNCH-pm-plan-110`）・sample-maintenance（`T-LAUNCH-pm-plan-120`）の result、依存成果物 [[prj-0001:pm-organization|組織定義]]、`pm-roles-sample.yaml`、SpecDojo 標準 `people-and-organization-definition-standard.md` を突き合わせ、プレースホルダの配置・網羅性に次の3点の不足を確認し、template を最小修正した。
  1. **§1 概要のプレースホルダ不足**: rulebook §6.1 は「実行主体の割り当ては `pm-members.yaml` へ委譲する」「AI Agent の支援範囲と、人間が担う最終判断・説明責任を明記する」ことを明示しているが、旧 template の TODO はこの2点を含んでいなかった。編集履歴 `T-LAUNCH-pm-plan-080-I01-result.md` では、初期編集（`070-I01`/`070-I02`）でこの「説明責任」観点が一度見落とされ、後の編集で `pm-organization.md` を根拠に補われた経緯が記録されている。同じ見落としを次回以降の作成で再発させないため、§1 の TODO に「実行主体の割り当て先（`pm-members.yaml` 等への委譲）」と「人間が担う最終判断・説明責任」を明記する記述へ更新した。
  2. **§4.3 RACI のプレースホルダ不整合**: 旧 template は `_ROLE_1_` / `_ROLE_2_` / `_ROLE_3_` という汎用 3 列の placeholder だったが、`people-and-organization-definition-standard.md` §3「標準ロール」が定義する `PO`/`PM`/`BA`/`ARC`/`DEV`/`QE`/`UX`/`OPS` の8ロールは、同じ template の §4.1 採用ロール表で既に固定値として使われている SpecDojo 共通語彙であり、`pm-plan-sample.md` と完成版 [[prj-0001:pm-plan|プロジェクト管理計画]] のいずれも RACI 表でこの8ロールをそのまま列として使っている。`_ROLE_1_`〜`_ROLE_3_` という可変色の placeholder は §4.1 と矛盾し、雛形としての一貫性を欠いていたため、列を §4.1 と同じ8ロールの固定値に揃えた（行の値は `_TODO_` のまま、成果物固有の責任分担は埋めない）。
  3. **§6 関連ドキュメントの構造不足**: rulebook §6.6 は「正本、委譲先、管理台帳を分けて記載する」ことを明示している。旧 template は単一のフラットな表（`ドキュメント` / `役割` の2列、行数3）のみで、3区分への分離を促す構造になっていなかった。完成版 [[prj-0001:pm-plan|プロジェクト管理計画]] §6 は「正本（採用 Role code、`owner`、責任分担の語彙が一致すること）」「委譲先（本計画は上位方針のみを定義し、詳細は各計画へ委ねる）」「管理台帳（本文に混在させず、識別した事項を転記する記録先）」の3グループに分けたうえで、各グループの説明文を固定文言として使っている。この固定文言は `pm-plan` という成果物種別に共通する定型的な区分説明であり、成果物固有の内容ではないと判断し、テンプレート本文に取り込んだ上で、各グループ配下に `_DOC_ID_` / `_TODO_` のプレースホルダを配置する構成へ変更した。
- 上記以外の章・表・箇条書きの記述（2 管理方針、3 品質・リスク・課題管理方針、5 レポーティングと見直し、7 継続確認事項）は、rulebook の記述ガイド・推奨フォーマット、完成版成果物、review result（090: 全 RVP pass / approve、構造面の指摘なし）と整合しており、陳腐化や欠落は見つからなかったため維持した。
- 成果物固有の業務文脈（駄菓子屋プロジェクトの文脈や `prj-0001` 固有の判断者名など）は template に持ち込んでいない。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/pm-plan-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-plan-130-result.md`

## 3. 申し送り

- なし。

## 4. 参考資料の活用

- `template-maintenance` の進め方に従い、参照の向きを「成果物 → template」に切り替え、見直し対象である [[pm-plan-template|プロジェクト管理計画 テンプレート]] を編集対象として扱った。
- 根拠とした成果物・review result:
  - [[prj-0001:pm-plan|プロジェクト管理計画]]（完成版本文、`status: draft`）。章構成・記述粒度・各章の実際の組み立て方（特に §1 概要、§4.3 RACI、§6 関連ドキュメント）を template の現状と突き合わせた。
  - `T-LAUNCH-pm-plan-070-I01-result.md` 〜 `080-I02-result.md`（編集履歴）。AI Agent の説明責任の記述が初期編集で一度見落とされ、後の編集で補われた経緯を確認し、§1 の TODO 不足の根拠とした。
  - `T-LAUNCH-pm-plan-090-result.md`（review result）。全 RVP が pass / approve であり、template 由来の構造不足を示す finding はなかったことを確認した。template の §1〜§7 章構成は完成版成果物と整合していることも合わせて確認した。
  - `T-LAUNCH-pm-plan-110-result.md`（rulebook-maintenance result）。rulebook §6.1 に「人間が担う最終判断・説明責任」が明記された経緯と根拠（`pm-organization.md` の禁止事項、`people-and-organization-definition-standard.md` §8/§12）を確認し、template 側がこの観点に追随していないことを特定する根拠とした。
  - `T-LAUNCH-pm-plan-120-result.md`（sample-maintenance result）。sample 側は本タスクの3点の構造的な不足（特に §6 の3区分分離）を扱っていないことを確認し、template-maintenance の対象として残っていることを確認した。
- [[pm-plan-rulebook|プロジェクト管理計画 作成ルール]] を正本とし、§5 本文構成、§6.1〜§6.6 記述ガイド、§7 禁止事項と template の章構成・プレースホルダを照合した。§6.6「正本、委譲先、管理台帳を分けて記載する」という明示要求に対し、旧 template の単一フラット表が対応していなかったため、rulebook を正として template を修正した。
- 依存成果物として [[prj-0001:pm-organization|組織定義]] と `pm-roles-sample.yaml` を確認し、§1 の「Role code の正本」「実行主体の割り当て先」という記述が組織定義の方針（採用 Role code の正本は `pm-roles.yaml`、実行主体の割り当ては `pm-members.yaml`）と矛盾しないことを確認した。
- `people-and-organization-definition-standard.md`（rulebook の `based_on`）§3「標準ロール」を確認し、`PO`/`PM`/`BA`/`ARC`/`DEV`/`QE`/`UX`/`OPS` の8ロールが `pm-plan` 固有ではなく SpecDojo 共通の標準語彙であることを確認した。これにより、§4.3 RACI 表の列を §4.1 と同じ8ロールへ揃える変更が、成果物固有の事情の持ち込みではなく雛形としての一貫性確保であると判断した。
- 章構成・プレースホルダ規約は `docs/ja/specdojo/standards/template-authoring-standard.md` に従った（章番号の連番・末尾`.`の維持、`_UPPER_SNAKE_`/`_TODO_`記法の踏襲、固定値の直書き、recipe へ問い・観点を委譲する方針の維持）。recipe（`pm-plan-recipe.md`）・sample（`pm-plan-sample.md`）の記述と矛盾しないことを確認した（recipe 4.1 は AI Agent の説明責任を既に明記しており、今回の template 修正と整合する）。複数文書間に矛盾は見つからず、rulebook を正とする判断が必要な場面はなかった。
- 整形・静的検査: `npx prettier --write docs/ja/specdojo/templates/pm-plan-template.md` と `npx markdownlint docs/ja/specdojo/templates/pm-plan-template.md` を実行し、エラーがないことを確認した。
