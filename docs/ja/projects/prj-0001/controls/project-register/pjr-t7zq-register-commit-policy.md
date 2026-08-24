---
specdojo:
  id: prj-0001:pjr-t7zq-register-commit-policy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-24T12:01:18Z"
  due_on: "2026-10-31"
---

# PJR-T7ZQ Registerの状態遷移に対するcommit policyを選定する

## 1. 背景

PJR-TPY9 で Register の状態遷移を追記型 event として記録できるようにした後、遷移ごとにコミットする現行の運用を見直す。per-event、per-item、batch、related-change、manual などの候補を評価し、採用する policy、既定値、設定方法、人手・Agent・routine・worktree 実行時の扱いを決める。event が履歴を保持するならコミット頻度を下げられるため、PJR-TPY9 の完了を前提とする。

## 2. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | PO     |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- 前提となる第1段: [[prj-0001:pjr-tpy9-register-git-github|PJR-TPY9 Register履歴をGitコミット粒度から分離する]]
- 第3段: [[prj-0001:pjr-5w8c-register-github-integration|PJR-5W8C RegisterとGitHub Issues/Projectsの連携を実装する]]
- コミット方針の現行規約: [[specdojo:git-branching-standard|Gitブランチ標準]]
- Register の運用: [[specdojo:register-operation-guide|Register運用ガイド]]
