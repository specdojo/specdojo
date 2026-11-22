---
specdojo:
  id: prj-0001:pjr-09ha-distribute-exec-in-session-skill
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-22T05:44:25Z"
  block_reason: "integrate failed: project: Result Markdown notation violation before commit: docs/ja/projects/prj-0001/execution/runs/register/PJR-09HA/pjr-09ha-20261122T062549Z-40297868/result.md:42:26 error MD034/n…"
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

| No  | 作業                                       | 担当                  | 状態 | メモ                     |
| --- | ------------------------------------------ | --------------------- | ---- | ------------------------ |
| 1   | provider ごとの skill の読み場所を確かめる | DEV                   | open | 一次情報の URL を残す    |
| 2   | 原本の写しと検査を足す                     | DEV                   | open | orchestrator:sync の系統 |
| 3   | scaffold で置く                            | DEV                   | open | 上書きしない             |
| 4   | テストと文書、CHANGELOG の文案             | DEV                   | open | -                        |
| 5   | 空のリポジトリで確かめる                   | specdojo-orchestrator | open | npm pack                 |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
