---
specdojo:
  id: prj-0001:pjr-sdxb-bootstrap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T01:12:02Z"
  due_on: "2026-08-31"
---

# PJR-SDXB bootstrapテンプレートに仕上げ品質チェックを追加

## 1. 概要

xep-bootstrap-template.mdの完了手順に、内容の質を上げる基本操作（不要記述の削除・重複記述の統合・可読性のための分割・論理整合の確認）を単発の仕上げチェックとして追加する。観点別自己レビュー・修正ループとは区別し、既存の禁止事項と矛盾しないよう記述する。フレームワーク共通ファイルのため他プロジェクトへの影響を確認のうえ反映する。

## 2. 完了条件

- `xep-bootstrap-template.md` の「6. 完了手順」の前に、内容の質を上げる基本操作（不要記述の削除・重複記述の統合・可読性のための分割・論理整合の確認）を明記した節が追加されている。
- 追加した節が、既存の「下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わない」という制約と矛盾しない記述（単発の仕上げ操作であり、多観点レビューループではないことが読み取れる記述）になっている。
- `ryu-guide.md` の `bootstrap` approach の説明（1.2.2）と矛盾しないことを確認している。
- `npm run lint:md` がエラーなく通る。
- フレームワーク共通ファイルであるため、`prj-0001` 以外で `bootstrap` approach を使用している track・プロジェクトへの影響有無を確認し、対応結果に記録している。

## 3. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | `xep-bootstrap-template.md` の現状構成を確認し、追加節の挿入位置を決める     | ARC  | open | -    |
| 2   | 4操作（削除・統合・分割・論理整合）を明記した節を追加する                    | ARC  | open | -    |
| 3   | 既存の自己レビューループ禁止の記述と矛盾しないか確認する                     | ARC  | open | -    |
| 4   | 他 track・他プロジェクトでの `bootstrap` approach 使用箇所への影響を確認する | ARC  | open | -    |
| 5   | `npm run lint:md` を実行し、エラーがないことを確認する                       | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- 変更対象（`docs/` 内だが `id` 未登録のため相対パス表記）: `docs/ja/specdojo/templates/xep-bootstrap-template.md`
- approach 定義の正本: [[specdojo:ryu-guide]]
- 提案の経緯を記録したメモ: [[prj-0001:pjr-ez9g-sch-strategy-bootstrap-human-review]]
- 対になる todo: [[prj-0001:pjr-aqmw-fully-guided-refine-pass-rulebook]]
- 同一ファイルへの過去の変更履歴: [[prj-0001:pjr-0102-xep-fully-guided-template]]（`xep-fully-guided-template.md` 側の類似修正例）
