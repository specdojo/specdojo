---
specdojo:
  id: prj-0001:pjr-zm1k-agent-members-model-alias
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-10-14T22:16:44Z"
  due_on: null
  completed_at: "2026-10-14T22:19:02Z"
  conclusion: agent の名簿を、provider・model・effort・役割を持つ実体（opus-executor など、model の系統で命名）と、実体を指す別名（今の名前を残す）の 2 段構成にする。0.4.0 の対象とし、Y8P9 の完了後に実装する
---

# PJR-ZM1K agent の名簿を model と役割の実体と別名の 2 段構成にする

## 1. 背景

`.specdojo/agent-members.yaml` には 37 の member があり、名前は provider と格と役割（`claude-expert-executor` など）で付けている。model の指定は provider ごとに次の場所へ分散している（2026-10-15 時点）。

| provider    | model を指定している場所                                                                                 |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| claude      | `.claude/agents/<nickname>.md` の `model:`（`sonnet` / `opus`）                                          |
| opencode    | `.opencode/agents/<nickname>.md` の `model:`                                                             |
| codex       | `.specdojo/exec-defaults.yaml` の `by_proficiency`（normal は `gpt-5.6-terra`、expert は `gpt-5.6-sol`） |
| antigravity | `.specdojo/exec-defaults.yaml` の `by_proficiency` と `by_nickname`                                      |

- 名前から model が分からない。`claude-expert-executor` が opus であることは agent の定義ファイルを開かないと分からない。
- agy の model の提供が終わった際（[[prj-0001:pjr-nmsh-agy-model-not-recognized]]・[[prj-0001:pjr-x60a-agy-model-ids-in-templates]]）、直す場所を探す手間がかかった。
- claude の `claude-executor.md` と `claude-expert-executor.md` は、`model:` と名前と説明の数行だけが異なり、役割の指示は同じ本文の複製である。review executor の組も同じ。
- codex・opencode・agy の CLI は `--model` を受け付け、claude も `--model` で agent の定義の model を上書きできる。

利用者から、model と役割で member を作り（`opus-executor`・`sol-executor` など）、役割の名前（`claude-expert-executor`）はその別名として定義する 2 段構成にし、model を直接選べるようにする提案があった（2026-10-15）。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                                                                                                       | 利点                                                                                                                            | 欠点                                                                                                         |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A      | 現状のまま（provider と格と役割の名前、model は分散した場所に書く）                                                                                                        | 変更が要らない                                                                                                                  | model の差し替えのたびに複数の場所を探す。名前から model が分からない                                        |
| B      | 名前だけを model と役割に改める（`opus-executor` など）                                                                                                                    | 名前から model が分かる                                                                                                         | model の提供が終わると名前を変える必要があり、Job・routine・文書の参照が壊れる。model の指定場所の分散は残る |
| C      | 2 段構成にする。実体（model と役割）に provider・model・effort・役割を持たせ、別名（役割と格）は実体を指すだけにする。model は実体の 1 か所に書き、CLI へ `--model` で渡す | model の差し替えは実体の 1 か所か別名の向き先の変更で済む。Job・routine は別名を使い続けられる。実体の名前で model を直接選べる | schema・名前の解決・agent の定義・配布する雛形の変更が要る                                                   |

## 3. 決定内容

C を採る。あわせて次の点を決める。

1. 実体の名前に入れる model は系統（`opus`・`sonnet`・`sol`・`terra`・`flash` など）とし、版は実体の `model` の欄に書く。版を名前に入れると、版が上がるたびに名前が変わるため。
2. 同じ系統の model を別の provider で使う場合は、既定でない provider の名前を前に付けて区別する（Claude Code の `opus-executor` と agy の `agy-opus-executor`）。
3. claude と opencode の agent の定義は役割ごと（executor・review executor・reporter など）の 1 ファイルにまとめ、model は `--model {model}` で渡す。
4. イベントや result の actor には、別名ではなく実体の名前を記録し、どの model が動いたかを残す。
5. 今の名前（`claude-expert-executor` など）は別名として残し、Job・routine・文書・利用者の設定との互換を保つ。配布する雛形の変更を含むため 0.4.0 の対象とする。
6. 名前の解決の処理（`src/exec-run-agent.ts` など）は [[prj-0001:pjr-y8p9-large-source-files-split]] の分割と重なるため、Y8P9 の完了後に実装する。

## 4. 採択理由

- model の差し替えが、実体の 1 か所の変更か、別名の向き先の変更で済む。
- 今の名前を別名として残すため、Job・routine・文書・利用者の設定を壊さずに移行できる。
- 実体の名前で model を直接選べ、記録にも実際に動いた model が残る。
- 役割の指示を役割ごとの 1 ファイルにまとめ、model ごとの複製をなくせる。

## 5. 承認

| 項目     | 内容                                                                                 |
| -------- | ------------------------------------------------------------------------------------ |
| 決定者   | 利用者（PO）                                                                         |
| 決定日   | 2026-10-15                                                                           |
| 承認方式 | orchestrator との会話で、提案した構成と推奨の 4 点を「推奨でお願いします」として承認 |
| 証跡     | orchestrator との会話（2026-10-15）                                                  |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `docs/specdojo/schemas/v1/agent-members.schema.yaml`、`.specdojo/agent-members.yaml`、`.specdojo/exec-defaults.yaml`、名前の解決（`src/exec-run-agent.ts` など）、`.claude/agents/`・`.opencode/agents/`・`.codex/agents/` の agent の定義、`templates/` の配布する雛形、Job と routine の agent の指定、関係するガイドと設計書 |
| 必要な対応 | 決定後に、schema、名前の解決、agent の定義の統合、本リポジトリの名簿の移行、配布する雛形の 5 つの todo に分けて起票する                                                                                                                                                                                                         |
| 追跡先     | 決定後に起票する todo                                                                                                                                                                                                                                                                                                           |

## 7. 関連ドキュメント

- [[prj-0001:pjr-nmsh-agy-model-not-recognized]]: model の提供終了への対応。
- [[prj-0001:pjr-x60a-agy-model-ids-in-templates]]: 配布物の model の ID の修正。
- [[prj-0001:pjr-y8p9-large-source-files-split]]: 名前の解決の処理を含む分割。
