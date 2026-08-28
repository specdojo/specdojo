---
specdojo:
  id: prj-0001:pjr-g2f4-qwen-reporter-structured-output
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-27T23:00:18Z"
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_46dd43dc781c26a074df0791447b8ab7
      ts: "2026-08-27T23:03:10Z"
      action: add
      actor: naoji3x
      from_status: null
      to_status: open
      reason: "docs(register): PJR-G2F4 を起票しqwen比較の結果を記録する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: qwen-reporterへ構造化出力を指定してJSON単体出力を強制する
        - field: description
          from: ""
          to: qwen-reporter は JSON 自体は生成できるが前後に散文が付き、SpecDojo の単一 JSON 解析に失敗する。指示文へ JSON オブジェクト単体で出力する旨と no_think を明示したが、3回とも同じ失敗で効果がなかった。opencode.json のスキーマにはモデル単位の options が任意オブジェクトとして定義されており、Ollama の OpenAI 互換 API へ response_format を渡せる可能性がある。JSON モードを強制すれば構造上前置きを出力できなくなる。ただし同じモデルを executor でも使っているため、モデル設定では両者を分離できない。別名登録などの分離方法とあわせて検証する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-28"
        - field: due
          from: ""
          to: "2026-09-30"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 8500f4214d92fb08157eefcac13b4b7b895b0790
---

# PJR-G2F4 qwen-reporterへ構造化出力を指定してJSON単体出力を強制する

## 1. 概要

qwen-reporter は JSON 自体は生成できるが前後に散文が付き、SpecDojo の単一 JSON 解析に失敗する。指示文へ JSON オブジェクト単体で出力する旨と no_think を明示したが、3回とも同じ失敗で効果がなかった。opencode.json のスキーマにはモデル単位の options が任意オブジェクトとして定義されており、Ollama の OpenAI 互換 API へ response_format を渡せる可能性がある。JSON モードを強制すれば構造上前置きを出力できなくなる。ただし同じモデルを executor でも使っているため、モデル設定では両者を分離できない。別名登録などの分離方法とあわせて検証する。

## 2. 完了条件

- qwen-reporter が有効な JSON 単体を返す。前後に散文が付かない。`exec trial` または通常実行で確認する。
- **executor へ影響しない**。同一モデルを executor でも使うため、モデル単位の設定では両者を分離できない。別名登録などの方法で reporter にだけ構造化出力を適用する。executor の動作が変わらないことを確認する。
- モデル単位の `options` が実際に API リクエストへ転送されることを確認する。転送されない場合はその事実と根拠を記録し、代替の有無とともに完了とする。実現できないことの確認も成果とする。
- 構造化出力の指定方法と、どこまで保証されるかを記録する。`json_object` は JSON であることのみを強制し、reporter スキーマへの準拠は別である。`json_schema` 形式が使える場合は、その適用可否も確認する。
- gemma と codex の動作を壊さない。`opencode.json` の変更が他モデルへ波及しないことを確認する。
- 指示文による対処との関係を記録する。PJR-0FCT の trial で追加した「JSON オブジェクト単体で出力する」「`/no_think`」の指示は効果がなかった。構造化出力が有効な場合、指示文を残すか整理するかを判断する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- 失敗の実体は「JSON を出力できない」ではなく「JSON だけを出力できない」である。保全された reporter の生ログ3件すべてに `"outcome"` を含む JSON が存在し、その前に `I need to reconsider this.` のような散文が付いていた。SpecDojo は `JSON.parse(raw.trim())` で全体を単一 JSON として解析するため失敗する。
- 指示文の改善は効果がなかった。`/no_think` と JSON 単体出力の明示を追加した状態で trial を実行したが、3回とも `invalid_output` であった。
- `opencode.json` のスキーマでは `provider.<id>.models.<model>` に `options`（任意オブジェクト）、`reasoning`、`temperature` などが定義されている。
- 本環境の Ollama は OpenAI 互換の `/v1` を使っており、`response_format` を解釈しうる。
- opencode の issue #5674 は「openai-compatible provider で options が転送されない」と報告している（closed as not planned）。ただし本環境では provider 単位の `baseURL` が機能しており、状況が異なる。モデル単位の `options` が届くかは未確認である。
- gemma-reporter は同じ provider・同じ指示文で3例連続して構造化出力に成功している。provider の問題ではなくモデルの性質である。

## 3. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ                                  |
| --- | ------------------------------------------------- | ---- | ---- | ------------------------------------- |
| 1   | モデル単位の `options` が転送されるかを確認する   | ARC  | open | 届かない場合はその記録をもって完了    |
| 2   | reporter と executor を分離する方法を決める       | ARC  | open | 別名登録など                          |
| 3   | 構造化出力を指定し、JSON 単体で返ることを確認する | ARC  | open | `json_object` と `json_schema` の可否 |
| 4   | gemma と codex への影響がないことを確認する       | ARC  | open | 他モデルへ波及させない                |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- agent 比較の仕組み: [[prj-0001:pjr-nw9v-agent-comparison-trial|PJR-NW9V 同一タスクを複数agentで試行し性能を比較できるようにする]]
- 生ログ保全（失敗内容の特定に使った）: [[prj-0001:pjr-kaqv-agent-raw-stderr-retention|PJR-KAQV agent失敗時の生のstderrを保全する]]
- 比較の題材: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT 共通規約のtest実行に関する記述の矛盾を解消する]]
- 対象設定: `opencode.json`、`.opencode/agents/qwen-reporter.md`
- agent の起動設定: [[specdojo:exec-config-guide|exec設定ガイド]]
