---
specdojo:
  id: prj-0001:pjr-25b9-clis-kata-confirm-diagram-references
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-08T11:53:47Z"
  derived_from:
    - PJR-2GD6
    - PJR-K4PM
  depends_on:
    - PJR-1D1X
---

# PJR-25B9 図と参照先を直した clis の型を確定する

## 1. 背景

PJR-K4PM で、clis の図を入力情報・出力情報の仕様への線だけにし、自システムの API と CLI が起動する外部コマンドの参照先を足すと決めた。PJR-1D1X で直した clis の型を人が確かめて確定する。確定した型で、カタログの付け替え（PJR-8J47）と clis の代表の作成を進める。

## 2. 入力

- 型の確定は人が行う（PJR-K4PM と同じ扱い）。

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

- 決定: [[prj-0001:pjr-k4pm-clis-kata-confirm-input-output-info]]
- 型の直し: [[prj-0001:pjr-1d1x-clis-kata-diagram-references]]
