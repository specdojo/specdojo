---
specdojo:
  id: prj-0001:xer-t-launch-prj-success-criteria-and-acceptance-criteria-120
  type: exec-result
  task_id: T-LAUNCH-prj-success-criteria-and-acceptance-criteria-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-120-plan.md
  started_at: "2026-06-30T15:10:48.253Z"
  completed_at: "2026-06-30T15:14:12.373Z"
  agent: codex-edit-agent
  approach: sample-maintenance
  targets:
    - prj-0001:prj-success-criteria-and-acceptance-criteria
    - prj-success-criteria-and-acceptance-criteria-sample
---

# Edit Result

## 1. 実施内容

- `sample-maintenance` として、`docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md` を rulebook、recipe、template、review result（090）、前回の maintenance 結果（100、110）と照合した。
- rulebook の本文構成に合わせて、sample の `1. 目的と適用範囲` を `1. 判定対象と適用範囲` に、`5. 未解決事項` を `5. 例外条件と未解決事項` に統一した。
- 章冒頭の説明文は、初期受入の判定対象を示す表現へ微調整し、成功基準・受入条件・例外条件の内容自体は維持した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-120-result.md`

## 3. 申し送り

- sample は rulebook の章構成に揃えたため、後続で rulebook 側の構成が更新された場合は、同じ見出しの一致を再確認する。
- `docs/ja/projects/prj-0001/020-project-definition/prj-success-criteria-and-acceptance-criteria.md` は今回変更していない。

## 4. 参考資料の活用

- `sample-maintenance` に従い、参照の向きを「成果物 → sample」に切り替えて確認した。
- 正本は `docs/ja/specdojo/rulebooks/prj-success-criteria-and-acceptance-criteria-rulebook.md` とし、章構成・必須項目・禁止事項のうち、sample でずれていた見出し表記を rulebook 側に合わせた。
- `docs/ja/specdojo/recipes/prj-success-criteria-and-acceptance-criteria-recipe.md` は、判定可能な文体と未確定事項の扱いを確認する補助に使った。
- `docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md` は、章構成が rulebook と整合しているかを確認する基準に使った。
- `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-090-result.md` と `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-110-result.md` は、既存 sample の妥当性と、見出し表記の修正が必要であることの根拠として参照した。
