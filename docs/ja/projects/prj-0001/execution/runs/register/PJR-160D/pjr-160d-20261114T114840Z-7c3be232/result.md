---
specdojo:
  id: prj-0001:xer-pjr-160d-20261114t114840z-7c3be232
  type: exec-result
  task_id: PJR-160D
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-160D/pjr-160d-20261114T114840Z-7c3be232/plan.md
  started_at: "2026-11-14T11:51:08.884Z"
  completed_at: "2026-11-14T12:12:48.151Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- commit scope の停止ガードを `schedule` を含む agent タスクへ一般化しました。
- executor が commit 対象外の変更を残した場合の、統合・撤去・runner への申し送り・回帰テスト・利用ガイド・個票の更新フローを実装しました。
- 型ディレクトリの許可に関する説明を、`approach` によるディレクトリ許可の記述と整合するように修正しました。
- 関連する設計書（`exec-config-guide.md`、`exec-worktree-guide.md`）、ソースコード、テストコード、および個票を更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: executor のカタログ・型に関する許可条件の変更と、未解決 ID の警告に関する説明を修正。
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: executor が commit 対象外の変更を残した場合の、統合・撤去・申し送り等のフローに関する記述を追加。
- `src/exec/protection-handoff.ts`: 変更の停止および報告のための `handoff` 生成ロジックを更新。
- `src/exec/repo-integration.ts`: リポジトリ統合時の変更検知と停止判定のロジックを修正。
- `src/exec/run/register-worktree.ts`: worktree 登録時の保護ロジックを更新。
- `src/exec/run/schedule-task.ts`: `schedule` 由来のタスクにおいても、commit scope の停止ガードが適用されるよう修正。
- `src/exec/worktree-ops-commit.ts`: commit 操作時の変更検知および停止処理を実装。
- `src/exec/worktree-ops-lifecycle.ts`: worktree のライフサイクル管理における変更検知ロジックを更新。
- `src/exec/worktree-ops-merge.ts`: merge 操作時の変更検知と停止判定を実装。
- `src/exec/worktree-ops.ts`: worktree 操作全般における変更検知の基盤となる共通ロジックを更新。
- `tests/src/exec/worktree-ops.integration.test.ts`: worktree 操作における変更検知と停止ガードの統合テストを追加。

## 3. 申し送り

- 判断: bootstrap / `*-maintenance` のカタログ・schema・型のメニューは一括許可しない。他成果物や親 runner への影響を避け、checkpoint 済み targets で個別に解決できる場合だけ許可する。対象外なら変更理由・対象パス・提案差分・必要な検証を報告する。未解決 ID の警告は個別パス解決の失敗を表し、approach の型ディレクトリ許可は独立して適用される説明へ修正した。
- CHANGELOG 文案（不具合修正）: executor が commit 対象外の変更を残した場合、schedule 由来のタスクでも統合と worktree 撤去を停止し、対象パスと次のアクションを result とログへ記録する。型の対象 ID を解決できない場合の警告を、approach によるディレクトリ許可と整合する説明に修正する。
- 統合後は運用メモに従い、PJR-JSEY の対象に PJR-160D を加えて実 agent の start から review までを確認し、その後 close する。
- 適用外の検証: `npm run validate:schema:file`（pjr-160d.yaml は作業開始時点から存在する runner の差分であり、executor は編集していない。）
- 適用外の検証: `specdojo catalog build`（`dct-*.yaml` を変更していない。）
- 適用外の検証: `specdojo register build`（pjr-index.md を変更していない。）
- 適用外の検証: `specdojo exec refresh`（`sch-*.yaml` を変更していない。）
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --join --executor-by claude-executor`（統合後、JSEY の対象更新と再開手続きを行い、実 agent で start から review まで確認する。実 agent の起動は sandbox 外で実施する。）

## 4. 進め方

commit scope の停止ガードを `schedule` 由来のタスクを含むよう一般化し、executor が変更を残した際の安全な停止・報告フローを構築しました。これに伴い、既存の各種 `worktree-ops` および関連する各種ガイド、テストコードを更新しました。
