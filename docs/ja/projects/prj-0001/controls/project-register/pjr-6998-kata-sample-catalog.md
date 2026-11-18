---
specdojo:
  id: prj-0001:pjr-6998-kata-sample-catalog
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: BA
  registered_at: "2026-11-18T11:59:09Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-WYTX
---

# PJR-6998 型の見直しを schedule で漏れなく行うため、sample を成果物としてカタログに載せるか決める

## 1. 背景

rulebook の整備を schedule に載せる単位を、製品の成果物から sample の成果物へ変えるかを決める。kata-slim-3 の作成の前に決める

## 2. 入力

- 利用者の提案（2026-11-18）: specdojo の仕様書などの成果物がない型はカタログに載らず schedule で rulebook を整備できない。sample を成果物にしてカタログに載せれば、schedule で rulebook の整備などを漏れなくできるのではないか
- orchestrator の調べ（2026-11-18）: rulebook 112 件のうち 105 件が sample を持ち、not-needed が 4 件、undecided が 1 件、未記入が 2 件。非推奨は 6 件
- orchestrator の調べ（2026-11-18）: kata-slim-2 は製品の成果物から型ごとに担当の成果物を選び、型のための仮の成果物（kata-only）をカタログに足した。それでも記法の rulebook・非推奨の型・dec・ntp・ifx-api・ifx-msg・recipe の exec-human-finalize の 14 件が対象から漏れた
- orchestrator の調べ（2026-11-18）: カタログには /.github/instructions/typescript.instructions.md を絶対パスで載せた前例がある。sample の ID（specdojo:`<name>-sample`）とカタログの成果物の ID（prj-0001:`<local_id>`）が食い違うかは未確認

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
