---
specdojo:
  id: specdojo:pjr-handoff-template
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
      item_type: handoff
      item_status: open
      priority: medium
---

# _PJR-XXXX_ _HANDOFF_TITLE_

## 1. 引き継ぎ元と先

_TODO_: どのセッション・どの LLM から、誰へ引き継ぐかを記載する。

## 2. 有効な承認の範囲

_TODO_: 夜の間に close してよい条件、使わない agent など、引き継ぎ先が従う承認の範囲を記載する。長く効くものは playbook や個票の入力へ移す。ない場合は `-` とする。

## 3. 進行中

_TODO_: 流している列・run、review・waiting の項目を、登録簿と `exec status` から組み立てて記載する。ない場合は `-` とする。

## 4. 判断待ち

_TODO_: 利用者の返事を待っている `question` や項目への参照だけを記載する。待っていることは `question` として別に起票する。ない場合は `-` とする。

## 5. 注意点

_TODO_: 会話の中で気づいたことを記載する。決まりになるものは playbook へ移す。ない場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
