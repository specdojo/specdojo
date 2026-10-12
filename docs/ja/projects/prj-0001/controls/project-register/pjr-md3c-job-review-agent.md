---
specdojo:
  id: prj-0001:pjr-md3c-job-review-agent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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
| 1   | Job の schema・検証・解決に、統合前 review と review agent を追加する | -    | open | -    |
| 2   | routine の `action.commit` を互換として扱い、Job を優先する           | -    | open | -    |
| 3   | grade の 2 Job に宣言と指名を書き、routine から `commit` を外す       | -    | open | -    |
| 4   | テストと文書を更新する                                                | -    | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqza-routine-commit-after-run]]: 統合前 review の流れを入れた項目。
- [[prj-0001:pjr-wzma-job-responsibility-boundary]]: Job の責務境界と agent 指名の規約を定めた項目。
- [[prj-0001:pjr-adz6-register-run-non-pipeline-agent-fallback]]: pipeline の agent の自動選択の問題。
