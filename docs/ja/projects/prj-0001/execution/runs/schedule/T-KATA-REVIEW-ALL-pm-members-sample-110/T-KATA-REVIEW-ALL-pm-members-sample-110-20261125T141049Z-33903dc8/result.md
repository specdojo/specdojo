---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-members-sample-110-20261125t141049z-33903dc8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-members-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-members-sample-110/T-KATA-REVIEW-ALL-pm-members-sample-110-20261125T141049Z-33903dc8/plan.md
  started_at: "2026-11-25T14:10:57.873Z"
  completed_at: "2026-11-25T14:20:03.413Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-members-sample
    - specdojo:pm-members-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。sample `docs/ja/specdojo/samples/pm-members-sample.yaml` は rulebook の必須項目・任意項目・`rules` の例を過不足なく備えており、禁止事項にも該当しないため、足す・削る差分は入れていない。
- plan に展開された grade の F001（`vp-ux-language-consistency`）は R1 の観点に当たらず R3 が扱う。R1 では直さず R3 に渡す。
- `npm run validate:schema:file` による schema 検査は valid だった。runner の検証では `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`validate:schema` が passed で、変更種別により適用外の検査は `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | `docs/ja/specdojo/samples/pm-members-sample.yaml` 全体 | rulebook の必須メタ項目（`id`・`type`・`status`・`title`・`rulebook`・`version`・`project_id`）と `members[]` の必須フィールドが揃っている。任意フィールド（`email: null`・`persona`・`focus`・`scheduler_strategy`・`note`）と `rules` の例も入っている。禁止事項（`type: agent`、`provider`・`command`・`mode`・`stage_role`、`roles: []`）と人物名の使用はなく、足す・削る内容はない。 | 変更なし（現状を維持する） | `specdojo:pm-members-rulebook` の推奨メタ項目・本文要件・禁止事項、`specdojo:sample-authoring-standard` の共通登場人物と記述ガイド、`dct-kata.yaml` の `pm-members-sample` の `done_criteria`、`pm-roles-sample` の Role code、schema 検査の結果 valid | - |
| 2 | R1 | `members[2].display_name`（`同行レビュー担当`）と、`rules` の 2 件目の表記 | grade の finding F001 の観点は `vp-ux-language-consistency` で、kata-guide では R3 が扱う。このため R1 では直さず R3 に渡す。この表示名は Sample 記述標準の共通登場人物の表の「sample 内の役割」と同じなので、変える場合はその表と `rules` 内の表記も一緒にそろえる必要がある。 | R3 で表示名を見直し、変える場合は `sample-authoring-standard` の共通登場人物の表も同時に直す案を出す。 | `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」、`specdojo:sample-authoring-standard` の共通登場人物 | 要判断 |

## 2. 変更ファイル

- なし

## 3. 申し送り

- F001 の `display_name`「同行レビュー担当」は R3 で見直す。変える場合は `sample-authoring-standard` の共通登場人物の表と、`rules` 内の表記も一緒にそろえる必要がある。
- No: 1 / 段: R1 / 箇所: `docs/ja/specdojo/samples/pm-members-sample.yaml` 全体 / 指摘: rulebook の必須メタ項目（`id`・`type`・`status`・`title`・`rulebook`・`version`・`project_id`）と `members[]` の必須フィールドが揃っている。任意フィールド（`email: null`・`persona`・`focus`・`scheduler_strategy`・`note`）と `rules` の例も入っている。rulebook の禁止事項（`type: agent`、`provider`・`command`・`mode`・`stage_role`、`roles: []`）と人物名の使用はなく、足す・削る内容はない / 直した案: 変更なし（現状を維持する） / 根拠: `specdojo:pm-members-rulebook` の推奨メタ項目・本文要件・禁止事項、`specdojo:sample-authoring-standard` の共通登場人物と記述ガイド、`dct-kata.yaml` の `pm-members-sample` の `done_criteria`、`pm-roles-sample` の Role code、schema 検査の結果 valid / 印: なし
- No: 2 / 段: R1 / 箇所: `members[2].display_name`（`同行レビュー担当`）と、`rules` の 2 件目の表記 / 指摘: grade の finding F001 の観点は `vp-ux-language-consistency` で、kata-guide では R3 が扱う。このため R1 では直さず R3 に渡す。この表示名は Sample 記述標準の共通登場人物の表の「sample 内の役割」と同じなので、変える場合はその表と `rules` 内の表記も一緒にそろえる必要がある / 直した案: R3 で表示名を見直し、変える場合は `sample-authoring-standard` の共通登場人物の表も同時に直す案を出す / 根拠: `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」、`specdojo:sample-authoring-standard` の共通登場人物 / 印: 要判断

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿って、対象 sample を `specdojo:pm-members-rulebook` の推奨メタ項目・本文要件・禁止事項、`specdojo:sample-authoring-standard`、`dct-kata.yaml` の `pm-members-sample` の `done_criteria`、`pm-roles-sample` の Role code と照合した。必須項目と `members[]` の必須フィールドは揃っており、任意フィールドと `rules` の例も入っている。禁止事項（`type: agent`、`provider`・`command`・`mode`・`stage_role`、`roles: []`）と人物名の使用はないため、現状を維持した。grade の F001 は `vp-ux-language-consistency` の観点で、`docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」では R3 の担当にあたる。そのため R1 では未対応とし、理由と次のアクションを handoff に残した。
