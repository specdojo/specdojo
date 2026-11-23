---
specdojo:
  id: prj-0001:pjr-x141-deprecate-pm-log-kata
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: PO
  registered_at: "2026-11-23T21:12:10Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T21:13:48Z"
  conclusion: 単独で書く pm-* のログの型を非推奨にし、register build の一覧の枠は登録簿の内部の template として残す（案 A）
  derived_from:
    - PJR-CPA8
---

# PJR-X141 単独で書く pm-* のログの型を非推奨にし、一覧の枠は登録簿の内部の template として残す

## 1. 背景

pm-change-request-log・pm-issue-log・pm-risk-register・pm-decision-log は登録簿の項目と重なるため、単独のログの型を非推奨にする。register build の一覧の枠は残す

## 2. 入力

- 第 6 波の pm-change-request-log-sample-060 で、template が register build の一覧の枠を兼ねているため executor が止まった（2026-11-24）
- 利用者の指摘: pm-change-request-log は登録簿の change-request と重なる（2026-11-24）

## 3. 検討した選択肢

| 選択肢 | 内容                                                                           | 利点                                           | 懸念                                                           |
| ------ | ------------------------------------------------------------------------------ | ---------------------------------------------- | -------------------------------------------------------------- |
| A      | 単独で書くログの型を非推奨にし、一覧の枠は登録簿が中で使う template として残す | 登録簿の項目に一本化でき、二重の記録がなくなる | rulebook・sample の非推奨化と、カタログ・schedule の整理が要る |
| B      | 「登録簿から作る一覧の型」として残し、PJR-CPA8 で生成の処理と合わせて整える    | 一覧の形を型として説明できる                   | 型を変えるたびに生成のコードも変わり、手間が大きい             |

## 4. 決定内容

- 単独で書くログとしての pm-change-request-log・pm-issue-log・pm-risk-register・pm-decision-log の型は非推奨にする。正本は登録簿の項目（change-request・issue・risk・decision）とし、人が別にログを書く使い方をやめる。
- `register build` が `generated/` に作る一覧の枠（`pm-*-template.md`）は、登録簿が中で使う template として残す。一覧の形を変えるときは、生成の処理（`src/register/views.ts`）と合わせて変える。
- 第 6 波の `T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-060`・`-080`・`-090` は流さない。
- 理由: 単独のログは登録簿の項目と内容が重なり、二重に保つ手間と食い違いの元になる。一覧は登録簿から作られるため、型として書き方を教える場面がない。

## 5. 採択理由

- 単独のログは登録簿の項目と内容が重なり、二重に保つ手間と食い違いの元になる（利用者の指摘、2026-11-24）。
- 一覧は `register build` が登録簿から作るため、人に書き方を教える型としての場面がない。
- 一覧の枠を内部の template として残せば、生成の結果を変えずに済む。

## 6. 承認

| 項目     | 内容                                                               |
| -------- | ------------------------------------------------------------------ |
| 決定者   | indie                                                              |
| 決定日   | 2026-11-24                                                         |
| 承認方式 | commit                                                             |
| 証跡     | オーケストレーターとの会話で案 A を承認（この個票の記帳の commit） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| 影響範囲   | pm-change-request-log・pm-issue-log・pm-risk-register・pm-decision-log の rulebook・sample・カタログ・第 6 波の schedule |
| 必要な対応 | 非推奨化の todo（この decision から起票）。一括実行の pm-change-request-log の 060・080・090 は流さない                  |
| 追跡先     | PJR-CPA8（登録簿と計画から生成する一覧の型）                                                                             |

## 8. 関連ドキュメント

- 追跡先: PJR-CPA8（登録簿と計画から生成する一覧の型を整える）。
- 影響先: [[specdojo:pm-change-request-log-rulebook]]、[[specdojo:pm-issue-log-rulebook]]、[[specdojo:pm-risk-register-rulebook]]。生成の処理は `src/register/views.ts`。
