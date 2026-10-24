---
specdojo:
  id: prj-0001:pjr-evaq-codex-agent-defs-gpt6
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-24T13:26:42Z"
  derived_from:
    - PJR-9482
---

# PJR-EVAQ codex の agent の定義のモデルを GPT-6 に上げる

## 1. 概要

codex の agent の定義（本リポジトリの .codex/agents と配布する templates/codex/agents）のモデルが gpt-5.6-terra などのままで、GPT-6 の系統には terra がない。orch の script は -m でモデルを渡すため今は影響しないが、agent の定義だけで起動したときに古いモデルが使われる

## 2. 完了条件

- 次の版の範囲とする（2026-10-24、利用者が承認）。
- 根拠: OpenAI の公式のモデルの一覧（<https://learn.chatgpt.com/docs/models>、2026-10-24 確認）。`gpt-5.4-mini` は 2026-08-31 に、`gpt-5.5` は 2026-10-14 に Codex（ChatGPT でのサインイン）から外れた。`gpt-5.6-terra` は移行のあいだだけ使える。GPT-6 の系統は `gpt-6-astra`・`gpt-6.1-sol`・`gpt-6-sol`・`gpt-6-luna`。
- 配布する `templates/codex/agents/*.toml` のモデルを、名簿の雛形（PJR-9482）と同じ 2 段にそろえる。`codex-executor`・`codex-review-executor` は `gpt-6-luna`、`codex-expert-executor`・`codex-expert-review-executor` は `gpt-6.1-sol`、`specdojo-orchestrator` は `gpt-6.1-sol` とする。`model_reasoning_effort` は、モデルが受け付ける値にする（`gpt-6-luna` は Ultra を使わない）。
- `specdojo-orchestrator.toml` を `npm run orchestrator:sync`（`tools/generate-orchestrator-wrappers.mjs`）が作っている場合は、生成の元のモデルの指定を直し、同期の検査が通るようにする。
- 本リポジトリの `.codex/agents/*.toml` は保護された設定のため変えない。同じ内容に上げる変更案を result に書く（反映はオーケストレーター）。
- [[specdojo:exec-config-guide]] と `templates/codex/README.md` の codex の agent の定義のモデルの記述を合わせ、既存の利用者が自分の `.codex/agents` を書き換える方法を書く。
- 単体テストで、配布する codex の agent の定義のモデルが、外れたモデル（`gpt-5.4-mini`・`gpt-5.5`）と `gpt-5.6-*` を使っていないことを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 3. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | codex の agent の定義のモデルを GPT-6 に上げる | DEV  | done | -    |

## 4. 対応結果

- 実施内容:
  - 配布する `templates/codex/agents/*.toml` のモデルを、名簿の雛形（PJR-9482）と同じ GPT-6 の 2 段構成にそろえた。
    - `codex-executor.toml`・`codex-review-executor.toml`: `gpt-6-luna`（`model_reasoning_effort = "medium"`）
    - `codex-expert-executor.toml`・`codex-expert-review-executor.toml`: `gpt-6.1-sol`（`model_reasoning_effort = "high"`）
    - `specdojo-orchestrator.toml`: `gpt-6.1-sol`（`model_reasoning_effort = "medium"`）
  - `npm run lint:orchestrator-sync` を実行し、`specdojo-orchestrator.toml` の同期検査が通ることを確認した。
  - 単体テスト `tests/src/shared/provider-scaffold.test.ts` にテストを追加し、配布する codex の agent の定義が提供終了モデル（`gpt-5.4-mini`・`gpt-5.5`）や移行用モデル（`gpt-5.6-*`）を使わず、GPT-6 系（`gpt-6-luna`・`gpt-6.1-sol`）を使用していることを確かめた。
  - 文書は `templates/codex/README.md` と [[specdojo:exec-config-guide]]（配布 subagent のモデルと既存利用者が `.codex/agents` を書き換える手順）および CHANGELOG の `## [Unreleased]` を更新した。
- 成果物:
  - `templates/codex/agents/codex-executor.toml`
  - `templates/codex/agents/codex-review-executor.toml`
  - `templates/codex/agents/codex-expert-executor.toml`
  - `templates/codex/agents/codex-expert-review-executor.toml`
  - `templates/codex/agents/specdojo-orchestrator.toml`
  - `templates/codex/README.md`
  - `docs/ja/specdojo/guides/exec-config-guide.md`
  - `tests/src/shared/provider-scaffold.test.ts`
  - `CHANGELOG.md`
- 残課題:
  - 本リポジトリの `.codex/agents/*.toml` は保護された設定のため変更していない。オーケストレーターが反映する変更案は次のとおり。
    - `.codex/agents/codex-executor.toml`・`codex-review-executor.toml` の `model` を `gpt-6-luna` にする。
    - `.codex/agents/codex-expert-executor.toml`・`codex-expert-review-executor.toml` の `model` を `gpt-6.1-sol` にする。
    - `.codex/agents/specdojo-orchestrator.toml` の `model` を `gpt-6.1-sol` にする。

## 5. 関連ドキュメント

- PJR-9482（名簿の雛形の GPT-6 と expert の 2 段）
- [[specdojo:exec-config-guide]]
