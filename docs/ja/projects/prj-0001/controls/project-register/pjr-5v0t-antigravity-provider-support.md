---
specdojo:
  id: prj-0001:pjr-5v0t-antigravity-provider-support
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: PO
  registered_at: "2026-11-21T00:23:18Z"
---

# PJR-5V0T SpecDojo のパッケージとしての Antigravity（agy）対応をどうするか

## 1. 背景

consumer plan では他社の agent や application から agy を起動することが規約上対象外のため、provider の実装・配布テンプレート・文書の agy 対応を外すか、注意書きを付けて残すかを決める

## 2. 入力

- Antigravity の FAQ（<https://antigravity.google/docs/faq>）: agy -p は direct scripting と CI 向け。Wrapping agy inside third-party coding agents or applications は consumer plans で not supported。他社のソフトから Antigravity のログインで使うのは規約違反で、アカウントの停止・終了がありうる
- Additional Terms の Section 6（<https://antigravity.google/terms>）: 当社が提供しない製品と組み合わせた利用と、他社のソフトを通じたアクセスは契約違反
- 2026-10-16 のフォーラムの回答（<https://discuss.ai.google.dev/t/clarification-on-consumer-plan-policy-for-invoking-official-agy-via-local-subprocess/189905>）で、FAQ が今の方針であり以前の回答より優先すると示された
- SpecDojo は 2026-09-21（21726189f）に agy を provider として追加し、利用者へ配るテンプレート（templates/antigravity/ など）と orchestrator launch --provider antigravity を持つ
- prj-0001 では 2026-11-21 に agy の利用を止めた（afbebe967）。利用者の契約は Google AI Pro（consumer plan）

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
