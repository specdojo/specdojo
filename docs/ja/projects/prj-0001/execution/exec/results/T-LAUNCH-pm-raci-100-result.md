---
specdojo:
  id: prj-0001:xer-t-launch-pm-raci-100
  type: exec-result
  task_id: T-LAUNCH-pm-raci-100
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-raci-100-plan.md
  started_at: "2026-06-29T16:45:00.480Z"
  completed_at: "2026-06-29T16:48:20.998Z"
  agent: codex-edit-agent
  approach: recipe-maintenance
  targets:
    - prj-0001:pm-raci
    - pm-raci-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/pm-raci-recipe.md` を見直し、RACI の作成時に `Role code` の実体一覧が参照範囲外だった場合の扱いを明文化した。
- `2. 作成前に集める情報` に `Role code 根拠` を追加し、`4. 各章の書き方` では `pm-roles.yaml` などの正本が参照できないときに推測で埋めず、制約を `_ASSUMPTION_` や result に残す観点を追記した。
- `6. 見直し条件` と `7. 禁止事項` に、Role code の正本が別文書へ委譲されている場合の参照範囲確認と、未検証のまま採用済みと断定しない注意を追加した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-raci-recipe.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-raci-100-result.md`

## 3. 申し送り

- `pm-raci` の現行成果物は review で approve だったが、Role code の実体一覧はこの plan の参照範囲外で `unclear` が残っている。後続で `pm-roles.yaml` を参照できるタスクがある場合は、RACI 列の語彙と実体一覧の一致を確認する。
- recipe には、参照範囲が足りないときに推測で埋めないことを明示したため、今後の RACI 改訂でも同じ制約を前提に扱う。

## 4. 参考資料の活用

- `docs/ja/specdojo/guides/specdojo-reference-materials-guide.md` の `recipe-maintenance` と `参考資料メンテナンスの進め方` を基準に、成果物から recipe へ参照の向きを切り替えた。
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-raci-090-result.md` の `RVP-003` で、`pm-roles.yaml` が参照範囲に含まれないため Role code の実体確認ができない点が既知の限界として残っていた。これを recipe 側で一般化し、参照範囲外の正本に依存する場合は `_ASSUMPTION_` / result で制約を記録する方針にした。
- `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-organization.md` は Role code の正本を `pm-roles.yaml` に委譲しているため、recipe ではその委譲先が参照できないときの扱いを明示した。
- `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md` で禁止事項と見直し条件の構造を確認し、recipe には構造の重複を避けつつ、判断に必要な問いだけを追加した。
- `docs/ja/specdojo/samples/pm-raci-sample.md` と `docs/ja/specdojo/templates/pm-raci-template.md` は、章立てや粒度が recipe と整合していることを確認するために参照した。今回の修正では sample/template の構造は変えず、問いと深掘り手順の補強に留めた。
