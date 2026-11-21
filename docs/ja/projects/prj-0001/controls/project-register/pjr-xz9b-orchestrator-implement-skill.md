---
specdojo:
  id: prj-0001:pjr-xz9b-orchestrator-implement-skill
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: specdojo-orchestrator
  registered_at: "2026-11-21T23:16:40Z"
  derived_from:
    - PJR-DEF1
---

# PJR-XZ9B オーケストレーターが自分で、または subagent で項目を実装する手順を skill にする

## 1. 概要

オーケストレーターが自分で実装する手順が playbook と判断に頼り、回ごとにぶれる。worktree と feature ブランチを作り、自分か subagent で実装し、検査・保護された設定の確認・commit・承認後の merge・片付けまでを skill に固定する。

## 2. 入力

- skill の正本は .agents/skills/`<skill-name>`/SKILL.md に置く。Codex はリポジトリの .agents/skills を標準で読む（<https://developers.openai.com/codex/skills>）。
- .claude/skills/`<skill-name>`/SKILL.md は、frontmatter と正本を最初に読んで従う指示だけの薄いラッパーにする。シンボリックリンクは Windows と npm の配布で動きが怪しいため使わない（indie の決定、2026-11-22）。読み落としが起きたら、本文を写して lefthook で一致を保つ方式へ移す。
- subagent での実装は Claude Code の skill の context: fork と agent で指定できる（<https://code.claude.com/docs/en/skills>）。skill 全体は fork させず、実装の段だけを subagent に渡し、検査と確認はオーケストレーターが行う。
- 作業は worktree を作り feature/`<project-id>`/`<topic>` で行う。いまの作業ツリー（develop）は runner の統合と記帳に使うため切り替えない（indie の決定、2026-11-22）。
- SpecDojo のコマンドには、register の項目を worktree で準備・commit・統合する段のコマンドがない（exec worktree prepare/commit/merge は --task のみ）。段のコマンドは DEF1 の続きとして別に扱う。
- 実装者は specdojo-orchestrator（indie の指定、2026-11-22）。.agents/skills と .claude は executor が書けない保護された場所のため、この項目を skill の最初の利用例にする。

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
