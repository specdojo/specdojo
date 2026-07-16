---
specdojo:
  id: pjr-index-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pjr-index
      type: project
      status: draft
      rulebook: pjr-index-rulebook
---

# プロジェクト登録簿

Project Register

この文書は、_PROJECT_ID_ プロジェクトのプロジェクト登録簿です。

プロジェクト進行中に発生する TODO、要確認事項、リスク、課題、変更要求、決定事項、依存事項、備忘などの管理対象を一覧化します。

記載ルール、項目定義、type / status / priority の定義は [[pjr-index-rulebook]] に従います。
登録の判断、状態遷移、個票分離などの使い方は [[specdojo-register-operation-guide]] を参照します。

## 1. 登録項目一覧

<!-- prettier-ignore -->
| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 期限 | 完了日 | 結論 | 個票 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PJR-0001 | open | _TODO_ | _TODO_ | todo | high | _TODO_ | _TODO_ | - | - | - |

## 2. 派生ビュー

以下のファイルは、プロジェクト登録簿から生成される補助一覧です。
正本は `pjr-index.md` と各 `pjr-XXXX-<topic>.md` とし、派生ビューは正本の内容に従属します。

### 2.1. 登録簿内の補助一覧

- [[pjr-views|台帳ビュー（状態別・優先度別・担当者別）]]

### 2.2. controls 全体の派生管理ビュー

- [[pm-risk-register|リスク登録簿]]
- [[pm-issue-log|課題ログ]]
- [[pm-change-request-log|変更要求ログ]]
- [[pm-decision-log|決定記録]]
