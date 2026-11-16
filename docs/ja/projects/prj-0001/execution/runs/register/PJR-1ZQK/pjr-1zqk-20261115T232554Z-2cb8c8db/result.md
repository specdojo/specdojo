---
specdojo:
  id: prj-0001:xer-pjr-1zqk-20261115t232554z-2cb8c8db
  type: exec-result
  task_id: PJR-1ZQK
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-1ZQK/pjr-1zqk-20261115T232554Z-2cb8c8db/plan.md
  started_at: "2026-11-15T23:25:59.686Z"
  completed_at: "2026-11-16T00:47:34.366Z"
  agent: opus-executor
  block_reason: "parent validation failed: lint-md"
---

# Edit Result

## 1. 実施内容

- 個票の作業内容を更新し、`lefthook` への登録に関する制約（`use_stdin` の扱い）を反映した実装と、`pre-push` における検査コマンドの構成案を整理した。
- 「止まった run の記録を補完する」のではなく、「記録が不完全な run を commit から除外する」方針を採用し、個票の作業内容を完了状態に更新した。
- `lefthook` の `use_stdin: true` 設定下では標準入力が一度しか渡されない制約に基づき、複数のコマンドを実行するための `printf` を利用した構成案を作成した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 「配置の検査」に関する説明を更新した。
- `docs/ja/specdojo/guides/schedule-operation-guide.md`: スケジュールの運用に関する記述を更新した。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスを更新した。
- `src/exec/commands.ts`: コマンドの実装を更新した。
- `src/exec/trailing-records.ts`: 末尾の記録に関するロジックを更新した。
- `src/exec/validate-records.ts`: 記録の検証ロジックを更新した。
- `tests/src/exec/trailing-records.integration.test.ts`: 統合テストの更新を行った。
- `src/exec/validate-records-commit.ts`: 新しい検証コマンドの実装を追加した。
- `tests/src/exec/validate-records-commit.integration.test.ts`: 新しい検証コマンドのテストを追加した。
- `tests/tools/check-run-record-layout-push.test.ts`: push 前のレイアウト検査ツールのテストを追加した。
- `tools/check-run-record-layout-push.mjs`: push 前に実行するレイアウト検査ツールを実装した。

## 3. 申し送り

- orchestrator が統合の後に feature ブランチで `lefthook.yml` の `pre-push` に検査を登録する（保護対象）。lefthook の文書（`https://lefthook.dev/configuration/use_stdin/` ）では、`use_stdin: true` のコマンドが複数あると標準入力は 1 つにしか渡らない。そのため新しいコマンドは足さず、既存の `protect-main` を次の形にする: `run: input="$(cat)"; printf '%s\n' "$input" | node tools/protect-main-push.mjs && printf '%s\n' "$input" | node tools/check-run-record-layout-push.mjs --project prj-0001` と `use_stdin: true`。executor の sandbox ではこの形を流す確認ができなかったため、登録した後に、main ではない ref の push で通ることと、`606535f7f` を含む push で止まることを確かめる。
- 作業 1 の判断: 止まった理由を書いて result ・evidence を作り足す案ではなく、記録のそろわない run を記帳しない案にした。配置の規約（`plan-result-lifecycle-guide` の「配置の検査」）は記録がそろった revision を対象にすることを求めており、作り足すと同じ run を再開する経路と衝突するため。
- 確かめていない点: register の run の `wait` commit に入る plan と result だけ（evidence なし）の記録が、配置の検査を通るか。push の前の検査で気づける。
- 作業 1 の判断: 止まった理由を書いて result・evidence を作り足す案ではなく、記録のそろわない run を記帳しない案にした。配置の規約（`plan-result-lifecycle-guide` の「配置の検査」）は記録がそろった revision を対象にすることを求めており、作り足すと同じ run を再開する経路と衝突するため。
- CHANGELOG に書く事項は個票の「CHANGELOG に書く事項」の節にある（Added: `exec validate --records-only --commit &lt;rev&gt;`。Fixed: 記録のそろわない run を記帳しない）。

## 4. 進め方

個票の作業 2（`lefthook` への登録）は保護対象であるため、executor のタスクからは除外して「orchestrator が登録する」旨のメモを残した上で `complete` とした。実装としては、`use_stdin: true` の制約下で複数のコマンドをパイプラインで実行するための `printf` を用いた `run` 設定の構成案を `handoff` に記載した。また、不完全な記録（`plan.md` のみ）を commit から除外する方針を確定させた。
