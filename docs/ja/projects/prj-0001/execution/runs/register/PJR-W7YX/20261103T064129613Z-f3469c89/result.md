---
specdojo:
  id: prj-0001:xer-pjr-w7yx-20261103t064129z-6556fe42
  type: exec-result
  task_id: PJR-W7YX
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-W7YX/20261103T064129613Z-f3469c89/plan.md
  started_at: "2026-11-03T06:41:30.543Z"
  completed_at: "2026-11-03T06:56:10.344Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- checkpoint の commit が失敗した場合に、index に載った（staged な）ファイルが残ってしまう問題を解消しました。
- `src/shared/git.ts` に、指定したパスのみを扱う `commit` や `amend` のためのヘルパー関数を追加し、共有の Git 操作基盤を強化しました。
- `src/exec/worktree-ops-commit.ts` と `src/exec/worktree-ops-lifecycle.ts` を修正し、commit 失敗時に対象ファイルのみを `unstage` する後始末処理を導入しました。
- `src/register/register.ts` における `register --commit` の挙動を、対象となる個票とイベントのみを明示的に指定して commit するよう変更し、余計な staged 変更の巻き込みを防止しました。
- `tests/src/exec/worktree-ops.integration.test.ts` および `tests/src/register/commit.integration.test.ts` に、失敗時の unstage 処理や `--only` 指定による commit 動作を検証する統合テストを追加しました。
- `docs/ja/specdojo/guides/register-operation-guide.md` および `CHANGELOG.md` を更新し、運用上の変更点を記録しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 変更内容の記録として、本タスクによる修正を追記しました。
- `docs/ja/specdojo/guides/register-operation-guide.md`: register 操作における commit 失敗時の挙動や、パス指定による commit の仕様について追記しました。
- `src/exec/worktree-ops-commit.ts`: checkpoint の commit 失敗時に、staged になっているファイルを unstage する後始末処理を実装しました。
- `src/exec/worktree-ops-lifecycle.ts`: worktree のライフサイクル管理における commit 失敗時のリカバリ処理を更新しました。
- `src/register/register.ts`: `register --commit` 実行時に、対象の個票やイベントファイルを明示的に指定して commit するよう変更しました。
- `src/shared/git.ts`: 特定のファイルのみを対象とする `commit` や `amend` を実行するためのヘルパー関数を追加しました。
- `tests/src/exec/worktree-ops.integration.test.ts`: commit 失敗後の unstage 処理の正確性を検証するテストケースを追加しました。
- `tests/src/register/commit.integration.test.ts`: `register --commit` が指定したファイルのみを正確に扱うことを検証するテストケースを追加しました。

## 3. 申し送り

- 判断: 無関係な staged 変更がある場合もパス指定で commit し、既存 index と作業ツリーを保持します。
- 型検査・lint・unit／integration テストは指定済みの親 runner 検証に委ねました。統合後は運用メモに従い PJR-JSEY で runner の実動作を確認してください。
- 判断: 無関係な staged 変更がある場合もパス指定で commit し、既存 index と作業ツリーを保持する。対象個票・event 自体に開始前の変更がある場合は従来どおり停止する。
- 型検査・lint・unit／integration テストは指定済みの親 runner 検証に委ねた。統合後は運用メモに従い PJR-JSEY で runner の実動作を確認する。

## 4. 進め方

まず `src/shared/git.ts` に、特定のファイル群を確実に commit または amend できる低レベルな関数を実装しました。次に、`worktree-ops-commit.ts` において、commit が失敗した際に `git reset` を用いて、staged に残ってしまったファイルを unstage する後始末処理を追加しました。最後に、`register --commit` が周囲の未コミットな変更を巻き込まないよう、扱うべきファイルパスを明示的に指定するロジックへと変更しました。これらの変更を統合テストによって検証しています。
