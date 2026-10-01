---
specdojo:
  id: prj-0001:pjr-30sw-multi-repo-refs-trace
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:54:02Z"
---

# PJR-30SW プロダクト側 commit の Refs 付与と result の trace 記録

## 1. 概要

プロダクト側の commit に Refs: `<project-id>`:`<item-id>` を自動で付け、統合後の commit snapshot・PR 参照を result の trace 表へ自動で記録する（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- runner がプロダクト側の commit と merge commit の両方に `Refs: <project-id>:<item-id>` を付ける。プロジェクト側の merge commit の `Refs:` も修飾形へ直す（[[prj-0001:pjr-1sxk-refs-trailer-project-qualified-id]]）。
- 統合後に、リポジトリごとの統合先の commit snapshot と、分かる場合は PR 参照を result の trace 表へ自動で記録する。
- `docs-structure-guide` の「result によるトレーサビリティ」の書式と `git log --grep` の例を修飾形にし、修飾なしの過去の履歴も検索する方法を書く。
- 付与と記録の単体テストまたは統合テストがある。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ |
| --- | ------------------------------------------- | ---- | ---- | ---- |
| 1   | Refs の自動付与（プロダクト・プロジェクト） | DEV  | open | -    |
| 2   | result の trace 表の自動記録                | DEV  | open | -    |
| 3   | ガイドの更新とテスト                        | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
