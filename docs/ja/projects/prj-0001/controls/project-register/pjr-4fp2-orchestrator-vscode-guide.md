---
specdojo:
  id: prj-0001:pjr-4fp2-orchestrator-vscode-guide
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  registered_at: "2026-10-28T12:06:49Z"
---

# PJR-4FP2 VS Code からオーケストレーターを使う手順を案内する

## 1. 概要

Copilot Chat の agent の選択、Claude Code の拡張での既定の agent の設定、Codex の拡張での使い方を、orchestrator-operation-guide・クイックスタート・templates/copilot/README.md に書き、onboarding の間口を広げる

- 利用者が、このリポジトリの VS Code の Copilot Chat の agent の選択肢に `specdojo-orchestrator` が出ることを確かめた（2026-10-28）。定義の配布は `specdojo config scaffold --provider copilot` が `.github/agents/specdojo-orchestrator.md` へ置くことで済んでおり、足りないのは VS Code から使う案内である。
- Claude Code は settings の `agent` キーで、セッションを名前付きの agent として開始できる。公式の settings の説明では、ターミナル・VS Code の拡張・JetBrains の拡張・デスクトップのアプリが同じ settings のファイルを読む。

## 2. 完了条件

- orchestrator-operation-guide に「VS Code から使う」節があり、次の 3 つの拡張の使い方を書く。
  - Copilot Chat: `config scaffold --provider copilot` の後、チャットの agent の選択肢から `specdojo-orchestrator` を選ぶ。
  - Claude Code の拡張: settings の `agent` キーに `specdojo-orchestrator` を設定すると、セッションがオーケストレーターとして始まる。共有の `.claude/settings.json` に書くとそのリポジトリのすべての人のすべてのセッションが対象になるため、各自の `.claude/settings.local.json` に書くことを勧める。
  - Codex の拡張: SSOT の本文を最初の指示として渡す。
- Claude Code の `agent` キーと Codex の拡張の使い方は、executor が公式の文書で確かめ、確かめた URL を本個票の対応結果に書く。確かめられなかったことは「未確認」と明記する。
- exec の executor・reporter は起動のコマンドで `--agent` を明示しており、settings の `agent` キーの影響を受けないことを、コマンドの定義（`exec-defaults.yaml` の `command_template`）で確かめて対応結果に書く。影響を受ける経路が見つかった場合は、その経路と対処の案を対応結果と報告の `handoff` に書く（保護された設定は変えない）。
- クイックスタートでオーケストレーターを紹介している箇所に、VS Code から使えることと上の節への参照を足す。
- `templates/copilot/README.md` の導入手順に、VS Code の Copilot Chat で選ぶ手順を足す。
- `npm run lint:md` と `npm run docs:build` が通り、親の検証 7 件が通る。

## 3. 作業内容

| No  | 作業                                                | 担当     | 状態 | メモ                                          |
| --- | --------------------------------------------------- | -------- | ---- | --------------------------------------------- |
| 1   | orchestrator-operation-guide に VS Code の節を足す  | executor | done | 2.2 節を追加（Copilot・Claude Code・Codex）   |
| 2   | Claude Code と Codex の拡張の使い方を公式で確かめる | executor | done | 公式ドキュメントの記述を確認し対応結果に記録  |
| 3   | クイックスタートと Copilot の README に案内を足す   | executor | done | quick-start-guide と templates/copilot に反映 |

## 4. 対応結果

### 4.1. 公式ドキュメントの確認結果

- **Claude Code の `agent` キー**:
  - 確認元 URL: <https://docs.anthropic.com/en/docs/claude-code/settings>
  - 公式設定リファレンスにて、`settings.json` の `agent` キーが「Start every session as a named subagent with a designated prompt, toolset, and model configuration」として提供されていることを確認した。
  - 設定スコープは User（`~/.claude/settings.json`）、Shared Project（`.claude/settings.json`）、Local Project（`.claude/settings.local.json`）の順で優先される。共有の `.claude/settings.json` に設定するとリポジトリ全員の全セッションが対象になるため、各自の `.claude/settings.local.json` に設定することを推奨する。VS Code 拡張やターミナルで同一の設定が読み込まれる。
- **Codex の VS Code 拡張**:
  - 確認元 URL: VS Code Marketplace <https://marketplace.visualstudio.com/items?itemName=openai.chatgpt>
  - Codex の VS Code 拡張（`Codex – OpenAI's coding agent`）において、名前付きカスタムエージェント定義（`.codex/agents/*.toml`）をドロップダウン等から選択して起動する設定・機能は現時点で公式文書上に記載がなく「未確認」。そのため、会話開始時に SSOT である `.agents/specdojo-orchestrator.agent.md` の本文をチャットの最初の指示（プロンプト）として渡す運用を案内する。

### 4.2. exec defaults における `agent` キーの影響確認

- `.specdojo/exec-defaults.yaml` の `providers.claude.command_template` を確認した。
  - テンプレート定義: `claude -p --verbose --agent {agent} --model {model} --settings .specdojo/claude/settings.{mode}.json`
  - 各 mode に応じて `--agent` 引数（`edit`: `claude-executor`、`review`: `claude-review-executor`、`report`: `claude-reporter`）をコマンドライン引数で明示的に渡している。
  - CLI の `--agent` 引数は `settings.json` の `agent` キーの既定値を上書きするため、settings に `agent` キーが設定されていても exec の executor・reporter 実行には影響しないことを確認した。
  - さらに `--settings .specdojo/claude/settings.{mode}.json` でモード別設定も明示されている。影響を受ける経路はない。

### 4.3. 成果物の更新内容

1. **`docs/ja/specdojo/guides/orchestrator-operation-guide.md`**:
   - 「2.2. VS Code から使う」節を追加し、Copilot Chat、Claude Code 拡張、Codex 拡張の利用手順を記載した。
   - 冒頭の「この文書で分かること」に「VS Code からの使い方」を追加した。
2. **`docs/ja/specdojo/guides/quick-start-guide.md`**:
   - 冒頭のオーケストレーター紹介箇所に、ターミナルだけでなく VS Code の拡張機能（Copilot Chat、Claude Code、Codex）からも利用できる旨と、オーケストレーター運用ガイドの「VS Code から使う」節への参照リンクを追加した。
3. **`templates/copilot/README.md`**:
   - 導入手順のステップ 5 に、VS Code の Copilot Chat から `specdojo-orchestrator` を選んで対話を開始する手順を追加した。

## 5. 関連ドキュメント

- [[specdojo:orchestrator-operation-guide]]
- [[specdojo:quick-start-guide]]
