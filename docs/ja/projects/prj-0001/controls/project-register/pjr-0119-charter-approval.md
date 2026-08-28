---
specdojo:
  id: prj-0001:pjr-0119-charter-approval
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: PO
  due_on: "2026-07-17"
  completed_at: "2026-07-17T12:00:00Z"
  conclusion: コミットce44286c時点の憲章を承認。立ち上げ認可と権限委譲を確定
  register_events:
    - v: 1
      id: reg_0b7aa54b298548758fc36af5eee1128f
      ts: "2026-07-25T10:10:47Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "refactor(docs): 横断ディレクトリをプロジェクト直下へ移動"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: プロジェクト憲章の承認
        - field: description
          from: ""
          to: "[[prj-0001:prj-charter\\|プロジェクト憲章]] の内容整備が完了し、正式な立ち上げ認可文書として確定させるため、PO の承認が必要になった。"
        - field: type
          from: ""
          to: decision
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
      legacy_commit: 393767768e66c987bff6cfac9914f208620e9166
    - v: 1
      id: reg_bc808684c610c194d113be4426dc1039
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: decided
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: decided
        - field: description
          from: "[[prj-0001:prj-charter\\|プロジェクト憲章]] の内容整備が完了し、正式な立ち上げ認可文書として確定させるため、PO の承認が必要になった。"
          to: prj-charter の立ち上げ認可と権限委譲を PO として承認する
        - field: priority
          from: medium
          to: high
        - field: owner
          from: _TODO_
          to: PO
        - field: due
          from: _TODO_
          to: "2026-07-17"
        - field: conclusion
          from: "-"
          to: コミットce44286c時点の憲章を承認。立ち上げ認可と権限委譲を確定
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_0b7aa54b298548758fc36af5eee1128f
    - v: 1
      id: reg_6ed8853dad65272e7d048a9d962b75a3
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: decided
      to_status: decided
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-17"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_bc808684c610c194d113be4426dc1039
  supersedes:
    - prj-0001:pjr-0119
---

# PJR-0119 プロジェクト憲章の承認

## 1. 背景

prj-charter の立ち上げ認可と権限委譲を PO として承認する

[[prj-0001:prj-charter|プロジェクト憲章]] の内容整備が完了し、正式な立ち上げ認可文書として確定させるため、PO の承認が必要になった。

## 2. 検討した選択肢

| 選択肢 | 内容                   | 利点                               | 懸念                             |
| ------ | ---------------------- | ---------------------------------- | -------------------------------- |
| A      | 現内容のまま承認する   | 詳細計画策定と初期準備へ進められる | 予算枠・公開範囲は未決のまま残る |
| B      | 未決事項の解消まで保留 | 承認時点の不確定要素が減る         | 立ち上げが遅延する               |

## 3. 決定内容

プロジェクト憲章（コミット `ce44286c` 時点の内容）を承認する。承認対象は、立ち上げ認可、詳細計画策定と初期準備の権限委譲である。本承認は、本格実行開始、外部公開、追加支出を承認するものではない。

## 4. 採択理由

- 予算枠・公開範囲などの未決事項は憲章の「認可しない範囲」に含まれており、承認を保留する理由にならないため。
- 憲章が認可対象・権限委譲・GO / Not GO 条件を監査可能な粒度で満たしていることを確認したため。

## 5. 影響範囲とフォローアップ

| 項目       | 内容                                                                            |
| ---------- | ------------------------------------------------------------------------------- |
| 影響範囲   | プロジェクト定義・管理文書の詳細化と、追加支出を伴わない初期準備の開始          |
| 必要な対応 | 憲章の承認章へ承認日と本記録を記載し、frontmatter の status を ready へ更新する |
| 追跡先     | [[prj-0001:prj-charter\|プロジェクト憲章]] の未決事項、GO / Not GO 判断         |

## 6. 関連ドキュメント

- [[prj-0001:prj-charter|プロジェクト憲章]]
- [[prj-0001:prj-overview|プロジェクト概要]]
- [[prj-0001:prj-stakeholder-register|ステークホルダー登録簿]]
