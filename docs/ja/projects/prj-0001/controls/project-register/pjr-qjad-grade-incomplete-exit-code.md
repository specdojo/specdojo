---
specdojo:
  id: prj-0001:pjr-qjad-grade-incomplete-exit-code
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:23:18Z"
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
| 1   | 完了時に incomplete の件数で終了コードを決める | DEV  | open | -    |
| 2   | 終了コードのテストを追加する                   | DEV  | open | -    |
| 3   | routine 経由での終了コード 1 の扱いを確認する  | DEV  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]
- `tools/grade/run-per-document.sh`
