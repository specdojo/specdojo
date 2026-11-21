---
specdojo:
  id: prj-0001:pjr-xa6y-grade-run-rate-limit-fallback
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                | 担当 | 状態 | メモ                                    |
| --- | ----------------------------------- | ---- | ---- | --------------------------------------- |
| 1   | 代わりの評価者の指定を足す          | DEV  | done | `--fallback-by` を追加                  |
| 2   | rate limit のときに切り替えて続ける | DEV  | done | 同じ run id で続行                      |
| 3   | routine の job から渡せるようにする | DEV  | done | job 入力 `fallback_by`                  |
| 4   | テストと文書、CHANGELOG の文案      | DEV  | done | 単体テスト 3 件、command-reference 更新 |

## 5. 対応結果

### 5.0. 実施内容

- `grade run --fallback-by <nickname>` を追加した（`src/grade/run.ts`、`src/grade/command-run.ts`）。`resolveActor` で有効な executor の member か確かめ、元の評価者と同じならエラーにする。不明な nickname や空文字もエラーにする。
- rate limit を検出したら、同じ run id のまま、その文書と残りを代わりの評価者で続ける。代わりも rate limit なら従来どおり終了コード 75 で止める。dry-run には `fallback=` を表示する。
- 評価者は grade 結果の `graded_by` と `run.json` の文書ごとの `actor` に残る。切り替え時は stdout にも出す。
- `job-grade-kata`・`job-grade-deliverable` に入力 `fallback_by`（既定は空で切り替えなし）を足し、空でないときだけ `--fallback-by` を渡す。
- `exec-defaults.yaml` から既定を引く案は採らず、明示指定のみにした。理由は、既定を引くと全 run の挙動が暗黙に変わり、評価者が決まっていない現状では意図しない agent で評価される恐れがあるため。`--fallback-by` は request の digest に含まれるため、再開時は同じ指定が要る。
- 単体テストを 3 件足した（切り替え、代わりも rate limit、不正な指定）。`command-reference.md` の `grade run` の節を更新した。

### 5.1. CHANGELOG に書く事項

- 区分: Added
- 文案: `grade run` に `--fallback-by <nickname>` を追加し、評価者が rate limit のときに代わりの評価者へ切り替えて同じ run を続けられるようにした。

### 5.2. 残課題・提案

- prj-0001 の routine（`rtn-grade-recheck`・`rtn-grade-deliverable-recheck`）は評価者未定のため変えていない。評価者が決まったら、routine の `inputs` に `fallback_by: sol` のように足すと切り替わる（`rtn-grade-recheck` は現在 `enabled: false`）。
- job の評価者 `--by agy-expert-executor` は固定のまま。評価者を入力にする案は評価者の決定後に検討する。

## 6. 関連ドキュメント

- `docs/ja/specdojo/references/command-reference.md`（`grade run` の節）
- 派生元: PJR-SW7T
