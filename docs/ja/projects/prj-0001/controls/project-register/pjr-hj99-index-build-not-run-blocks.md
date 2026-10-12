---
specdojo:
  id: prj-0001:pjr-hj99-index-build-not-run-blocks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-10-12T03:32:21Z"
---

# PJR-HJ99 executor が実行できない index build の not_run で run が止まる

## 1. 課題内容

.specdojo/doc-index.json は agent の書き込み禁止対象のため、executor は specdojo index build を not_run と記録するしかない。index は worktree の準備で runner が再生成しているが、その結果は not_run を満たす根拠として扱われず run が止まる（PJR-ADZ6 で発生）。runner が担う検証として満たしたとみなす

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
