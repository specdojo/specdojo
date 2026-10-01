---
specdojo:
  id: prj-0001:pjr-69vp-multi-repo-e2e-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:54:10Z"
---

# PJR-69VP 複数リポジトリ構成の実構成検証と文書の更新

## 1. 概要

2 リポジトリの統合テストと e2e で動作を確かめ、docs-structure-guide・exec のガイド・CHANGELOG・移行ガイドを更新する（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- プロジェクトリポジトリ 1 つとプロダクトリポジトリ 2 つの構成を一時ディレクトリに作り、1 つの項目で 3 つのリポジトリを変更する exec run が、worktree の作成から統合・trace の記録まで通る e2e または統合テストがある。
- 同じ構成で、統合の各位置での失敗と再開が期待どおりになることを確かめる。
- 宣言を持たない構成（同一リポジトリ構成を含む）の回帰を確かめる。
- `docs-structure-guide` の「別リポジトリ構成」（「現行実装の境界」「二重 worktree」の各章）、exec のガイド、`CHANGELOG.md`、v0.3.0 の移行ガイドを、実装後の動作に合わせて更新する。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 3 リポジトリ構成の e2e              | DEV  | open | -    |
| 2   | 失敗と再開の検証                    | DEV  | open | -    |
| 3   | 宣言のない構成の回帰                | DEV  | open | -    |
| 4   | ガイド・CHANGELOG・移行ガイドの更新 | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
- [[prj-0001:pjr-p7hy-multi-repo-single-item]]
- [[specdojo:docs-structure-guide]]
