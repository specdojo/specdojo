---
id: prj-0001:xer-t-launch-pm-raci-130
type: exec-result
task_id: T-LAUNCH-pm-raci-130
mode: edit
status: complete
project_id: prj-0001
plan_ref: docs/ja/projects/prj-0001/030-project-management/execution/exec/plans/T-LAUNCH-pm-raci-130-plan.md
started_at: "2026-07-01T00:00:00.000Z"
completed_at: "2026-07-01T15:47:50.871Z"
agent: opencode-edit-agent
approach: template-maintenance
---

# Edit Result

## 1. 実施内容

`docs/ja/specdojo/templates/pm-raci-template.md` を、レビュー済みの成果物およびルールブックに基づき最終調整した。

- **構成の最適化**: `pm-raci-rulebook` の標準構成（目的、適用方針、定義、成果物別、プロセス別、見直し条件、禁止事項）に従い、骨組みを維持しつつ内容を具体化した。
- **定型表現の導入**: 成果物 `prj-0001:pm-raci` で採用され、汎用性が高いと判断した以下の記述を雛形として取り込んだ。
  - 「目的」セクションにおける PM の利用用途（計画化、進捗確認、課題・リスク管理への接続）。
  - 「適用方針」における Role code の正本参照、`A` の集約方針、Agent/兼務の扱い。
  - 「RACI の定義」表。
  - 「禁止事項」における具体的な禁止ケース（Agent への `A` 割り当て禁止、Schedule owner との矛盾禁止など）。
- **ガイド文の追加**: 成果物別・プロセス別 RACI セクションに、作成者が迷わないよう「管理単位に合わせる」「最終責任者が異なるものは行を分ける」といった記述方針をガイドとして追記した。
- **プレースホルダの整備**: プロジェクト固有の内容（具体的な Role code や成果物リスト）は `_ROLE_1_` や `_TODO_: <deliverable-id>` として残し、再利用可能なテンプレート形式を維持した。
- **静的検査**: `npx prettier --write` および `npx markdownlint` を実行し、整形と静的検査に合格したことを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/pm-raci-template.md`

## 3. 参考資料の活用

- **根拠成果物**: `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-raci.md`
  - 実運用で妥当と判断された「目的」や「適用方針」、「見直し条件」の文言をベースに雛形化した。
- **根拠ルールブック**: `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md`
  - 章構成、必須項目、禁止事項の正本として参照し、テンプレートの構造を整合させた。
- **参照ガイド**: `docs/ja/specdojo/standards/template-authoring-standard.md`
  - プレースホルダの命名規約（`_TODO_` 等）および構造化の方針に従い記述した。
