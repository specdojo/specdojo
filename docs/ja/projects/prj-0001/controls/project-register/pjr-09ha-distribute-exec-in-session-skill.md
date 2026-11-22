---
specdojo:
  id: prj-0001:pjr-09ha-distribute-exec-in-session-skill
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-22T05:44:25Z"
  derived_from:
    - PJR-XZ9B
---

# PJR-09HA skill specdojo-exec-in-session を利用者のリポジトリへ配る

## 1. 概要

オーケストレーターが会話の中で項目を実装する手順の skill を、templates と scaffold で利用者のリポジトリへ配る。正本は .agents/skills に置き、Claude Code などにはラッパーを置く

## 2. 入力

- PJR-XZ9B で skill の正本 .agents/skills/specdojo-exec-in-session/SKILL.md と Claude Code のラッパー .claude/skills/specdojo-exec-in-session/SKILL.md を足した。配布は XZ9B の範囲外とした。
- 2026-11-22、indie の判断で skill も配ることにした。
- 配る仕組みは src/shared/provider-scaffold.ts で、templates/`<provider>`/ の agents・rules と、それ以外を .specdojo/`<provider>`/ へ写す。skills を写す経路はまだない。
- Codex はリポジトリの .agents/skills を標準で読む。opencode と Copilot がどこから skill を読むかは未確認。
- .agents/skills と .claude は executor が書けない保護された設定のため、正本はこの項目では変えない。配る原本は templates/ に置く。

## 3. 完了条件

- 正本 `.agents/skills/specdojo-exec-in-session/SKILL.md` を、`templates/` の配る原本へ写す。写すのは `npm run orchestrator:sync`（`tools/generate-orchestrator-wrappers.mjs`）とし、写し漏れは `tools/validate-orchestrator-sync.mjs` の系統で検出する。原本を手で 2 か所に持たない。
- `specdojo provider scaffold`（Claude Code・Codex・opencode・Copilot）で、利用者のリポジトリに正本 `.agents/skills/specdojo-exec-in-session/SKILL.md` を置く。provider が `.agents/skills` を読まない場合は、その provider の読む場所にラッパー（Claude Code では `.claude/skills/specdojo-exec-in-session/SKILL.md`）も置く。既にあるファイルは、`--force` なしでは上書きしない。
- opencode と Copilot が skill をどこから読むかは executor が一次情報（公式の文書）で確かめる。ラッパーが要るかを決め、確かめた URL と理由を個票の対応結果に書く。
- 配る本文に、このリポジトリに固有の記述を残さない。`src/` のパスなど利用者のリポジトリにないものは、利用者のリポジトリでのパス（`node_modules/specdojo/dist/...` など）に書き換える。正本の変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く（正本は保護された設定のため、executor は変えない）。
- `package.json`・`lefthook.yml` などの保護された設定の変更が要る場合も、案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとでオーケストレーターが行う。
- 単体テストで、provider ごとに置かれるファイルの一覧と、既にあるファイルを上書きしないことを確かめる。
- `command-reference` の `provider scaffold` の節と、関係するガイドの説明を直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分「追加」と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが `npm pack` した tarball を空のリポジトリに入れて `provider scaffold --provider claude` を流し、新しいセッションの Claude Code がラッパーから正本を読むことを確かめる。

## 4. 作業内容

| No  | 作業                                       | 担当                  | 状態 | メモ                                                                                                        |
| --- | ------------------------------------------ | --------------------- | ---- | ----------------------------------------------------------------------------------------------------------- |
| 1   | provider ごとの skill の読み場所を確かめる | DEV                   | done | 4 provider の公式文書の URL を対応結果に記載                                                                |
| 2   | 原本の写しと検査を足す                     | DEV                   | done | `SKILL_COPIES` を `orchestrator:sync` と `lint:orchestrator-sync` に追加                                    |
| 3   | scaffold で置く                            | DEV                   | done | `templates/agent-skills/` を 4 provider の `.agents/skills/` へ、Claude Code にはラッパーも置く             |
| 4   | テストと文書、CHANGELOG の文案             | DEV                   | done | 単体テスト、command-reference と 2 つのガイド、CHANGELOG の文案                                             |
| 5   | 空のリポジトリで確かめる                   | specdojo-orchestrator | open | 統合の後にオーケストレーターが `npm pack` で行う。executor の範囲外で、Claude Code の新しいセッションが要る |

## 5. 対応結果

### 5.1. CHANGELOG に書く事項

- 区分: 追加
- 文案: `config scaffold --provider`（`init` の provider 設定も同じ）が、オーケストレーターが会話の中で登録簿の項目を実装する手順の skill `specdojo-exec-in-session` を配るようにしました。正本は `.agents/skills/specdojo-exec-in-session/SKILL.md` に置きます。Claude Code には、正本を読ませるラッパー `.claude/skills/specdojo-exec-in-session/SKILL.md` も置きます。既にあるファイルは `--force` なしでは上書きしません。

### 5.2. 実施内容

- `tools/validate-orchestrator-sync.mjs` に `SKILL_COPIES` を足した。正本 `.agents/skills/specdojo-exec-in-session/SKILL.md` を `templates/agent-skills/specdojo-exec-in-session/SKILL.md` へ、ラッパー `.claude/skills/specdojo-exec-in-session/SKILL.md` を `templates/claude/skills/specdojo-exec-in-session/SKILL.md` へ、ファイル全体で写す。`npm run orchestrator:sync` が写しを作り、`npm run lint:orchestrator-sync` が写し漏れ（`MISSING`）と食い違い（`MISMATCH`）を検出する。配布原本は sync で作ったもので、手で持たない。
- `src/shared/provider-scaffold.ts` で、`templates/agent-skills/**` を `claude`・`codex`・`copilot`・`opencode` の 4 provider で `.agents/skills/**` へ置くようにした。`templates/<provider>/skills/**` は `.<provider>/skills/**` へ置く。`agent-skills` は provider の一覧に出さず、`--provider agent-skills` は未知の provider として拒む。上書きの扱いは既存のファイルと同じで、`--force` なしでは上書きしない。
- 単体テスト: `tests/src/shared/provider-scaffold.test.ts` に provider ごとの skill の一覧、配布原本が正本と一致すること、`agent-skills` を provider として扱わないこと、既にある skill を `--force` なしで上書きしないことを足した。`tests/tools/validate-orchestrator-sync.test.ts` に写しの一覧、写し漏れ・食い違いの検出、sync が写しを作ることを足した。
- 文書: [[specdojo:command-reference|CLIコマンドリファレンス]] の `config scaffold` の説明、[[specdojo:exec-config-guide|exec 設定ガイド]] の「provider 設定の配布と scaffold」、[[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]] の「設定ファイルの構成」、`templates/claude/README.md` の配置表を直した。運用ガイドの「10個の同期対象」は数が変わったため「すべての同期対象」にした。

### 5.3. provider ごとの skill の読み場所

| provider    | リポジトリで読む場所                                                     | 一次情報                                                                                                  | ラッパー |
| ----------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | -------- |
| Claude Code | `.claude/skills/`（文書に `.agents/skills` の記載なし）                  | <https://code.claude.com/docs/en/skills>                                                                  | 要る     |
| Codex       | `$CWD/.agents/skills`、その親、`$REPO_ROOT/.agents/skills`               | <https://learn.chatgpt.com/docs/build-skills>（旧 <https://developers.openai.com/codex/skills> から転送） | 不要     |
| OpenCode    | `.opencode/skills`、`.claude/skills`、`.agents/skills`（根までの各階層） | <https://opencode.ai/docs/skills/>                                                                        | 不要     |
| Copilot CLI | `.github/skills`、`.claude/skills`、`.agents/skills`                     | <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills>                     | 不要     |

- OpenCode と Copilot は `.agents/skills` を読むため、正本だけを置き、ラッパーは置かない。
- OpenCode と Copilot は `.claude/skills` も読む。Claude Code と併せて scaffold すると、同じ名前の skill が `.agents/skills` と `.claude/skills` の両方に置かれる。ラッパーは正本を読ませるだけなので手順は変わらないが、重複の扱い（一覧に 2 件出るか）は未確認。_ASSUMPTION_: 害はないと見て、今回は置き分けない。

### 5.4. 正本と保護された設定の変更案（オーケストレーターが利用者の承認のもとで反映する）

配る本文は正本のバイト写しのため、正本にあるこのリポジトリに固有の記述がそのまま配られる。executor は正本を変えられないため、次の案を残す。正本を直した後に `npm run orchestrator:sync` を流すと、配布原本も直る。

1. 「使ってよい条件」の `src/exec/agent-protected-config.ts`（利用リポジトリでは `node_modules/specdojo/dist/exec/agent-protected-config.js`）を、`node_modules/specdojo/dist/exec/agent-protected-config.js` だけにする。
2. 手順の「承認を得て merge する」の 3（`src` を変えた場合は `npm run build` で dist を作り直す）は、specdojo を開発するこのリポジトリに固有のため、正本から消し、`pm-orchestrator-playbook.md` へ移す。
3. 「作業ツリー（対象 project の `develop`）」「作業ツリー（develop）」を、「統合ブランチ（`specdojo.config.json` の `integration_branch`）を出した作業ツリー」に替える。利用者のリポジトリの統合ブランチは `develop` とは限らない。
4. 「検査を流す」の `npm run docs:build` を「文書サイトのビルド」とし、npm の script 名を書かない。利用者のリポジトリには無い。
5. `lefthook.yml` の `orchestrator-sync` の `glob` に `.agents/skills/specdojo-exec-in-session/SKILL.md`、`.claude/skills/specdojo-exec-in-session/SKILL.md`、`templates/agent-skills/**`、`templates/claude/skills/**` を足す。足さないと、正本だけを変えた commit で写しが自動では直らない（`lint:orchestrator-sync` の検査では検出される）。
6. `package.json` の `files` は `templates` を含むため、変更は要らない。

### 5.5. 残課題

- 作業内容 5（空のリポジトリで `npm pack` の tarball から `config scaffold --provider claude` を流し、新しいセッションの Claude Code がラッパーから正本を読むことを確かめる）は、統合の後にオーケストレーターが行う。
- 変更案 1〜5 の反映。

## 6. 関連ドキュメント

- [[prj-0001:pjr-xz9b-orchestrator-implement-skill]]: skill の正本とラッパーを足した項目
- [[specdojo:command-reference|CLIコマンドリファレンス]]
- [[specdojo:exec-config-guide|exec 設定ガイド]]
- [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]
