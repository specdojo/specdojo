---
specdojo:
  id: prj-0001:pjr-x2q7-register-conclusion-overwrite
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-24T11:26:51Z"
  due_on: "2026-08-31"
---

# PJR-X2Q7 失敗時のブロック理由が個票のconclusionを上書きする問題を解消する

## 1. 概要

exec run が失敗すると、その時点のブロック理由が個票の conclusion へ書き込まれる。実行が成功して完了した後も古いブロック理由が残るため、PJR-JT1Y・PJR-E6HG・PJR-Q828・PJR-1Z1H の4件連続で手作業による書き換えが必要になった。conclusion は項目の結論を記録する欄であり、途中の失敗理由を保持する場所として適切ではない。ブロック理由の記録先を分けるか、完了時に上書きされるようにする。あわせて register update に conclusion を更新するオプションがなく、直接編集が必要である点も解消する。

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
