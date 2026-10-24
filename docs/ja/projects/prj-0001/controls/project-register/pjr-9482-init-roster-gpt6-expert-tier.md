---
specdojo:
  id: prj-0001:pjr-9482-init-roster-gpt6-expert-tier
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-24T12:51:55Z"
  derived_from:
    - PJR-2ASZ
---

# PJR-9482 配布する名簿の雛形を GPT-6 と expert の 2 段にそろえる

## 1. 概要

雛形の codex の実体は gpt-5.6-terra の terra だけで、expert の段（sol・opus）もない。codex は normal を gpt-6-luna の luna、expert を gpt-6.1-sol の sol、claude は normal を sonnet、expert を opus とし、codex-expert-executor と claude-expert-executor の別名を加える。init の振り分けの表と orch の script も合わせる

## 2. 完了条件

- v0.4.6 の範囲とする（2026-10-24、利用者が承認）。
- 根拠: OpenAI の公式のモデルの一覧（<https://learn.chatgpt.com/docs/models>、2026-10-24 確認）では、GPT-6 の系統は `gpt-6-astra`・`gpt-6.1-sol`・`gpt-6-sol`・`gpt-6-luna` で、terra はない。`gpt-6.1-sol` は複雑なコーディングと agent の作業に推奨、`gpt-6-luna` は効率のよいモデルで、推論は Max まで（Ultra は不可）。`gpt-5.6-sol`・`gpt-5.6-terra`・`gpt-5.6-luna` は移行のあいだだけ使える。
- `templates/init-agent-members.yaml` を次の 2 段にする。expert の実体には `proficiency: expert` を付ける（本リポジトリの名簿と同じ形）。
  - claude の normal: `sonnet-executor`・`sonnet-review-executor`・`sonnet-reporter`（今のまま）
  - claude の expert: `opus-executor`・`opus-review-executor`（新設）
  - codex の normal: `luna-executor`・`luna-review-executor`・`luna-reporter`（`gpt-6-luna`、新設。今の `terra-*` は雛形から外す）
  - codex の expert: `sol-executor`・`sol-review-executor`（`gpt-6.1-sol`、新設）
- 別名を次の向きにする。`claude-executor`・`claude-review-executor`・`claude-reporter` は sonnet、`claude-expert-executor`・`claude-expert-review-executor` は opus、`codex-executor`・`codex-review-executor`・`codex-reporter` は luna、`codex-expert-executor`・`codex-expert-review-executor` は sol。今ある別名の名前は変えない。
- 各実体の `effort`（または相当の項目）は、モデルが受け付ける値にする（`gpt-6-luna` は Ultra を使わない）。claude と codex の `command_template` が `{model}` などを今のまま組み立てられることを単体テストで確かめる。
- `specdojo init` の振り分けの表（`routing`）を、hard は expert の別名、medium と easy は normal の別名、reporter は normal の別名にする。選んだ provider に expert の段がない場合（opencode・antigravity など）は今の作り方のままとする。
- `init` と `config scaffold` が作る codex の `orch:*` を、`orch:sol`（`gpt-6.1-sol`）と `orch:luna`（`gpt-6-luna`）にし、`orch:terra` は作らない。claude の `orch:opus`・`orch:sonnet` は今のまま。既存の利用者の名簿・`package.json` は書き換えない。
- `gpt-6-astra` は雛形の既定に入れず、[[specdojo:exec-config-guide]] に名簿に足す例として書く。provider ごとの README と [[specdojo:exec-config-guide]] の名簿の説明を、新しい 2 段に合わせる。
- 本リポジトリの `.specdojo/agent-members.yaml` と `package.json` は保護された設定のため変えない。同じ形に上げる変更案（本リポジトリの `sol-*` を `gpt-6.1-sol` に、`terra-*` を `luna-*`（`gpt-6-luna`）に置き換え、別名の向き先を合わせる、`orch:terra` を `orch:luna` に）を result に書く（反映はオーケストレーター）。
- 単体テストで、`init` で claude と codex を選んだときの名簿の実体と別名、振り分けの表、`orch:*` を確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。既存の利用者の名簿は変わらないことと、新しい名前への書き換え方を書く。

## 3. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ   |
| --- | ---------------------------------------------- | ---- | ---- | ------ |
| 1   | 名簿の雛形を GPT-6 と expert の 2 段にそろえる | DEV  | open | v0.4.6 |

## 4. 対応結果

- `templates/init-agent-members.yaml` を 2 段にした。claude は normal の `sonnet-*` に expert の `opus-executor`・`opus-review-executor` を加えた。codex は `terra-*` を外して normal の `luna-*`（`gpt-6-luna`）と expert の `sol-executor`・`sol-review-executor`（`gpt-6.1-sol`）にした。expert には `proficiency: expert` を付けた。別名 `claude-expert-executor`・`claude-expert-review-executor`・`codex-expert-executor`・`codex-expert-review-executor` を加え、`codex-executor` などは `luna-*` へ向けた。
- reasoning effort は雛形の `init-exec-defaults.yaml` の `by_proficiency`（normal は `medium`、expert は `high`）のまま。`gpt-6-luna` へ Ultra を渡さない。
- `src/commands/init.ts` の振り分けの表は、hard を expert の別名（ない provider は normal の別名）、medium・easy と reporter を normal の別名にした。normal の executor と reporter は `proficiency: expert` 以外から選ぶ。
- `src/shared/provider-scaffold.ts` の codex の `orch:*` を `orch:sol`（`gpt-6.1-sol`）と `orch:luna`（`gpt-6-luna`）にし、`orch:terra` は作らないようにした。既存のスクリプトは引き続き上書きしない。
- 単体テスト（`tests/src/commands/init.test.ts`・`tests/src/shared/provider-scaffold.test.ts`）で、名簿の実体・別名・振り分けの表・`orch:*`、`command_template` の `{model}` と effort の組み立てを確かめる。統合テスト `tests/src/commands/init-agent-roster.integration.test.ts` の別名の一覧にも expert の 4 つの別名を加えた。
- 文書は `templates/claude/README.md`・`templates/codex/README.md`・[[specdojo:exec-config-guide]]（2 段の表、`gpt-6-astra` を足す例、0.4.5 までの名簿から移す手順）・command-reference・orchestrator-operation-guide の `init` の説明と CHANGELOG の `## [Unreleased]` を更新した。
- 残課題: 本リポジトリの `.specdojo/agent-members.yaml` と `package.json` は保護された設定のため変えていない。オーケストレーターが反映する変更案は次のとおり。
  - `.specdojo/agent-members.yaml`: `sol-executor`・`sol-review-executor` の `model` を `gpt-6.1-sol` にする。`terra-executor`・`terra-review-executor`・`terra-reporter` を `luna-executor`・`luna-review-executor`・`luna-reporter`（`model: gpt-6-luna`）に名前を変え、`aliases` の `codex-executor`・`codex-review-executor`・`codex-reporter` の `alias_of` を `luna-*` にする。
  - `package.json`: `orch:sol`・`orch:sol:work` の `-m` を `gpt-6.1-sol` にし、`orch:terra`・`orch:terra:work` を `orch:luna`・`orch:luna:work`（`-m gpt-6-luna`）に置き換える。
- 範囲外として残したもの: codex の subagent の定義（`templates/codex/agents/*.toml`）の `model` は利用者が調整する項目のため変えていない。`specdojo-orchestrator.toml` は `gpt-5.6-terra` のままで、`orch:*` は `-m` で model を明示する。製品設計の `sysd-orchestrator-agent-settings.md` と運用ガイドの本リポジトリ向けの `orch:*` の表は、本リポジトリの `package.json` に合わせて反映時に直す。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- PJR-2ASZ（gemma の雛形の見直し）
