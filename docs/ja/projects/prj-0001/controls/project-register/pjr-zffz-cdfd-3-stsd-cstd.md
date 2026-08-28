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
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_f873591d6de55f9264c0cd0ad22f99f3
      ts: "2026-08-12T09:36:03Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "exec(register PJR-ZFFZ): file todo to migrate cdfd scope detail to stsd/cstd"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: cdfd 3ファイルの状態・分類詳細をstsd/cstd等へ移設
        - field: description
          from: ""
          to: cdfd-register-operation.md（2.1/2.2/2.3）、cdfd-routine.md（2.1/2.2）、cdfd-reporting.md（2.1）にある状態定義・type分類・データ正本の詳細記載は、対応するステータス定義（stsd）・概念状態遷移図（cstd）・データストア定義（cdsd）等の文書を作成する際に、そちらへ移設し、cdfd側は参照へ簡潔化する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-12"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 795a8942936e036874023af21a5a57fd1e53a351
    - v: 1
      id: reg_f38f7904c746af6d1a5bb9e289934aaa
      ts: "2026-08-13T11:34:04Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "docs(cdfd): rename cdfd-register-operation to cdfd-register-lifecycle"
      changes:
        - field: description
          from: cdfd-register-operation.md（2.1/2.2/2.3）、cdfd-routine.md（2.1/2.2）、cdfd-reporting.md（2.1）にある状態定義・type分類・データ正本の詳細記載は、対応するステータス定義（stsd）・概念状態遷移図（cstd）・データストア定義（cdsd）等の文書を作成する際に、そちらへ移設し、cdfd側は参照へ簡潔化する。
          to: cdfd-register-lifecycle.md（2.1/2.2/2.3）、cdfd-routine.md（2.1/2.2）、cdfd-reporting.md（2.1）にある状態定義・type分類・データ正本の詳細記載は、対応するステータス定義（stsd）・概念状態遷移図（cstd）・データストア定義（cdsd）等の文書を作成する際に、そちらへ移設し、cdfd側は参照へ簡潔化する。
      legacy_commit: 886852ba49351509cae80864a294bd12688a6e37
      previous_event_id: reg_f873591d6de55f9264c0cd0ad22f99f3
    - v: 1
      id: reg_cfc09b2eb7e3ae241d369441efaabae5
      ts: "2026-08-26T14:42:06Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "docs(register): PJR-ZFFZ の期限を9月末へ変更する"
      changes:
        - field: due
          from: "2026-08-31"
          to: "2026-09-30"
      legacy_commit: 46776088bb4593cdd4b64fa7f72d6f9a27512087
      previous_event_id: reg_f38f7904c746af6d1a5bb9e289934aaa
---

# PJR-ZFFZ cdfd 3ファイルの状態・分類詳細をstsd/cstd等へ移設

## 1. 概要

cdfd-register-lifecycle.md（2.1/2.2/2.3）、cdfd-routine.md（2.1/2.2）、cdfd-reporting.md（2.1）にある状態定義・type分類・データ正本の詳細記載は、対応するステータス定義（stsd）・概念状態遷移図（cstd）・データストア定義（cdsd）等の文書を作成する際に、そちらへ移設し、cdfd側は参照へ簡潔化する。

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

- [[prj-0001:cdfd-register-lifecycle]]（2.1・2.2・2.3が対象）
- [[prj-0001:cdfd-routine]]（2.1・2.2が対象）
- [[prj-0001:cdfd-reporting]]（2.1が対象）
