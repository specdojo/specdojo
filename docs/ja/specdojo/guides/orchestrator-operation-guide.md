---
specdojo:
  id: orchestrator-operation-guide
  type: guide
  status: draft
---

# オーケストレーター運用ガイド

Orchestrator Operation Guide

会話から `specdojo` CLI を実行する対話型オーケストレーターエージェント `specdojo-orchestrator` の使い方を説明します。起動方法、対話の進め方、承認を伴う実行、安全上の制約、設定ファイルの構成を扱います。個別コマンドの詳細は [CLIコマンドリファレンス](../references/command-reference.md) を、CLI 全体像は [CLI概要ガイド](cli-overview-guide.md) を参照します。

**対象読者**

- `specdojo` のプロジェクト実行管理（登録・計画・実行・状況確認）を、CLI を直接叩く代わりに対話で進めたい利用者

**この文書で分かること**

- オーケストレーターの位置づけ、起動用スクリプト、対話フロー、承認と安全の扱い、設定ファイルの構成

**次に読む文書**

- タスク実行の運用は [exec運用ガイド](exec-operation-guide.md)、登録簿の運用は [登録簿運用ガイド](register-operation-guide.md)、コマンド詳細は [CLIコマンドリファレンス](../references/command-reference.md) を参照してください。

## 1. オーケストレーターの位置づけ

`specdojo-orchestrator` は、利用者との対話から意図を読み取り、対応する `specdojo` サブコマンド（`register` / `exec` / `catalog` / `schedule` / `routine` など）を組み立てて実行する司令塔エージェントです。

`specdojo exec run` が起動する edit / review agent とは役割が異なります。

| 観点             | edit / review agent            | `specdojo-orchestrator`             |
| ---------------- | ------------------------------ | ----------------------------------- |
| 起動             | `specdojo exec run` から非対話 | 利用者との対話                      |
| 入力             | 標準入力で渡される1件の plan   | 会話（自由入力）                    |
| 実行対象         | 成果物または result の編集     | `specdojo` サブコマンドの実行       |
| claim / complete | 実行しない                     | `specdojo` コマンドとして実行しうる |

CLI を直接操作する場合の代表フローは [CLI概要ガイド](cli-overview-guide.md) の `代表フロー` を参照します。オーケストレーターは、この代表フローを会話で組み立てて実行する用途に向きます。

## 2. 起動方法

`package.json` に、対話起動用の npm スクリプトを `orch:` 接頭辞で用意しています。Claude Code / Codex はモデル別に用意し、`:work` 付きは固定 worktree で起動します。

| スクリプト           | CLI・モデル             | worktree                                         |
| -------------------- | ----------------------- | ------------------------------------------------ |
| `orch:sonnet`        | Claude Code / `sonnet`  | なし                                             |
| `orch:sonnet:work`   | Claude Code / `sonnet`  | `.claude/worktrees/claude-work`（自動作成）      |
| `orch:opus`          | Claude Code / `opus`    | なし                                             |
| `orch:opus:work`     | Claude Code / `opus`    | `.claude/worktrees/claude-work`（自動作成）      |
| `orch:terra`         | Codex / `gpt-5.6-terra` | なし                                             |
| `orch:terra:work`    | Codex / `gpt-5.6-terra` | `../worktrees/codex-work`（無ければ自動作成）    |
| `orch:sol`           | Codex / `gpt-5.6-sol`   | なし                                             |
| `orch:sol:work`      | Codex / `gpt-5.6-sol`   | `../worktrees/codex-work`（無ければ自動作成）    |
| `orch:copilot`       | GitHub Copilot          | なし                                             |
| `orch:copilot:work`  | GitHub Copilot          | `../worktrees/copilot-work`（無ければ自動作成）  |
| `orch:opencode`      | OpenCode                | なし                                             |
| `orch:opencode:work` | OpenCode                | `../worktrees/opencode-work`（無ければ自動作成） |

用途に応じて使い分けます。

```bash
# 通常の対話（既定モデル）
npm run orch:sonnet

# 込み入った判断が必要なときは frontier モデル
npm run orch:opus

# 変更を隔離したいときは worktree で起動
npm run orch:sonnet:work
```

frontier モデルは Claude Code が `opus`、Codex が `gpt-5.6-sol` に対応します。通常運用はそれぞれ既定の `sonnet` / `gpt-5.6-terra` を使います。

worktree 付きは、固定名の worktree を使い、無ければ起動時に作成します。Claude Code は `--worktree` で `.claude/worktrees/claude-work` を自動作成します。Codex / GitHub Copilot / OpenCode は worktree を作成できないため、`git worktree add ../worktrees/<cli>-work` を先行させてから作業ディレクトリ指定で入ります（Codex / Copilot は `-C`、OpenCode は起動ディレクトリの位置引数）。

## 3. 対話の進め方

オーケストレーターは「提案 → 承認 → 実行」を基本とします。

1. 要望から「対象プロジェクト」「やりたいこと（登録・計画・実行・状況確認）」を特定します。曖昧な場合は質問で絞り込みます。
2. 対応する `specdojo` サブコマンドと引数へマッピングします。必要なら該当コマンドの `--help` を先に確認します。
3. 実行予定のコマンドを、目的と影響範囲（生成・更新されるファイル）とともに提示します。
4. 状態を変える操作は承認を得てから実行します。影響が大きい場合は、先に `--dry-run` を提案します。
5. 実行後は結果（生成物・イベント・次の作業）を要約し、必要なら検証コマンド（`specdojo exec validate` など）を案内・実行します。

読み取り・状況確認のみのコマンド（`--help` / `list` / `status` / `where` / `validate` / `--dry-run`）は、説明の上でそのまま実行します。

対象 project は、`--project <id>` → 環境変数 `SPECDOJO_PROJECT` → `specdojo.config.json` の `current_project` → `projects` 先頭、の順で解決します（[CLI概要ガイド](cli-overview-guide.md) の `プロジェクト解決順序` を参照）。会話で対象を特定できない場合は確認します。

## 4. 安全と権限

オーケストレーターは、状態やファイルを変える操作を承認なしに実行しません。CLI 側の権限機構でも同じ方針を多重に担保します。

- 破壊的変更や `git push` は行いません。`git commit` は明示的に依頼した場合のみ行います。
- 認証情報・秘密鍵・`.env` / `secrets/` は読み込みません。
- 会話で確定していないプロジェクト事実（担当・期日・結論など）を勝手に埋めません。
- Codex は `approval_policy` により状態変更時に承認を求めます。OpenCode は読み取り系の `specdojo` のみ許可し、その他の `specdojo` 実行は都度確認します。

影響の大きい操作（`specdojo exec run` など、エージェントを起動して成果物を生成・更新するもの）は、対象と実行範囲を提示して承認を得てから実行します。

## 5. 設定ファイルの構成

指示本文（システムプロンプト）の正本を1ファイルに集約し、各 agent CLI の設定はその本文を埋め込む薄いラッパーとしています。4系統の設定形式は非互換のため、単一のネイティブ設定ファイルを共有することはできません。

| 役割               | パス                                        |
| ------------------ | ------------------------------------------- |
| 本文の正本（SSOT） | `.agents/specdojo-orchestrator.agent.md`    |
| Claude Code        | `.claude/agents/specdojo-orchestrator.md`   |
| GitHub Copilot     | `.github/agents/specdojo-orchestrator.md`   |
| Codex              | `.codex/agents/specdojo-orchestrator.toml`  |
| OpenCode           | `.opencode/agents/specdojo-orchestrator.md` |

本文を変更する場合は SSOT を編集し、各ラッパーの本文を同期します。モデル・権限・provider の変更は本文ではなく、各ラッパーの frontmatter / TOML 側で行います。
