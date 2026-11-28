---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-bps-sample-045-20261123t111142z-7f533b12
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-bps-sample-045
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-bps-sample-045/T-KATA-WAVE-6-DESIGN-bps-sample-045-20261123T111142Z-7f533b12/plan.md
  started_at: "2026-11-23T11:11:52.310Z"
  completed_at: "2026-11-23T16:16:17.053Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - specdojo:bps-sample
    - specdojo:bps-recipe
---

# Edit Result

## 1. 実施内容

- grade の finding F001（minor）に対応し、`bps-recipe` の「仕上げチェック」に、ファイル名と Frontmatter の確認項目を1行追加した。
- rulebook の完成判定と照合した。recipe 内の「承認」は業務の流れの中の判断であり、PJR-76N9 の対象外と判断した。
- 上記以外の記述は rulebook と矛盾しないため維持した。rulebook と sample は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/bps-recipe.md`: 「仕上げチェック」に1行追加した。ファイル名と Frontmatter の `id`・`type`・`rulebook` が rulebook の「ファイル命名・ID規則」「推奨 Frontmatter 項目」に一致し、`npm run lint:md` と `npm run lint:fm` が通ることを確かめる項目である。rulebook の規則は再掲せず、参照だけにしている。

## 3. 申し送り

- grade result のサイドカーは再評価時に更新されるため直接編集していない。F001 の解消は再評価で確認する。

## 4. 進め方と実践の型の適用

根拠は grade の finding F001、rulebook の完成判定、recipe 執筆標準である。F001 は、rulebook が完成判定で求めるファイル名と Frontmatter の一致確認が仕上げチェックに欠けているという指摘だった。そこで、rulebook の章を名指しで参照する1行を追加し、規則の本文は再掲しなかった。PJR-76N9 については、recipe に文書の役割割り当てや承認の進み具合を書かせる問いや手順がないことを確かめた。「承認」は業務プロセス内の判断を指すので対象外とした。それ以外の記述は rulebook と整合するため維持した。矛盾はなく、rulebook を正とする判断が必要な箇所はなかった。根拠不足で見送った finding はない。
