---
specdojo:
  id: prj-0001:xer-pjr-yq32-20261124t053738z-8ac12ff0
  type: exec-result
  task_id: PJR-YQ32
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-YQ32/pjr-yq32-20261124T053738Z-8ac12ff0/plan.md
  started_at: "2026-11-24T05:37:39.428Z"
  completed_at: "2026-11-24T05:51:46.090Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- 準備の段で失敗した run が変更範囲の予約を残す問題に対し、準備失敗時に予約を解放するようにした。
- register と schedule の両経路が共用する予約ディレクトリから、古い予約を回収する処理を追加した。未着手で exec worktree と予約 lock がない予約だけを回収し、時間閾値は設けない。
- 回帰テストと関連文書（システム設計、運用ガイド、コマンドリファレンス）を更新した。
- runner の親検証では `npm run test:unit` が失敗している。失敗箇所は `tests/src/exec/run/track-filter.test.ts` の 191 行目付近で、この変更との関係は evidence からは確認できない。他の親検証は passed または `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-critical-flows.md`: 準備失敗時の予約解放と古い予約の回収を、重要フローの記述に反映した。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 予約が残った場合の自動回収の条件と、保持される場合の運用上の扱いを追記した。
- `docs/ja/specdojo/references/command-reference.md`: `exec run` の準備失敗時の予約解放と古い予約の回収の挙動を追記した。
- `src/exec/run/change-scope.ts`: 予約の解放と古い予約の回収に必要な処理を追加・調整した。
- `src/exec/run/register-mode.ts`: register 経路で、準備の失敗時に予約を解放し、古い予約を回収するようにした。
- `src/exec/run/register-worktree.ts`: worktree 準備の失敗時に予約を解放するようにした。既存 worktree がある run の失敗では予約を保持する。
- `src/exec/run/schedule-mode.ts`: schedule 経路でも、準備失敗時の予約解放と古い予約の回収を行うようにした。
- `src/exec/run/shared.ts`: register と schedule の両経路が共用する、予約解放と回収の処理を調整した。
- `tests/src/exec/run/change-scope.test.ts`: 予約の解放と古い予約の回収に関するテストを追加・更新した。
- `tests/src/exec/run/human-task-skip.test.ts`: 予約の挙動の変更に合わせて期待値を更新した。
- `src/exec/run/change-scope-state.ts`: 新規ファイル。予約の状態判定（未着手・worktree 不在・lock 不在）を扱う。
- `tests/src/exec/run/register-scope.test.ts`: 新規テスト。register 経路での準備失敗時の予約解放と、古い予約の回収を検証する。

## 3. 申し送り

- 親検証の `npm run test:unit` が failed。`tests/src/exec/run/track-filter.test.ts` の 191 行目付近の期待値で失敗している。この変更で `schedule-mode.ts` が変わったため、原因の確認が必要。次の作業は、失敗ログ `parent-validation-attempt-1-test-unit.log` を確認し、この変更の影響かを切り分けること。
- 統合後、orchestrator が `specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-YQ32 --executor-by claude-executor --reporter-by gemma26-reporter` を実行し、成功を確認してから close する。個票の smoke 行は理由付きで open とした。
- 判断: 未着手は schedule の `todo`、register の `open` とした。両経路が予約ディレクトリを共用するため、どちらからも両種の予約を回収する。時間閾値は設けず、未着手・exec worktree 不在・予約 lock 不在を条件とする。状態を確認できない場合や stale lock が残る場合は保持する。
- 判断: 再実行の準備失敗では取得前の未統合予約を復元し、既存 worktree がある register run の失敗も予約を保持する。
- CHANGELOG に書く事項（v0.10.0、不具合修正）: `exec run`（`--auto`・`exec cycle` を含む）の準備失敗で変更範囲の予約が残って後続を止める問題を修正。未着手で worktree と予約 lock のない古い予約も自動で回収する。
- 型検査・lint・単体テストを含む設定済みの親検証は runner が実行する。executor では重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（既存の runner 管理 event 差分を除き、変更対象は TypeScript と Markdown のみ。）
- 人の確認が必要: `specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-YQ32 --executor-by claude-executor --reporter-by gemma26-reporter`（統合後に orchestrator が実 agent CLI を起動し、成功を確認してから close する。）

## 4. 進め方

executor は register と schedule が共用する予約ディレクトリを前提に、準備失敗時の解放と古い予約の回収を実装した。回収条件は、未着手であること、exec worktree がないこと、予約 lock がないこととした。状態を確認できない場合や stale lock が残る場合は保持する。あわせて回帰テストと関連文書を更新した。
