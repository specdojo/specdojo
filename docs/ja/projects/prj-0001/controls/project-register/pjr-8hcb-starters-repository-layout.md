---
specdojo:
  id: prj-0001:pjr-8hcb-starters-repository-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-03T04:42:37Z"
  due_on: null
  derived_from:
    - PJR-RTD5
  commit_type: docs
  commit_scope: register
---

# PJR-8HCB スターターのリポジトリの構成と名前を決める

## 1. 背景

PJR-RTD5 のスターター（ひな型）を、管理 specdojo-starters-specdojo・作る側 specdojo-starters・配る側 `specdojo-starter-<name>` の 3 種類のリポジトリで作り、作る側のディレクトリを 3 層の構成にする

## 2. 入力

- GitHub の template repository は 1 つのリポジトリが 1 つのひな型で、「Use this template」はリポジトリの中身をまるごと複製する（2026-11-03）
- このリポジトリの Git 管理の大きさは 63 MB で、そのうち prj-0001 の実行記録が 42 MB（6,406 ファイル）。prj-0002 の管理の文書は 1.4 MB（2026-11-03 の実測）
- 利用者は、管理の履歴とプロダクトの履歴が混ざらないよう、管理用のリポジトリを分ける形を選んだ。名前は、scratch-vm のようにプロダクトの名前を頭に付ける慣習と、ガイドの例の「プロダクトの名前＋-specdojo」の形に合わせる案 A を選んだ（2026-11-03）

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
