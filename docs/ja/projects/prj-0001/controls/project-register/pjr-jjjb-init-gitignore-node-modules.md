---
specdojo:
  id: prj-0001:pjr-jjjb-init-gitignore-node-modules
  type: project
  status: deprecated
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: rejected
  priority: medium
  registered_at: "2026-10-13T14:50:07Z"
  completed_at: "2026-10-13T21:17:57Z"
  conclusion: PJR-J2AS の重複。config init と init は同じ既定の一覧から node_modules/ を .gitignore へ追記する（develop・main で修正済み）。検証に J2AS の修正を含まない版（npm の specdojo 0.2.1 など）を使ったとみられる
---

# PJR-JJJB init が .gitignore に node_modules を追加しない

## 1. 課題内容

specdojo init は生成物の除外行だけを .gitignore に追記する。npm init 直後のリポジトリで git add -A すると node_modules まで commit され、worktree 実行の前提となる
commit 手順と相性が悪い

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
