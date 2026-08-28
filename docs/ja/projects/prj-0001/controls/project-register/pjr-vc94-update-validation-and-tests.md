---
specdojo:
  id: prj-0001:pjr-vc94-update-validation-and-tests
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
  completed_at: "2026-08-09T11:27:57Z"
  register_events:
    - v: 1
      id: reg_1d59a509b7697764fac546dea616dcc1
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
          to: 検証とテストを個票正本の構成へ更新する
        - field: description
          from: ""
          to: "[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割6。表専用スキーマによる検証を廃止し、個票 frontmatter を対象とする検証へ付け替える。あわせて既存テストを新構成へ更新し、移行後の挙動を検証するテストを追加する。"
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
      id: reg_2f14df856bab8e7f161a8f2b2d681994
      ts: "2026-08-09T10:55:22Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: description
          from: "[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割6。表専用スキーマによる検証を廃止し、個票 frontmatter を対象とする検証へ付け替える。あわせて既存テストを新構成へ更新し、移行後の挙動を検証するテストを追加する。"
          to: PJR-ES57 の分割6。表専用スキーマの廃止に伴う検証経路の付け替えと、移行後の挙動を検証するテストを整備する。
        - field: priority
          from: medium
          to: high
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_1d59a509b7697764fac546dea616dcc1
    - v: 1
      id: reg_332b4245148f37e0789387ae51415bce
      ts: "2026-08-09T11:19:32Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-VC94): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 1be7bcd5052320582bcb57dde132dfb9d78f4c9b
      previous_event_id: reg_2f14df856bab8e7f161a8f2b2d681994
    - v: 1
      id: reg_26b6dc34aed91235e32045fd3f63544c
      ts: "2026-08-09T11:26:47Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-VC94): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 7b6b4ecc318b69f001a2864020b68aee2cdcd6ba
      previous_event_id: reg_332b4245148f37e0789387ae51415bce
    - v: 1
      id: reg_fc38e5bfd0611255ca03f24cee81bd42
      ts: "2026-08-09T11:27:57Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "docs(prj-0001): close PJR-VC94"
      changes:
        - field: status
          from: review
          to: done
      legacy_commit: 3f05c6ce0c1397606cabe2544a45658cb1a85b73
      previous_event_id: reg_26b6dc34aed91235e32045fd3f63544c
    - v: 1
      id: reg_7d9d546a1708a84cfc09a4a5afd79406
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
      previous_event_id: reg_fc38e5bfd0611255ca03f24cee81bd42
---

# PJR-VC94 検証とテストを個票正本の構成へ更新する

## 1. 概要

PJR-ES57 の分割6。表専用スキーマの廃止に伴う検証経路の付け替えと、移行後の挙動を検証するテストを整備する。

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割6。表専用スキーマによる検証を廃止し、個票 frontmatter を対象とする検証へ付け替える。あわせて既存テストを新構成へ更新し、移行後の挙動を検証するテストを追加する。

## 2. 完了条件

- 表専用スキーマによる検証が廃止され、個票 frontmatter の検証へ置き換わっている。
- ID の一意性、個票ファイル名と ID の対応、enum 値の妥当性が検証で検出される。
- 検証がエディタのリアルタイム検証と CI の両方で機能する。
- 既存テストが新構成で green である。表の入出力に依存したテストが更新または削除されている。
- 個票の追加・状態遷移・一覧生成について、振る舞いを検証するテストが存在する。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                                                         |
| --- | ------------------------------------------ | ---- | ---- | ------------------------------------------------------------ |
| 1   | 検証経路の付け替えを行う                   | ARC  | done | 表専用スキーマを廃止し、個票 schema rule へ更新              |
| 2   | ID 一意性とファイル名対応の検証を実装する  | ARC  | done | `register build` が対象 ID とファイルを含めて報告            |
| 3   | 既存テストを新構成へ更新する               | ARC  | done | 個票正本の fixture を基準に検証経路を確認                    |
| 4   | 移行後の振る舞いを検証するテストを追加する | ARC  | done | 追加・状態遷移・一覧生成の既存テストを維持し、横断検証を追加 |

## 4. 対応結果

- `pjr-index-content.schema.yaml` とそれを呼ぶ schema 検証経路を廃止し、`.remarkrc.yaml` で `project-register/pjr-????-*.md` を `register-item-frontmatter.schema.yaml` に接続した。エディタの Remark/Ajv 検証で必須項目・enum・日付形式を各個票へ即時適用する。
- `validateRegisterItemDocs` を追加し、`register build` の開始前に個票を横断検証するようにした。表示 ID の重複と、ファイル名・frontmatter の `specdojo.id` の不一致を、ID と両方の対象ファイル名を含むエラーとして検出する。
- 個票の追加・状態遷移・一覧生成のテストは既存の `register-commands.test.ts` / `register.test.ts` で個票 frontmatter を正本として検証済みであることを確認した。今回、`register-item.test.ts` に横断検証、`register-commands.test.ts` に build 経路での不整合拒否を追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]]: 検証対象となるスキーマ定義
- [[prj-0001:pjr-tt4j-register-cli-write-to-tickets]]: テスト更新の対象となる CLI 変更
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 決定性を検証する一覧生成
