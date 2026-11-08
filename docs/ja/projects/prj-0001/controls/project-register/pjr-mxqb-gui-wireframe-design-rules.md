---
specdojo:
  id: prj-0001:pjr-mxqb-gui-wireframe-design-rules
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: low
  registered_at: "2026-11-08T08:12:24Z"
---

# PJR-MXQB GUI のワイヤーフレームとデザインのルールをどの型で定めるか

## 1. 確認事項

uis はワイヤーフレームとレイアウトを含めず、今の型にはそれらとデザインのルールを定める場所がない。デザインのルール（色・文字・余白の基本の値、部品、レイアウトの型、アクセシビリティ）を設計の新しい型にするか、ワイヤーフレームを文書にせず uis とデザインのルールから試作として作るかを決める

## 2. 入力

- orchestrator の案（2026-11-08、indie が question として起票することに同意）: デザインのルールは設計の範疇で、実装の共通ルールを扱う sysd-cross-cutting-policy とは分けた新しい型にする。ワイヤーフレームは文書として保守せず、uis とデザインのルールから agent に試作を作らせ、プロダクトのリポジトリに置く。
- uis だけでも画面の試作は作れるが、項目の並び・部品の選び方・色や余白・画面をまたいだ揃いが決まらず、作るたびに見た目が変わる。
- prj-0001（SpecDojo）には GUI がないため、GUI を持つプロジェクト（prj-0002 の LP など）で必要になったときに決める。nfr-usability は測れる目標を決める要求で、デザインのルールはそれを満たす設計の決まりにあたる。

## 3. 背景

_TODO_: この確認が必要になった背景、前提、制約を記載する。

## 4. 回答候補

| 候補 | 内容   | 利点   | 懸念   |
| ---- | ------ | ------ | ------ |
| A    | _TODO_ | _TODO_ | _TODO_ |

## 5. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
