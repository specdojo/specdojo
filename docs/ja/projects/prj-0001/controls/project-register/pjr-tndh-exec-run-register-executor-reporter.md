---
specdojo:
  id: prj-0001:pjr-tndh-exec-run-register-executor-reporter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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
| 1   | 現状分析: `exec-run.ts`のSchedule向け`agent_pipeline`解決ロジック（`buildExecutorPrompt`/`buildReporterPrompt`、`resolveAgent`のstage_role分岐等）を洗い出し、register経路（`runSingleRegisterItem`/`runSingleRegisterItemWorktree`/`resolveRegisterCommand`）との差分を整理する | ARC | open | 対象: `src/exec-run.ts` |
| 2   | `--register`向けのexecutor/reporter指定方法を設計する（CLIフラグ／`exec-defaults.yaml`のデフォルト指定／既存`--executor-by`・`--reporter-by`の`--register`対応拡張、のいずれか） | ARC | open | a案（pipeline対応）を採用する前提で設計する |
| 3   | in-place・worktree双方のregister実行フローへexecutor→reporterの2段階呼び出しを実装する | ARC | open | worktree内でreporter実行→result反映→finalize、の順序を守る |
| 4   | `downgradeUnfilledResult`等の完了判定ロジックが2段階実行後も正しく機能することを確認・必要なら調整する | ARC | open | - |
| 5   | `command-reference.md`／`schedule-design-guide.md`の該当箇所を更新する | ARC | open | - |
| 6   | 実PJR項目（本チケット自身の後続タスクなど、小粒なもの）で新方式の動作確認を行う | ARC | open | - |
| 7   | 検証コマンド実行（typecheck／test／lint:md） | ARC | open | - |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:schedule-design-guide]]: 既存`agent_pipeline`（executor/reporter 2段階）の仕様
- [[specdojo:command-reference]]: `exec run --register`・`--executor-by`/`--reporter-by`の現行仕様
- [[prj-0001:pjr-seqc-timeline-gantt-chart-timeline]]: 本ギャップを実際に検出した実行例（`claude-expert-executor`によるresult未記入）
