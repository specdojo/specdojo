---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-prj-stakeholder-register-sample-060-20261123t205545z-087d2655
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-060/T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-060-20261123T205545Z-087d2655/plan.md
  started_at: "2026-11-23T20:55:53.410Z"
  completed_at: "2026-11-23T21:31:21.915Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - specdojo:prj-stakeholder-register-sample
    - specdojo:prj-stakeholder-register-template
---

# Edit Result

## 1. 実施内容

- ステークホルダー登録簿の `template` を更新しました。
- 具体的には、`template` 冒頭の `rulebook` の記述ガイドの繰り返しと、各章の `_TODO_` セクション内の説明文を、`sample` の記述形式（章の冒頭に具体的な記入欄を設ける形式）に合わせて修正しました。
- 章の構成、表の列名、およびプレースホルダ名は、すでに `rulebook` および `sample` と一致していたため、そのまま維持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/prj-stakeholder-register-template.md`: `template` の冒頭の冗長な説明を削除し、各章の `_TODO_` を `sample` に倣った記入欄の形式へと書き換えました。

## 3. 申し送り

- 見直し条件の表の「見直し責任者」および「承認者」の列は、`rulebook` の本文要件で必須であるため維持しています。PJR-76N9（文書の役割の割り当てと承認の進み具合の記入欄を置かない）の適用については、`rulebook` 側での判断が必要です。
- `template` 自身の `frontmatter` 内の `status` は `ready` のままですが、これは `template` の執筆標準における `draft` 指定と食い違います。本タスクでは `status` の変更は行っていません。
- 見直し条件の表の「見直し責任者」「承認者」の列は rulebook の本文要件で必須のため維持した。PJR-76N9（文書の役割の割り当てと承認の進み具合の記入欄を置かない）に当たるかは、rulebook 側で判断が要る。
- template 自身の frontmatter は `status: ready` のままで、template の執筆標準の `draft` 指定と食い違う。本タスクでは `status` を変えていない。

## 4. 進め方と実践の型の適用

「成果物 → template」の方向で、`sample` の記述スタイルを `template` に適用しました。具体的には、指示的な `_TODO_` 文言を、実際の `sample` に見られるような「記入すべき内容を提示するプレースホルダ」へと置き換え、テンプレートとしての実用性を高めました。
