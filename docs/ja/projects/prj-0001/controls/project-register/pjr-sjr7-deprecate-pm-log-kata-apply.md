---
specdojo:
  id: prj-0001:pjr-sjr7-deprecate-pm-log-kata-apply
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T21:14:31Z"
  due_on: "2026-11-30"
  block_reason: "executor reported incomplete: 3 型の rulebook・sample の非推奨化、dct-kata と第 6 波 strategy からの除外、個票の記入は完了した。第 6 波の track（sch-track-kata-wave-6-project.yaml）の再生成が未実施で、060・080・090 の段がまだ残っている。"
  derived_from:
    - PJR-X141
  commit_type: docs
  commit_scope: kata
---

# PJR-SJR7 単独で書く pm-* のログの型を非推奨にする

## 1. 概要

PJR-X141 に従い、pm-change-request-log・pm-issue-log・pm-risk-register・pm-decision-log の rulebook と sample を非推奨にし、一覧の枠は register build 用に残す

## 2. 入力

- PJR-X141 で決定（利用者の承認、2026-11-24）
- 期限は 11 月末（利用者の指定、2026-11-24）

## 3. 完了条件

- PJR-X141 の決定に従い、pm-change-request-log・pm-issue-log・pm-risk-register・pm-decision-log の rulebook と sample（ある場合）の frontmatter の `status` を `deprecated` にし、冒頭に、正本が登録簿の項目であることと移る先を 1 段落で書く。
- 型の一覧・カタログ・kata の案内（`kata list` の対象や文書サイトの目次）で、非推奨の型が新しく選ばれないようにする。どこを変えたかを個票の対応結果に書く。
- `pm-*-template.md` は `register build` の枠として残し、一覧の生成（`register build`）の結果が変わらないことを、変更の前後の `generated/` の差分で確かめる。
- 第 6 波の schedule で、pm-change-request-log の 060・080・090 を流さない扱いにする。track は直接編集せず strategy で行う。pm-issue-log・pm-risk-register の残りの段があれば同じに扱う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run test:unit` を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
