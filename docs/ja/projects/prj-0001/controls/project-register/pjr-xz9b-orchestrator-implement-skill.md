---
specdojo:
  id: prj-0001:pjr-xz9b-orchestrator-implement-skill
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: medium
  owner: specdojo-orchestrator
  registered_at: "2026-11-21T23:16:40Z"
  completed_at: "2026-11-22T05:16:26Z"
  conclusion: skill specdojo-exec-in-session の正本と Claude Code のラッパーを develop に入れ、新しいセッションでラッパーから正本が読まれることを確かめた。配布は別の todo で扱う
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

- skill の名前を `specdojo-exec-in-session` とする。Agent Skills の仕様（<https://agentskills.io/specification>）に沿い、`name` とフォルダーの名前を一致させる。`specdojo-` で始めるのは、一般的な名前の skill や組み込みのコマンドと重ならないようにするため（indie の決定、2026-11-22）。
- 正本を `.agents/skills/specdojo-exec-in-session/SKILL.md` に置く。`.claude/skills/specdojo-exec-in-session/SKILL.md` は、frontmatter（`name`・`description`）と「最初に正本を読み、それに従う」という指示だけの薄いラッパーにする。シンボリックリンクは使わない。
- 正本の冒頭に範囲を書く。最初の版は登録簿の項目（edit）だけを扱う。schedule のタスクと review の段は対象外で、後で広げると明記する。
- 正本に、使ってよい条件を書く。利用者が実装者にオーケストレーターを指定した場合と、executor が書けない保護された設定を変える場合に限る。それ以外は `exec run --register` を使う。
- 正本に、次の手順を順に書く。各段で使うコマンドを、実在するもの（`npx specdojo git -- <git の引数>`・`register ... --commit` など）で示す。
  - 対象の項目と完了条件を読み、実装者の指定を確かめる。
  - `feature/<project-id>/<topic>` のブランチで worktree を作る。作業ツリー（develop）は切り替えない。worktree で検査を流すための依存の用意の仕方も書く。
  - 実装する。自分で書くか、Claude Code の subagent（`.claude/agents/claude-executor.md` など）に渡すかの選び方を書く。subagent には完了条件・worktree のパス・変えてはいけないものを渡し、その報告を信じず、オーケストレーターが差分と検査で確かめる。
  - `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` と同じ検査を worktree で流す。
  - 差分に保護された設定が入っていないかを、runner と同じ一覧（`src/exec/agent-protected-config.ts`）に照らして確かめる。入っている場合は、利用者の承認を得たものだけを残す。
  - worktree で commit する。commit メッセージの方針は orchestrator の定めに従う。
  - 差分の要約を示し、利用者の承認を得て develop へ `--no-ff` で merge する。`src` を変えた場合は、merge の後に dist を作り直す。`git push` と PR は行わず、コマンドを示して利用者へ引き渡す。
  - 個票の対応結果を書き、確かめた結果に応じて close するか review のまま残す。
  - merge を確かめたら、worktree とブランチを片付ける。
- `.agents/specdojo-orchestrator.agent.md` に、自分で実装するときはこの skill に従うと 1 行で書き、`npm run orchestrator:sync` で各環境のラッパーと `templates/` へ反映する。
- 利用者のリポジトリへ配布する（`templates/` や scaffold）かどうかは、この項目では扱わない。案を個票の対応結果に書く。
- merge の後、実装者にオーケストレーターが指定された別の項目で 1 回使う。Claude Code がラッパーから正本を読んだかを確かめ、読み落としがあれば、本文を写して lefthook で一致を保つ方式へ移す案を個票の対応結果に書く。
- `CHANGELOG.md` は変えない。配布しないため、個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` を通す。

## 4. 作業内容

| No  | 作業                                                | 担当                  | 状態 | メモ                         |
| --- | --------------------------------------------------- | --------------------- | ---- | ---------------------------- |
| 1   | worktree と feature ブランチを作る                  | specdojo-orchestrator | open | 作業ツリーは develop のまま  |
| 2   | 正本の SKILL.md を書く                              | specdojo-orchestrator | open | 範囲・使う条件・手順         |
| 3   | Claude Code のラッパーを書く                        | specdojo-orchestrator | open | シンボリックリンクは使わない |
| 4   | orchestrator の本文に 1 行足し、sync する           | specdojo-orchestrator | open | `npm run orchestrator:sync`  |
| 5   | 検査を流し、承認を得て merge し、片付ける           | specdojo-orchestrator | open | push と PR は利用者          |
| 6   | 別の項目で 1 回使い、結果と配布の案を対応結果に書く | specdojo-orchestrator | open | 正本を読んだかを確かめる     |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
