---
specdojo:
  id: prj-0001:pjr-9kst-multi-repo-resume-precheck-register-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-01T11:39:21Z"
---

# PJR-9KST 複数リポジトリの統合を再開すると waiting の記帳が事前検査を妨げる

## 1. 課題内容

統合の途中で失敗して waiting に戻った項目を exec run --resume で再開すると、runner がプロジェクト側に書いた waiting の記帳（個票と event）が、事前検査で merge の対象と重なる未 commit の変更と判定され、統合できない。初回の統合と同じく releasePaths として除外する（v0.3.0）

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
