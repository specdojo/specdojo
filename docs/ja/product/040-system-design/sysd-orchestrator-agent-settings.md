---
specdojo:
  id: sysd-orchestrator-agent-settings
  type: project
  status: draft
  rulebook: specdojo:sysd-rulebook
---

# SpecDojo オーケストレーターエージェント設定

人との対話から `specdojo` CLI（`register` / `exec` など）を実行する対話型オーケストレーターエージェント `specdojo-orchestrator` の設計・構成を定義する。

本設計は [エージェント共通設定](sysd-agent-settings.md) が対象とする `specdojo exec run` の非対話実行モデルとは別系統である。共通設定の edit / review agent が「渡された1件の plan だけを処理し、claim / complete を実行しない」のに対し、オーケストレーターは会話から意図を読み取り、`specdojo` コマンド自体を提案・実行する。

## 1. 設計方針

`specdojo-orchestrator` は、利用者との対話を通じて SpecDojo のプロジェクト実行管理コマンドを代行する司令塔エージェントである。

- **対話駆動**: 会話から「対象プロジェクト」「やりたいこと（登録・計画・実行・状況確認）」を特定し、対応する `specdojo` サブコマンドへ落とし込む。
- **提案 → 承認 → 実行**: 状態やファイルを変える操作は、実行するコマンドを提示して利用者の承認を得てから実行する。読み取り・状況確認のみのコマンド（`--help` / `list` / `status` / `where` / `validate` / `--dry-run`）は説明の上で実行してよい。
- **1本文・4環境**: 指示本文（システムプロンプト）を単一の正本（SSOT）に集約し、4系統の agent CLI 設定へ同一本文を埋め込む（`設定ファイル構成` を参照）。
- **安全既定**: 破壊的変更や `git push` を行わない。認証情報・秘密鍵・`.env` / `secrets/` を読み込まない。会話で確定していないプロジェクト事実を捏造しない。

対象とする agent CLI は共通設定と同じ4系統（Claude Code / Codex / GitHub Copilot / OpenCode）である。個別 CLI の認証・provider・非対話起動の詳細は共通設定の各子設計に従う。

## 2. 責務分担

| 主体                    | 責務                                                                         | 責務外                                     |
| ----------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| 利用者                  | 目的の提示、コマンド実行の承認、確定していない事実の判断                     | コマンドの逐語的な組み立て                 |
| `specdojo-orchestrator` | 意図の特定、コマンドへのマッピング、影響範囲の提示、承認後の実行、結果の要約 | 承認なしの状態変更、破壊的操作、事実の捏造 |
| `specdojo` CLI          | タスク状態・依存関係・登録簿・生成物の管理                                   | 対話の意図解釈                             |

共通設定の edit / review agent との違いは次のとおりである。

| 観点             | edit / review agent（共通設定） | `specdojo-orchestrator`（本設計）   |
| ---------------- | ------------------------------- | ----------------------------------- |
| 起動             | `specdojo exec run` から非対話  | 利用者との対話                      |
| 入力             | 標準入力で渡される1件の plan    | 会話（自由入力）                    |
| 実行対象         | 成果物または result の編集      | `specdojo` サブコマンドの実行       |
| claim / complete | 実行しない                      | `specdojo` コマンドとして実行しうる |
| 対象 CLI         | 1 CLI（子設計ごと）             | 4 CLI 横断（同一本文）              |

## 3. 実行フロー

```text
利用者の要望
   ↓
意図の特定（対象プロジェクト・やりたいこと）。曖昧なら質問して絞り込む
   ↓
specdojo サブコマンドと引数へマッピング（必要なら --help で確認）
   ↓
実行予定コマンドを目的・影響範囲とともに提示
   ↓
状態を変える操作は承認を得てから実行（影響が大きい場合は --dry-run を先行提案）
   ↓
結果（生成物・イベント・次の作業）を要約し、必要なら検証コマンドを案内・実行
```

対象 project の解決順序は CLI 共通で `--project <id>` → 環境変数 `SPECDOJO_PROJECT` → `specdojo.config.json` の `current_project` → `projects` 先頭、の順とする。会話で対象を特定できない場合は利用者に確認する。

## 4. 設定ファイル構成

指示本文の正本を1ファイルに集約し、各 agent CLI の設定は同一本文を埋め込む薄いラッパーとする。4系統の設定形式（配置先・frontmatter キー・OpenCode の権限・Codex の TOML）は非互換のため、単一のネイティブ設定ファイルを4環境で共有することはできない。そこで「本文の SSOT ＋ 環境別ラッパー」構成を採る。

| 役割               | パス                                        | 形式・要点                                                         |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------ |
| 本文の正本（SSOT） | `.agents/specdojo-orchestrator.agent.md`    | システムプロンプトの唯一の正本                                     |
| Claude Code        | `.claude/agents/specdojo-orchestrator.md`   | frontmatter に `tools` / `model`、本文は SSOT と同一               |
| GitHub Copilot     | `.github/agents/specdojo-orchestrator.md`   | frontmatter に `target: github-copilot` / `tools` / `model`        |
| Codex              | `.codex/agents/specdojo-orchestrator.toml`  | `developer_instructions` に SSOT 本文、`approval_policy` を宣言    |
| OpenCode           | `.opencode/agents/specdojo-orchestrator.md` | frontmatter に `mode: primary` と `permission`、本文は SSOT と同一 |

各ラッパーの本文は SSOT とバイト単位で一致させる。個別 CLI の認証・provider・モデル選択・非対話起動の詳細は共通設定の各子設計に従う。

## 5. 安全と権限

「提案 → 承認 → 実行」を各 CLI の権限機構でも多重に担保する。

- **Claude Code / GitHub Copilot**: 状態変更コマンドはハーネスの承認フローを通す。破壊的操作と `git push` は本文で禁止する。
- **Codex**: `approval_policy = "on-request"` とし、状態変更コマンドの実行時に承認を求める。`sandbox_mode = "workspace-write"` でリポジトリ外への書き込みを避ける。
- **OpenCode**: `permission.bash` を許可リスト方式とし、読み取り系 `specdojo`（`--help` / `project list` / `exec status` / `exec where` / `exec validate` / `* --help` / `* --dry-run`）は `allow`、その他の `specdojo *` は `ask` とする。`.env` / `secrets/` の読み取りは `deny` する。

共通の禁止事項は次のとおりとする。

- 状態変更・ファイル生成を伴うコマンドを、承認なしに実行すること。
- `git push` や履歴を書き換える破壊的操作を行うこと。
- 認証情報・秘密・`.env` / `secrets/` の読み取り。
- 会話で確定していないプロジェクト事実（担当・期日・結論など）を勝手に埋めること。

## 6. 起動方法

`specdojo-orchestrator` は各 CLI の agent 選択機構で起動する。設定ファイルの配置は `設定ファイル構成` のとおりで、非対話起動の具体的なフラグは共通設定の各子設計（[Claude Code エージェント設定](sysd-claude-agent-settings.md) / [Codex エージェント設定](sysd-codex-agent-settings.md) / [GitHub Copilot エージェント設定](sysd-github-copilot-agent-settings.md) / [OpenCode エージェント設定（Ollama）](sysd-opencode-agent-settings.md)）に従う。edit / review agent と異なり、本エージェントは対話セッションで使うことを主用途とする。

### 6.1. npm スクリプト

`package.json` に対話起動用の npm スクリプトを `orch:` 接頭辞で用意する。Claude / Codex はモデル別に用意し、`:work` 付きは固定 worktree で起動する。

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

起動方式の要点は次のとおりとする。

- Claude Code は `--agent specdojo-orchestrator --model <model>` で起動し、`:work` は `--worktree claude-work` で worktree を自動作成する。orchestrator の承認フローを維持するため `--permission-mode acceptEdits` は付けない。
- Codex は対話 TUI に agent 選択フラグが無いため、SSOT 本文（`.agents/specdojo-orchestrator.agent.md`）を初期プロンプトとして渡し、`-m <model>` でモデルを指定する。承認・sandbox は `.codex/config.toml` の設定に従う。
- Codex / GitHub Copilot / OpenCode は worktree を作成できないため、`:work` は `git worktree add ../worktrees/<cli>-work` を冪等に先行させてから作業ディレクトリ指定で入る（Codex / Copilot は `-C <path>`、OpenCode は位置引数 `<path>`）。worktree 名を固定することで、Claude Code 以外でも worktree 実行を実現する。
- frontier モデルは Claude が `opus`、Codex が `gpt-5.6-sol` に対応する。通常運用はそれぞれ既定の `sonnet` / `gpt-5.6-terra` を使う。

## 7. 保守

- 本文を変更する場合は SSOT（`.agents/specdojo-orchestrator.agent.md`）を編集し、4系統のラッパー本文をすべて同期する。ラッパー本文が SSOT とバイト一致していることを確認する。
- Markdown ラッパー（Claude / Copilot / OpenCode）は pre-commit の Markdown 整形（prettier）で表の列幅が整形されうる。Codex の TOML は Markdown 整形対象外のため、埋め込み表の空白が Markdown 側と異なる場合があるが、内容は同一とみなす。
- モデル・権限・provider の変更は本文ではなく各ラッパーの frontmatter / TOML 側で行い、共通設定の各子設計と整合させる。
