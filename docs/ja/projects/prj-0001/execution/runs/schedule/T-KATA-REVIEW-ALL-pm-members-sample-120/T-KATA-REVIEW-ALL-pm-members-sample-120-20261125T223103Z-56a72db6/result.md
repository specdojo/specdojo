---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-members-sample-120-20261125t223103z-56a72db6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-members-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-members-sample-120/T-KATA-REVIEW-ALL-pm-members-sample-120-20261125T223103Z-56a72db6/plan.md
  started_at: "2026-11-25T22:31:14.537Z"
  completed_at: "2026-11-25T22:32:43.592Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-members-sample
    - specdojo:pm-members-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）の段で `docs/ja/specdojo/samples/pm-members-sample.yaml` を rulebook の本文構成と template に照合した。ルートの順（メタ項目、`members`、`rules`）、`members[]` のフィールド順、member の並び（PO、PM/BA/DEV、QE、ARC、UX）、`rules` の範囲はいずれも沿っていた。構成の指摘は 0 件で、sample は変更していない。
- F001（`vp-ux-language-consistency`、line 38、`display_name`「同行レビュー担当」）は kata-guide の観点の組で R3 が扱うものなので、R2 では扱わず R3 に回した。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R3 で F001 を直す場合は、`members[2].display_name` と `rules[1]` の括弧書きを同じ表示名（例: 第三者レビュー担当）にそろえる必要がある。
- R2 構成の指摘は 0 件。sample のルートの順（メタ項目 → `members` → `rules`）とメタ項目の並びは、rulebook「推奨メタ項目」・template の `metadata_template` と一致した。`based_on` は template と同じ 3 件（project 修飾の ID を除く）だった。`members[]` のフィールド順は rulebook「本文要件」の表・template の順（`nickname`・`display_name`・`email`・`roles`・`type`・`persona`・`focus`・`scheduler_strategy`・`note`）と一致した。member の並びは PO → PM/BA/DEV → QE → ARC → UX で、判断の起点から支援の順に読める。`rules` は rulebook「運用ルール」の範囲（公開制約・交代時の扱い）に収まっている。
- F001（`vp-ux-language-consistency`、line 38、`display_name`「同行レビュー担当」）は、kata-guide「kata の観点の組」で R3 の観点に当たるため、R2 では扱っていない。R3 で直す場合は、`members[2].display_name` と `rules[1]` の括弧書き「同行レビュー担当」を同じ表示名（例: 第三者レビュー担当）にそろえる必要がある。
- 適用外の検証: `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-members.schema.yaml --data docs/ja/specdojo/samples/pm-members-sample.yaml`（この段では sample を含む `*.yaml` / `*.yml` を変更していないため、適用条件（YAML の変更）を満たさない）

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、sample のルートの順、`members[]` のフィールド順、member の並び、`rules` の範囲を rulebook の本文構成と template に照合した。ずれはなかったため、既存の記述を維持した。plan に展開された F001 は構成ではなく表示名の言語一貫性の指摘で R3 の観点に当たる。R2 では修正せず、次のアクションとして R3 に回した。YAML を変更していないため、schema 検査（`validate:schema:file`）は適用外とした。
