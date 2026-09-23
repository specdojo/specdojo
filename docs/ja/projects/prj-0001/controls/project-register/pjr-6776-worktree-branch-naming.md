---
specdojo:
  id: prj-0001:pjr-6776-worktree-branch-naming
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: ARC
  registered_at: "2026-09-10T13:16:40Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-10T15:15:32Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=package.json; agent must record the required change in the result …"
---

# PJR-6776 エージェント作業用 worktree のブランチ命名を統一する

## 1. 概要

エージェント作業用 worktree のブランチ名が揺れている。接頭辞の有無が agent によって異なり、
script の指定と実際のブランチが一致しない箇所もある。

## 2. 現状

| worktree       | script              | script の指定  | 実際のブランチ         | 整合  |
| -------------- | ------------------- | -------------- | ---------------------- | ----- |
| `claude-work`  | `orch:sonnet:work`  | `claude-work`  | `worktree-claude-work` | ○     |
| `codex-work`   | `orch:terra:work`   | `codex-work`   | `worktree-codex-work`  | **×** |
| `copilot-work` | `orch:copilot:work` | `copilot-work` | `copilot-work`         | ○     |
| `qwen-work`    | `orch:qwen:work`    | `qwen-work`    | `qwen-work`            | ○     |
| `gemma-work`   | `orch:gemma:work`   | `gemma-work`   | 未作成                 | —     |

`opencode-work` は script に存在せず、使用もされていなかったため削除した。

### 2.1. 原因は作成方法が 2 系統あること

Claude Code の `--worktree` は接頭辞を自動で付ける。

```json
"orch:sonnet:work": "claude --agent specdojo-orchestrator --model sonnet --worktree claude-work"
```

`claude-work` と指定して `worktree-claude-work` が作られる。配置も `.claude/worktrees/` 配下に
なる。

他は `git worktree add` で、ディレクトリ名がそのままブランチ名になる。

```json
"orch:copilot:work": "git worktree add ../worktrees/copilot-work 2>/dev/null; copilot ..."
```

`worktree-codex-work` は script から作られたものではない。script は `codex-work` を指定して
おり、実在するブランチと一致しない。過去に Claude Code 経由で作られたか手動で作られたものと
推測する。

## 3. 命名規則の案

リポジトリは既にスラッシュ区切りの名前空間を使っている。

```text
exec/prj-0001-PJR-BKQ0
project/prj-0001/develop
feature/prj-0001/register-item-file-as-ssot
docs/revise-contents-guilde
```

`worktree-claude-work` だけがハイフン区切りで、この慣例から外れる。

| 案                         | 例                        | 評価                   |
| -------------------------- | ------------------------- | ---------------------- |
| 接頭辞なし                 | `codex-work`              | 用途が名前から読めない |
| `worktree-` ハイフン       | `worktree-codex-work`     | 既存の慣例と不一致     |
| **`worktree/` スラッシュ** | **`worktree/codex-work`** | **`exec/` と揃う**     |

スラッシュを推す理由は 3 点ある。

**名前空間が一貫する**。`exec/` が一時ブランチ、`worktree/` が常設の作業ブランチとして用途が
読める。

**git のツールが名前空間として扱える**。`git branch --list "worktree/*"` で一括列挙できる。
`exec/*` では実際にこの方法で残骸を検出した実績がある。

**補完とフィルタが効く**。多くの git UI がスラッシュを階層として表示する。

## 4. 決定事項

### 4.1. 命名は `worktree/` とする

スラッシュ区切りの名前空間を採る。`exec/` と揃い、`git branch --list "worktree/*"` で一括列挙
できる。

### 4.2. Claude Code も `git worktree add` で作る

`--worktree` は使わない。ブランチ名を指定する手段がなく、接頭辞 `worktree-` の付与を回避
できない。

```text
-w, --worktree [name]   Create a new git worktree for this session (optionally specify a name)
```

他の agent と同じ形へ揃える。`-C` 相当のオプションはないが、`cd` で代替できる。

```sh
git worktree add ../worktrees/claude-work 2>/dev/null
cd ../worktrees/claude-work && claude --agent specdojo-orchestrator --model sonnet
```

配置も統一される。現在 claude だけ `.claude/worktrees/claude-work` にあり、他は
`../worktrees/` 配下にある。

### 4.3. `--tmux` は使わない

`--tmux` は `--worktree` を前提とするため、あわせて使えなくなる。

```text
--tmux   Create a tmux session for the worktree (requires --worktree).
         Uses iTerm2 native panes when available; use --tmux=classic for traditional tmux.
```

worktree ごとに tmux セッションを自動作成する機能だが、自動化しているのは実質 1 行である。

```sh
tmux new-session -A -s claude-work -c ../worktrees/claude-work
```

iTerm2 のネイティブペインは devcontainer 内では利用できず、`--tmux=classic` の経路になる。
必要になれば script 側で `tmux new-session` を明示できる。命名の統一を優先する。

## 5. 完了条件

- エージェント作業用の worktree ブランチが `worktree/<name>` の形になっている。
- `worktree-codex-work` と script の不整合が解消している。
- `package.json` の script が `git worktree add` で worktree を作り、指定と実際のブランチ名が
  一致する。Claude Code の `--worktree` を使わない。
- 5 つの worktree の配置が `../worktrees/<name>` へ揃っている。`.claude/worktrees/` を使わない。
- `git branch --list "worktree/*"` で作業用ブランチを一括列挙できる。
- 命名規則と `--worktree` を使わない理由が規範文書に記述されている。
- `tools/worktree/sync.sh` が改名後も動作する。
- 改名の前に各 worktree の未コミット変更と独自コミットを確認し、失われるものがないことを
  確かめている。

## 6. 作業内容

| No  | 作業                                             | メモ                        |
| --- | ------------------------------------------------ | --------------------------- |
| 1   | 各 worktree の未コミット変更と独自コミットを確認 | 改名前の安全確認            |
| 2   | 既存ブランチを `worktree/<name>` へ改名          | worktree の付け替えを伴う   |
| 3   | claude の worktree を `../worktrees/` へ移す     | `.claude/worktrees/` から   |
| 4   | `package.json` の script を揃える                | `--worktree` を使わない形へ |
| 5   | 規範文書へ命名規則と判断理由を記述する           |                             |
| 6   | `sync.sh` の動作を確認する                       |                             |

## 7. 対応結果

- 既存の Claude Code、Codex、GitHub Copilot、OpenCode / Qwen の4 worktree は、未コミット変更と `project/prj-0001/develop` に含まれない独自 commit がいずれもないことを確認した。4ブランチは同ブランチより遅れているだけで、Gemma 用 worktree は未作成だった。
- `tools/worktree/open-agent-worktree.sh` を追加し、`worktree/<name>` と `../worktrees/<name>` の対応を作成・検証してから agent を起動する形へ統一した。不一致時は agent を起動せずエラーにするため、script の指定と実際のブランチが食い違ったまま作業を続けない。
- `package.json` の7つの `orch:*:work` は共通スクリプトを呼び出す提案差分へ更新した。このファイルは agent の固定保護対象であるため、親 runner の `agent-config-write` による block 後、人または対話型 orchestrator が agent 実行外で差分を適用する必要がある。
- [[specdojo:git-branching-standard|Git ブランチ運用標準]]、[[sysd-orchestrator-agent-settings|SpecDojo オーケストレーターエージェント設定]]、[[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]へ命名・配置・Claude Code の `--worktree` を使わない理由を反映した。
- branch/worktree の改名と Claude Code worktree の移動は Git 状態および作業ディレクトリ外を変更するため、この executor では実行していない。保護対象差分の適用時に、安全確認済みの4 worktree を移行する必要がある。

移行は primary worktree で次の順に行う。再実行時にも各 worktree の未コミット変更と独自 commit を確認してから実行する。

```sh
git -C .claude/worktrees/claude-work branch -m worktree/claude-work
git worktree move .claude/worktrees/claude-work ../worktrees/claude-work
git -C ../worktrees/codex-work branch -m worktree/codex-work
git -C ../worktrees/copilot-work branch -m worktree/copilot-work
git -C ../worktrees/qwen-work branch -m worktree/qwen-work
```

Gemma 用は未作成のため、設定適用後の初回 `npm run orch:gemma:work` で `worktree/gemma-work` として作成される。

## 8. 関連ドキュメント

- [[prj-0001:pjr-5hhs-exec-branch-not-deleted]]: `exec/*` ブランチの整理。名前空間の活用例。
