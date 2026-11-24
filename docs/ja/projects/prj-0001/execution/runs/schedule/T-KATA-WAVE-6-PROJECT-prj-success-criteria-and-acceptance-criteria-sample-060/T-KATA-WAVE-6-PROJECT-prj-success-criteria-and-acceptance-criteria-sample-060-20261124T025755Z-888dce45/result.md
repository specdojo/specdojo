---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-prj-success-criteria-and-acceptance-criteria-sample-060-20261124t025755z-888dce45
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-060/T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-060-20261124T025755Z-888dce45/plan.md
  started_at: "2026-11-24T02:58:02.632Z"
  completed_at: "2026-11-24T03:00:36.323Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
    - specdojo:prj-success-criteria-and-acceptance-criteria-template
---

# Edit Result

## 1. 実施内容

- template を rulebook に同期するための更新を行いました。
- rulebook からの過剰な説明を削り、骨組みとしての責務（章構成とプレースホルダ）に絞ることで、成果物として再利用しやすい形に整理しました。
- 判定手順と証跡のセクションに、証跡の保存先・公開範囲、および再判定時期に関する `_TODO_` を追加しました。
- 例外条件と未解決事項のセクションについて、rulebook の推奨される表形式（論点・判定への影響・当面の扱い）に合わせて改訂しました。
- PJR-76N9 の方針に従い、文書の役割の割り当てや承認の進み具合に関する列を削除しました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md`: template の骨組みを rulebook に同期させました。具体的な説明を削り、判定手順や証跡に関する `_TODO_` の追加、および例外条件の表形式の修正を行いました。

## 3. 申し送り

- sample の「例外条件と未解決事項」の表は 論点・扱い・解決期限 / 判断タイミング・責任者 の列のままで、rulebook の推奨表とそれに合わせた template（論点・判定への影響・当面の扱い）と食い違っている。後続タスクで sample を rulebook に合わせる必要がある。
- grade・condense の finding は plan になく、finding による修正はない。

## 4. 進め方と実践の型の適用

rulebook の規定に基づき、template の章構成を整理し、説明的な記述をプレースホルダに置き換えることで、テンプレートとしての純度を高めるメンテナンスを行いました。
