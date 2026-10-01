---
specdojo:
  id: prj-0001:pjr-5822-multi-repo-item-design
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-10-01T03:53:24Z"
---

# PJR-5822 1 つの項目で複数リポジトリを変更する exec の方針を決める

## 1. 背景

既定の別リポジトリ構成では、プロジェクトリポジトリ（`app1-specdojo/`）とプロダクトリポジトリ（`app1/`）を分ける。現行の exec は、プロジェクトリポジトリ 1 つと worktree 1 組だけを扱う。このため、プロダクトの実装やプロダクト文書を変更する項目は exec run で扱えない（`docs-structure-guide` の「現行実装の境界」）。v0.3.0 で、1 つの項目が複数のリポジトリを変更する exec を実現する。N 個のリポジトリを扱える設計とし、まずプロジェクトリポジトリ 1 つとプロダクトリポジトリ 1 つで動かす。複数プロダクトの論点は [[prj-0001:pjr-p7hy-multi-repo-single-item]] にある。

### 1.1. 調査と案の作成

決定に必要な調査と選択肢の比較は、[[prj-0001:pjr-fzc4-multi-repo-design-investigation]] で exec run により行い、結果を本個票の「検討した選択肢」に書く。決定内容と承認は利用者が記入する。

### 1.2. 現行実装の変更箇所

調査時点（2026-10-01）の実装を、変更が要る箇所としてファイルと関数の単位で挙げる。現行はどの箇所も「プロジェクトリポジトリのルート 1 つと worktree 1 つ」を前提にしている。

#### 1.2.1. worktree の作成・撤去・命名

| ファイル                       | 関数                                                                                                  | 現状                                                                                                      | 必要な変更                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `src/exec-worktree.ts`         | `worktreeNameFromTaskId`、`findExecWorktree`、`execBranchExists`                                      | project 修飾 task ID から worktree 名と branch `exec/<name>` を 1 組だけ導く                              | リポジトリ名を含む配置（`<name>/<repo>`）を導き、リポジトリごとに branch を照合する               |
| `src/exec-worktree.ts`         | `resolveWorktreeBase`                                                                                 | `run.worktree_base`（既定 `../worktrees`）を SpecDojo ルート起点で解決する                                | 全リポジトリで共通の base を使うか、リポジトリごとの base を持つかを決める                        |
| `src/exec-worktree.ts`         | `ensureExecWorktree`、`installWorktreeDependencies`、`generateWorktreeArtifacts`、`runWorktreeBuild`  | base がリポジトリ外であることを検査し、`git worktree add` の後に `npm ci` と SpecDojo の build を実行する | リポジトリごとに呼び出す。依存導入と生成物の build はリポジトリの宣言で有無と方法を切り替える     |
| `src/exec-worktree-ops.ts`     | `checkpointAndEnsureWorktree`                                                                         | 記帳ファイル（plan・result・event）を checkpoint commit してから worktree を作る                          | checkpoint はプロジェクトリポジトリだけで行い、プロダクトリポジトリは統合先ブランチの先端から作る |
| `src/exec-worktree-ops.ts`     | `removeWorktree`、`discardStaleExecWorktree`、`listOrphanedExecBranches`、`pruneOrphanedExecBranches` | 1 つのリポジトリの worktree と exec branch を撤去・検出する                                               | タスクに属する全リポジトリを撤去・検出する。統合済みのリポジトリだけを先に撤去しない              |
| `src/exec-worktree-command.ts` | `prepare`、`requireWorktree`、`requireInsideWorktree`、`configuredWorktreeBase`                       | `exec worktree` サブコマンドが 1 組の worktree を前提に動く                                               | 手動運用のサブコマンドも複数 worktree を表示・検査する                                            |

#### 1.2.2. agent の作業ディレクトリと provider の書き込み許可

| ファイル                                      | 関数・設定                                                                   | 現状                                                                                                                      | 必要な変更                                                                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `src/exec-run.ts`                             | `executeAgent`、`runWithRetry`、`spawnAgentInPlace`                          | agent を `cwd` 1 つ（プロジェクト worktree）で起動する                                                                    | `cwd` は維持し、追加のルートを起動コマンドと環境変数で渡す                                                      |
| `src/exec-run.ts`                             | `agentEnvironment`、`pathInsideWorktree`                                     | `SPECDOJO_SCHEDULE_PATH`・`SPECDOJO_EXECUTION_PATH` を worktree 内へ付け替える。SpecDojo ルート外のパスはエラーにする     | プロダクト worktree のパスを渡す環境変数を加える                                                                |
| `src/exec-run.ts`                             | `buildExecutorPrompt`、`executorEvidenceContract`                            | plan と evidence の書式を渡す。パスは作業ディレクトリからの相対パスと指示する                                             | 他リポジトリのファイルの指定方法（リポジトリ付きの書式）をプロンプトに加える                                    |
| `src/exec-agent-config.ts`                    | `buildCommandVariables`、`resolveMemberCommand`                              | `command_template` で展開できる組み込み変数は `nickname`・`mode`・`proficiency` と `command_params` の値だけ              | 追加のルートを展開する組み込み変数（例: `{extra_dirs}`）を加える                                                |
| `.specdojo/exec-defaults.yaml`（claude）      | `providers.claude.command_template`、`.specdojo/claude/settings.<mode>.json` | `--settings` の `permissions.allow` が `Edit(docs/**)` などの作業ディレクトリ相対で、他のルートへの書き込みは許可されない | 追加ディレクトリの指定と、そのディレクトリへの `Edit` 許可を加える                                              |
| `.specdojo/exec-defaults.yaml`（codex）       | `providers.codex.command_template`                                           | `--sandbox workspace-write` で、書き込みは作業ディレクトリ配下に限られる                                                  | 追加の書き込みルートを指定する。_ASSUMPTION_: 利用中の codex CLI が追加ルートの指定に対応していることを確かめる |
| `.specdojo/exec-defaults.yaml`（antigravity） | `providers.antigravity.command_template`                                     | `--sandbox --add-dir "$(pwd)"` で作業ディレクトリだけを加える                                                             | `--add-dir` をリポジトリの数だけ並べる                                                                          |
| `.opencode/agents/*.md`（opencode）           | `providers.opencode.command_template`、agent 定義の permission               | OS の sandbox を持たず、agent 定義の `permission.external_directory: deny` で作業ディレクトリ外を拒否している             | プロダクト worktree を外部ディレクトリとして許可する。許可の範囲をタスクの worktree に限る方法を確かめる        |
| `src/exec-provider-scaffold.ts`               | `buildProviderScaffoldPlan`、`mergeProviderGlobalSettings`                   | 単一リポジトリ前提の settings と雛形を配る                                                                                | 雛形に追加ルートの変数を含める。利用プロジェクトの既存 settings へ互換を保って追記する                          |

#### 1.2.3. commit 対象の算出と保護設定の検査

| ファイル                             | 関数                                                                                                                                                                      | 現状                                                                                                                                   | 必要な変更                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `src/exec-worktree-ops.ts`           | `taskPaths`、`isCommitTargetPath`、`repoRelative`                                                                                                                         | plan・result・events などの記帳パスを SpecDojo ルート相対で求め、commit 対象から除く                                                   | 記帳パスの除外はプロジェクトリポジトリだけに適用する                                                            |
| `src/exec-worktree-ops.ts`           | `resolveCommitScope`、`headDocIndexLookup`                                                                                                                                | schedule 由来の edit は `targets` を worktree の `.specdojo/doc-index.json` と catalog で 1 リポジトリのパスへ解決し、許可リストを作る | リポジトリ付きの `targets` をリポジトリごとの許可リストへ分ける                                                 |
| `src/exec-worktree-ops.ts`           | `partitionCommitTargets`、`registerNewFileIsAllowed`、`pathsTrackedAtHead`、`commitTargetPaths`、`stageCommitTargets`                                                     | register 由来は作業ツリー差分を commit し、新規ファイルは `REGISTER_NEW_FILE_DIR_PREFIXES` と HEAD の最上位ディレクトリで許可する      | リポジトリごとに差分を分類する。プロダクトリポジトリの許可ディレクトリは宣言から取る                            |
| `src/exec-worktree-ops.ts`           | `commitWorktreeChanges`、`assertNoAgentReadyPromotion`、`assertResultMarkdownlint`、`stabilizeCommitTargets`                                                              | 1 つの worktree で検査・stage・commit する。commit message は `exec(<task-id>)` の固定書式                                             | リポジトリごとに commit し、プロダクト側の message に `Refs:` を付ける。result の検査はプロジェクト側だけで行う |
| `src/exec-agent-protected-config.ts` | `PROTECTED_DIRECTORY_PREFIXES`、`PROTECTED_EXACT_PATHS`、`captureAgentProtectedConfigSnapshot`、`changedAgentProtectedConfigPaths`、`describeAgentProtectedConfigChanges` | 1 つのルートの保護パス（`package.json`、`.github/workflows/` など）をスナップショットして比べる                                        | 全ルートで比べ、違反パスにリポジトリ名を付ける。保護パスの一覧はプロダクト側にもそのまま適用する                |
| `src/exec-agent-git-state.ts`        | `captureAgentGitStateSnapshot`、`changedAgentGitStateFields`、`describeAgentGitStateChanges`                                                                              | 1 つのリポジトリの HEAD とローカル設定を比べる                                                                                         | 全リポジトリの Git 状態を比べる                                                                                 |
| `src/exec-protection-handoff.ts`     | `recordProtectedConfigBlock`、`recordGitStateBlock`                                                                                                                       | 1 つのルートの差分を result の申し送りへ書く                                                                                           | リポジトリ名を付けて書く                                                                                        |
| `src/exec-evidence.ts`               | `snapshotWorktreeChanges`、`buildExecutorEvidence`、`validateResumedTargetCoverage`                                                                                       | 変更ファイルと target coverage を 1 つの worktree の相対パスで記録・検証する                                                           | 変更をリポジトリ付きのパスで記録し、coverage をリポジトリごとに検証する                                         |

#### 1.2.4. 親検証の実行場所

| ファイル                        | 関数・設定                                                                                                                 | 現状                                                                             | 必要な変更                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/exec-parent-validation.ts` | `PARENT_VALIDATION_REGISTRY`、`resolveParentValidationDefinitions`                                                         | 固定 ID（`lint-md`・`test-unit` など）を固定 argv の npm script に対応させる     | ID とリポジトリの組を受け付ける。任意コマンドを注入できない性質は保つ                        |
| `src/exec-parent-validation.ts` | `invokeParentValidation`、`runParentValidations`                                                                           | 全 ID を 1 つの `cwd` で直列に実行する                                           | ID ごとに割り当てたリポジトリの worktree を `cwd` にする。evidence にリポジトリ名を残す      |
| `src/exec-run.ts`               | `runConfiguredParentValidations`、`refreshParentValidationsForReporterResume`、`appendParentValidationsToExecutorEvidence` | `pipeline.parent_validations`（ID 配列）を読み、プロジェクト worktree で実行する | 割り当てに従って worktree を選ぶ。reporter 再開時も同じ割り当てで再実行する                  |
| `.specdojo/exec-defaults.yaml`  | `pipeline.parent_validations`                                                                                              | ID の配列だけを持つ                                                              | リポジトリへの割り当てを書ける形にする（宣言の場所は論点「親検証のリポジトリへの割り当て」） |

#### 1.2.5. 統合・再開・pipeline state

| ファイル                      | 関数                                                                                                                              | 現状                                                                                                                             | 必要な変更                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/exec-run.ts`             | `runPreparedTask`                                                                                                                 | schedule 由来のタスクを commit → merge → worktree 撤去の順で統合する                                                             | リポジトリごとに commit・merge し、全リポジトリの統合後に撤去する                                   |
| `src/exec-run.ts`             | `finalizeRegisterWorktreeRun`、`commitRegisterWaitState`、`syncExecBranchAfterWait`                                               | register 由来の項目を commit → register review → merge commit 1 件 → 撤去で統合する。失敗時は worktree を残して `waiting` へ戻す | プロダクト先行で統合し、プロジェクト側の merge commit を最後に置く。失敗時に統合済みの範囲を残す    |
| `src/exec-run.ts`             | `resumeRegisterIntegration`、`resumeSingleRegisterItemWorktree`、`prepareScheduleIntegrationResume`、`runResumeMode`              | 統合段を最初から再試行する                                                                                                       | 統合済みのリポジトリを飛ばして、失敗した位置から再開する                                            |
| `src/exec-run.ts`             | `recordIntegrateStage`、`integrateLogPath`                                                                                        | `stages.integrate` 1 つに状態を記録し、`integrate.log` へ失敗を書く                                                              | リポジトリ別の統合状態を記録する                                                                    |
| `src/exec-worktree-ops.ts`    | `mergeWorktreeIntoCurrent`、`isExecBranchMergedIntoCurrent`、`releaseRootWorkingCopies`、`restoreRootWorkingCopies`、`abortMerge` | `currentBranch(context.repoRoot)` へ merge する。統合先はプロジェクトリポジトリの現在のブランチ                                  | プロダクトリポジトリでは宣言した統合先ブランチへ merge する。記帳ファイルの退避はプロジェクト側だけ |
| `src/exec-pipeline-state.ts`  | `PipelineState`、`createPipelineState`、`updatePipelineStage`、`loadPipelineResumeCheckpoint`、`resolveArtifactRef`               | `schema_version: 1`。`stages.integrate` は 1 つで、`artifacts` の参照は 1 つの worktree 相対                                     | リポジトリ別の統合状態を任意項目で加える。旧 state は単一リポジトリとして読む                       |
| `src/exec-register-resume.ts` | `selectResumableRegisterRun`、`resolveRegisterResumeArtifacts`                                                                    | 1 つの worktree の evidence と artifacts から再開候補を選ぶ                                                                      | 全リポジトリの worktree が残っていることを再開の条件に加える                                        |
| `src/exec-run-lock.ts`        | `execRunLockPath`、`acquireExecRunLock`                                                                                           | `execution_path` 単位でプロジェクトの run を排他する                                                                             | 同じプロダクトリポジトリを複数プロジェクトが統合する場合の排他を確かめる                            |

#### 1.2.6. targets・paths の解決と doc index

| ファイル                 | 関数                                                                                         | 現状                                                                                                           | 必要な変更                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `src/specdojo-config.ts` | `SpecDojoProjectConfig`、`isValidProjectConfig`、`loadConfig`、`getProject*Path` 系          | project はプロジェクト文書のパスと `run` だけを持ち、パスは `base_path` を起点に SpecDojo ルート相対で解決する | リポジトリの宣言を加え、検証する。JSON schema と `specdojo-config-reference` も合わせる    |
| `src/register-item.ts`   | `targets` の読み取り                                                                         | 個票の `targets` は doc id の配列                                                                              | リポジトリ付きのパスを書けるようにするか、doc id のままにするかを決める                    |
| `src/exec-register.ts`   | `registerPlanFrontmatter`、`generateRegisterPlan`                                            | 個票の `targets` を plan frontmatter へ写す                                                                    | リポジトリ付きの値を写し、plan 本文にリポジトリの一覧を出す                                |
| `src/job.ts`             | job 定義の検証（`task.paths`・`task.targets`）、`qualifyTargets`、plan 生成（`_JOB_PATHS_`） | `paths` は SpecDojo ルート相対の文字列。`targets` は project で修飾する                                        | `paths` にリポジトリ付きの書式を受け付け、検証する                                         |
| `src/doc-index.ts`       | `loadIndexConfig`、`collectDocIndex`、`buildDocIndex`、`lookupDocIndex`                      | SpecDojo ルートだけを走査し、`.specdojo/doc-index.json` に id とパスを持つ                                     | プロダクト文書を doc id で引くなら、プロダクトリポジトリの走査とリポジトリ付きのパスが要る |

## 2. 検討した選択肢

論点ごとに選択肢を比べ、推奨案を記す。推奨案は調査者の提案であり、決定ではない。決定は「決定内容」に利用者が記入する。

### 2.1. 1 つの項目で複数リポジトリの変更を許すか

| 選択肢 | 内容                                                                                        | 利点                                               | 懸念                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| A      | 禁止する。複数リポジトリに及ぶ項目は分割を求め、検出して警告・拒否する                      | 統合の部分状態が生じない。実装が小さい             | プロダクトの実装とプロジェクト文書（result・設計書）を同じ項目で変える既定の別リポジトリ構成を扱えない |
| B      | プロジェクトリポジトリ 1 つとプロダクトリポジトリ 1 つまで許す                              | v0.3.0 の目的を満たし、部分状態が 1 通りに限られる | 複数プロダクト（[[prj-0001:pjr-p7hy-multi-repo-single-item]]）で作り直しが要る                         |
| C      | N 個のリポジトリを許す設計とし、v0.3.0 はプロジェクト 1 つとプロダクト 1 つで動作を確かめる | 設計を作り直さずに複数プロダクトへ広げられる       | 部分状態の記録と再開を N 個で設計する必要があり、未検証の組み合わせが残る                              |

推奨: C。データ構造（リポジトリの宣言、リポジトリ別の統合状態）は N 個で設計し、v0.3.0 の検証と保証の範囲はプロダクト 1 つに限る。プロダクトが 2 つ以上の構成は、[[prj-0001:pjr-p7hy-multi-repo-single-item]] で実構成を用意するまで警告を出す。理由は、背景の「N 個のリポジトリを扱える設計」に合い、実装の差は統合ループの回数だけで済むためである。A は既定構成の主用途を満たさない。

### 2.2. リポジトリの宣言の場所と形式

| 選択肢 | 内容                                                                                                           | 利点                                                                      | 懸念                                                                                                                 |
| ------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| A      | `specdojo.config.json` の project に `repos` を持たせる（名前・パス・統合先ブランチ・依存導入と build の有無） | プロジェクトごとに分かれ、既存の `projects` と `--project` の仕組みに乗る | 同じプロダクトを複数プロジェクトが参照すると宣言が重複する                                                           |
| B      | `specdojo.config.json` のトップレベルに `repos` を置き、project は名前で参照する                               | 宣言が 1 か所になり、複数プロジェクトで共有できる                         | 参照の解決が 1 段増える。単一プロジェクトの利用者には冗長                                                            |
| C      | `.specdojo/exec-defaults.yaml` に置く                                                                          | exec の設定（親検証など）と同じ場所にまとまる                             | exec-defaults はリポジトリ構成ではなく実行方針の設定で、保護パスでもある。`targets` の解決にも要るため場所が合わない |

推奨: A。項目は `name`（`targets` の接頭辞に使う。`[a-z0-9-]`）、`path`（SpecDojo ルートからの相対パス）、`integration_branch`（省略時はそのリポジトリの現在のブランチ）、`setup`（依存導入と build の有無）とする。プロジェクトリポジトリ自身は暗黙に `name: project`（仮称）として扱い、宣言しない。理由は、`targets` の解決と exec の両方が project 単位で設定を引くためである。複数プロジェクトでの重複は、まず同じ値を書く運用で受け、必要になれば B へ移す。親検証の割り当ては論点「親検証のリポジトリへの割り当て」で扱う。

### 2.3. targets・paths でリポジトリを指定する書式

| 選択肢 | 内容                                                                                    | 利点                                | 懸念                                                                                                     |
| ------ | --------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| A      | `<repo>:<path>`（例: `app1:src/auth/token.ts`）。接頭辞が無ければプロジェクトリポジトリ | 短く、既存の値はそのまま有効        | doc id の `<project-id>:<local-id>` と同じ区切りで、`targets` の値が doc id かパスかを区別する規則が要る |
| B      | オブジェクト形式（`{ repo: app1, path: src/... }`）                                     | 曖昧さが無く、schema で検証しやすい | 個票と job の記述が長くなり、既存の文字列配列と混在する                                                  |
| C      | 別の区切り（例: `app1//src/...`、`@app1/src/...`）                                      | doc id と見分けられる               | 見慣れない書式で、利用者が書き誤りやすい                                                                 |

推奨: A。区別の規則は「接頭辞が宣言済みのリポジトリ名ならパス、それ以外は doc id」とし、リポジトリ名と project id の重複を設定の検証でエラーにする。`targets` はプロダクト側では doc id でなくパスを主に使う。プロダクト文書を doc id で引くための doc index の拡張は v0.3.0 では行わず、パス指定に限る。理由は、既存の値を変えずに済み、PJR-HQBK の概要が挙げる書式とも一致するためである。

### 2.4. worktree の配置と agent の作業ディレクトリ

| 選択肢 | 内容                                                                                                           | 利点                                                              | 懸念                                                                                            |
| ------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| A      | `<worktree_base>/<task-id>/<repo>/` にリポジトリごとの worktree を置く。agent の `cwd` は `<task-id>/project/` | タスクの範囲が 1 つのディレクトリにまとまり、撤去と孤児検出が単純 | 既存の `<worktree_base>/<task-id>/` の直下配置と変わり、手動運用の手順や記憶済みのパスが変わる  |
| B      | プロジェクト worktree は現行の `<task-id>/` のまま、プロダクトは `<task-id>--<repo>/` に並べる                 | 単一リポジトリ構成の配置が変わらない                              | タスクの worktree が散らばり、撤去漏れを検出しにくい                                            |
| C      | agent の `cwd` を `<task-id>/` 親ディレクトリにする                                                            | agent から全リポジトリが相対パスで見える                          | 親ディレクトリは Git リポジトリでないため、provider の設定・指示ファイル・hook が読み込まれない |

推奨: A を、宣言したリポジトリがある project に限って使う。宣言が無い project は現行の `<task-id>/` 直下の配置を保つ。agent の `cwd` はプロジェクト worktree とし、プロダクト worktree は provider の追加ディレクトリと環境変数（例: `SPECDOJO_REPO_APP1`）で渡す。理由は、`cwd` をプロジェクト側に置けば plan・result・指示ファイルの読み込みが現行のまま働き、書き込み許可だけを広げれば済むためである。C は provider の設定が効かなくなるため採らない。

### 2.5. 統合の順序と、統合済みの範囲の記録・再開の位置

| 選択肢 | 内容                                                                                                                                     | 利点                                                                                  | 懸念                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| A      | 宣言順にプロダクトを統合し、プロジェクトを最後に統合する。統合済みのリポジトリと commit を pipeline state に記録し、失敗位置から再開する | 部分状態が「プロダクトの一部だけ統合済み」に限られ、result はすべての統合後に確定する | プロダクトが統合済みでプロジェクトが未統合の間、プロダクト側に記帳の無い commit が残る |
| B      | プロジェクトを先に統合し、プロダクトを後に統合する                                                                                       | 記帳が先に残る                                                                        | 記帳が実装より先に `review` を示し、プロダクト側の失敗を記帳と食い違ったまま残す       |
| C      | 全リポジトリを統合前に検査し（dry-run と fast-forward 可否）、まとめて統合する                                                           | 失敗の多くを統合前に検出できる                                                        | Git は複数リポジトリの原子的な更新を持たず、最終段の失敗は残る                         |

推奨: A に C の事前検査を加える。統合前に全リポジトリで commit 対象の算出と merge 可否を確かめ、その後に宣言順でプロダクト、最後にプロジェクトを統合する。pipeline state には `stages.integrate` の下にリポジトリ別の状態（`repos.<name>.status`・`commit`・`merged_at` など。キー名は仮称）を任意項目で加える。再開は、統合済みのリポジトリを `isExecBranchMergedIntoCurrent` 相当の確認で飛ばす。理由は、[[prj-0001:pjr-qhka-docs-structure-detached-unit]] がソース先行とした結論と一致し、部分状態を 1 方向に限れるためである。

### 2.6. 部分状態での `item_status`

| 選択肢 | 内容                                                                                 | 利点                                                    | 懸念                                                                      |
| ------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| A      | 統合が途中で失敗したら `waiting` に戻し、`block_reason` に統合済みのリポジトリを書く | 現行の統合失敗と同じ遷移で、schema の enum を増やさない | `waiting` だけでは部分統合と未着手の失敗を一覧で見分けにくい              |
| B      | `in-progress` のまま残す                                                             | 統合の再開を作業の継続として扱える                      | run が止まっていることが状態に現れず、放置を検出しにくい                  |
| C      | 部分統合を表す新しい `item_status` を加える                                          | 一覧で区別できる                                        | register の schema・遷移・生成ビューの変更が大きく、v0.3.0 の範囲を超える |

推奨: A。`block_reason` は統合済みのリポジトリと未統合のリポジトリを含めた定型文とし、詳細は pipeline state と `integrate.log` を正本とする。理由は、現行の `finalizeRegisterWorktreeRun` が統合失敗で `waiting` に戻しており、再開手段も同じ（`exec run --register` の再開）で済むためである。

### 2.7. 親検証のリポジトリへの割り当て

| 選択肢 | 内容                                                                                                                 | 利点                                                | 懸念                                                                                  |
| ------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| A      | `pipeline.parent_validations` の要素に `{ id, repo }` の形を許し、文字列だけの要素はプロジェクトリポジトリで実行する | 既存の設定がそのまま動き、割り当てが 1 か所で読める | exec-defaults がリポジトリ名を知る必要がある                                          |
| B      | リポジトリの宣言（`specdojo.config.json`）に、そのリポジトリで実行する親検証 ID を持たせる                           | リポジトリの性質と検証がまとまる                    | 親検証の有効化は exec-defaults、割り当ては config と 2 か所に分かれる                 |
| C      | 変更があったリポジトリでのみ、全 ID を実行する                                                                       | 設定が要らない                                      | プロダクトに無い npm script（`lint:fm` など）が失敗し、検証の意味がリポジトリで異なる |

推奨: A。変更の無いリポジトリに割り当てた検証は省略せず実行する（統合先の破損を検出するため）。固定 ID と固定 argv の許可リストは維持し、プロダクト側で npm script 名が異なる場合への対応（ID の追加など）は PJR-V96B で扱う。理由は、exec-defaults が保護パスであり、agent が割り当てを変えられない場所に置けるためである。

### 2.8. プロダクト側の commit への Refs の付与

| 選択肢 | 内容                                                                                            | 利点                                   | 懸念                                                                                          |
| ------ | ----------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| A      | runner がプロダクト側の commit と merge commit の両方に `Refs: <project-id>:<item-id>` を付ける | 追跡が確実で、agent の記述に依存しない | プロダクト側の commit message 規約（Conventional Commits など）と並べる書式を決める必要がある |
| B      | merge commit だけに付ける                                                                       | 付与箇所が 1 つで済む                  | fast-forward や squash で merge commit が残らない運用では追跡が切れる                         |
| C      | agent に付けさせる                                                                              | runner の変更が要らない                | 付け忘れを防げない                                                                            |

推奨: A。PJR-1SXK の決定（`<project-id>:<item-id>`）に従う。現行の `finalizeRegisterWorktreeRun` はプロジェクト側の merge commit に `Refs: ${item.id}` を修飾なしで付けているため、プロジェクト側も同時に修飾形へ直す。result の trace 表への commit の記録は PJR-30SW で扱う。

### 2.9. 既存の単一リポジトリ構成との互換性

- リポジトリの宣言が無い project は、現行と同じ 1 ルート・1 worktree・`<worktree_base>/<task-id>/` 直下の配置で動かす。宣言が有る project だけ新しい配置を使う。
- `targets`・`paths` の接頭辞が無い値は、プロジェクトリポジトリの doc id またはパスとして現行どおり解決する。
- `pipeline.parent_validations` の文字列だけの要素は、プロジェクトリポジトリで実行する。
- pipeline state のリポジトリ別の項目は任意とし、`schema_version: 1` の旧 state はプロジェクトリポジトリ 1 つの統合として読む。
- 同一リポジトリ構成（文書とソースが同じリポジトリ）は宣言を持たないため、上記により変化しない。PJR-69VP の統合テストに、宣言の無い構成の回帰を含める。

### 2.10. todo の分担と実施順

推奨案に沿うと、PJR-HQBK・PJR-98G4・PJR-V96B・PJR-0WAA・PJR-30SW・PJR-69VP の分担は概要のとおりで妥当である。実施順は次を提案する。

1. PJR-HQBK（宣言と `targets`・`paths` の解決）。他の todo がすべて宣言を参照する。
2. PJR-98G4（複数 worktree と agent の作業ディレクトリ）。provider ごとの追加ディレクトリの対応確認を最初に行う。
3. PJR-V96B（親検証の割り当て）と PJR-0WAA（統合と再開）。どちらも 2 の worktree に依存し、互いには独立なので並行できる。
4. PJR-30SW（Refs と trace）。0WAA の統合段の中で commit message を組むため、その後に行う。
5. PJR-69VP（実構成検証と文書）。

分担への変更の提案は次の 2 点である。

- 保護設定と Git 状態の検査（`src/exec-agent-protected-config.ts`、`src/exec-agent-git-state.ts`）、および evidence の変更記録（`src/exec-evidence.ts`）の担当が概要に無い。agent 実行の前後で行う検査のため、PJR-98G4 に含めることを提案する。
- プロジェクト側の merge commit の `Refs:` を修飾形へ直す作業は、PJR-1SXK のフォローアップとして PJR-30SW に含めることを提案する。

## 3. 決定内容

「検討した選択肢」の推奨案を採択する。ただし論点 2.1. は推奨案を変更し、N 個のリポジトリを v0.3.0 で実装・保証する。

- 2.1. 複数リポジトリの変更: 1 つの項目で N 個のリポジトリ（プロジェクトリポジトリ 1 つとプロダクトリポジトリ N 個）の変更を許す。v0.3.0 でプロダクトが 2 つ以上の構成も実装・検証し、警告は出さない。
- 2.2. 宣言: `specdojo.config.json` の project に `repos` を置き、`name`・`path`・`integration_branch`・`setup` を持たせる。プロジェクトリポジトリ自身は宣言しない。
- 2.3. 書式: `targets`・`paths` は `<repo>:<path>`（例: `app1:src/auth/token.ts`）とする。接頭辞が宣言済みのリポジトリ名ならパス、それ以外は doc id とし、リポジトリ名と project id の重複は設定の検証でエラーにする。プロダクト側は v0.3.0 ではパス指定に限る。
- 2.4. worktree: 宣言を持つ project だけ `<worktree_base>/<task-id>/<repo>/` に配置する。agent の `cwd` はプロジェクト worktree とし、プロダクト worktree は provider の追加ディレクトリと環境変数で渡す。
- 2.5. 統合: 全リポジトリで commit 対象の算出と merge 可否を事前に確かめ、宣言順にプロダクト、最後にプロジェクトを統合する。リポジトリ別の統合状態を pipeline state に任意項目で記録し、統合済みのリポジトリを飛ばして失敗位置から再開する。
- 2.6. 部分状態: 統合が途中で失敗したら `waiting` に戻し、統合済みと未統合のリポジトリを `block_reason` に書く。
- 2.7. 親検証: `pipeline.parent_validations` の要素に `{ id, repo }` を許し、文字列だけの要素はプロジェクトリポジトリで実行する。割り当てたリポジトリに変更がなくても実行する。
- 2.8. Refs: runner がプロダクト側の commit と merge commit の両方に `Refs: <project-id>:<item-id>` を付ける。プロジェクト側の merge commit の `Refs:` も修飾形へ直す。
- 2.9. 互換性: 宣言を持たない project は現行どおりに動く。
- 2.10. 実施順: PJR-HQBK → PJR-98G4 → PJR-V96B と PJR-0WAA（並行可）→ PJR-30SW → PJR-69VP。保護設定・Git 状態の検査と evidence の変更記録は PJR-98G4、プロジェクト側の merge commit の `Refs:` の修飾は PJR-30SW に含める。

## 4. 採択理由

- 推奨案の理由は「検討した選択肢」の各論点に記載したとおりである。
- 論点 2.1. を N 個の保証へ変更したのは、データ構造を N 個で設計する以上、統合ループと再開の検証を 1 つに限る理由が薄く、v0.3.0 の公開時点で複数プロダクトの構成を制約なく使えるようにするためである（利用者の判断）。これにより [[prj-0001:pjr-p7hy-multi-repo-single-item]] の論点も本決定と todo で扱う。

## 5. 承認

| 項目     | 内容                                                                  |
| -------- | --------------------------------------------------------------------- |
| 決定者   | 利用者（orchestrator が示した推奨案を承認し、論点 2.1. のみ変更した） |
| 決定日   | 2026-10-01                                                            |
| 承認方式 | commit                                                                |
| 証跡     | 本個票を close する commit                                            |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `specdojo.config.json` の schema、exec の worktree・agent 起動・commit 対象・親検証・統合・再開、`docs-structure-guide` |
| 必要な対応 | 追跡先の todo を実施順に進める。PJR-0WAA と PJR-69VP はプロダクトが 2 つ以上の構成と失敗位置ごとの再開を含める          |
| 追跡先     | PJR-HQBK、PJR-98G4、PJR-V96B、PJR-0WAA、PJR-30SW、PJR-69VP、PJR-P7HY                                                    |

## 7. 関連ドキュメント

- [[prj-0001:pjr-fzc4-multi-repo-design-investigation]]: 本個票の調査と選択肢の比較。
- [[prj-0001:pjr-p7hy-multi-repo-single-item]]: 複数プロダクトの論点。
- [[prj-0001:pjr-qhka-docs-structure-detached-unit]]: 別リポジトリ構成の整理とソース先行の統合順序。
- [[prj-0001:pjr-1sxk-refs-trailer-project-qualified-id]]: `Refs:` trailer の書式の決定。
- [[prj-0001:pjr-hqbk-multi-repo-config-resolution]]、[[prj-0001:pjr-98g4-multi-repo-worktree-agent]]、[[prj-0001:pjr-v96b-multi-repo-parent-validations]]、[[prj-0001:pjr-0waa-multi-repo-integration-resume]]、[[prj-0001:pjr-30sw-multi-repo-refs-trace]]、[[prj-0001:pjr-69vp-multi-repo-e2e-docs]]: 追跡先の todo。
- [[specdojo:docs-structure-guide]]: 「現行実装の境界」の記載先。
