---
specdojo:
  id: prj-0001:pjr-pjbn-grade-exec-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-08T22:09:37Z"
---

# PJR-PJBN 定期実行の grade がメインの作業ツリーにステージ済みのファイルを残し、exec run が止まる

## 1. 課題内容

cron の routine run --due で動く grade のジョブが evidence をメインの作業ツリーで git add したまま commit せずに終わる。その後の exec run --register は checkpoint で Root index has staged changes となり waiting になる（2026-10-09 の PJR-HQKV で発生）。routine の出力を commit するか、ステージしないか、exec 側の扱いを決める。

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
