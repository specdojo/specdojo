---
specdojo:
  id: prj-0001:pjr-g2f4-qwen-reporter-structured-output
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-27T23:00:18Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-30T03:04:17Z"
  conclusion: 構造化出力の指定は採用せず、応答から JSON を抽出する方式で解決した。対処は PJR-AKJ4 で実施済みである。exec-reporter.ts の JSON.parse(raw.trim()) を extractJsonText 経由へ変更し、コードフェンスと前置きを除去してから解析する。本項目が記録した失敗例と同じ形状の応答が受理されることを確認した。Ollama の構造化出力は provider 固有で claude と codex へ適用できず、thinking を有効化した agent と競合しうるため採らない。モデル設定を変更していないため reporter と executor を分離する課題も生じない。
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

構造化出力の指定は採用せず、応答から JSON を抽出する方式で解決した。対処は PJR-AKJ4 で実施済みである。

- 失敗の実体は「JSON だけを出力できない」ことであり、`exec-reporter.ts` が `JSON.parse(raw.trim())` で応答全体を単一 JSON として解析していた点にあった。この解析を `extractJsonText` を経由する形へ変更し、コードフェンスと前置きを除去してから解析するようにした。
- 散文が前置きされた reporter 応答が受理されることを確認した。本項目が記録した失敗例（`I need to reconsider this.` に続く JSON）と同じ形状で検証している。
- Ollama の構造化出力を採らない判断は次の理由による。provider 固有であり claude と codex へ適用できない。thinking を有効化した agent と競合しうる。新しいモデルを追加するたびに固有設定を調べる必要が生じる。抽出処理は provider に依存せず、1箇所の実装で全 agent に効く。
- executor へ影響しない。モデル設定を変更していないため、reporter と executor を分離する必要も生じなかった。本項目が完了条件に挙げた分離の課題は、構造化出力を採らないことで解消した。
- 指示文による対処は効果がないことが実証された。gemma の agent 定義へ「Markdown コードフェンスを加えない」旨を明示して再測定したが、コードフェンスは消えなかった。qwen では同じ記述が効いており、指示の遵守能力はモデルごとに異なる。指示の強化では出力形式を保証できないため、受け側で吸収する設計が妥当である。

## 5. 関連ドキュメント

- agent 比較の仕組み: [[prj-0001:pjr-nw9v-agent-comparison-trial|PJR-NW9V 同一タスクを複数agentで試行し性能を比較できるようにする]]
- 生ログ保全（失敗内容の特定に使った）: [[prj-0001:pjr-kaqv-agent-raw-stderr-retention|PJR-KAQV agent失敗時の生のstderrを保全する]]
- 比較の題材: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT 共通規約のtest実行に関する記述の矛盾を解消する]]
- 対象設定: `opencode.json`、`.opencode/agents/qwen-reporter.md`
- agent の起動設定: [[specdojo:exec-config-guide|exec設定ガイド]]
