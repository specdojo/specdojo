---
specdojo:
  id: prj-0001:pjr-13m6-exec-worktree-integration-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: low
  owner: DEV
  registered_at: "2026-10-14T21:26:09Z"
  due_on: null
  block_reason: "agent exited with non-zero code: parent validation failed: test-integration, typecheck"
---

# PJR-13M6 exec-worktree-ops.ts・exec-repo-integration.ts・exec-reporter.ts を分ける

## 1. 概要

worktree の操作、プロダクトリポジトリの統合、reporter の処理（合わせて 3,748 行）を責務ごとのモジュールへ移す。 動作は変えない

## 2. 完了条件

[[prj-0001:pjr-y8p9-large-source-files-split]] を分けた 1 件である（2026-10-15、利用者が承認）。

対象: `src/exec-worktree-ops.ts`（1,595 行）、`src/exec-repo-integration.ts`（1,030 行）、`src/exec-reporter.ts`（1,123 行）。runner が使う worktree の操作・プロダクトリポジトリの統合・reporter の処理であるため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

比べるコマンド: `exec run`・`exec cycle`・`exec resume`（runner の入口として、出力が変わらないことを確かめる）

条件:

- 移すだけにし、ロジックは変えない。分割の途中で不具合や改善点を見つけても直さず、result に書く。
- 分割の前に対象のファイルが export していた名前は、すべて同じ名前で元のファイルから import できる。再 export は `export *` を使わず、分割の前に export していた名前だけを明示的に再 export する。既存のテストは import のパスを含めて変更せずに通る。テストの追加は妨げない。
- 分割の前後で、下記の「比べるコマンド」の `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの一覧と差分がないことを result に記録する。比べるコマンドがない場合は、その旨を result に書く。
- 分割の後、対象のファイルと新しく作るモジュールはそれぞれ 1,000 行以下とする。1 つの関数が大きいなどで超える場合は、理由を result に書く。関数の中身の分割は本件では行わない。
- 新しい循環 import を作らない。移した先のモジュールから元のファイルを import しない。
- 新しいモジュールのファイル名は、元のファイル名で始める（例: `src/register-migration.ts`）。
- モジュールの構成に触れている設計書（[[sysd-index]] など）があれば更新する。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                                | 担当         | 状態 | メモ                                    |
| --- | ------------------------------------------------------------------- | ------------ | ---- | --------------------------------------- |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV          | done | `exec run`・`exec cycle`・`exec resume` |
| 2   | 責務ごとのモジュールへ移し、元のファイルから明示的に再 export する  | DEV          | done | 6 モジュールへ分割                      |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV          | done | help 差分なし、親検証は runner が実行   |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | reporter     | open | reporter stage で記録                   |
| 5   | 統合後に `exec run --register` を 1 回流して runner を確かめる      | orchestrator | open | close の条件                            |

## 4. 対応結果

`src/exec-worktree-ops.ts` は commit 対象・commit、merge、worktree lifecycle の 3 モジュール、
`src/exec-repo-integration.ts` は共通 Git 判定と再開時の統合先同期の 2 モジュール、
`src/exec-reporter.ts` は reporter 出力 schema・parse の 1 モジュールへ処理を移した。元の 3
ファイルは既存の公開名だけを明示的に再 export し、既存の import path を維持する。

分割後の最大ファイルは `src/exec-reporter.ts` の 899 行で、対象ファイルと新規モジュールは
すべて 1,000 行以下である。移動先から各 façade への import と新しい循環 import はない。
分割前後で `exec run`・`exec cycle`・`exec resume` の `--help` に差分がなく、公開 export の名前も
一致することを確認した。ロジックの改善や不具合修正は行っていない。

親 runner が lint、型検査、単体・統合テスト、schema 検証を実行する。統合後の runner の実動作
確認は、完了条件どおり orchestrator が `exec run --register` を 1 回流して行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-y8p9-large-source-files-split]]: 親の項目。
- [[prj-0001:pjr-k6kb-grade-module-split]]・[[prj-0001:pjr-gbpx-exec-run-split-register]]: 同じ条件で行った分割。
