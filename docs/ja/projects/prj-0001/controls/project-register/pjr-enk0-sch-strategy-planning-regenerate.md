---
specdojo:
  id: prj-0001:pjr-enk0-sch-strategy-planning-regenerate
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-26T15:20:19Z"
  due_on: "2026-09-30"
---

# PJR-ENK0 sch-strategy-planningをassessmentから再生成する

## 1. 概要

docs/ja/projects/prj-0001/schedule/sch-strategy-planning.yaml は手書きで作成されており、全フェーズが approach: fully-guided の一律指定になっている。本来は sch-assessment-planning.yaml の判定に基づいて決定論的に生成されるべきである。現状の assessment は facts が実態と一致せず（3件）、判定も1件も入っていない骨組みの状態で、strategy 生成は blocking open question により停止する。assessment の事実を最新化し、agent による判定を経て strategy を再生成する。既存ファイルには手書きの owner_rules 8件と group_milestones が含まれるため、生成結果との差分を確認して失われる情報がないかを検証する。

## 2. 完了条件

- `sch-assessment-planning.yaml` の facts が実際の解決結果と一致する。現在は3件（`sch-strategy-data-flow`、`sch-strategy-launch`、`tml-index`）が不一致である。
- assessment に成果物と実践の型の利用可能性の判定が入っている。現在は1件も判定されていない骨組みの状態で、blocking open question により strategy 生成が停止する。
- `schedule assessment validate` がエラーなく通る。
- `sch-strategy-planning.yaml` が `schedule strategy generate` で生成された内容になっている。手書きではない。
- 生成された `approach` が assessment の判定に基づいており、全フェーズ一律の `fully-guided` ではない。判定の結果として一律になる場合は、その根拠が assessment に現れている。
- 既存ファイルの手書き内容（`owner_rules` 8件、`group_milestones`）が生成結果でどう扱われたかを確認し、失われた情報があれば記録する。生成で表現できない情報は、どこへ移すかを判断する。
- `schedule build --track planning` が成功し、生成された track に想定外のタスクが現れない。
- `npm run validate:schema`、`npm run lint:md`、`npm run lint:fm` が成功する。

### 調査済みの事実

- 実行手順は3段階である。`schedule assessment scaffold` で事実を収集し、`schedule assessment prompt` が出す指示を agent が判定して `--from` で取り込み、`schedule strategy generate` で生成する。
- `schedule assessment validate` は現在、facts 不一致3件のエラーと、判定なし・confidence low・blocking open question の警告を出す。
- 現在の `sch-strategy-planning.yaml` は `maintain-pass` の1フェーズのみで、`approach: fully-guided` が一律に指定されている。
- 本項目は PJR-K4TA の完了を待って保留していた。実践の型の要否宣言が整備され、`undecided` と `not-needed` が正しく宣言された現在、assessment の判定材料は揃っている。

## 3. 作業内容

| No  | 作業                                                          | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | assessment の facts を最新化する                              | ARC  | open | `assessment scaffold` の再実行   |
| 2   | 成果物と実践の型の利用可能性を判定し取り込む                  | ARC  | open | `assessment prompt` の指示に従う |
| 3   | strategy を生成し、既存の手書き内容との差分を確認する         | ARC  | open | 失われる情報がないかを検証する   |
| 4   | `schedule build` が成功し想定外のタスクが出ないことを確認する | ARC  | open | 生成結果の妥当性確認             |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- Schedule の設計方針: [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- 対象ファイル: `docs/ja/projects/prj-0001/schedule/sch-strategy-planning.yaml`
- 判定の入力: `docs/ja/projects/prj-0001/schedule/assessments/sch-assessment-planning.yaml`
- 保留の経緯となった項目: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- planning ドメインを設けた決定: [[prj-0001:pjr-wvns-planning-artifacts-catalog-scope|PJR-WVNS 計画成果物をカタログへ載せる]]
