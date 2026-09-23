---
specdojo:
  id: prj-0001:pjr-49jk-readme-orchestrator-onboarding
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-23T12:58:16Z"
  due_on: "2026-10-17"
  completed_at: "2026-09-23T21:23:53Z"
  conclusion: README の onboarding を orchestrator 経由の導線へ改め、provider ごとの配置と起動、会話での操作例を示した。CLI の直接利用は選択肢として残した。
---

# PJR-49JK README の onboarding を orchestrator 経由の導線へ書き換える

## 1. 概要

README は `npx specdojo` を直接叩く手順を案内している。SpecDojo の想定する使い方は対話型オーケストレーターへ会話で指示することなので、導線を組み替える。

現在の README は次の流れである。

```text
npm install --save-dev specdojo @specdojo/docs-lint
npx specdojo config init
npx specdojo config scaffold --provider codex   （任意）
npx specdojo register scaffold / add / build
npx specdojo exec plan --register PJR-XXXX
npx specdojo kata list / show / eject
```

CLI を直接使う手順としては完結しているが、オーケストレーターへの言及が無い。[[specdojo:quick-start-guide]] は各コマンドへチャット指示を併記しているものの、agent の入手方法は書かれていない。

本項目は [[prj-0001:pjr-8xqz-orchestrator-distribution-and-ssot]] で配布経路が整ってから着手する。

## 2. 完了条件

- README の導入手順が、オーケストレーターの配置と起動を含む。
- 配置は `config scaffold --provider <name>` で行えることが示されている。
- 起動方法が provider ごとに示されている（`claude --agent specdojo-orchestrator` など）。
- 最初の操作として、オーケストレーターへ会話で指示する例（register の起票など）が示されている。
- CLI を直接使う手順が選択肢として残り、agent を使わない利用者も導入できる。
- 記載した手順を kata を持たない一時ディレクトリでなぞり、記載どおり動作することを確認している。
- README が npm のページとして成立している。GitHub 前提の記述が残っていない。
- `npm run lint:md` が通過している。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                        |
| --- | -------------------------------------------------- | ---- | ---- | --------------------------- |
| 1   | オーケストレーターの配置と起動を README へ追加する | DEV  | done | provider ごとの起動コマンド |
| 2   | 会話で操作する最初の例を示す                       | DEV  | done | register の起票を例にする   |
| 3   | CLI 直接利用を選択肢として整理する                 | DEV  | done | 既存手順を残す              |
| 4   | 一時ディレクトリで記載手順をなぞって確認する       | DEV  | done | 実際に動くことを確かめる    |

## 4. 対応結果

- README の `使い始める` を組み替え、`オーケストレーターを配置する` と `会話で操作する` を新設した。CLI を直接叩く手順は `CLI を直接使う` として選択肢に残した。
- provider ごとの配置先と起動方法を表で示した。

| provider      | 配置先                                      | 起動                                             |
| ------------- | ------------------------------------------- | ------------------------------------------------ |
| `claude`      | `.claude/agents/specdojo-orchestrator.md`   | `claude --agent specdojo-orchestrator`           |
| `opencode`    | `.opencode/agents/specdojo-orchestrator.md` | `opencode --agent specdojo-orchestrator`         |
| `codex`       | `.specdojo/codex/orchestrator.md`           | `codex "$(cat .specdojo/codex/orchestrator.md)"` |
| `antigravity` | `.specdojo/antigravity/orchestrator.md`     | `agy --add-dir "$(pwd)" -i "$(cat ...)"`         |

- 作業中に `codex --help` を確認したところ `--agent <name>` が存在せず、TOML の agent 定義を名前で選べないことが分かった。プロンプトとして渡せる `templates/codex/orchestrator.md`（raw 形式）を追加した。同期対象は 9 から 10 になった。
- antigravity の規定ディレクトリを調査した。`agy-customizations` の SKILL.md によると、カスタマイズのルートは `.agents/`（`.agent/` / `_agents/` / `_agent/` も可）だが、扱うのは rules・skills・plugins・hooks・JSON 設定であり、**agent の定義は含まれない**。`agy agents` の一覧も空である。`.agents/rules/` へ置くと `always_on` で全セッションへ読み込まれ、executor として起動したときに役割が混入するため採らない。この理由を README へ併記した。
- copilot は表から外した。`.github/agents/` を読む一方で scaffold の機械的規則では `.copilot/agents/` へ置かれるため、正しい起動方法を案内できない。
- 会話例を載せ、承認を経て実行すること、`git push` や破壊的操作を行わないことを示した。
- 検証: 空ディレクトリで 4 provider を scaffold し、配置を確認した。配置された `.specdojo/codex/orchestrator.md` と `.specdojo/antigravity/orchestrator.md` は SSOT と diff なしで一致した。`npm run check`（1658 tests）と `npm run lint:md` が通過した。
- ローカル feature ブランチ `feature/prj-0001/readme-orchestrator` で実装し、`--no-ff` merge で develop へ統合した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-8xqz-orchestrator-distribution-and-ssot]]
- [[prj-0001:pjr-09kk-npm-onboarding-path]]
- [[specdojo:orchestrator-operation-guide]]
- [[specdojo:quick-start-guide]]
- `README.md`
