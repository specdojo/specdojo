---
specdojo:
  id: prj-0001:xer-pjr-nwpc-20260808t061145z-f2d9
  type: exec-result
  task_id: PJR-NWPC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-nwpc-20260808T061145Z-f2d9-plan.md
  started_at: "2026-08-08T06:12:05.895Z"
  completed_at: "2026-08-08T06:16:54.785Z"
  agent: claude-expert-edit-agent
---

# Edit Result

## 1. 実施内容

PJR-NWPC「register whereのエラー出力をstderrへ分離する」に対応した。

- 個票 [[prj-0001:pjr-nwpc-register-where-stderr|PJR-NWPC register whereのエラー出力をstderrへ分離する]] の完了条件を作業基準とした。
- `register where` は成功時のパスを stdout へ書き、その stdout を `register:sync-pull` / `register:sync-push` が `git -C "$(... register where --integration)"` のコマンド置換で消費する。従来はエラー時も共通の `printCommandError` で stdout へ書いていたため、統合ブランチ worktree 未用意時にエラー文字列が `git -C` のパス引数へ混入し、git の `cannot change to directory` という分かりにくい二重エラーになっていた。
- 対応として `src/register.ts` に `register where` 専用の `printWhereError` を新設し、エラーメッセージを `process.stderr` へ書くよう変更した。`register where` の `catch` を `printCommandError` から `printWhereError` に差し替えた。成功時のパス出力（stdout）とエラー出力（stderr）が分離され、コマンド置換で消費されるのは正しいパスのみになる。
- 他の `register` サブコマンドは従来どおり `printCommandError`（stdout 出力）のままとし、変更を `register where` のみに限定した。
- `tests/src/register-reserve.test.ts` に `printWhereError` の単体テストを追加し、エラーが stderr へ書かれ stdout を汚さないこと、`process.exitCode` が 1 になることを検証した。統合 worktree 未用意時に投げられるエラーメッセージ自体は、既存の `resolveIntegrationWorktree` のテスト（`No worktree is checked out ...`）でカバーされている。
- `docs/ja/specdojo/references/command-reference.md` に、`register where` がエラーを stderr へ分離する旨を追記した。
- 検証コマンドと結果:
  - `npx vitest run tests/src/register-reserve.test.ts` → 21 passed。
  - `npm run -s typecheck` → エラーなし。
  - `npm run -s lint:ts` → エラーなし。
  - `npx prettier --write` / `npx markdownlint`（command-reference.md・個票）→ エラーなし。

## 2. 変更ファイル

- `src/register.ts`（`printWhereError` 新設、`register where` の catch を差し替え）
- `tests/src/register-reserve.test.ts`（`printWhereError` の単体テスト追加）
- `docs/ja/specdojo/references/command-reference.md`（stderr 分離の説明追記）
- `docs/ja/projects/prj-0001/controls/project-register/pjr-nwpc-register-where-stderr.md`（作業内容の状態と対応結果を更新）

## 3. 申し送り

- npm script（`register:sync-pull` / `register:sync-push`）経由の統合 worktree 未用意時の挙動は、`printWhereError` の stdout 非汚染を単体テストで担保したうえで論理的に確認した。実 git を起動する統合テストは既存方針（`where` は subprocess CLI テスト未整備）に合わせて追加していない。実環境での二重エラー解消を最終確認したい場合は、統合ブランチ worktree を外した状態で `npm run register:sync-pull` を手動実行して確認するとよい。

## 4. 実践の型の活用

- approach は `retrofit`（既存実装の挙動修正）として進めた。参照した実装パスは `src/register.ts` の `printCommandError`（1238行付近）・`register where` アクション（`whereCmd`, 1823行付近）・`resolveIntegrationWorktree`（1052行付近）、および `package.json` の `register:sync-pull` / `register:sync-push`（51–52行）。
- 抽出した現在動作: `register where` は成功時にパスを stdout へ書き、エラー時は共通 `printCommandError` で stdout へ書く。この stdout がコマンド置換で `git -C` の引数に渡る。
- 新設判断: 既存の `printCommandError`（他サブコマンドが依存）には手を加えず、`register where` 専用の `printWhereError` を新設して stderr 出力に切り替えた。これにより完了条件「他の register サブコマンドの慣例に影響を与えない」を満たしつつ、where のみを変更範囲に限定した。個票のメモ（`printCommandError` を流用せず専用のエラー処理にするか要検討）に沿った判断である。
- 未確認範囲: 実 git プロセスを起動する end-to-end の二重エラー再現は未実施（申し送りに記載）。参照範囲から外れる rulebook との矛盾は生じなかった（本タスクは実装修正で、対象 plan の `rulebook: none`）。
