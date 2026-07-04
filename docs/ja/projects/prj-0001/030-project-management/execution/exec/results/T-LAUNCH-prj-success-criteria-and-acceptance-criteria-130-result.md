---
specdojo:
  id: prj-0001:xer-t-launch-prj-success-criteria-and-acceptance-criteria-130
  type: exec-result
  task_id: T-LAUNCH-prj-success-criteria-and-acceptance-criteria-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-130-plan.md
  started_at: "2026-06-30T15:46:40.521Z"
  completed_at: "2026-07-01T15:51:14.381Z"
  agent: opencode-edit-agent
  approach: template-maintenance
---

# Edit Result

## 1. 実施内容

- `approach: template-maintenance` として、`docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md` を完成版成果物、review result（090）、および前回の maintenance 結果（100、110、120）と照合した。
- 章構成、Frontmatter、成功基準と受入条件の表構成は rulebook / sample / 完成版成果物のいずれとも整合していたため維持し、未解決事項の記述だけを rulebook / recipe に合わせて明示化した。
- 具体的には、「5. 例外条件と未解決事項」で `_UNDECIDED_:` の使い方が分かるようにし、未確定事項を `_TODO_` のまま曖昧に残さないテンプレートへ調整した。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-130-result.md`

## 3. 申し送り

- この template は、判定対象・成功基準・受入条件の章構成については現行 rulebook と整合している。今後 rulebook 側で列構成や章の追加・削除が入った場合のみ再点検すればよい。
- 未解決事項のラベルは `_UNDECIDED_:` を優先する運用へ寄せたため、後続の成果物編集では template に合わせて `_TODO_` をそのまま残さない。

## 4. 参考資料の活用

- `template-maintenance` のため、参照の向きを「成果物 → template」に切り替えた。見直し対象は `docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md` とし、根拠として完成版成果物 `[[prj-0001:prj-success-criteria-and-acceptance-criteria|成功基準と受入条件]]`、review result `[[prj-0001:xrr-t-launch-prj-success-criteria-and-acceptance-criteria-090|T-LAUNCH-prj-success-criteria-and-acceptance-criteria-090]]`、および前回の maintenance 結果 `[[prj-0001:xer-t-launch-prj-success-criteria-and-acceptance-criteria-100|T-LAUNCH-prj-success-criteria-and-acceptance-criteria-100]]`、`[[prj-0001:xer-t-launch-prj-success-criteria-and-acceptance-criteria-110|T-LAUNCH-prj-success-criteria-and-acceptance-criteria-110]]`、`[[prj-0001:xer-t-launch-prj-success-criteria-and-acceptance-criteria-120|T-LAUNCH-prj-success-criteria-and-acceptance-criteria-120]]` を読み込んだ。
- rulebook `[[prj-success-criteria-and-acceptance-criteria-rulebook]]` を構造・必須項目・禁止事項の正本として確認し、recipe `[[prj-success-criteria-and-acceptance-criteria-recipe]]` を記述の進め方と未確定事項ラベルの運用基準として確認した。sample `[[prj-success-criteria-and-acceptance-criteria-sample]]` は完成例として粒度と表構成を確認するために使った。
- 参照した範囲では、章構成や各表の列構成に矛盾はなく、template を全面改稿する必要はなかった。唯一、未解決事項の扱いが `_TODO_` だと recipe / rulebook で示している運用が伝わりにくいため、その箇所のみ `_UNDECIDED_:` に寄せた。
