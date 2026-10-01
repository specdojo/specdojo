---
specdojo:
  id: prj-0001:pjr-v96b-multi-repo-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:53:47Z"
  block_reason: rate limit reached
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
| 1   | `{ id, repo }` の schema と解決        | DEV  | done | -    |
| 2   | リポジトリ別の実行と evidence への記録 | DEV  | done | -    |
| 3   | テスト                                 | DEV  | done | -    |

## 4. 対応結果

- `src/exec-parent-validation.ts`: `pipeline.parent_validations` の要素として ID の文字列と `{ id, repo }` を受け付ける解決処理（`resolveParentValidationAssignments`）を追加した。文字列の要素はプロジェクトリポジトリ（`project`）に割り当てる。`id`・`repo` 以外のキー、`repo` の無いオブジェクト、同じ `(id, repo)` の組の重複は設定エラーにする。同じ ID を複数のリポジトリへ割り当てることはできる。
- `runParentValidations` は、割り当てたリポジトリの worktree を `cwd` にして ID ごとに実行する。変更の有無にかかわらず実行する。task に worktree の無いリポジトリへ割り当てた検証は、コマンドを起動せずに `failed` とする。task がプロダクトリポジトリを持つ場合と、要素が `{ id, repo }` の場合は、evidence の runner 検証に `repo` を記録する。ログ・block 理由・reporter 再開時の照合は `<repo>:<id>` の表示名で行う。
- `src/exec-run.ts`・`src/exec-trial.ts`: executor 成功後の検証と reporter 再開前の再検証で、task のプロダクト worktree を割り当て先として渡すようにした。executor への指示文には `<repo>:<id>` と `npm run ... (in <repo>)` を表示する。
- schema: `docs/specdojo/schemas/v1/exec-defaults.schema.yaml` の `parent_validations` の要素に `{ id, repo }` を加えた。`docs/specdojo/schemas/v1/exec-evidence.schema.yaml` の `validations` に `repo` を加えた。
- npm script 名の扱い: 固定 ID と固定 argv の許可リストは維持し、リポジトリ別の command や script 名の指定は設けない。プロダクト側の script 名が異なる場合は、プロダクトの `package.json` に許可リストと同じ名前の script を用意するか、その ID を割り当てない。この方針を `exec-config-guide` に記載した。
- テスト: 2 つのプロダクトリポジトリ（`app1`・`app2`）で、リポジトリごとに異なる検証が各 worktree で実行される単体テストを追加した。宣言の無い構成で evidence の形が変わらない回帰テストも追加した。
- 残課題: `.specdojo/exec-defaults.yaml` は変更していない。別リポジトリ構成の project で割り当てを使う場合は、利用者が `{ id, repo }` を追記する。実構成での検証は PJR-69VP で行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
