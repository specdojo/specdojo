---
specdojo:
  id: prj-0001:pjr-x055-specdojo-maturity-criteria
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-16T03:22:45Z"
  due_on: null
  commit_type: chore
  commit_scope: release
---

# PJR-X055 SpecDojo を枯れたと判断する目安を満たす

## 1. 概要

夜間の無人実行、別リポジトリでの通し、手作業のコマンド化、対話の試験の安定を目安に、成熟度を追う

## 2. 入力

- 2026-11-16、0.8.0 の準備で一晩に 30 件ほどの項目を並列で流し、登録簿に履歴を残しながら進められた。一方で、SpecDojo 自身の機能の組み合わせの不具合（DVNV と ED0K、rulebook の ready と schema の検査、grade の翻訳の段、plan だけの run の記録など）に何度も当たり、orchestrator が 5 回ほど手を入れた
- 利用者は「不具合は直せばいいので、枯れれば使えるか」と尋ね、orchestrator が示した目安を記録することを選んだ（2026-11-16）。直しても残る性質（仕組みが大きく小さな作業には重い）は目安の対象にしない

## 3. 完了条件

- 夜間の run（並列の register・schedule）を、人が手を入れずに続けて 3 回以上、最後まで流せる。止まった項目は runner の再開だけで進む。
- prj-0001 とは別のリポジトリで、`init` から起票・実行・grade・確定・リリースの手順までを通せる（駄菓子屋のデモ、[[prj-0001:pjr-dq9e-demo-repository-dagashiya]] など）。
- orchestrator が決まって行う手作業（待ち合わせの script、記録の commit、作業内容の表の手直し、再 grade の起動）が specdojo のコマンドに移っている。
- 対話型オーケストレーターの試験（[[prj-0001:pjr-fnb7-orchestrator-test-minimal-check]]）が、決めた回数で安定して通る。
- 複数人の運用の前提（[[prj-0001:pjr-pgyd-integration-actor-github-app]]・[[prj-0001:pjr-30sa-specdojo-git-serialized]]）が入っているか、1 人の運用に限る旨が文書にある。

## 4. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 夜間の無人の run を 3 回流し、手を入れた回数と理由を記録する | PO   | open | -    |
| 2   | 別のリポジトリで通しの試験をする                             | PO   | open | -    |
| 3   | orchestrator の手作業を洗い出し、コマンド化の項目を起票する  | PO   | open | -    |
| 4   | 目安ごとの達成を確かめて、成熟度を判断する                   | PO   | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-pmk6-release-v0-8-0]]
- [[prj-0001:pjr-dq9e-demo-repository-dagashiya]]
- [[prj-0001:pjr-fnb7-orchestrator-test-minimal-check]]
- [[prj-0001:pjr-pgyd-integration-actor-github-app]]
- [[prj-0001:pjr-30sa-specdojo-git-serialized]]
