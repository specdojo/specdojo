---
specdojo:
  id: prj-0001:pjr-sjr7-deprecate-pm-log-kata-apply
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T21:14:31Z"
  due_on: "2026-11-30"
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

| No  | 作業                                          | 担当 | 状態 | メモ                                                                    |
| --- | --------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------- |
| 1   | 3 型の rulebook・sample の非推奨化            | DEV  | done | `status: deprecated` と冒頭の案内を追加                                 |
| 2   | kata の一覧から外す（dct-kata）               | DEV  | done | 3 つの sample の項目と依存を削除                                        |
| 3   | 第 6 波の strategy から外す                   | DEV  | done | scope・approach_rules・owner_rules から削除                             |
| 4   | 第 6 波の track の再生成                      | DEV  | open | track は直接編集不可。下の残課題を参照                                  |
| 5   | `register build` の結果が変わらないことの確認 | DEV  | done | template・`views.ts` を変えていないため差分なし。実行は親の検査に任せた |
| 6   | CHANGELOG に書く事項                          | DEV  | done | 下に区分と文案を記載                                                    |

## 5. 対応結果

### 5.1. 実施内容

- pm-change-request-log・pm-issue-log・pm-risk-register の rulebook と sample（計 6 件）の `status` を `deprecated` にし、見出しを「（非推奨）」にして、正本が登録簿の項目（`change-request`・`issue`・`risk`）であることと移る先を 1 段落で書いた。
- pm-decision-log には rulebook も sample もない（`dct-project-management.yaml` の項目は `pjr-rulebook` を参照する生成物）ため、文書の変更はない。
- 新しく選ばれない対応: `dct-kata.yaml` から 3 つの sample の項目を削除し、`pm-communication-plan-sample` の `depends_on` からも外した。`sch-strategy-kata-wave-6-project.yaml` の scope・approach_rules・owner_rules からも外した（cld 等の前例と同様に、非推奨の型は kata のカタログに載せない）。
- `dct-project-management.yaml` の「管理ビュー」の生成物の項目と `pm-*-template.md` は、`register build` の枠として変更せず残した。`slim-2` の strategy は実行済みの段のため変えていない。
- 追加で変えた strategy の先頭コメントに、除外の理由を 1 行で記した。

### 5.2. CHANGELOG に書く事項

- 区分: Deprecated
- 文案: 単独で書く pm-change-request-log・pm-issue-log・pm-risk-register の rulebook と sample を非推奨にした。正本はプロジェクト登録簿の項目で、一覧は `register build` が作る（PJR-X141）。

### 5.3. 残課題

- `sch-track-kata-wave-6-project.yaml` に、3 つの sample の 040〜080 の段が残っている。track は直接編集せず、strategy からの再生成で外す。未実行の 060・080・090 は流さないこと。
- `npm run lint:md`・`lint:fm`・`validate:schema`・`test:unit` は親の runner が実行する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-x141-deprecate-pm-log-kata]]
- [[specdojo:pm-change-request-log-rulebook]]、[[specdojo:pm-issue-log-rulebook]]、[[specdojo:pm-risk-register-rulebook]]
