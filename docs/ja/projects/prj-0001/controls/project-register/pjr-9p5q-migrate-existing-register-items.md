---
specdojo:
  id: prj-0001:pjr-9p5q-migrate-existing-register-items
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-09T08:48:42Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T11:03:44Z"
  register_events:
    - v: 1
      id: reg_cb57373bf64b368f556837fc1a02c997
      ts: "2026-08-09T08:48:42Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(prj-0001): split PJR-ES57 into 8 register items"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 既存登録項目を個票 frontmatter へ一括移行する
        - field: description
          from: ""
          to: "[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割4。現行の登録項目一覧に存在する全行を個票へ移行する。個票を持たない項目には新たに個票を生成し、既に個票を持つ項目には表の構造化フィールドを frontmatter へ移す。"
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: ed4a5ebd78cf5d5c024951e1eb834e5a78317135
    - v: 1
      id: reg_8a0a632092a305890c299c1e613252e1
      ts: "2026-08-09T10:26:35Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-9P5Q): start"
      changes:
        - field: status
          from: open
          to: in-progress
        - field: priority
          from: medium
          to: high
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
      legacy_commit: 96fa32cf55b83365a5331a5b2856245edda7679b
      previous_event_id: reg_cb57373bf64b368f556837fc1a02c997
    - v: 1
      id: reg_2d50c86a5fe504b7655bd0d7239377cf
      ts: "2026-08-09T10:55:48Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-9P5Q): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 089a3ffa2ed946e691e67e6102340986fcd6b613
      previous_event_id: reg_8a0a632092a305890c299c1e613252e1
    - v: 1
      id: reg_98251a7e72c81f95ee53f4dc11fa6bf9
      ts: "2026-08-09T11:03:44Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "docs(prj-0001): close PJR-9P5Q, add PJR-1D0C"
      changes:
        - field: status
          from: review
          to: done
      legacy_commit: 7eeeb85408d2e382450800116dca75eba2633d62
      previous_event_id: reg_2d50c86a5fe504b7655bd0d7239377cf
    - v: 1
      id: reg_0c7c34e3181bbd3df8058bce468d6fc1
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: registered
          from: _TODO_
          to: "2026-08-09"
        - field: completed
          from: "-"
          to: "2026-08-09"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_98251a7e72c81f95ee53f4dc11fa6bf9
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
