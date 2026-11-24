---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-prj-scope-sample-060-20261123t205048z-44b20577
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-prj-scope-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-prj-scope-sample-060/T-KATA-WAVE-6-PROJECT-prj-scope-sample-060-20261123T205048Z-44b20577/plan.md
  started_at: "2026-11-23T20:50:55.569Z"
  completed_at: "2026-11-23T21:28:35.308Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - specdojo:prj-scope-sample
    - specdojo:prj-scope-template
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/templates/prj-scope-template.md` を、更新された `prj-scope-rulebook` および `prj-scope-sample` に適合するように調整した。
- 具体的には、導入文・境界の判断基準・スコープ変更方針に（任意）のラベルを付与し、対象業務の記述指示を『各行がどの対象業務を支えるか』へと変更した。また、スコープ外の項目を rulebook の規定に合わせて『今回扱わない対象』と言い換え、完成例の写しを整理した。
- 章構成、表の列、`frontmatter_template` の構造は維持している。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/prj-scope-template.md`: `rulebook` および `sample` に合わせて、各章の `_TODO_` 記述や『スコープ外』の項目名を更新した。

## 3. 申し送り

- 根拠: `docs/ja/specdojo/rulebooks/prj-scope-rulebook.md`（commit 93a61c69e3 の改訂を含む）、`docs/ja/specdojo/samples/prj-scope-sample.md`、`docs/ja/specdojo/standards/template-authoring-standard.md`。
- スコープ変更方針の表の『承認者』行は、スコープ変更の判断者という中身として rulebook が求める項目なので残した（PJR-76N9 が外すよう求める、文書の役割の割り当てや承認の進み具合の欄ではない）。
- スコープ変更方針の末尾にあるトレードオフ確認方針の記入欄は、rulebook の必須ではないが sample で使われているので残した。

## 4. 進め方と実践の型の適用

直した `rulebook` と厚くした `sample` に沿って、`template` を同期した。骨組みである章構成や `frontmatter_template` は維持しつつ、項目名や `_TODO_` の説明を成果物の実態に合わせて微調整し、説明や完成例の写しを排除して、テンプレートとしての責務を明確にした。
