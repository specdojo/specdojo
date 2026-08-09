---
specdojo:
  id: prj-0001:pjr-rf3b-register-item-frontmatter-schema
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-RF3B 登録項目の個票 frontmatter スキーマを定義する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割1。移行の起点となる作業として、登録項目の構造化フィールドを個票 frontmatter へ定義し、共通の frontmatter スキーマで検証できるようにする。以降の CLI 変更・一覧生成・既存項目移行はすべてこのスキーマに依存する。

## 2. 完了条件

- 登録項目の構造化フィールド（処理状態・優先度・担当・登録日・期限・完了日・結論・分類）が個票 frontmatter の項目として定義されている。
- 値の enum（type / status / priority）が既存の定義と一致し、表記ゆれが生じない。
- 共通 frontmatter スキーマから検証でき、必須項目の欠落と不正値がエラーになる。
- 既存の個票 frontmatter 項目（`id` / `type` / `status` / `rulebook` / `part_of` / `item_type`）との関係が整理され、文書成熟度の `status` と登録項目の処理状態が区別されている。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                 |
| --- | --------------------------------------------------- | ---- | ---- | ---------------------------------------------------- |
| 1   | 現行の一覧列と個票 frontmatter の項目対応を洗い出す | ARC  | open | 一覧の標準列を入力とする                             |
| 2   | 個票 frontmatter のスキーマを定義する               | ARC  | open | 文書成熟度の `status` と処理状態の名前衝突に注意する |
| 3   | 既存 enum の再利用と検証経路を確認する              | ARC  | open | 表専用スキーマの enum 定義を移送元とする             |
| 4   | サンプル個票で検証が機能することを確認する          | ARC  | open | 正常系と不正値の両方を確認する                       |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 移行の根拠となる決定
- [[specdojo:pjr-rulebook]]: 現行の項目定義と enum の正本
