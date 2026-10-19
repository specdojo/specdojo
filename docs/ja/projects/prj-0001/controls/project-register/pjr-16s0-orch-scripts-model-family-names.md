---
specdojo:
  id: prj-0001:pjr-16s0-orch-scripts-model-family-names
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-19T21:17:49Z"
  block_reason: "agent exited with non-zero code: Error: Cannot connect to API: Unable to connect. Is the computer able to access the url?"
  derived_from:
    - PJR-ZM1K
---

# PJR-16S0 配布する orch の script の名前を model の系統にそろえる

## 1. 概要

init が作る orch の script は、claude だけ model の系統（orch:opus・orch:sonnet）で、codex・antigravity は provider の名前（orch:codex・orch:agy）で model も指定していない。ZM1K の名付けに合わせ、codex は orch:sol・orch:terra、antigravity は orch:flash にし、model を指定する。opencode はローカルの model が利用者の環境ごとに違うため orch:opencode のままとする（2026-10-20、利用者が提案）

## 2. 完了条件

- `src/shared/provider-scaffold.ts` の `ORCHESTRATOR_NPM_SCRIPTS` を、次の名前と model の指定に改める。claude（`orch:opus`・`orch:sonnet`）と opencode（`orch:opencode`）は今のまま。
  - codex: `orch:sol`（`-m gpt-5.6-sol`）と `orch:terra`（`-m gpt-5.6-terra`）。`orch:codex` は作らない。
  - antigravity: `orch:flash`（`--model gemini-3.8-flash-high`）。`orch:agy` は作らない。
- model の版は、名簿の雛形（`templates/init-agent-members.yaml`）の実体の `model` と同じ値にし、どちらを正本にするかを result に書く。
- `init` の最後の案内に出す script の名前を、新しい名前に合わせる。
- 既存の利用者の `package.json` は書き換えない（`init` も `config scaffold` も、既にある script を上書きしない）。古い名前から新しい名前への移り方を、CHANGELOG と [[specdojo:orchestrator-operation-guide]] に書く。
- 配布するガイド・テンプレートの README（`templates/codex/README.md`・`templates/antigravity/README.md` など）とコマンドリファレンスの `orch:codex`・`orch:agy` を、新しい名前に改める。
- LP（`../specdojo-lp`）は変えない。LP の変更は prj-0002 の PJR-SGM6 で行う。
- 単体テストで、provider ごとに作られる script の名前と model の指定を確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ |
| --- | -------------------------------------- | ---- | ---- | ---- |
| 1   | 配布する orch の script の名前を改める | DEV  | done | -    |

## 4. 対応結果

- `ORCHESTRATOR_NPM_SCRIPTS` をモデル系統名へ改め、Codex は `orch:sol`・`orch:terra`、Antigravity は `orch:flash` をモデル指定付きで生成するようにした。Claude Code と OpenCode は従来の名前を維持した。
- `init` の案内、README、運用ガイド、コマンドリファレンス、設計書、CHANGELOG を新しい名前へ揃え、旧名からの移行手順を記載した。本リポジトリ自身の Antigravity 起動スクリプト名は保護対象の `package.json` にあるため、この executor では変更せず、人または対話型 orchestrator が `orch:agy`・`orch:agy:work` を `orch:flash`・`orch:flash:work` へ改める申し送りとした。
- provider ごとの生成スクリプト名・モデル指定、旧名を生成しないこと、既存の旧名を上書きしないこと、`init` の案内を単体テストで確認した。
- model の版は `templates/init-agent-members.yaml` の実体を正本とし、Antigravity の `flash-*` 実体も `gemini-3.8-flash-high` へ揃えた。`ORCHESTRATOR_NPM_SCRIPTS` と単体テストで同じ値を固定した。保護対象の `package.json` への上記改名だけは申し送りとして残る。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（名付けの決定）
- prj-0002 の PJR-SGM6（LP の記述の変更）
