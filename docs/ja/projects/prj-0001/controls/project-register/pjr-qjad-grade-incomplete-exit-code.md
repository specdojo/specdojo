---
specdojo:
  id: prj-0001:pjr-qjad-grade-incomplete-exit-code
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:23:18Z"
  completed_at: "2026-09-27T04:02:13Z"
  block_reason: "agent exited with non-zero code: 親検証の `test-unit` (npm run test:unit) が失敗しています。`tests/src/grade.test.ts` および `tests/src/doc-index.test.ts` でエラーが発生しているため、完了条件を満たしていません。"
  conclusion: run-per-document.sh は走りきって incomplete が残ると未完了文書と再開方法を stderr へ出し exit 1 で終わる。routine では Job 失敗として記録される
---

# PJR-QJAD grade が未完了の文書を残して終わった場合に終了コード 1 を返す

## 1. 概要

`tools/grade/run-per-document.sh` は、処理の最後に `grade pipeline complete: ... incomplete=<n> ...` を出力し、そのあと incomplete の件数に関係なく終了コード 0 で終わる。

PJR-9PZ7 では、途中で打ち切られた実行を exit 1 にした。一方、最後まで走りきったものの、段の失敗で未完了の文書が残った場合は、今も 0 で終わる。このため、定期実行（routine）や呼び出し元が未完了を検知できない。

## 2. 完了条件

- 最後まで走りきって incomplete が 1 件以上のとき、`grade pipeline complete` 行を出力したあと終了コード 1 で終わる。
- incomplete が 0 件なら、従来どおり終了コード 0 で終わる。
- 終了コード 1 のとき、未完了の文書と `--run-id` での再開方法が標準エラーへ出力される。
- 打ち切り時の EXIT trap（PJR-9PZ7）の挙動が変わらない。
- `tests/tools/grade-per-document.test.ts` に、incomplete が残る場合と残らない場合の終了コードのテストがある。
- routine から grade を呼ぶ経路で、終了コード 1 がどう扱われるか（失敗として記録されるか）を確認し、結果を対応結果へ記録する。
- `npm run test:unit` が成功する。

## 3. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | 完了時に incomplete の件数で終了コードを決める | DEV  | done | -    |
| 2   | 終了コードのテストを追加する                   | DEV  | done | -    |
| 3   | routine 経由での終了コード 1 の扱いを確認する  | DEV  | done | -    |

## 4. 対応結果

- `tools/grade/run-per-document.sh` で、段の失敗で未完了となった文書を段番号付きで記録するようにした。`grade pipeline complete` 行を出力して `pipeline_finished=true` にしたあと、incomplete が 1 件以上なら終了コード 1 で終える。
- 終了コード 1 のときは、標準エラーへ `grade pipeline incomplete: incomplete=<n> ...; rerun with --run-id <id> to retry the failed stages, or start a new run with --incomplete` と、文書ごとの `grade pipeline incomplete document: <path> failed_stage=<n>` を出力する。
- incomplete が 0 件の場合は従来どおり終了コード 0 で終わる。`pipeline_finished=true` を立てたあとで判定するため、打ち切り時の EXIT trap（PJR-9PZ7）は `grade pipeline aborted` を出さず、終了コードもそのまま返す。打ち切り時の挙動は変わらない。
- 連続失敗の上限に達しただけの文書（`retry_exhausted`、report-only）は incomplete に数えないため、`--incomplete` による報告だけの実行は従来どおり終了コード 0 になる。
- `tests/tools/grade-per-document.test.ts` に、incomplete が残る場合（終了コード 1、標準エラーに未完了文書と再開方法を出力）と残らない場合（終了コード 0）のテストを追加した。段の失敗を含む既存テストの期待値は 1 に更新した。
- routine 経由の扱いを確認した。`job-grade-kata` と `job-grade-deliverable` の `task.command` は script を `if` の条件として起動し、非 0 の終了コードを `grade pipeline failed: run_id=<id> exit_code=<n>` とともにそのまま返す。このため、未完了が残った Job Run はコマンド失敗として記録され、routine の `last_result` は `failure` になる。コマンド成功時だけ起動する analysis reporter は起動せず、command evidence に `results.tsv` も出力されない。未完了の段の切り分けは、stdout・stderr の `document incomplete` 行と `grade pipeline incomplete document` 行、および同じ `--run-id` での再開で行う。
- 残課題として、Job の `task.analysis` の説明（`failed` の段の切り分け）は、コマンド成功時だけ reporter が起動する前提と合わなくなった。未完了時にも `results.tsv` を evidence に残すか、reporter を起動するかは、Job 定義の変更として別途判断する。

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]
- `tools/grade/run-per-document.sh`
