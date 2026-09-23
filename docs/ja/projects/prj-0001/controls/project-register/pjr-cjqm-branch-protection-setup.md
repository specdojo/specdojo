---
specdojo:
  id: prj-0001:pjr-cjqm-branch-protection-setup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: OPS
  registered_at: "2026-09-23T02:37:14Z"
  due_on: "2026-12-31"
---

# PJR-CJQM 統合専用 actor を用意し main と develop に branch protection を設定する

## 1. 概要

[[prj-0001:pjr-ewwx-feature-branch-policy]] の決定を運用へ反映する。[[specdojo:git-branching-standard]] は `main` と `project/<project-id>/develop` に branch protection を求めているが、現在は未設定である。標準は「統合専用 actor を分離できない間は develop の保護を有効化しない」として猶予を認めており、本項目はその猶予を終わらせるための作業を扱う。

リポジトリ管理権限が必要なため担当は OPS（人）とし、複数人開発が具体化する時点で実施する。

## 2. 完了条件

- 統合専用の GitHub App または service account が作成され、`project/prj-0001/develop` の bypass actor に指定されている。人の管理者や承認者へ広い bypass を付与していない。
- `main` に branch protection が設定されている（PR 経由、承認 1 件以上、Code Owners レビュー、新規 commit 時の古い承認の無効化、未解決 conversation の解消、管理者を含む bypass・force-push・削除の禁止）。
- `project/prj-0001/develop` に branch protection が設定され、統合専用 actor 以外の直接 push が禁止されている。
- `git-branching-standard` の `CODEOWNERS と branch protection を設定する` にある確認 4 項目を実施し、結果を本個票へ記録している。
- 通常の `exec → develop` 統合が設定後も止まらないことを、実際の exec 実行で確認している。

## 3. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ                              |
| --- | ---------------------------------------------------------------- | ---- | ---- | --------------------------------- |
| 1   | 統合専用 actor を作成し、リポジトリへ write 権限を付与する       | OPS  | open | リポジトリ管理者権限が必要        |
| 2   | exec の統合が統合専用 actor として行われるよう認証情報を設定する | OPS  | open | devcontainer の認証設定に影響する |
| 3   | `main` と develop に branch protection を設定する                | OPS  | open | 標準の表に従う                    |
| 4   | 確認 4 項目を実施し、exec 実行で統合が止まらないことを確認する   | OPS  | open | 結果を対応結果へ記録する          |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-ewwx-feature-branch-policy]]
- [[specdojo:git-branching-standard]]
- [[specdojo:branch-workflow-guide]]
- `.github/CODEOWNERS`
