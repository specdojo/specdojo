---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-members-sample-060-20261123t121342z-62b521d7
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-members-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-members-sample-060/T-KATA-WAVE-6-PROJECT-pm-members-sample-060-20261123T121342Z-62b521d7/plan.md
  started_at: "2026-11-23T12:13:55.490Z"
  completed_at: "2026-11-24T01:39:03.931Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - prj-0001:pm-members-sample
    - specdojo:pm-members-template
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/templates/pm-members-template.yaml` を rulebook と sample に合わせて、骨組みだけを残す形に整理した。
- rulebook と sample はこの段では変更していない。
- executor が実行した prettier の検査は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。
- 変更種別に該当しない検査（`lint:ts`、`lint:md`、`lint:fm`、`test:integration`、`typecheck`、`test:unit`）は `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/pm-members-template.yaml`: `title` を rulebook の形式に直した。`members` の固定値はプレースホルダに替えた。`rules` にあった共通標準や schema の書き写しは削り、project 固有のルールを書く `_TODO_` 1 件にした。

## 3. 申し送り

- template 自体への schema 検査（`validate:schema:file`）は、executor が `not_applicable` とした。template は `specdojo-schema: validate=false reason=template` の印で検査対象外であり、値がプレースホルダのため成果物用 schema に適合しない。この結果は編集前の template でも同じと evidence にある。
- 対象 `prj-0001:pm-members-sample` は未変更: 根拠として読む成果物で、plan の「このフェーズで行うこと」が、この段では sample を変更しないと定めているため
- 適用外の検証: `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-members.schema.yaml --data docs/ja/specdojo/templates/pm-members-template.yaml`（対象は template で、`specdojo-schema: validate=false reason=template` の印により schema 検査の対象外。生成物のメタ情報は `metadata_template` に入り、値はプレースホルダのため、成果物用 schema には適合しない）

## 4. 進め方と実践の型の適用

参照の向きを成果物から template に切り替え、`pm-members-template.yaml` を見直し対象にした。plan に展開された grade と condense の finding はなかった。sample は根拠として読み、変更していない（`target_coverage` は unchanged）。根拠と整合しない記述は直し、整合する記述は維持した。矛盾があれば rulebook を正とした。ただし、evidence には個々の矛盾箇所の記録がない。
