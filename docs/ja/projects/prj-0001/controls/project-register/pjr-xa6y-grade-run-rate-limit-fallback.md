---
specdojo:
  id: prj-0001:pjr-xa6y-grade-run-rate-limit-fallback
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-20T23:35:36Z"
  derived_from:
    - PJR-SW7T
---

# PJR-XA6Y grade run で rate limit のときに代わりの agent へ切り替える

## 1. 概要

grade run に代わりの agent の指定を足し、rate limit のときに切り替えて残りの文書を続ける。夜間の grade の job にも組み込む

## 2. 入力

- 夜間の grade（rtn-grade-recheck・rtn-grade-deliverable-recheck）は job の中で grade run --by agy-expert-executor に固定され、rate limit のときに代わりの agent へ切り替える仕組みがない（2026-11-21 に src/grade/run.ts と src/exec/agent-plan.ts で確かめた）
- rate limit のときは残りを未実行のまま止め、終了コード 75 で終える。残りは翌日の run が未完了・未評価の条件で選び直す
- 利用者の要望: agy が rate limit に当たったら sol に切り替わるようにしたい
- PJR-SW7T の 2 回目の実行で、rate limit の後も続けるのは --kata のときだけに絞る。切り替えはこの項目で扱う

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
