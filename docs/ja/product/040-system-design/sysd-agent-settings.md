---
specdojo:
  id: sysd-agent-settings
  type: architecture
  status: draft
  rulebook: specdojo:sysd-rulebook
  part_of:
    - sysd-index
---

# エージェント実行・共通設計

SpecDojo CLIと外部エージェントCLIを組み合わせた実行モデルの入口を定義する。本書は共通の目的・責務境界と子設計への導線を保持し、横断的な必須ルールは`sysd-cross-cutting-policy`を正本とする。

## 1. 目的・適用範囲

対象は`specdojo exec run`による非対話実行と、対話型オーケストレーターからSpecDojoを操作する構成である。provider固有の認証・モデル・権限・agent定義は子設計、CLI更新操作は`opr-agent-cli-update`へ委ねる。

## 2. 設計方針・責務境界

| 層                  | 責務                                                    | 責務外                         |
| ------------------- | ------------------------------------------------------- | ------------------------------ |
| SpecDojo CLI        | task状態、依存、plan・result・eventを管理する           | 成果物内容の判断・編集         |
| agent               | 渡されたplanを解釈し、editまたはreviewを実行する        | claim、並列起動、統合制御      |
| `specdojo exec run` | member選択、phase、並列数、worktree、失敗処理を制御する | 成果物内容の判断・編集         |
| orchestrator        | 人との対話から対象とコマンドを提案し、承認後に実行する  | 非対話executorの代替、最終承認 |

責務分離、member選択、設定解決、利用制限、イベント、worktreeの規範は`sysd-cross-cutting-policy`のRule IDを参照する。事故予防が必要な順序と失敗経路は`sysd-critical-flows`を参照する。

## 3. 共通実行モデル

```text
schedule / register item
  → plan生成・claim
  → phase要件に適合するmember選択
  → 必要なworktreeを割当
  → agentがeditまたはreview
  → 検証・result確定
  → commit・直列統合・complete、またはblockして再開条件を保持
```

設定の一次情報は`.specdojo/exec-defaults.yaml`と`pm-members.yaml`、実行状態の一次情報はproject配下のplan・result・append-only eventである。

agent が親 runner・Git hook・CI の実行内容を変更できないよう、`package.json`、lefthook 設定、`.specdojo/**`、commitlint 設定、CI 設定は provider 共通の固定保護パスとする。runner は agent 終了直後かつ親検証前に起動前との差分を検査し、worktree の commit 前には未 commit 差分と branch 上の commit 済み差分を再検査する。違反時は対象パスを標準エラーへ出力して block し、branch / worktree を保持する。provider 固有の permission / sandbox は第一層として維持するが、この判定の入力には使わない。

## 4. 子設計一覧

| 子設計                                                                    | 対象               | 固有責務                                |
| ------------------------------------------------------------------------- | ------------------ | --------------------------------------- |
| [Claude Codeエージェント設定](sysd-claude-agent-settings.md)              | Claude Code        | 認証、モデル、agent定義、起動設定       |
| [Codexエージェント設定](sysd-codex-agent-settings.md)                     | Codex              | sandbox、モデル、custom agent、起動設定 |
| [OpenCodeエージェント設定](sysd-opencode-agent-settings.md)               | OpenCode / Ollama  | ローカルLLM、agent定義、起動設定        |
| [GitHub Copilotエージェント設定](sysd-github-copilot-agent-settings.md)   | GitHub Copilot CLI | 認証、agent定義、非対話実行             |
| [オーケストレーターエージェント設定](sysd-orchestrator-agent-settings.md) | 対話型orchestrator | 提案・承認・実行境界、固定worktree起動  |

`provider: custom`は共通の上書き拡張点であり、固有の標準provider設計は持たない。採用する場合は独立した子設計を追加する。

## 5. 検証観点・関連文書

| 種別       | 参照先                                                               | 確認事項                             |
| ---------- | -------------------------------------------------------------------- | ------------------------------------ |
| 全体入口   | [システム設計](sysd-index.md)                                        | 設定・実装SSOTの所在                 |
| 横断ルール | [システム設計横断ルール](sysd-cross-cutting-policy.md)               | 責務、設定、失敗、worktreeの必須事項 |
| 重要フロー | [システム設計重要フロー](sysd-critical-flows.md)                     | 並列・統合・ID・PR・延期再開         |
| Job        | [Job実行設計](sysd-job-execution.md)                                 | Job Runからexec基盤への委譲          |
| 運用手順   | [外部エージェントCLI更新](../090-operations/opr-agent-cli-update.md) | CLI更新と証跡                        |
| 検証       | `tests/src/exec-*.test.ts`                                           | member選択、worktree、retry、resume  |
