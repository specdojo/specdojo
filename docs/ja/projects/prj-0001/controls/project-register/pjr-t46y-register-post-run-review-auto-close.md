---
specdojo:
  id: prj-0001:pjr-t46y-register-post-run-review-auto-close
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T00:40:06Z"
  due_on: null
---

# PJR-T46Y register の実行のあとに review の agent が判定し、todo と issue を自動で close する

## 1. 概要

段階 A。統合の後に review の agent が個票の完了条件・result・差分・検証の結果を照らして verdict を出し、complete なら close、incomplete なら waiting に戻す。runner 自身のコードを変えた項目の動作確認の扱いも決める。 PJR-3DY1 の決定に基づく

## 2. 完了条件

- PJR-7WME の完了後に行う。
- `exec run --register` の統合の後に、review の agent（既定は `claude-expert-review-executor`）が、個票の完了条件・result・差分・検証の結果を照らして verdict を出す段を加える。review の agent は読み取り専用とし、確かめるためのコマンドは流してよい。
- verdict が `complete`・`complete-with-findings` なら runner が close し、`incomplete` なら `waiting` に戻す。actor は review の agent とし、verdict の理由をイベントに残す。
- 自動で close するのは todo と issue だけとし、decision・question は close しない。
- この段は既定では動かさず、オプションか設定で有効にする。有効にする方法を [[specdojo:exec-operation-guide]] に書く。
- runner 自身のコードを変えた項目の扱い（統合の後に実際の `exec run` で確かめる段を加えるか、人の close に残すか）を決めて実装し、理由を result に書く。
- 単体テストか統合テストで、`complete`・`complete-with-findings`・`incomplete` の 3 通りと、decision を close しないことを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 統合の後の review の agent による自動の close を加える | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-3dy1-night-orchestrator-autopilot]]（決定）
