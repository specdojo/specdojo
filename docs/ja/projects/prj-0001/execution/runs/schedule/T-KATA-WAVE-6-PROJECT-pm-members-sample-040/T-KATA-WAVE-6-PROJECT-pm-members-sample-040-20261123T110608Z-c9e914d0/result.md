---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-members-sample-040-20261123t110608z-c9e914d0
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-members-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-members-sample-040/T-KATA-WAVE-6-PROJECT-pm-members-sample-040-20261123T110608Z-c9e914d0/plan.md
  started_at: "2026-11-23T11:06:22.721Z"
  completed_at: "2026-11-23T11:25:01.262Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-members-sample
    - specdojo:pm-members-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook `docs/ja/specdojo/rulebooks/pm-members-rulebook.md` を更新し、grade の指摘事項（F001〜F003）を解消した。
- F001 に対し、合成名簿における `nickname` の一意性と、schema 適合を判定するための検証手順（期待される結果）を追記した。
- F002 に対し、人間 member における `roles: []` の適否（禁止事項）を明記し、汎用 agent 用の表記との区別を明確にした。
- F003 に対し、成果物 title の標準表記として `メンバー定義: &lt;プロジェクト名&gt;` を追加した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-members-rulebook.md`: grade の指摘に基づき、`nickname` の一意性に関する検証手順の追加、人間 member に対する `roles: []` の禁止事項の追加、および成果物 title の標準表記 `メンバー定義: &lt;プロジェクト名&gt;` の追記を行った。

## 3. 申し送り

- F003: template (`docs/ja/specdojo/templates/pm-members-template.yaml`) の生成物 title「メンバー名簿」は rulebook の標準表記 `メンバー定義: &lt;プロジェクト名&gt;` と揃っていない。template を扱う段で揃える。sample はすでに標準表記に合っている。
- 直さなかった箇所: 全体方針・位置づけ・ファイル命名・ID規則・6.1・6.3、および既存の禁止事項 3 行。grade の指摘がなく、冗長な記述やほかの型との重なりもないため維持した。
- 根拠として読んだもの: `docs/specdojo/schemas/v1/pm-members.schema.yaml` (`roles` に `minItems` がない)、`people-and-organization-definition-standard` (`roles: []` は汎用 agent 用)、`src/shared/specdojo-config.ts` の `loadMemberRoster` (合成時の Duplicate `member` `nickname` 検査)、`rulebook-authoring-standard`。
- F003: template（docs/ja/specdojo/templates/pm-members-template.yaml）の生成物 title「メンバー名簿」は rulebook の標準表記 `メンバー定義: &lt;プロジェクト名&gt;` と揃っていない。template を扱う段で揃える。sample はすでに標準表記に合っている。
- 根拠として読んだもの: docs/specdojo/schemas/v1/pm-members.schema.yaml（roles に minItems がない）、people-and-organization-definition-standard（`roles: []` は汎用 agent 用）、src/shared/specdojo-config.ts の loadMemberRoster（合成時の Duplicate member nickname 検査）、rulebook-authoring-standard。
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown の rulebook だけで、`*.yaml` / `*.yml` の変更がない）
- 適用外の検証: `npm run validate:history-links`（plan / result / 個票を変更していない）

## 4. 進め方と実践の型の適用

grading に基づく rulebook の簡潔化と整合性確保。F001〜F003 の各 finding を解消するために、検証手段の明示、`roles: []` の扱い、およびタイトル標準表記の定義を追加した。既存の記述は、ルールとの重複を避けるため維持している。
