---
specdojo:
  id: prj-0001:pjr-bj97-codeowners-and-branch-protection
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-09T02:12:43Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-26T14:36:20Z"
  conclusion: .github/CODEOWNERS を作成し、リポジトリ全体の承認者として @naoji3x を宣言した。独立した所有者が割り当てられた時点でより限定的なルールを追加する方針をコメントで残している。branch-workflow-guide へ、管理者が実施する branch protection の設定手順と確認項目、および統合専用 actor のみが bypass できる設計を追記した。独立した承認者がいない期間は PR 強制3ケースを承認待ちとし、作成者自身の approve と管理者権限の bypass を承認として扱わないことを明記した。緊急対応で bypass する場合も承認済みとせず例外として記録する。branch protection の設定と PR 強制3ケースの検証は GitHub 上の操作であり、リポジトリ管理者が実施する。実施後は対応結果へ追記する。
  register_events:
    - v: 1
      id: reg_4a0d3e228b09a27a011384931379a0ab
      ts: "2026-08-09T02:12:43Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(prj-0001): add PJR-ES57, PJR-GQFX, PJR-BJ97"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: CODEOWNERS 未整備により PR 承認の職務分離が強制されていない
        - field: description
          from: ""
          to: PR 承認を強制する 3 ケース（`develop → main` 昇格、`change-request` の承認、不可逆・高リスク・framework schema 破壊的変更）について、承認者を宣言する仕組みが未整備であり、職務分離が platform 側で強制されていない。
        - field: type
          from: ""
          to: issue
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
      legacy_commit: 3f1be811234eaf5d52ea68370d0ed906d7f01245
    - v: 1
      id: reg_37118835786cdd562a35418b0621fa94
      ts: "2026-08-09T10:55:22Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: description
          from: PR 承認を強制する 3 ケース（`develop → main` 昇格、`change-request` の承認、不可逆・高リスク・framework schema 破壊的変更）について、承認者を宣言する仕組みが未整備であり、職務分離が platform 側で強制されていない。
          to: .github/CODEOWNERS が存在せず branch protection の Code Owners 承認を強制できないため、PR 強制3ケースで自己承認が成立してしまう。
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_4a0d3e228b09a27a011384931379a0ab
    - v: 1
      id: reg_0ecf47ce4b0612aa417cc2c213683e94
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: registered
          from: _TODO_
          to: "2026-08-09"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_37118835786cdd562a35418b0621fa94
    - v: 1
      id: reg_6191bd64d67ceb2e49c851e7dd9d0342
      ts: "2026-08-26T14:23:51Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-BJ97): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 1592cdea1182f2effac85e6fb907e9059ef6b678
      previous_event_id: reg_0ecf47ce4b0612aa417cc2c213683e94
    - v: 1
      id: reg_f14ceb8c586f4fa73bfa120e36dbc408
      ts: "2026-08-26T14:32:10Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-BJ97): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 67ec643043e88a79d998b83f83ab1932bc86fa3a
      previous_event_id: reg_6191bd64d67ceb2e49c851e7dd9d0342
    - v: 1
      id: reg_4d2646e4083f9cd133f3448ef77b7db4
      ts: "2026-08-26T14:36:44Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "docs(register): PJR-BJ97 をクローズする"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-26"
        - field: conclusion
          from: "-"
          to: .github/CODEOWNERS を作成し、リポジトリ全体の承認者として @naoji3x を宣言した。独立した所有者が割り当てられた時点でより限定的なルールを追加する方針をコメントで残している。branch-workflow-guide へ、管理者が実施する branch protection の設定手順と確認項目、および統合専用 actor のみが bypass できる設計を追記した。独立した承認者がいない期間は PR 強制3ケースを承認待ちとし、作成者自身の approve と管理者権限の bypass を承認として扱わないことを明記した。緊急対応で bypass する場合も承認済みとせず例外として記録する。branch protection の設定と PR 強制3ケースの検証は GitHub 上の操作であり、リポジトリ管理者が実施する。実施後は対応結果へ追記する。
      legacy_commit: 5db3830cb2dc6f2db68a160cc79a3508f361c725
      previous_event_id: reg_f14ceb8c586f4fa73bfa120e36dbc408
---

# PJR-BJ97 CODEOWNERS 未整備により PR 承認の職務分離が強制されていない

## 1. 課題内容

.github/CODEOWNERS が存在せず branch protection の Code Owners 承認を強制できないため、PR 強制3ケースで自己承認が成立してしまう。

PR 承認を強制する 3 ケース（`develop → main` 昇格、`change-request` の承認、不可逆・高リスク・framework schema 破壊的変更）について、承認者を宣言する仕組みが未整備であり、職務分離が platform 側で強制されていない。

- 発生日: 2026-08-09
- 事実: リポジトリに `.github/CODEOWNERS` が存在しない。標準では承認者を `CODEOWNERS` で宣言し、branch protection の Code Owners 承認要求で強制する前提になっている。
- 顕在化した事例: [[prj-0001:pjr-9y7g-register-item-file-as-ssot]] の承認において、PR の作成者と承認者が同一だった。標準は作成者による自己承認を承認としてカウントしないと定めており、記録上は職務分離が成立していない。
- branch protection の設定状況は未確認。確認には platform 側の権限が必要である。

## 2. 影響範囲

| 観点         | 影響                                                           |
| ------------ | -------------------------------------------------------------- |
| スコープ     | PR 承認を強制する 3 ケース全般。承認事実の実効性が担保されない |
| スケジュール | 影響は小さい。整備は独立して実施できる                         |
| コスト       | 影響は小さい                                                   |
| 品質         | 承認記録が形式的になり、監査時に承認の実効性を示せない         |
| 関係者       | リポジトリ管理者、PO、変更承認権限者（CCB）                    |

## 3. 対応方針

| 項目     | 内容                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 承認者宣言（`CODEOWNERS`）と強制設定（branch protection）が未整備で、標準が想定する強制手段が機能していない                         |
| 対応策   | `.github/CODEOWNERS` を作成して `main` と各 project の承認対象へ承認者を割り当て、branch protection で Code Owners 承認を必須にする |
| 依存事項 | 承認者の GitHub アカウントは `naoji3x` で確定した。branch protection の設定は GitHub 上の操作であり、リポジトリ管理者が実施する     |
| 完了条件 | 下記のとおり                                                                                                                        |

単独運用の期間が続く場合は、職務分離を満たせない事実と、その期間の承認の扱いを運用ガイドまたは本個票へ明記することを検討する。承認記録を実態と異なる形で残さないことを優先する。

### 3.1. 本項目の範囲

当初の完了条件は branch protection の設定と PR 強制 3 ケースの検証まで含んでいたが、これらは GitHub 上の操作でありリポジトリ管理者が行う。本項目はリポジトリ内で完結する作業に範囲を限定する。

| 作業                              | 範囲   |
| --------------------------------- | ------ |
| `.github/CODEOWNERS` の設計と作成 | 含む   |
| 承認対象パスへの承認者の割り当て  | 含む   |
| 単独運用期間の扱いの明文化        | 含む   |
| branch protection の設定          | 範囲外 |
| PR 強制 3 ケースの検証            | 範囲外 |

範囲外の作業は本項目の完了後に管理者が実施する。実施内容と確認結果は対応結果へ追記する。

### 3.2. 完了条件

- `.github/CODEOWNERS` が存在し、承認者として `@naoji3x` が宣言されている。
- 承認対象のパスが設計され、なぜその範囲を対象にしたかが記録されている。リポジトリ全体を対象にするのか、`docs/ja/projects/` や `.specdojo/` など統制上重要な範囲に絞るのかを判断する。
- 単独運用のため、現状では Code Owners 承認を必須にしても**自己承認しか成立しない**。この事実と、その期間の承認の扱いが明文化されている。承認記録を実態と異なる形で残さない。
- branch protection の設定手順が記録されている。管理者が後から実施できる内容とする。
- `CODEOWNERS` の記法が正しい。GitHub が解釈できる形式であることを確認する。
- `npm run lint:md`、`npm run lint:fm` が成功する。

## 4. 対応結果

- `.github/CODEOWNERS` を作成し、リポジトリ全体の owner に `@naoji3x` を指定した。`develop → main` 昇格は任意のパスを変更し得るため、統制対象を一部の project 文書や `.specdojo/` に限定すると owner のない差分が生じる。そこで `*` を既定ルールとし、`main` と全 project の承認対象を漏れなく含めた。project ごとに独立した承認者を割り当てる場合は、既定ルールより後へ限定パスのルールを追加する。
- [[specdojo:branch-workflow-guide]] の「CODEOWNERS と branch protection を設定する」に、管理者が行う設定の前提、`main` と `project/<project-id>/develop` の保護条件、確認項目を記録した。`project/<project-id>/develop` では通常の自動統合を維持するため、統合専用 actor だけに bypass を限定する。actor を分離できない間は develop の保護を有効化せず、未設定期間を project register で追跡する。
- 同ガイドの「独立した承認者がいない期間を扱う」に、単独運用中は PR 強制 3 ケースを「承認待ち」とし、自己承認や管理者 bypass を承認として記録しないことを明記した。緊急 bypass は未承認の例外として記録し、独立した承認者の参加後に遡及レビューする。
- branch protection の GitHub 上の設定と PR 強制 3 ケースの実地確認は本項目の範囲外であり、リポジトリ管理者がガイドの手順に従って実施する。設定時には `@naoji3x` の明示的な write 権限と、`CODEOWNERS` が各 base branch に存在することも確認する。

## 5. 関連ドキュメント

- [[specdojo:branch-workflow-guide]]: 承認方式の使い分けと PR 承認の手順
- [[specdojo:register-operation-guide]]: PO 留保事項の PR 承認運用
- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 自己承認が顕在化した決定
- [[prj-0001:pjr-0126-pr-based-po-approval]]: PR ベースの PO 承認運用（先行対応）
