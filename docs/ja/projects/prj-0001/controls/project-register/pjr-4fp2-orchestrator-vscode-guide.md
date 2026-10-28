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

| No  | 作業                                                | 担当     | 状態 | メモ |
| --- | --------------------------------------------------- | -------- | ---- | ---- |
| 1   | orchestrator-operation-guide に VS Code の節を足す  | executor | open | -    |
| 2   | Claude Code と Codex の拡張の使い方を公式で確かめる | executor | open | -    |
| 3   | クイックスタートと Copilot の README に案内を足す   | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:orchestrator-operation-guide]]
- [[specdojo:quick-start-guide]]
