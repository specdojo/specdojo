---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-prj-issues-and-approach-sample-040-20261123t215141z-1ae8a118
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-prj-issues-and-approach-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-prj-issues-and-approach-sample-040/T-KATA-WAVE-6-PROJECT-prj-issues-and-approach-sample-040-20261123T215141Z-1ae8a118/plan.md
  started_at: "2026-11-23T21:51:48.929Z"
  completed_at: "2026-11-23T22:02:49.053Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:prj-issues-and-approach-sample
    - specdojo:prj-issues-and-approach-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/prj-issues-and-approach-rulebook.md` を更新しました。
- F001 に基づき、禁止事項に「個人や特定の組織を識別できる情報、非公開の観察事実」の項目を追加しました。
- F002 に基づき、「次の検討事項（ToDo）」の表に「完了条件」および「期限 / 判断タイミング」の列を追加しました。
- F003 に基づき、課題一覧の「優先度」について、取りうる値として `High` / `Medium` / `Low` を定義しました。
- F004 に基づき、「見直しと変更管理」の記述から、記録先や責任に関する記述を削除し、共通の運用に委ねる方針に統一しました。
- PJR-76N9 に従い、導入部の記述を「どの利用場面で何を判断するための文書か」という形式に改めました。
- 各項目（課題一覧、原因、ToDo）の記述ガイドに、判断基準を明確にするための良い例と悪い例を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/prj-issues-and-approach-rulebook.md`: grade の指摘に基づき、禁止事項の拡充（公開不適切情報の追加）、ToDo 表への完了条件と期限の列の追加、優先度の値の定義、および「見直しと変更管理」における役割記述の削除を行いました。また、PJR-76N9 に従って導入部を改め、各章の記述ガイドに具体例を追加しました。

## 3. 申し送り

- template の「次の検討事項 (ToDo)」の表に「完了条件」と「期限 / 判断タイミング」の列を足し、rulebook (`F002` の修正) と揃える。
- template の「見直しと変更管理」から「記録先と責任ロールを添える」という指示を外し、rulebook (`F004` の修正) と揃える。
- template の導入部の `_TODO_` 「承認者、および利用ロールごとの利用目的を記述する」を「どの利用場面で何を判断するための文書か」に改める (PJR-76N9)。
- sample の導入部の承認者・利用ロールの記述、7 章末尾の「店主代表が確認し」という記録責任の文、6 章の ToDo の表に完了条件と期限の列がない点を、rulebook に合わせて直す。
- recipe の「全体の作成手順」6 と「レビュー観点」の「関係者・利用場面」が承認者・利用ロールの記述を求めているので、PJR-76N9 に合わせて見直す。
- 直さなかった箇所と理由: ToDo の「責任ロール」の列は ToDo ごとの担当という中身であり、文書の役割の割り当てではないので残した。
- template の「次の検討事項（ToDo）」の表に「完了条件」と「期限 / 判断タイミング」の列を足し、rulebook（F002 の修正）と揃える。
- template の「見直しと変更管理」から「記録先と責任ロールを添える」という指示を外し、rulebook（F004 の修正）と揃える。
- template の導入部の `_TODO_`「承認者、および利用ロールごとの利用目的を記述する」を「どの利用場面で何を判断するための文書か」に改める（PJR-76N9）。
- 直さなかった箇所と理由: ToDo の「責任ロール」の列は ToDo ごとの担当という中身であり、文書の役割の割り当てではないので残した。章構成・位置づけ・命名・Frontmatter・ほかの禁止事項は、指摘も重複もないので変えていない。
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更しておらず、変更したのは rulebook だけ）

## 4. 進め方と実践の型の適用

rulebook-maintenance
