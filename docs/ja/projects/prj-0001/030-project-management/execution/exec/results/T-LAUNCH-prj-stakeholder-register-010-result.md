---
id: prj-0001:xer-t-launch-prj-stakeholder-register-010
type: exec-result
task_id: T-LAUNCH-prj-stakeholder-register-010
mode: edit
status: complete
project_id: prj-0001
plan_ref: exec/plans/T-LAUNCH-prj-stakeholder-register-010-plan.md
started_at: "2026-06-24T14:37:00Z"
completed_at: "2026-06-24T14:55:03.030Z"
agent: codex
approach: bootstrap
---
## 1. 実施内容

- `prj-stakeholder-register` を [[prj-0001:prj-overview|プロジェクト概要]] の目的、利用者、期待効果、前提条件と照合し、関係者、期待・懸念・必要な合意、影響度/関心度、関与方針、コミュニケーション要件、見直し条件を BA 視点で再構成した。
- `prj-stakeholder-register-rulebook` を正として、対象成果物と sample を必須の 5 章構成へ揃えた。rulebook には recipe、sample、template を明示的に宣言した。
- 未整備だった recipe と template を新規作成し、sample は駄菓子屋の販売管理システムという共通文脈で、rulebook の必須表を埋めた最小完成例へ更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/020-project-definition/prj-stakeholder-register.md`
- `docs/ja/specdojo/rulebooks/prj-stakeholder-register-rulebook.md`
- `docs/ja/specdojo/recipes/prj-stakeholder-register-recipe.md`
- `docs/ja/specdojo/samples/prj-stakeholder-register-sample.md`
- `docs/ja/specdojo/templates/prj-stakeholder-register-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-stakeholder-register-010-result.md`

## 3. 申し送り

- 初期公開の具体日とステークホルダー登録簿の定期見直し周期は、根拠文書に決定がないため `_TODO_` として残した。初期公開計画が確定した時点で、期限・周期を更新する。
- `npm run -s lint:md`、`npm run -s lint:fm`、`npm run -s validate:catalog` は完了した。rulebook、recipe、sample、成果物の Frontmatter は対応スキーマで検証済みである。`lint:fm` の 7 件の警告は既存の exec plan/result のスキーマ不整合である。
- `npm run -s docs:build` は、本変更と無関係な既存 Mermaid 図の SVG 生成時に Puppeteer が sandbox 内で browser process を起動できず失敗した（`setsockopt: Operation not permitted`）。

## 4. 参考資料の活用

- bootstrap として、成果物本文の内容根拠は [[prj-0001:prj-overview|プロジェクト概要]] に限定した。既存の別標準への依存記述は外し、人間の判断責任、AI Agent の支援範囲、将来利用者・貢献者、公共性・継続性を同文書から具体化した。
- 既存の成果物、rulebook、sample は評価の結果、rulebook が recipe/template を未宣言で、成果物・sample の章構成も規定と不一致だったため修正した。recipe と template は未作成だったため新規作成した。
- 同種の `status: ready` 文書である `prj-scope` と `prj-overview` の rulebook、recipe、sample、template を、章番号、表の粒度、プレースホルダ、Frontmatter の形式だけの手本として参照した。固有内容は転記していない。
- 構造、必須項目、禁止事項は [[prj-stakeholder-register-rulebook]] を正とした。recipe は問い・深掘り・レビュー、sample は完成最小例、template はプロジェクト固有値を含まない骨組みとして役割を分離した。Web 出典は使用していない。
