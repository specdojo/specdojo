---
specdojo:
  id: prj-0001:pjr-v96b-multi-repo-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:53:47Z"
---

# PJR-V96B 親検証のリポジトリ別の割り当て

## 1. 概要

親検証の ID ごとに実行するリポジトリ（cwd）を宣言し、ソースの test はプロダクト側、文書の lint と schema 検証はプロジェクト側で実行する（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- `pipeline.parent_validations` の要素に `{ id, repo }` を許し、文字列だけの要素はプロジェクトリポジトリで実行する。exec-defaults の schema を更新する。
- 割り当てたリポジトリの worktree を `cwd` として実行し、変更がなくても実行する。結果の evidence にリポジトリ名を記録する。
- 固定 ID と固定 argv の許可リストを維持する。プロダクト側で npm script 名が異なる場合の扱いを決め、result に記録する。
- プロダクトが 2 つ以上の構成で、リポジトリごとに異なる検証が実行される単体テストまたは統合テストがある。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ |
| --- | -------------------------------------- | ---- | ---- | ---- |
| 1   | `{ id, repo }` の schema と解決        | DEV  | open | -    |
| 2   | リポジトリ別の実行と evidence への記録 | DEV  | open | -    |
| 3   | テスト                                 | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
