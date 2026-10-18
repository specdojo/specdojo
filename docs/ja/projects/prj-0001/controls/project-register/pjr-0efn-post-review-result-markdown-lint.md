---
specdojo:
  id: prj-0001:pjr-0efn-post-review-result-markdown-lint
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T16:04:14Z"
  derived_from:
    - PJR-T46Y
---

# PJR-0EFN 統合後の review の result が markdownlint で落ち、close の記帳が commit されない

## 1. 課題内容

2026-10-19 01:01 の PJR-JSEY の --post-review で、review の agent が判断の根拠に自分で番号（1. 2. 3.）を付け、runner がそれを箇条書き（- ）として result に描いたため、- 1. の形が入れ子の番号付きリストとして markdownlint の MD029 に当たった。pre-commit の hook で post-review の記帳の commit が失敗し、close の記帳（個票・イベント・review の plan と result）が作業ツリーに残った。runner は失敗を git commit failed: format: の 1 行目だけで報告した

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
