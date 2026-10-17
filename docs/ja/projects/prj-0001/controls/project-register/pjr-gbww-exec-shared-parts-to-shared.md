---
specdojo:
  id: prj-0001:pjr-gbww-exec-shared-parts-to-shared
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:45:01Z"
  due_on: null
  block_reason: "checkpoint failed: Failed to inspect execution checkpoint changes."
---

# PJR-GBWW exec の汎用の部品を src/shared へ移す

## 1. 概要

exec/shared の補助関数、exec/types の共通の型、exec/worktree の git と worktree の操作のうち、exec 以外の機能から使われる部分を src/shared へ移す。 PJR-QQKY の決定に基づく。動作は変えない

## 2. 完了条件

[[prj-0001:pjr-qqky-src-feature-cycles]] の決定の 2 に基づく。`exec` の中の汎用の部品のうち、`exec` 以外の機能が使い、循環（`exec` ⇄ `register`・`schedule`・`grade`・`job`）の原因になっている部分を `src/shared/` へ移す。2026-10-17 時点で、`exec` 以外の機能が使っている名前は次のとおり。

| 移す前                 | 名前（使っている機能）                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 移した後                                                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/exec/shared.ts`   | `ensureDir`（routine）、`expandTemplate`（job）、`inlineCodeAnglePlaceholders`（register）、`isUtcIsoSeconds`（register）、`listFilesRecursive`（grade・job・routine）、`normalizeDateOnly`（dashboard）、`nowUtcIsoSeconds`（register・routine）、`padEndDisplay`（routine）、`readJson`（dashboard・job・routine）、`readYaml`（dashboard・routine・schedule）、`stripTerminalControlSequences`（dashboard）、`toArtifactPath`（dashboard）、`writeJson`（job・routine） | `src/shared/` の新しいモジュール（例: ファイルの読み書きは `src/shared/fs.ts`、時刻は `src/shared/time.ts`、文字列の整形は `src/shared/text.ts` など、責務ごとに分けてよい） |
| `src/exec/types.ts`    | `AgentAssignment`・`Approach`・`Proficiency`（schedule）、`Proficiency`・`TaskMode`（job）                                                                                                                                                                                                                                                                                                                                                                                 | `src/shared/agent-types.ts`（[[prj-0001:pjr-x8y9-src-dependency-direction-rules]] で作った）                                                                                 |
| `src/exec/worktree.ts` | `gitOutput`・`gitResult`（register・deliverable）、`gitEnvironment`（job。定義は既に `src/shared/git-environment.ts`）                                                                                                                                                                                                                                                                                                                                                     | `src/shared/` の新しいモジュール（例: `src/shared/git.ts`）。一時的な失敗の再試行（`runGitWithTransientRetry` と関係する関数）も一緒に移す                                   |

`src/exec/types.ts` のうち `ExecEventV1`・`StateSnapshot`・`ScheduleCalendar` は `dashboard` だけが使い、`dashboard` ⇄ `exec` は循環していないため移さない。

条件:

- 上の名前の定義を `src/shared/` へ移し、`exec` 以外の機能はすべて `src/shared/` から import する。`exec` の中の import も `src/shared/` へ直すか、`exec` の元のモジュールから明示的に再 export する（`export *` は使わない）。どちらにしたかを result に書く。
- 移す関数が `exec` の中の別の関数に依存している場合は、その依存も一緒に移すか、移す関数から依存を外す。`src/shared/` が他の機能を import しない規則（[[prj-0001:pjr-x8y9-src-dependency-direction-rules]]）を守る。
- 移すだけにし、動作は変えない。
- 移した後に、`exec` ⇄ `register`・`schedule`・`grade`・`job` の循環が残っているかを数え、残っている import の一覧を result に書く（後続の [[prj-0001:pjr-e025-src-remaining-cycles]] の入力にする）。
- 移す前と後で、`specdojo --help` に出る全コマンドとそのサブコマンドの `--help` の出力が一致する。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコード（git の起動と再試行）を移すため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 3. 作業内容

| No  | 作業                                                  | 担当         | 状態 | メモ                 |
| --- | ----------------------------------------------------- | ------------ | ---- | -------------------- |
| 1   | `exec/shared` の汎用の補助関数を `src/shared/` へ移す | DEV          | open | 責務ごとに分けてよい |
| 2   | 共通の型を `src/shared/agent-types.ts` へ移す         | DEV          | open | -                    |
| 3   | git の起動と再試行を `src/shared/` へ移す             | DEV          | open | -                    |
| 4   | 残っている循環を数えて result に書く                  | DEV          | open | E025 の入力          |
| 5   | 統合の後に `exec run --register` を 1 回流す          | orchestrator | open | close の条件         |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqky-src-feature-cycles]]: 決定。
- [[prj-0001:pjr-e025-src-remaining-cycles]]: 本件の後に残る循環。
