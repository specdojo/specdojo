---
specdojo:
  id: specdojo:cdr-template
  type: template
  status: draft
  frontmatter_template:
    applyTo: _APPLY_TO_
    specdojo:
      id: _LOCAL_ID_
      type: architecture
      status: draft
      rulebook: specdojo:cdr-rulebook
      based_on: _BASED_ON_
---

# _DELIVERABLE_NAME_

_DELIVERABLE_OVERVIEW_

## 1. 基本方針

- _TODO_

## 2. モジュールと import

- モジュール方式・import の書き方: _TODO_
- 依存の向きの制約と検査する仕組み: _TODO_

## 3. 型

<!-- 動的型の言語では型ヒントの方針に置き換えるか、章を削除して導入文に理由を書く。 -->

- 型の宣言: _TODO_
- 不明な外部入力の扱い: _TODO_
- 型の強制の制限: _TODO_

## 4. エラー処理

- 例外と戻り値の使い分け: _TODO_
- エラーメッセージに含める文脈: _TODO_

## 5. 命名

- 識別子の大文字小文字: _TODO_
- 略語・真偽値の名前: _TODO_

## 6. テストと検証

| コマンド  | 対象   | 実行条件 | 失敗時 |
| --------- | ------ | -------- | ------ |
| _COMMAND_ | _TODO_ | _TODO_   | _TODO_ |

## 7. 禁止事項

| 禁止事項 | 理由   |
| -------- | ------ |
| _TODO_   | _TODO_ |
