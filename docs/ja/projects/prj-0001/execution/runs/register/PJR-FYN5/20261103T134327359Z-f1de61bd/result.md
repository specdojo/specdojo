---
specdojo:
  id: prj-0001:xer-pjr-fyn5-20261103t134327z-65dc77df
  type: exec-result
  task_id: PJR-FYN5
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-FYN5/20261103T134327359Z-f1de61bd/plan.md
  started_at: "2026-11-03T13:43:27.853Z"
  completed_at: "2026-11-03T14:29:46.886Z"
  agent: argon-executor
---

# Edit Result

## 1. 実施内容

- executor 段からの `exec resume` において、`--executor-by` で別の executor を指定して再開した際に、元の actor の `release` イベントと新しい executor の `claim` イベントを記録することで、`last_by` と `PreparedTask.actor` を新しい executor へ適切に移譲するよう修正しました。
- これにより、統合前の完了確認（`readCompletionPreflight`）や、その後の `exec complete`、`exec block`、および `collectBusyActors` において、新しい executor が正しく作業中として認識されるようになり、不整合による停止が解消されました。
- E2E 統合テストおよび単体テストの追加、`exec-operation-guide.md` の更新、`CHANGELOG.md` の更新、および個票の対応結果の更新を行いました。

## 2. 変更ファイル

- `CHANGELOG.md`: `Unreleased` 節に本タスクに関する変更内容を追記しました。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: `exec resume` 時の executor 引き継ぎに関する説明を更新しました。
- `src/exec/events.ts`: イベントの記録および `last_by` の管理ロジックを修正しました。
- `src/exec/run/lifecycle-commands.ts`: 再開時の executor 引き継ぎに伴う状態遷移のロジックを実装しました。
- `src/exec/run/schedule-prepare.ts`: 再開時の `claim` イベント発行に関連する処理を修正しました。
- `tests/src/exec/events.test.ts`: イベントの記録と状態遷移に関する単体テストを追加・更新しました。
- `tests/src/exec/pipeline-e2e.integration.test.ts`: executor を変更して再開するシナリオの E2E 統合テストを追加しました。

## 3. 申し送り

- 方式の決定と理由: 案 A（executor 段からの再開時に `--executor-by` で別の executor が指定された場合、元の actor の `release` イベントと新しい executor の `claim` イベントを記録して claim を新しい executor へ移す方式）と案 B（完了前の確認 `readCompletionPreflight` で再開時に指定した executor を許す方式）を比較し、案 A を採用しました。統合後の `spawnComplete` と失敗時の `spawnBlock` は別プロセスの CLI（`specdojo exec complete/block --by &lt;actor&gt;`）でイベントログの `last_by` と `--by` の一致を検査するため、`readCompletionPreflight` だけを緩めても `last_by` が元の actor のままだと統合直後の `exec complete` や中断時の `exec block` が失敗し、`collectBusyActors` も稼働中の actor を誤認します。案 A により `readCompletionPreflight`・`exec complete`・`exec block`・`collectBusyActors` のすべてで状態が一貫し、引き継ぎ履歴（`claim` -&gt; `release` -&gt; `claim` -&gt; `complete`）もイベントログに残ります。
- 完了イベントの記録先の検証結果: `tests/src/exec/pipeline-e2e.integration.test.ts` で `blocked` および `doing` の双方から `--resume-from executor --executor-by cloud-expert-executor`（元の claim は `local-gemma-executor`）で再開し、executor・親の検証・reporter・統合・worktree 削除まで通り、イベントログに `local-gemma-executor` の `release` と `cloud-expert-executor` の再 `claim` が記録され、`complete` イベントの `by` が新しい executor である `cloud-expert-executor` で記録されることを確認しました。`--executor-by` を指定しない再開の動作は従来どおり維持されています。
- 保護された設定（`.specdojo/**`、`package.json` など）の変更提案はありません。
- 適用外の検証: `npm run validate:schema:file`（YAML 成果物を変更していないため適用外です。）

## 4. 進め方

`exec resume --resume-from executor --executor-by &lt;new-executor&gt;` が実行された際、既存の `claim` を一度 `release` し、新しい executor が新たに `claim` するという一連のイベントを明示的に記録するロジックを導入しました。これにより、システム内の `last_by` プロパティが新しい executor に更新され、その後のライフサイクルコマンドが新しい executor のコンテキストで正しく実行されるようになります。
