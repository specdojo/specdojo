---
specdojo:
  id: prj-0001:pjr-bj97-codeowners-and-branch-protection
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-09T02:12:43Z"
  due_on: "2026-08-31"
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

-

## 5. 関連ドキュメント

- [[specdojo:branch-workflow-guide]]: 承認方式の使い分けと PR 承認の手順
- [[specdojo:register-operation-guide]]: PO 留保事項の PR 承認運用
- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 自己承認が顕在化した決定
- [[prj-0001:pjr-0126-pr-based-po-approval]]: PR ベースの PO 承認運用（先行対応）
