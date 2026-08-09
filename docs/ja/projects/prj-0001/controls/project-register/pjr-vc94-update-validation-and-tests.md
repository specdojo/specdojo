---
specdojo:
  id: prj-0001:pjr-vc94-update-validation-and-tests
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-VC94 検証とテストを個票正本の構成へ更新する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割6。表専用スキーマによる検証を廃止し、個票 frontmatter を対象とする検証へ付け替える。あわせて既存テストを新構成へ更新し、移行後の挙動を検証するテストを追加する。

## 2. 完了条件

- 表専用スキーマによる検証が廃止され、個票 frontmatter の検証へ置き換わっている。
- ID の一意性、個票ファイル名と ID の対応、enum 値の妥当性が検証で検出される。
- 検証がエディタのリアルタイム検証と CI の両方で機能する。
- 既存テストが新構成で green である。表の入出力に依存したテストが更新または削除されている。
- 個票の追加・状態遷移・一覧生成について、振る舞いを検証するテストが存在する。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                                         |
| --- | ------------------------------------------ | ---- | ---- | -------------------------------------------- |
| 1   | 検証経路の付け替えを行う                   | ARC  | open | 表専用スキーマの廃止と参照元の更新を含む     |
| 2   | ID 一意性とファイル名対応の検証を実装する  | ARC  | open | 検出時の出力に対象 ID とファイルを含める     |
| 3   | 既存テストを新構成へ更新する               | ARC  | open | 表の入出力に依存する fixture が対象          |
| 4   | 移行後の振る舞いを検証するテストを追加する | ARC  | open | 追加・状態遷移・一覧生成の決定性を対象とする |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]]: 検証対象となるスキーマ定義
- [[prj-0001:pjr-tt4j-register-cli-write-to-tickets]]: テスト更新の対象となる CLI 変更
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 決定性を検証する一覧生成
