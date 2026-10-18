---
specdojo:
  id: prj-0001:pjr-yk1c-agent-alias-resolution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T22:18:27Z"
  due_on: null
  block_reason: "rate limit reached; rate limit fallback: agy-claude-expert-executor -> codex-expert-executor at 2026-10-18T07:51:01.439Z"
---

# PJR-YK1C agent の別名の解決と記録を実装する

## 1. 概要

--executor-by などの指定と自動選択で別名を実体へ解決し、model を command_template の {model} で CLI へ渡す。イベントと result の actor には実体の名前を記録する。 PJR-ZM1K の決定に基づく（Y8P9 の完了後、0.4.0）

## 2. 完了条件

- PJR-EANK の完了後に行う。
- `--executor-by`・`--reporter-by`・`--fallback-executor-by` などの指定と自動選択で、別名を実体へ解決する。実体の名前を直接指定しても動く。
- 実体の `model` を、command_template の `{model}` で CLI へ渡す。`{model}` を持たない command_template と、model を持たない実体は今のまま動く。
- イベントと result の actor には、別名ではなく実体の名前を記録する。指定した別名も分かるように記録するかを決めて実装し、理由を result に書く。
- Job・routine の定義で使っている今の名前（別名）が、そのまま動く。
- 単体テストで、別名の解決、実体の直接の指定、`{model}` の展開、actor の記録を確かめる。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ                                               |
| --- | ---------------------------------- | ---- | ---- | -------------------------------------------------- |
| 1   | agent の別名の解決と記録を実装する | DEV  | done | 実体への共通解決、model 展開、actor の正規化を実装 |

## 4. 対応結果

- agent 名簿の alias 連鎖を実体 member へ解決する共通処理を追加し、`--by`・`--executor-by`・`--reporter-by`・`--fallback-executor-by`・`--fallback-reporter-by`、Schedule / Job / routine の指名、単体 agent 実行、trial、grade の名前解決へ適用した。実体名の直接指定と自動選択は従来どおり動く。
- 実体の `model` を provider の `command_template` の `{model}` へ展開するようにした。実体に `model` がある場合は従来の `command_params` より優先し、`model` のない member は既存の `command_params` を引き続き使う。`{model}` のないテンプレートには影響しない。
- command・event・pipeline state・result に渡す actor は実体の `nickname` に統一した。指定された alias は actor の別フィールドへ保存しない。actor は claim / resume / complete の所有権判定に使う正規 identity であり二重表現を避ける必要があること、alias と実体の対応は agent 名簿が正本であることが理由である。
- 単体テストへ、alias 連鎖、実体の直接指定、`{model}` の展開、`--by` と executor / reporter 指定での実体 actor の記録を追加した。実 agent CLI を起動する `exec run --register` の smoke test は、統合後に PJR-JSEY の手順で確認する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（決定）
