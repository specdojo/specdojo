---
specdojo:
  id: specdojo:pjr-index-reference-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pjr-index
      type: project
      status: draft
      rulebook: specdojo:pjr-rulebook
---

# プロジェクト登録簿

Project Register

この文書は、プロジェクト登録簿の文書 ID と参照先を維持するための案内ページです。

登録項目の正本は、同じディレクトリにある各 `pjr-XXXX-<topic>.md` の Frontmatter です。登録項目の一覧は、`specdojo register build` により非追跡の派生ビューとして生成されます。

- [登録項目一覧を開く](./generated/pjr-index.md)

生成された一覧を手編集しても次回の生成で失われます。登録内容を変更する場合は、対象の個票を更新してください。
