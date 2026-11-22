---
specdojo:
  id: prj-0001:xer-pjr-09ha-20261122t062549z-40297868
  type: exec-result
  task_id: PJR-09HA
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-09HA/pjr-09ha-20261122T062549Z-40297868/plan.md
  started_at: "2026-11-22T06:25:50.387Z"
  completed_at: "2026-11-22T06:40:52.379Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- skill specdojo-exec-in-session の配布を実装した。正本は orchestrator:sync で templates/agent-skills/ と templates/claude/skills/ へバイト一致で写し、lint:orchestrator-sync が写し漏れを検出する。provider scaffold は 4 provider で .agents/skills/ に正本を、Claude Code には .claude/skills/ のラッパーも置き、既にあるファイルは --force なしでは上書きしない。単体テスト・文書・個票（CHANGELOG の文案、一次情報の URL、変更案）を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+3 / -1 行
- `docs/ja/specdojo/guides/orchestrator-operation-guide.md`: 変更、+2 / -2 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `src/shared/provider-scaffold.ts`: 変更、+33 / -3 行
- `templates/claude/README.md`: 変更、+8 / -7 行
- `tests/src/shared/provider-scaffold.test.ts`: 変更、+80 / -0 行
- `tests/tools/validate-orchestrator-sync.test.ts`: 変更、+66 / -1 行
- `tools/generate-orchestrator-wrappers.mjs`: 変更、+18 / -4 行
- `tools/validate-orchestrator-sync.mjs`: 変更、+36 / -2 行
- `templates/agent-skills/specdojo-exec-in-session/SKILL.md`: 追加、+126 / -0 行
- `templates/claude/skills/specdojo-exec-in-session/SKILL.md`: 追加、+11 / -0 行

## 3. 申し送り

- 正本 `.agents/skills/specdojo-exec-in-session/SKILL.md` の変更案（保護された設定のため未反映。反映後に `npm run orchestrator:sync` を流すと配布原本も直る）: (1) `src/exec/agent-protected-config.ts`（利用リポジトリでは …）を `node_modules/specdojo/dist/exec/agent-protected-config.js` だけにする。(2) 「承認を得て merge する」の `src` を変えたら `npm run build` の段を正本から消し、`pm-orchestrator-playbook.md` へ移す。(3) 「作業ツリー（develop）」を「統合ブランチ（`integration_branch`）を出した作業ツリー」に替える。(4) `npm run docs:build` を「文書サイトのビルド」にする。
- `lefthook.yml` の `orchestrator-sync` の `glob` に `.agents/skills/specdojo-exec-in-session/SKILL.md`、`.claude/skills/specdojo-exec-in-session/SKILL.md`、`templates/agent-skills/**`、`templates/claude/skills/**` を足す案。足さないと、正本だけを変えた commit で写しが自動では直らない（`lint:orchestrator-sync` では検出される）。
- 作業内容 5（統合の後に `npm pack` の tarball を空のリポジトリへ入れて `config scaffold --provider claude` を流し、新しいセッションの Claude Code がラッパーから正本を読むかを確かめる）は specdojo-orchestrator が行う。個票では open のまま。
- `_ASSUMPTION_:` OpenCode と Copilot は `.claude/skills` も読むため、Claude Code と併せて scaffold すると同じ名前の skill が 2 か所に置かれる。ラッパーは正本を読ませるだけなので害はないと見たが、重複の扱いは確かめていない。
- provider ごとの読み場所の一次情報: <https://code.claude.com/docs/en/skills> 、 <https://learn.chatgpt.com/docs/build-skills> 、 <https://opencode.ai/docs/skills/> 、 <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills>

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
