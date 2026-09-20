---
specdojo:
  id: specdojo:pjr-question-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PJR_DOCUMENT_ID_
      type: project
      status: draft
      rulebook: specdojo:pjr-rulebook
      part_of:
        - _PROJECT_ID_:pjr-index
      item_type: question
      item_status: open
      priority: medium
---

# _PJR-XXXX_ _QUESTION_TITLE_

## 1. 確認事項

_TODO_: 確認したい論点を、回答者が判断できる粒度で記載する。

## 2. 背景

_TODO_: この確認が必要になった背景、前提、制約を記載する。

## 3. 回答候補

| 候補 | 内容   | 利点   | 懸念   |
| ---- | ------ | ------ | ------ |
| A    | _TODO_ | _TODO_ | _TODO_ |

## 4. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
