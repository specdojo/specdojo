---
specdojo:
  id: prj-0001:pjr-jtjf-src-imports-in-dependencies
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-24T09:54:09Z"
  derived_from:
    - PJR-ZV60
---

# PJR-JTJF 配布するコードが dependencies にないパッケージを読み込んでも検査で気づけない

## 1. 課題内容

PJR-ZV60 で src が tinyglobby を読み込んだが devDependencies にしかなく、npm から入れたリポジトリで init などが落ちた。本リポジトリでは開発用の依存として入っているため、テストでも検証でも気づけなかった。src が読み込むパッケージがすべて dependencies にあることを npm run check で確かめる

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
