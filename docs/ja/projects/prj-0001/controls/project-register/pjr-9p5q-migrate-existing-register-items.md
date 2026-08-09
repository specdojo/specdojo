---
specdojo:
  id: prj-0001:pjr-9p5q-migrate-existing-register-items
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: ARC
  registered_on: "2026-08-09"
  due_on: "2026-08-31"
---

# PJR-9P5Q 既存登録項目を個票 frontmatter へ一括移行する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割4。現行の登録項目一覧に存在する全行を個票へ移行する。個票を持たない項目には新たに個票を生成し、既に個票を持つ項目には表の構造化フィールドを frontmatter へ移す。

## 2. 完了条件

- 一覧の全行が個票として存在し、構造化フィールドが frontmatter へ移されている。
- 個票が既にある項目で、本文の記述内容が失われていない。
- 移行前後で項目数、ID、処理状態、結論が一致する。差分が検証で確認できる。
- 移行後の一覧生成結果が、移行前の一覧と項目単位で同じ内容になる。
- 移行処理が再実行可能で、途中失敗時に部分適用が残らない。

## 3. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ                                                           |
| --- | -------------------------------- | ---- | ---- | -------------------------------------------------------------- |
| 1   | 移行処理を実装する               | ARC  | done | 全件計画後に一括適用し、失敗時に戻す `register migrate` を追加 |
| 2   | 個票が無い項目の個票を生成する   | ARC  | done | type 別テンプレートから126件を生成                             |
| 3   | 既存個票へ構造化フィールドを移す | ARC  | done | 58件を更新し、既存詳細の前へ一覧要約を保持                     |
| 4   | 移行前後の突き合わせ検証を行う   | ARC  | done | 186件の全項目値を適用前に照合                                  |
| 5   | 移行を実行して結果を確認する     | ARC  | done | 初期状態の clean を確認し、再実行が no-op になることを確認     |

## 4. 対応結果

- `specdojo register migrate` を追加した。旧一覧と、先に frontmatter 正本へ移った個票を統合して全件をメモリ上で変換・照合し、一時ファイルから切り替える。入力が計画後に変わった場合は適用前に停止し、切り替え途中の失敗時は既存ファイルと旧一覧を復元する。
- 186件を移行した。個票が無かった126件は type 別テンプレートから生成し、既存個票58件は frontmatter を追加した。すでに正本化済みだった2件は値を保持した。既存個票では一覧の短い説明を先頭段落へ追加し、従来の詳細段落と後続節を残した。
- 旧 `pjr-index.md` を除去し、個票群から `generated/pjr-index.md` と派生ビューを再生成した。再実行結果は `create=0 / update=0 / unchanged=186` である。
- 旧一覧と生成一覧は186件で一致した。差分は移行前から個票正本だった [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]] の完了状態と、runner が本作業開始時に `in-progress` へ遷移済みの本項目だけであり、いずれも新しい frontmatter 値を維持した。
- 既存165件の不明な登録日は値を推測せず `registered_on` を省略した。期限は未定をキー省略、期限なしを `due_on: null` として区別し、旧一覧の表示を保った。個票186件を登録項目 frontmatter スキーマで検証し、すべて適合した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]]: 移行先のスキーマ定義
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 移行結果の検証に用いる一覧生成
- [[prj-0001:pjr-index]]: 移行対象の登録項目一覧
