---
specdojo:
  id: prj-0001:xer-t-launch-pm-raci-070-i01
  type: exec-result
  task_id: T-LAUNCH-pm-raci-070-I01
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-raci-070-I01-plan.md
  started_at: "2026-06-28T12:42:40.313Z"
  completed_at: "2026-06-28T12:44:44.940Z"
  agent: codex-expert-edit-agent
  approach: fully-guided
  targets:
    - prj-0001:pm-raci
---

# Edit Result

## 1. 実施内容

- `pm-raci.md` の既存構成と RACI 表を維持し、PM が計画化・進捗確認・課題リスク管理へ使うための責務境界が読み取れるかを確認した。
- `C` と `I` の業務上の使い分けを目的に追記し、確認者・合意対象と共有対象の区別を明確化した。
- RACI 列に置く Role code を適用方針へ明示し、参照範囲の制約により `pm-roles.yaml` との突合が未実施であることを `_ASSUMPTION_` として残した。
- 成果物別 RACI とプロセス別 RACI は、各行の `A` が 1 つである既存状態を保ち、全面的な書き換えは行わなかった。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-raci.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-raci-070-I01-result.md`

## 3. 申し送り

- `pm-organization.md` は採用 Role code の実体を `pm-roles.yaml` に委譲しているが、本 plan の参照範囲外のため `pm-roles.yaml` は読んでいない。後続 review では、RACI 列の `PO`、`PM`、`BA`、`ARC`、`DEV`、`QE`、`UX`、`OPS` が `pm-roles.yaml` の `roles[].code` と一致するかを確認する。
- `pm-raci.md` の frontmatter `status` は既存の `ready` のまま変更していない。人間以外による `ready` 昇格は禁止されているため、今回の編集では status 操作を行っていない。

## 4. 参考資料の活用

- 参照した rulebook: `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md`。本文構成、RACI 列の Role code 制約、1 行 1 `A`、Agent に `A` を割り当てないこと、成果物別・プロセス別 RACI の必須性、見直し条件と禁止事項を構造基準として使用した。
- 参照した recipe: `docs/ja/specdojo/recipes/pm-raci-recipe.md`。PM が計画化、進捗確認、課題・リスク、変更要求、決定記録へ接続できる責任分担になっているか、`C` と `I` の読み分けができるかを確認する観点として使用した。
- 参照した depends_on 成果物: `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-organization.md`。RACI の Role code 語彙は組織定義を正とし、実行主体や兼務割り当てを RACI 本文へ複製しない方針の根拠として使用した。
- 磨き込みでは sample / template を読まないという plan 指示に従い、`pm-raci-sample` と `pm-raci-template` は参照していない。
- `pm-roles.yaml`、`pm-members.yaml`、`prj-overview` は本文や依存文書から言及されているが、plan に列挙されていないため参照していない。Role code の実体確認は未実施とし、既存 RACI 列を採用済み Role code として扱う前提を本文と申し送りに残した。
- rulebook / recipe / depends_on の間に、今回の編集判断へ影響する明確な矛盾は確認していない。既存記述は rulebook の章構成と禁止事項をおおむね満たしていたため、表の再設計や全面的な書き換えは行わず、判断根拠が薄い箇所の前提明示にとどめた。
