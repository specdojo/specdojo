---
specdojo:
  id: prj-0001:xer-t-business-specs-reps-ifx-cmd-ai-provider-cli-010-20261108t170001z-07c4248c
  type: exec-result
  task_id: T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-010/T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-010-20261108T170001Z-07c4248c/plan.md
  started_at: "2026-11-08T17:00:02.819Z"
  completed_at: "2026-11-08T17:17:31.102Z"
  agent: opus-executor
  execution: agent
  approach: retrofit
  targets:
    - ifx-cmd-ai-provider-cli
---

# Edit Result

## 1. 実施内容

- 判断: 新設。対象成果物が未作成であったため、カタログに定義された `path` および `done_criteria` に基づき `docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml` を新規作成した。
- 実装調査として `src/exec/run/agent.ts` および `src/exec/agent-config.ts` を参照し、AI provider CLI の起動コマンド組み立て、入出力契約（stdin/stdout/stderr）、終了コードによる判定ロジック、認証注入 (`provider_login` / `cli_profile`)、再試行方針などの現在動作を確認した。
- 意図された仕様として `ifx-cmd-rulebook` およびプロジェクト共通コンテキストを確認し、実装と整合する内容を成果物へ反映した。具体的には、`command_template` を正本とする参照、入出力の約束、終了コードの 5 分類、認証注入、冪等性の欠如と resume 処理などを記述した。
- 実装と意図された仕様（rulebook 等）との乖離として、`shell: true` での起動および起動上限時間（timeout）の欠如が確認された。これらは成果物上で乖離として明記し、`_UNDECIDED_` として扱うことで後続の判断に委ねている。

## 2. 変更ファイル

- `docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`: 外部コマンド連携仕様（AI provider CLI）を新規作成し、実装調査に基づいた実行契約、入出力の約束、認証注入、エラーハンドリング等の仕様を定義した。

## 3. 申し送り

- 乖離（実装か rulebook のどちらを変えるか要判断）: `ifx-cmd-rulebook` は `command.shell: false` を求めるが、`src/exec/run/agent.ts` の `executeAgent` は展開済みの `command_template` を `spawn(..., { shell: true })` で起動する。antigravity の `command_template` も `$(pwd)` と `$(cat)` に依存している。成果物には意図された値 `shell: false` を残し、コメントで乖離を明記した。実装を argv 起動へ変えるか、AI provider CLI 向けに rulebook の例外を定めるかを、PJR または後続 review finding として扱ってほしい。
- 乖離／未決: `executeAgent` に起動上限時間（timeout）がなく、子プロセスの終了まで待ち続ける。成果物の `execution.timeout_seconds` と `error_handling.timeout_action` は `_UNDECIDED_` とした。上限値とタイムアウト時の処置（子プロセスの終了、不完全出力の破棄）を決め、実装を変えるなら別タスクにする必要がある。
- 未決: `execution.max_parallel` は `exec run --parallel` と `providers.&lt;provider&gt;.max_concurrency`（現行では opencode が 1）で決まるため、固定値を持たせず `_UNDECIDED_` とした。仕様として上限を固定するかどうかの判断が要る。
- 乖離候補: 認証失敗を検出する専用の仕組み（パターンや終了コード）が実装になく、汎用の失敗として block される。`exit_codes` には `authentication_error` を「専用検出なし」と明記して載せた。provider 別の認証失敗検出を追加するかは別途判断が要る。
- 依存: カタログの `depends_on` にある `ifx-index`（`docs/ja/product/020-external-interface-specs/ifx-index.yaml`）は未作成。作成時には `interfaces[].spec_ref` に `ifx-cmd-ai-provider-cli` を設定する必要がある。
- 未確認範囲: `src/exec/run/shared.ts`（`isRateLimitError` / `isConnectionError`）、`src/exec/limit.ts`、`src/exec/task-repos.ts` は `evidence_refs` の列挙外のため読んでいない。exit 1 以外の終了コードの扱いと、各 provider CLI の実際の終了コードは実測していない。
- 適用外の検証: `npm run validate:history-links`（変更したのは `docs/ja/product/` 配下の YAML 1 件だけで、pjr 個票や plan / result などの履歴ファイルは変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更は `docs/ja/product/020-external-interface-specs/` 配下だけで、`docs/ja/projects/` 配下の成果物を変更していないため）

## 4. 進め方と実践の型の適用

retrofit
