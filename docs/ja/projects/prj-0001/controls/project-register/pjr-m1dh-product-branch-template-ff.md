---
specdojo:
  id: prj-0001:pjr-m1dh-product-branch-template-ff
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-31T02:43:00Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNMV
  depends_on:
    - PJR-TC62
    - PJR-Z7GX
---

# PJR-M1DH プロダクトのリポジトリの作業ブランチの名前を設定で選べるようにし、早送りの統合を足す

## 1. 概要

repos[].branch_template で作業ブランチの名前を選べるようにし、run と作業ブランチの対応を runner の記録で持ち、名前の重なりを run の開始時に検査し、統合の形に ff を足す

## 2. 入力

- PJR-BNMV の決定: `repos[].branch_template`（既定は exec/{project}-{id}、例: git-flow は feature/{topic}、GitHub flow は {type}/{topic}）。{id} も {topic} も含まないテンプレートは設定エラー
- ブランチ名が別の項目のものとしてあれば run の開始時に止め、topic を変えるか --branch で名前を指定するよう案内する。自動の連番は付けない。同じ項目の再開では同じブランチを使い続ける
- runner は作業ブランチの名前が exec/ で始まることを前提に worktree の片付けや再開をしている（src/exec/worktree-ops-lifecycle.ts など）。run と作業ブランチの対応は、名前の接頭辞ではなく runner の記録で持つ
- 統合の形に ff（merge commit を作らず早送りで積む）を足す。既存の merge・branch-only は変えない

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
