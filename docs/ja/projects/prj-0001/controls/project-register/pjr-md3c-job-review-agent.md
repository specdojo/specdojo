---
specdojo:
  id: prj-0001:pjr-md3c-job-review-agent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  registered_at: "2026-10-12T01:06:22Z"
---

# PJR-MD3C Job Run の review agent と統合前 review の宣言を Job で指定する

## 1. 概要

routine が起動する Job Run の review agent が自動選択になっており、routine からも指定できない。review agent の指名と、review を経て統合することの宣言を Job Definition の責務として追加し、routine の action.commit は互換として残す。grade の 2 Job で claude-expert-review-executor と claude-reporter を指名する

### 1.1. 背景と責務の判断（2026-10-12）

- PJR-VQZA で、routine の `action.commit: true` により Job Run を exec の worktree で実行し、runner の commit、review、verdict による統合を行う流れを入れた。
- review agent は CLI の `--review-by` / `--reporter-by` がなければ自動選択になる。review タスクは要件を持たないため、優先度 1 の `qwen-review-executor` などと `gemma-reporter` が選ばれる見込みで、利用者が求める claude-expert 級にならない。routine からも指定できない。
- 利用者との検討で、review agent の指名は Job の責務と判断した。根拠は次のとおり。
  - routine は時刻条件のトリガー層で、何を実行するかは Job に委ねる（[[specdojo:routine-operation-guide]]）。
  - 委譲先の agent は Job で nickname 指名する（[[specdojo:job-definition-standard]] の agent 指名の規約）。
  - routine に書くと、同じ Job を `exec run --job` で手動実行したときに reviewer が自動選択に戻る。
- 同じ理由で、「出力を統合前に review するか」も Job の出力の性質で決まるため、routine の `action.commit` から Job の宣言へ移す。Job は宣言だけを持ち、worktree・commit・review・統合は exec 実行基盤が担う（同標準の責務境界）。

## 2. 完了条件

- Job Definition（`job.schema.yaml` と `job validate`）に次を追加している。
  - 統合前に review を経ることの宣言（例: `task.review` の有無や有効化の項目）。宣言した Job は、起動元（routine・手動の `exec run --job`）によらず、exec の worktree での実行、runner による commit、review、verdict による統合の流れで動く。
  - review agent の指名（例: `task.review.agent.executor` / `task.review.agent.reporter`）。nickname の書式と未知のキーの扱いは既存の `task.agent` に揃える。
- review agent の解決順は、`--review-by` / `--reporter-by` → Job の指名 → 自動選択とする。
- routine の `action.commit` は互換として読み、Job の宣言と両方ある場合は Job を優先する。routine 側で新たに推奨しないことを文書に書く。
- `job-grade-kata` と `job-grade-deliverable` で統合前 review を宣言し、review agent に `claude-expert-review-executor`（executor）と `claude-reporter`（reporter）を指名している。2 つの grade の routine から `action.commit` を外しても同じ流れになる。
- `exec run --job job-grade-kata --dry-run` と `routine run --id rtn-grade-recheck --dry-run`（または同等の確認）で、review agent が指名どおりに解決されることを確認している。
- [[specdojo:job-definition-standard]]、[[specdojo:routine-operation-guide]]、`docs/ja/product/040-system-design/sysd-job-execution.md` に、宣言と指名の書き方、解決順、`action.commit` の互換の扱いが記載されている。
- 単体テストで、解決順（CLI → Job → 自動選択）、Job の宣言と routine の `action.commit` の優先、schema の検証を確認している。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する。

## 3. 作業内容

| No  | 作業                                                                  | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | Job の schema・検証・解決に、統合前 review と review agent を追加する | -    | done | -    |
| 2   | routine の `action.commit` を互換として扱い、Job を優先する           | -    | done | -    |
| 3   | grade の 2 Job に宣言と指名を書き、routine から `commit` を外す       | -    | done | -    |
| 4   | テストと文書を更新する                                                | -    | done | -    |

## 4. 対応結果

- Job Definition に `task.review` を追加した。mapping の存在が統合前 review の宣言で、`task.review.agent.executor`（必須）/ `task.review.agent.reporter`（任意）で review agent を nickname 指名する。書式と未知キーの扱いは `task.agent` と同じで、`job validate`（`src/job.ts`）と `job.schema.yaml` の両方で検証する。mode によらず書ける。
- `exec run --job` は、Job が `task.review` を宣言していれば `--worktree` がなくても worktree 実行・runner の commit・review・verdict による統合の流れで動く。worktree 内で Job を実行する子プロセスは環境変数 `SPECDOJO_JOB_REVIEW_WORKTREE_CHILD` で識別し、再入しない。
- review agent の解決順を `--review-by` / `--reporter-by` → `task.review.agent` → 自動選択とした。`exec run --job --dry-run` は review executor / reporter の nickname と解決元を表示し、`routine run --dry-run` は job action ごとに review の有無と指名を表示する。
- routine の `action.commit` は互換として残し（`true` なら従来どおり `--worktree` を渡す）、Job が宣言している場合は Job を優先する。schema の説明と文書に、新たには推奨しないことを書いた。
- `job-grade-kata` と `job-grade-deliverable` に `task.review` を書き、`claude-expert-review-executor` と `claude-reporter` を指名した。`rtn-grade-recheck` と `rtn-grade-deliverable-recheck` から `commit: true` を外した。
- 確認: `exec run --job job-grade-kata --dry-run` と routine 相当の `exec run --job job-grade-deliverable --job-trigger routine --dry-run`（`--worktree` なし）で、review executor が `claude-expert-review-executor (task.review.agent.executor)`、reporter が `claude-reporter (task.review.agent.reporter)` と解決された。`--review-by` を付けると executor だけが CLI 指定に置き換わった。`routine run --id rtn-grade-recheck --dry-run` は `review: job task.review (executor=claude-expert-review-executor, reporter=claude-reporter)` を表示した。
- 文書: [[specdojo:job-definition-standard]]、[[specdojo:routine-operation-guide]]、`docs/ja/product/040-system-design/sysd-job-execution.md` を更新した。sysd の実装境界にあった「`exec run --job --worktree` は未対応」の古い記述も現状に合わせた。
- テスト: 単体テスト（`tests/src/job.test.ts`、`tests/src/routine.test.ts`、`tests/docs/specdojo/schemas/job-schema.test.ts`）で解決順・Job と `action.commit` の優先・schema を、統合テスト（`tests/src/exec-job-worktree.integration.test.ts`）で宣言 Job が `--worktree` なしで review・統合され、指名した review executor が使われることを確認する。
- 残課題: 実 agent による routine 起動の確認は未実施（次回の定期実行で `[routine-job] merged|waiting` と review result の `agent` を確認する）。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqza-routine-commit-after-run]]: 統合前 review の流れを入れた項目。
- [[prj-0001:pjr-wzma-job-responsibility-boundary]]: Job の責務境界と agent 指名の規約を定めた項目。
- [[prj-0001:pjr-adz6-register-run-non-pipeline-agent-fallback]]: pipeline の agent の自動選択の問題。
