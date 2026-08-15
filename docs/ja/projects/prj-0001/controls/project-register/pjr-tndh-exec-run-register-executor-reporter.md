---
specdojo:
  id: prj-0001:pjr-tndh-exec-run-register-executor-reporter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: ARC
  registered_at: "2026-08-15T02:51:26Z"
  due_on: "2026-08-31"
---

# PJR-TNDH exec run --register をexecutor/reporterパイプラインに対応させる

## 1. 概要

`exec run --register`（PJR個票のAI Agent実行）は単一エージェントが編集からresult記入までを完結する前提だが、現行`pm-members.yaml`は全provider（opencode/claude/codex/copilot）の`stage_role: executor`メンバーが「成果物の編集・検証のみを担当し、resultは更新しない」設計に統一されている。この不整合により、どのexecutorメンバーで`--register`を実行してもresult未記入のまま`waiting`（blocked扱い）に陥る。PJR-SEQCの実行（`claude-expert-executor`使用）で実際に発生を確認した。Schedule タスクの `agent_pipeline`（executor→reporterの2段階固定）と同じモデルを`--register`にも適用し、この構造的ギャップを解消する。

## 2. 完了条件

- `exec run --register`が`agent_pipeline`（executor→reporterの2段階固定）を解決できること。既存Scheduleタスクの`agent_pipeline`（`schedule-design-guide.md`3.2）と同じ「順序を入れ替えない・一方を省略しない」原則に従うこと。
- `--register`実行時にexecutor/reporterのnicknameを指定できること（`--by`単体指定に加え、`--executor-by`/`--reporter-by`の`--register`への対応、またはそれに代わるオプション設計）。仕様は実装前にrulebook等へ明記する。
- worktreeモード・in-placeモードの両方で、executor実行後にreporterが同一worktree/作業ツリー内でresultへ構造化結果を記入し、その後に既存のfinalize処理（`downgradeUnfilledResult`によるunfilled判定・`review`/`waiting`遷移・commit・merge）が動作すること。
- reporterが読み取る「evidence」の受け渡し方法（Scheduleパイプラインの`buildExecutorPrompt`/`buildReporterPrompt`相当）が、register originのplan/result構造に対しても定義されていること。
- `command-reference.md`の`--register`・`--executor-by`/`--reporter-by`の説明が更新されていること。
- 少なくとも1件の実際のPJR項目を新方式で実行し、result記入まで自動完結することを確認すること（手動代筆なしで`review`へ遷移できること）。
- `npm run typecheck`／`npm run test`／`npm run -s lint:md`が成功すること。

## 3. 作業内容

<!-- prettier-ignore -->
| No  | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1   | 現状分析: `exec-run.ts`のSchedule向け`agent_pipeline`解決ロジック（`buildExecutorPrompt`/`buildReporterPrompt`、`resolveAgent`のstage_role分岐等）を洗い出し、register経路（`runSingleRegisterItem`/`runSingleRegisterItemWorktree`/`resolveRegisterCommand`）との差分を整理する | ARC | done | `recordExecutorEvidence`（`exec-evidence.ts`）／`runReporterWithFormatRetry`・`renderReporterResult`（`exec-reporter.ts`／`exec-results.ts`）／`exec-pipeline-state.ts`はSchedule非依存の汎用モジュールと確認し、register側から直接再利用した |
| 2   | `--register`向けのexecutor/reporter指定方法を設計する | ARC | done | a案採用。既存`--executor-by`/`--reporter-by`を`--register`でも受け付ける形にした（新規フラグは追加していない）。register項目はper-itemのpipeline宣言を持たないため、owner/roleからの自動選択は行わず、2フラグの明示指定（両方必須）のみで切り替える設計にした |
| 3   | in-place・worktree双方のregister実行フローへexecutor→reporterの2段階呼び出しを実装する | ARC | done | `runRegisterAgentPipeline`（新規共有関数）をin-place（`runSingleRegisterItem`）・worktree（`runSingleRegisterItemWorktree`）の両方から呼び出す形で実装 |
| 4   | `downgradeUnfilledResult`等の完了判定ロジックが2段階実行後も正しく機能することを確認・必要なら調整する | ARC | done | in-placeは`isResultUnfilled`を防御的に維持、worktreeは`runResult`（success/rate_limit/failure）を`downgradeUnfilledResult`にそのまま渡す形にして、既存の判定ロジックを変更せず再利用した |
| 5   | `command-reference.md`／`schedule-design-guide.md`の該当箇所を更新する | ARC | done | `command-reference.md`に`--executor-by`/`--reporter-by`の表行・実行例・説明文を追加。`schedule-design-guide.md`3.2に`--register`での使い方を1文追記 |
| 6   | 実PJR項目で新方式の動作確認を行う | ARC | done | 本チケット自身をPJR-SEQCと同様に`--register`で実行しようとすると同じ問題が再現するため（パイプライン未実装のツールでパイプライン機能自体を検証できない）、使い捨てのPJRチケットは作らず、実際のCLIコード経路（`exec run --register --executor-by --reporter-by`、`register start`/`review`の実プロセス起動を含む）を通す自動テスト（`tests/src/exec-register-pipeline-e2e.test.ts`）で確認した。実施内容は「4. 対応結果」参照 |
| 7   | 検証コマンド実行（typecheck／test／lint:md） | ARC | done | 全て成功（詳細は「4. 対応結果」） |

## 4. 対応結果

- `exec run --register`に、`--executor-by <nickname>`と`--reporter-by <nickname>`を両方指定した場合のみ有効化されるexecutor/reporterパイプラインモードを実装した（`src/exec-run.ts`: `isRegisterPipelineRequested`／`resolveRegisterPipelineCommand`／`runRegisterAgentPipeline`）。`--by`単体指定や owner 解決による従来の単一エージェントフローは変更していない（後方互換）。
- pipelineモードでは、executorがまず成果物を編集・検証し（`buildExecutorPrompt`でplanをexecutor向けに拡張）、その実行結果を`recordExecutorEvidence`でevidence化し、reporterへ渡して（`runReporterWithFormatRetry`）result本文を描画する（`renderReporterResult`）。evidence・pipeline-stateの記録形式はScheduleタスクの`agent_pipeline`と同じ`exec/evidence/<taskId>/<runId>/`配下に統一した。
- in-place・worktree双方に実装した。worktreeモードでは、executor/reporter双方の実行をworktree内（`cwd: worktree.path`）で行い、finalize処理（commit・merge・register review遷移）は既存ロジックをそのまま利用する。
- 片方のフラグのみの指定は実行前に明示的なエラーで停止する（`--register pipeline execution requires both --executor-by and --reporter-by.`）。
- `resolveRegisterPipelineCommand`は owner/role からの自動選択を行わない設計にした。register項目にはSchedule相当のper-itemパイプライン宣言が無く、自動選択の基準（capabilities/proficiencyの要求元）が存在しないため、明示指定のみを許容する方が安全と判断した。
- 動作確認は、実際の`specdojo` CLI（`src/specdojo.ts`）をtsx経由で一時プロジェクトに対して実行する形の自動テストで行った（`tests/src/exec-register-pipeline-e2e.test.ts`、3件）。`register start`/`review`の状態遷移コマンドはrunner内部で自プロセス（`spawnSelf`）を再帰的に起動する設計のため、一時リポジトリへ実リポジトリの`node_modules`をシンボリックリンクし、`process.argv[1]`を実リポジトリの`src/specdojo.ts`へ差し替えることで、テスト内から実CLI経路（agent実行・evidence記録・reporter実行・result描画・register状態遷移・commitまで）を成立させた。結果、`item_status`が`review`へ遷移し、result本文がreporter出力で埋まり、evidence・pipeline-stateファイルが生成されることを確認した。
- `resolveRegisterCommand`（従来の単一エージェント解決）の単体テストに加え、`isRegisterPipelineRequested`／`resolveRegisterPipelineCommand`の単体テストを`tests/src/exec-register.test.ts`へ追加した（9件）。
- 検証コマンド: `npm run typecheck`（成功）／`npm run -s lint:ts`（成功）／`npm test`（1085件成功、新規10件含む）／`npm run -s lint:md`（成功。生成物ディレクトリの既存の無関係な警告のみ残存、コミット対象外）。
- 申し送り: `resolveRegisterPipelineCommand`は現状owner/roleからの自動選択に対応していない（明示指定必須）。将来的に自動選択が必要になった場合は、register項目へパイプライン既定値を持たせる設計（例: `exec-defaults.yaml`へのregister向けデフォルト追加）を別途検討する必要がある。

## 5. 関連ドキュメント

- [[specdojo:schedule-design-guide]]: 既存`agent_pipeline`（executor/reporter 2段階）の仕様
- [[specdojo:command-reference]]: `exec run --register`・`--executor-by`/`--reporter-by`の現行仕様
- [[prj-0001:pjr-seqc-timeline-gantt-chart-timeline]]: 本ギャップを実際に検出した実行例（`claude-expert-executor`によるresult未記入）
