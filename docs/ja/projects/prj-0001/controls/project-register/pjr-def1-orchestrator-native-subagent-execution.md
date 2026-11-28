---
specdojo:
  id: prj-0001:pjr-def1-orchestrator-native-subagent-execution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: PO
  registered_at: "2026-11-21T02:20:55Z"
  derived_from:
    - PJR-5V0T
---

# PJR-DEF1 親の agent が subagent で項目を実行する方式を採るか

## 1. 背景

利用者が起動した agy・Claude Code・Codex を親にし、skill と subagent で register の項目と schedule のタスクを実行し、SpecDojo は段ごとのコマンドとして呼ばれる方式を採るかを決める

## 2. 入力

- 利用者の提案（2026-11-21）: specdojo の runner が agy -p を起動する代わりに、agy を orchestrator として立ち上げ、agy の subagent で todo を実行する。skill を用意する。claude・codex も同様にし、schedule の実行も同様にする
- Antigravity の FAQ（<https://antigravity.google/docs/faq>）は、他社のソフトから Antigravity を使うことと、agy を他社の agent や application の中に包むことを禁じる。利用者が起動した agy が skill（<https://antigravity.google/docs/skills>）で SpecDojo の CLI を呼ぶ形はこれに当たらない。ただし Additional Terms Section 6 の「using the Service in connection with products not provided by us」は広く読めるため、本格的に使う前に Google に確かめるかを決める
- Claude: 2026-02 に Consumer Terms が明確になり、Free・Pro・Max の OAuth を他の product・tool・service（Agent SDK を含む）で使うことは禁止（<https://www.theregister.com/software/2026/02/20/anthropic-clarifies-ban-on-third-party-tool-access-to-claude/5014546>）。公式の claude -p を他社の orchestrator から起動する形の扱いを明記した一次情報は見つかっていない
- Codex: ChatGPT のログインで他社のツールから codex exec を起動することを禁じる記載は見つかっていない。公式の規約の一次情報は未確認
- 方式の利点: 規約の不確かさが小さい。保護された設定の検査・commit の許可リスト・親の検証は SpecDojo の段のコマンドに残せる。欠点: 無人の夜間の実行ができず親のセッションが要る。並列と rate limit の切り替えは親の agent に依る。evidence が subagent の自己申告になる

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
