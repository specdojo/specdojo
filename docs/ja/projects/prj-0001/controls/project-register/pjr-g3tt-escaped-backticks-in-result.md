---
specdojo:
  id: prj-0001:pjr-g3tt-escaped-backticks-in-result
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T14:02:38Z"
---

# PJR-G3TT result のバッククォートがエスケープされて書かれ、統合の前の検査で止まる

## 1. 課題内容

reporter などが result の本文にバックスラッシュでエスケープしたバッククォートを書き、統合の前の Markdown の検査（MD038）で止まる。原因を確かめ、書かせないか runner が直す

## 2. 入力

- 2026-11-21、T-KATA-WAVE-3-utc-sample-050 の統合が、result.md のバッククォートが \` とエスケープされていたため MD038（Spaces inside code span elements）で止まった。成果物と親の検証は通っていた。オーケストレーターがエスケープを戻して exec resume --task で統合した
- オーケストレーターの観察: 同じ形の止まり方は以前にもあった（回数は未集計）
- 利用者の決定（2026-11-21、indie）: 夜の間に流す。直し方は executor が決めて理由を記録する

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
