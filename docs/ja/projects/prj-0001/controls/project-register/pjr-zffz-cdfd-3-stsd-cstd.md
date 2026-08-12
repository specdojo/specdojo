---
specdojo:
  id: prj-0001:pjr-zffz-cdfd-3-stsd-cstd
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T09:35:22Z"
  due_on: "2026-08-31"
---

# PJR-ZFFZ cdfd 3ファイルの状態・分類詳細をstsd/cstd等へ移設

## 1. 概要

cdfd-register-operation.md（2.1/2.2/2.3）、cdfd-routine.md（2.1/2.2）、cdfd-reporting.md（2.1）にある状態定義・type分類・データ正本の詳細記載は、対応するステータス定義（stsd）・概念状態遷移図（cstd）・データストア定義（cdsd）等の文書を作成する際に、そちらへ移設し、cdfd側は参照へ簡潔化する。

## 2. 完了条件

- 対象3ファイルの該当サブセクションが、移設先文書への参照だけを残した簡潔な記述に置き換わっている。
- 移設先の stsd・cstd・cdsd（いずれも本 todo の対象範囲に応じて必要な分だけ）が作成され、移設した内容が反映されている。
- `npm run lint:md` と `specdojo catalog validate` が通過している。

## 3. 作業内容

| No  | 作業                                                                             | 担当 | 状態 | メモ                                                          |
| --- | -------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------- |
| 1   | 移設先文書（stsd-specdojo・cstd-specdojo・cdsd-specdojo 等）の要否とIDを確定する | ARC  | open | 既存カタログ（dct-data-model.yaml）の based_on 宣言を確認する |
| 2   | 対象文書を作成し、3ファイルの該当箇所から内容を移設する                          | ARC  | open | -                                                             |
| 3   | 移設元3ファイルの該当サブセクションを参照ポインタへ簡潔化する                    | ARC  | open | -                                                             |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:cdfd-register-operation]]（2.1・2.2・2.3が対象）
- [[prj-0001:cdfd-routine]]（2.1・2.2が対象）
- [[prj-0001:cdfd-reporting]]（2.1が対象）
