---
specdojo:
  id: prj-0001:pjr-e6hg-claude-reporter-json-failure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-23T13:03:45Z"
  due_on: "2026-08-31"
---

# PJR-E6HG claude-reporterがJSON解析失敗で再現性をもってブロックする

## 1. 課題内容

claude-reporter が PJR-K4TA で3回、PJR-JT1Y で3回、いずれも is not valid JSON を理由に失敗した。変更規模はそれぞれ79ファイルと61ファイルで、出力が長大になる条件で再現する疑いがある。設定ファイルはいずれも妥当な JSON であり、worktree にも存在することを確認済みである。現状 claude-reporter は reporter として使えず、codex-reporter への差し替えで回避している。原因を特定して解消する。

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
