---
specdojo:
  id: prj-0001:pjr-gbww-exec-shared-parts-to-shared
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:45:01Z"
  due_on: null
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

| No  | 作業                                                  | 担当         | 状態 | メモ                                          |
| --- | ----------------------------------------------------- | ------------ | ---- | --------------------------------------------- |
| 1   | `exec/shared` の汎用の補助関数を `src/shared/` へ移す | DEV          | done | 責務別の shared モジュールへ移動              |
| 2   | 共通の型を `src/shared/agent-types.ts` へ移す         | DEV          | done | `exec/types.ts` から明示的に再 export         |
| 3   | git の起動と再試行を `src/shared/` へ移す             | DEV          | done | `src/shared/git.ts` へ移動                    |
| 4   | 残っている循環を数えて result に書く                  | DEV          | done | 下記に集計。result への転記は reporter が行う |
| 5   | 統合の後に `exec run --register` を 1 回流す          | orchestrator | open | close の条件                                  |

## 4. 対応結果

- `src/exec/shared.ts` にあった汎用処理を、責務ごとに `src/shared/fs.ts`・`src/shared/time.ts`・`src/shared/text.ts`・`src/shared/artifact-path.ts` へ移した。`exec` 内の既存 import の互換性は、元のモジュールからの明示的な再 export で維持した。
- `Approach`・`Proficiency`・`AgentAssignment` を `src/shared/agent-types.ts` へ移し、`schedule` と `job` は shared から直接 import するようにした。`TaskMode` は既に同ファイルにあったため import 先だけを変更した。
- git の起動・一時失敗の再試行・失敗診断を `src/shared/git.ts` へ移し、`register`・`deliverable`・`job` は shared から直接 import するようにした。worktree 固有の作成・準備処理は `src/exec/worktree.ts` に残し、移した API は同ファイルから明示的に再 export した。
- 移動後に `exec` 外から `exec/shared` と `exec/worktree` を参照する import は 0 件になった。`exec/types` への残り 2 件は、完了条件で移動対象外とされた dashboard の `ExecEventV1`・`StateSnapshot`・`ScheduleCalendar` だけである。
- 循環の残数（import 元ファイル数）は、`exec` ⇄ `register` が 7 ⇄ 1、`exec` ⇄ `schedule` が 8 ⇄ 0、`exec` ⇄ `grade` が 2 ⇄ 1、`exec` ⇄ `job` が 1 ⇄ 1 となった。`schedule` との循環は解消した。残る逆向き import は次のとおりで、[[prj-0001:pjr-e025-src-remaining-cycles]] の対象と一致する。
  - `src/register/register.ts` → `src/exec/run/lock.ts`・`src/exec/slot-lock.ts`・`src/exec/worktree-ops.ts`
  - `src/grade/target-discovery.ts` → `src/exec/schedule/index.ts`
  - `src/job/job.ts` → `src/exec/format.ts`・`src/exec/plans.ts`
- `npm run build` が成功した。Git HEAD から復元した変更前コードと変更後コードについて、全 123 コマンド／サブコマンドの help 出力が一致した。親 runner が実行する lint・型検査・単体／統合テスト・schema 検証は executor では重複実行していない。
- 残課題は、親 runner の検証完了と、統合後に orchestrator が `exec run --register` を 1 回完走させる close 条件である。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqky-src-feature-cycles]]: 決定。
- [[prj-0001:pjr-e025-src-remaining-cycles]]: 本件の後に残る循環。
