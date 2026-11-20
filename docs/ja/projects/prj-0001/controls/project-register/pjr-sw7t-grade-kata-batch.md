---
specdojo:
  id: prj-0001:pjr-sw7t-grade-kata-batch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  registered_at: "2026-11-13T14:08:23Z"
  commit_type: feat
  commit_scope: grade
---

# PJR-SW7T 型の一覧をまとめて grade する指定を用意する

## 1. 概要

rulebook と sample の組を型の名前の一覧で指定し、1 回の grade run で順に評価できるようにする

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- `grade run --target kata` で、型の名前（`pjr`・`sld` などの接頭辞）を複数指定し、その型の rulebook と sample の組を 1 回の実行で順に評価できる（例: `--kata <name>` を繰り返す。名前は executor が決める）。
- 1 つの型の失敗や rate limit で、残りの型を飛ばさない。終わったときに、型ごとの結果（完了・失敗・未実行）を一覧で表示する。
- 終了コードは今の `grade run` の決まりに合わせる（完了と失敗が混ざると 2、rate limit で 75）。
- 存在しない型の名前は、実行の前にまとめてエラーにする。
- 単体テストで、複数の型の選択、存在しない名前のエラー、失敗が混ざったときの終了コードを確かめる。
- コマンドリファレンスの `grade run` の節に、オプションと例を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
