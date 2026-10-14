---
specdojo:
  id: prj-0001:pjr-exh2-product-repo-branch-only-integration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T08:54:11Z"
  due_on: "2026-10-31"
---

# PJR-EXH2 プロダクトリポジトリを merge せず exec branch を残す統合方式を選べるようにする

## 1. 概要

プロダクト側の統合はローカルの merge commit しかない。GitHub flow で PR によるレビューを必須にするプロダクトのため、プロダクト側は merge せず exec branch を残し、PR はプロダクト側で作る方式を repos の設定で選べるようにする

## 2. 完了条件

- `repos` の設定で、プロダクトリポジトリごとに統合方式を選べる。既定は従来どおりのローカルの merge commit とする。
- merge しない方式を選んだリポジトリでは、runner は exec branch に commit するが統合先へ merge しない。exec branch を残し、PR はプロダクト側で作る。
- _UNDECIDED_: exec branch を push するか、PR を作るか（`gh` を使うか）、worktree と exec branch の撤去の扱い、プロジェクト側の記帳（`review` への遷移と result）の扱いは、設計時に決める。認証情報の扱いを含むため、push と PR の作成は利用者の承認を要する。
- result に、統合しなかったことと exec branch の名前、trace key が記録される。
- [[specdojo:specdojo-config-reference]] と [[specdojo:docs-structure-guide]] の `複数リポジトリの worktree と統合順序` に、方式の選び方と振る舞いが書かれている。
- 統合テストで、merge しない方式のリポジトリが統合先を変えず、exec branch が残ることを確認している。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ |
| --- | ------------------------------ | ---- | ---- | ---- |
| 1   | 方式の設定と振る舞いを設計する | DEV  | open | -    |
| 2   | 実装し、テストと文書を更新する | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]]: 派生元の決定。
- [[specdojo:docs-structure-guide]]: 複数リポジトリの統合順序。
- [[prj-0001:pjr-5w8c-register-github-integration]]: GitHub との連携。PR の作成と関わる。
