---
specdojo:
  id: prj-0001:pjr-xa6y-grade-run-rate-limit-fallback
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
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

- `grade run` に、rate limit のときに切り替える代わりの評価者を指定する手段を足す（`--fallback-by <nickname>` などの名前と、`exec-defaults.yaml` から既定を引くかどうかは executor が決め、理由を個票の対応結果に書く）。代わりの評価者は、元の評価者と違う有効な agent の member でなければエラーにする。
- rate limit を検出したら、同じ run id のまま、残りの文書を代わりの評価者で続ける。代わりの評価者も rate limit になったら、今までどおり残りを未実行のまま終了コード 75 で終える。
- どの文書をどの評価者が評価したかが、grade の結果と run の記録に残る。
- 夜間の grade の routine（rtn-grade-recheck・rtn-grade-deliverable-recheck）の job が、この指定を渡せるようにする。prj-0001 の routine の定義（評価者と代わりの評価者）は変えない。評価者がまだ決まっていないためで、変える案があれば個票の対応結果と報告の `handoff` に書く。
- 単体テストで、切り替える場合・代わりも rate limit の場合・代わりの指定が不正な場合を確かめる。
- `command-reference.md` の `grade run` の節を直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。利用者に影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 代わりの評価者の指定を足す          | DEV  | open | -    |
| 2   | rate limit のときに切り替えて続ける | DEV  | open | -    |
| 3   | routine の job から渡せるようにする | DEV  | open | -    |
| 4   | テストと文書、CHANGELOG の文案      | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
