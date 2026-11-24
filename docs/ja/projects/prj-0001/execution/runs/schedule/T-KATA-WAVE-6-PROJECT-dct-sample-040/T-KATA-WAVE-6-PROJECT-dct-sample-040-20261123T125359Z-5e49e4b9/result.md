---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-dct-sample-040-20261123t125359z-5e49e4b9
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-dct-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-dct-sample-040/T-KATA-WAVE-6-PROJECT-dct-sample-040-20261123T125359Z-5e49e4b9/plan.md
  started_at: "2026-11-23T12:54:08.832Z"
  completed_at: "2026-11-23T13:03:57.356Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:dct-sample
    - specdojo:dct-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook としての `docs/ja/specdojo/rulebooks/dct-rulebook.md` を、grade の指摘に基づき簡潔に整備しました。
- F002 (overview/brief の冗長な記述), F004 (post-edit チェックの一覧欠如), F005 (推奨メタ項目への `supersedes` の欠落), F006 (テンプレート ID 規約の誤り), F010 (non-`work` 項目への `done_criteria` 許容), F011 (生成物の管理), F012 (用語の一貫性) の各 finding に対する修正を行いました。
- F001, F003, F007, F008, F009 に関しては、schema や template 等の他の領域への変更が必要なため、handoff にて継続的なアクションとして記録しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dct-rulebook.md`: grade の指摘事項に基づき、冗長な説明の削除、推奨メタ項目への `supersedes` の追加、テンプレート ID 規約の修正、および `done_criteria` の適用範囲の限定を行いました。

## 3. 申し送り

- F001: `groups`/`deliverables` exclusivity and the ban on `min_size` under `type: project` cannot be detected by `dct.schema.yaml`. The rulebook now points to the review row of the post-edit checks. The root fix is to change the schema (for example, make `groups` and `deliverables` exclusive with `oneOf`, and forbid `min_size` under project). Candidate for a register ticket.
- F003: The decision-plan sections were condensed into one, but moving them out to a separate `dct-plan-rulebook` is not decided. That needs a new rulebook, catalog mapping and changes to `pm-review-viewpoints.yaml` `document_kinds`, so it needs a separate ticket.
- F007/F008: The rulebook rule is correct. Fix `docs/ja/specdojo/templates/dct-project-management-template.yaml` so that `sch-track-launch` and `sch-milestones` have `depends_on: [sch-strategy-launch]` (not changed here because the template cannot be edited in this stage).
- F010 follow-up: The rulebook now forbids `done_criteria` on non-`work` items. Remove `done_criteria` from the `generated` items `sch-milestones` and `sch-track-launch` in `dct-project-management-template.yaml`.
- F009: The rulebook-frontmatter schema allows only one ID for `template`, so the per-domain templates cannot be declared. The body now states that the omission is an exception, not a missing template. Decide whether to change the schema (allow arrays) or add the exception to rulebook-authoring-standard.
- 適用外の検証: `npm run validate:schema:file`（Only the Markdown rulebook was changed; no `*.yaml` or `*.yml` file was changed）
- 適用外の検証: `npm run validate:history-links`（No plan, result or register ticket file was changed）

## 4. 進め方と実践の型の適用

rulebook-maintenance
