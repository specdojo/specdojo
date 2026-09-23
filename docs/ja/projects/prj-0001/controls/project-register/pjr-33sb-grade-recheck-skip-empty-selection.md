---
specdojo:
  id: prj-0001:pjr-33sb-grade-recheck-skip-empty-selection
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-12T07:14:30Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-12T10:11:50Z"
  block_reason: rate limit reached
  conclusion: Job Definition に task.precondition（command と skip_when）を追加し、Job Run 作成前に grade list で選択を判定して 0 件なら Job Run・plan・result・evidence を作らず skipped を返すようにした。routine は skipped を routine-state.json に記録する。job-grade-kata と job-grade-deliverable に適用し、実機で選択 0 件の Job 起動が 1 秒で記録なしに終了することを確認した。
---

# PJR-33SB grade の定期再評価で選択 0 件のときは Job Run の記録を残さない

## 1. 概要

rtn-grade-recheck（1 日 3 回）と rtn-grade-deliverable-recheck（1 日 1 回）は、変更済み・未評価の文書が無くても Job Run を生成し、plan / result / evidence / run の 4 ファイルと analysis reporter の起動（約 2 分）が発生する。kata 254 件の評価が完了した現在は no-op が常態で、9/12 だけで 3 回の no-op 記録が積み上がった。選択が 0 件のときは Job Run を作らず、routine-state.json の last_run だけを更新する方式に変える。

### 1.1. 現状の仕組み

Job runner は `task.command` を起動する前に Job Run（`execution/jobs/runs/JBR-*.json`）を作成し、
plan と result を scaffold する。文書の選択は `tools/grade/run-per-document.sh` の中で行われるため、
選択が 0 件でも記録は作成済みであり、command 成功後には `task.analysis` の reporter が起動して
「選択 0 件のため no-op」と判断するだけの result を書く。

| 実行                      | 選択 | 所要         | 生成物                                       |
| ------------------------- | ---- | ------------ | -------------------------------------------- |
| 9/12 10:43（8 時枠）      | 0    | 約 2 分      | plan / result / evidence / run の 4 ファイル |
| 9/12 16:00                | 0    | 約 2 分      | 同上                                         |
| 9/12 00:00（成果物 5 件） | 5    | 2 時間 43 分 | 同上 ＋ 成果物の grade                       |

### 1.2. 方針

選択が 0 件のときは Job Run を作らない。実行した事実は `routines/generated/routine-state.json`
の `last_run` / `last_result` に残るため、定期実行が動いていることの確認には足りる。
選択が 1 件以上のときの記録は現状のまま変えない。

### 1.3. 実現方式の候補

選択の判定を Job Run 作成より前に行う必要がある。次のいずれかを ARC が選ぶ。

| 案  | 方式                                                                                                                   | 利点                              | 留意点                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| A   | Job Definition に事前判定（例: `precondition` command）を追加し、終了コードや出力が空なら Job Run を作らずに skip する | 汎用。grade 以外の Job にも使える | Job schema と runner の変更。skip を routine-state にどう記録するか |
| B   | routine の `action` に「対象が空なら skip」の判定コマンドを持たせる                                                    | Job を変えずに済む                | 判定が routine に分散し、Job 単体実行では効かない                   |
| C   | Job Run 作成後に command が no-op を通知し、runner が記録を破棄する                                                    | 既存の流れを大きく変えない        | 作成済み記録の削除は evidence の不変性と相反する。不採用が妥当      |

事前判定には `specdojo grade list --target <kata\|deliverable> --changed-only --ungraded --limit <n>` を
使う。script の選択規則（selection-v2）と同じ入口であり、判定と実行の対象がずれない。

### 1.4. 方式の決定（2026-09-12）

案 A を採る。「いつ no-op か」を決める入力（対象種別、`changed_only`、`ungraded`、`limit`）は Job の
`inputs` にあり、routine は時刻しか知らない。Job に置けば `exec run --job` の手動実行や CI でも効き、
routine の `action.kind: job` を「起動して結果を受け取る」役に絞った現在の設計を崩さない。
`job-register-sweep` や `job-translate-updated-docs` も同じ「選択が空なら no-op」の形であり、
同じ仕組みで横展開できる。

実装の形は次を想定する。

```yaml
task:
  mode: command
  precondition:
    command: "{{specdojo}} grade list --target kata --changed-only --project {{project_id}}"
    skip_when: empty-output
  command: |
    ...
```

- runner は Job Run を作成する前に `precondition.command` を materialize 済みの引数で実行し、
  `skip_when` を満たせば Job Run・plan・result・evidence を作らずに `skipped`（理由: empty selection）
  を返す。
- routine は `--if-busy skip` と同じ経路で `routine-state.json` に `last_result: skipped` を記録し、標準出力には理由を表示する。
- `skip_when` は当面 `empty-output` と終了コード指定の 2 通りに限定し、最初から汎用化しない。
- `precondition` の出力と選択の対象がずれないよう、判定には script と同じ選択規則を持つ `grade list` を使う。

## 2. 完了条件

- `rtn-grade-recheck` と `rtn-grade-deliverable-recheck` の定期実行で、選択が 0 件のときに Job Run、
  plan、result、evidence が生成されない。
- 選択が 0 件でも `routine-state.json` の `last_run` / `last_result` は更新され、`routine list` で
  最終実行時刻と結果を確認できる。
- 選択が 1 件以上のときの Job Run・plan・result・evidence の生成と analysis reporter の起動は従来どおり。
- 事前判定と script の選択が同じ規則（`grade list` の selection-v2）に基づく。
- Job 定義標準または routine 運用ガイドのうち、採用した方式に対応する正本へ仕組みを記述している。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功し、
  選択 0 件と 1 件以上の両経路を単体テストで確認している。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                                               |
| --- | ----------------------------------------------------- | ---- | ---- | -------------------------------------------------- |
| 1   | 事前判定の置き場所（案 A / B）を決める                | ARC  | done | 案 A（Job の `precondition`）に決定。案 C は不採用 |
| 2   | Job schema または routine schema と runner を変更する | ARC  | done | Job `task.precondition` と routine skip 返却を実装 |
| 3   | `job-grade-kata` / `job-grade-deliverable` へ適用する | ARC  | done | 判定は `grade list` の selection-v2 と同条件       |
| 4   | 正本の文書とテストを更新する                          | ARC  | done | 選択 0 件・1 件以上の回帰テストを追加              |

## 4. 対応結果

- command Job に `task.precondition` を追加し、`empty-output` または指定終了コードで、初回 Job Run の永続化前に skip できるようにした。precondition の失敗は Job Run を作らず実行エラーとし、既存の失敗 Run の retry では保存済み対象の再開性を優先して再評価しない。
- `job-grade-kata` と `job-grade-deliverable` は `grade list` から変更済み・未評価の和集合を作り、script と同じ辞書順、対象種別、件数上限で事前判定する。選択 0 件では Job Run、plan、result、evidence、command、analysis reporter を生成・起動しない。
- routine 起動の precondition skip は `last_result: skipped` として扱い、`last_run` と `last_scheduled_for` を従来の routine 状態更新経路で記録する。選択 1 件以上では従来の Job Run 実行へ進む。
- Job 定義標準、Job 実行設計、routine 運用ガイド、schema、単体テストを更新した。残課題はない。

## 5. 関連ドキュメント

- 定期再評価の設計: [[prj-0001:pjr-t2kk-grade-recheck-routine]]
- 成果物評価の定期実行: [[prj-0001:pjr-08k1-deliverable-grade-done-criteria]]
- Job の責務境界: [[specdojo:job-definition-standard]]
- routine の運用: [[specdojo:routine-operation-guide]]
