---
specdojo:
  id: prj-0001:pjr-30sw-multi-repo-refs-trace
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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
| 1   | Refs の自動付与（プロダクト・プロジェクト） | DEV  | done | -    |
| 2   | result の trace 表の自動記録                | DEV  | done | -    |
| 3   | ガイドの更新とテスト                        | DEV  | done | -    |

## 4. 対応結果

- `src/exec-repo-trace.ts` を追加し、`Refs: <project-id>:<item-id>` の組み立て、統合後の commit snapshot の取得、result への trace 表の記録をまとめた。
- `exec run --register` の統合段で、プロダクト側の exec branch の commit と merge commit に修飾形の `Refs:` を付けるようにした。プロダクト側の merge commit には遷移や agent 名を複製しない。プロジェクト側の merge commit の `Refs:` も修飾形に直した。
- プロダクトの統合後・プロジェクトの統合前に、リポジトリごとの統合先ブランチ、merge commit（40 文字）、分かる場合は PR 参照を result 末尾の「トレーサビリティ」章へ記録し、プロジェクト側の merge commit に同梱する。統合を再開した場合は同じ章を書き直し、統合先が先へ進んでいても exec branch を取り込んだ merge commit を記録する。
- `repos` を宣言しない project では trace 表を記録せず、統合の手順は変わらない。schedule 由来のタスクの統合（`runPreparedTask`）は登録簿の項目を持たないため、commit message を変えていない。
- [[specdojo:docs-structure-guide]] の「result によるトレーサビリティ」の書式、trace 表の例、`git log --grep` の例を修飾形にし、修飾なしの過去の履歴も検索する方法を書いた。
- 単体テスト（`tests/src/exec-repo-trace.test.ts`）と、実 Git の統合テスト（`tests/src/exec-task-repos.integration.test.ts` の 2 件）を追加した。宣言の無い project の回帰は既存のテストで確かめる。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
