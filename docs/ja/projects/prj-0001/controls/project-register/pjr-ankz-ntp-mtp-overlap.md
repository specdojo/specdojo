---
specdojo:
  id: prj-0001:pjr-ankz-ntp-mtp-overlap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-17T23:23:26Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-DJZD
---

# PJR-ANKZ 移行テスト計画（ntp）とリハーサル計画（mtp）の型を 1 つにまとめるか決める

## 1. 背景

ntp-rulebook（移行テスト計画（リハーサル計画））と、カタログの mtp-index が使う mtp-rulebook（リハーサル計画）は題材が同じで、型が二重になっている疑いがある

## 2. 入力

- orchestrator の調べ（2026-11-18）: ntp-rulebook の題は「移行テスト計画（リハーサル計画）作成ルール」。カタログの dct-migration-planning の mtp-index は mtp-rulebook を使い、概要は「切替前に成果物カタログ・Schedule・登録簿が実運用に耐えるかを検証するリハーサル計画」。ntp は決まるまで kata-slim-2 の対象外

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
