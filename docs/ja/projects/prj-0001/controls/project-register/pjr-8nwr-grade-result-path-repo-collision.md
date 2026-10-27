---
specdojo:
  id: prj-0001:pjr-8nwr-grade-result-path-repo-collision
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
  registered_at: "2026-10-27T13:26:19Z"
---

# PJR-8NWR grade の結果ファイルが別リポジトリの同じ ID の文書で重なる

## 1. 課題内容

grade の結果は results/`<文書 ID>.yaml` に保存され、ID はプロダクトリポジトリの成果物では project の修飾を持たない。project.repos の複数のリポジトリや本リポジトリに同じ ID の文書があると、結果が黙って上書きされ、plan も別の文書の前回の結果を読む。repos のリポジトリの文書は results/`<repo 名>`/`<ID>.yaml` に分けて保存する。

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
