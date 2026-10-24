---
specdojo:
  id: prj-0001:pjr-9482-init-roster-gpt6-expert-tier
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-24T12:51:55Z"
  block_reason: "agent exited with non-zero code: parent validation failed: test-integration; rate limit fallback: sol-executor -> opus-executor at 2026-10-24T12:53:50.053Z"
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

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- PJR-2ASZ（gemma の雛形の見直し）
