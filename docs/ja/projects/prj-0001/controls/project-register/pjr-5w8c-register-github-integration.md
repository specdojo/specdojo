---
specdojo:
  id: prj-0001:pjr-5w8c-register-github-integration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: ARC
  registered_at: "2026-08-24T12:01:27Z"
  due_on: "2026-12-31"
---

# PJR-5W8C RegisterとGitHub Issues/Projectsの連携を実装する

## 1. 概要

GitHub Issues/Projects を任意の共同作業UIとして利用できる連携境界を設け、Gitのみで完結する運用とGitHubを利用する運用の双方を選択できるようにする。none、一方向のpublish/import、参照のみのlinked などの候補を評価し、方式・正本側・ID対応・同期失敗・競合・認証情報の境界を定める。方式の採用は decision として起票し承認を得る。外部ツール連携の共通契約とGitHub固有処理を分離し、将来 GitLab や Jira などのアダプターを追加するときに Register 本体の状態遷移・履歴モデルを変更しなくてよい境界にする。GitHub 以外のアダプターの実装・接続試験・運用文書は本項目の対象外とし、必要になった時点で別途起票する。同期対象が Register event となるため PJR-TPY9 の完了を前提とする。

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 前提となる第1段: [[prj-0001:pjr-tpy9-register-git-github|PJR-TPY9 Register履歴をGitコミット粒度から分離する]]
- 第2段: [[prj-0001:pjr-t7zq-register-commit-policy|PJR-T7ZQ Registerの状態遷移に対するcommit policyを選定する]]
- Register の運用: [[specdojo:register-operation-guide|Register運用ガイド]]

完了条件と作業内容は、PJR-TPY9 の設計結果を踏まえて着手時に具体化する。方式の採用は decision として起票し承認を得る。
