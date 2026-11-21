---
specdojo:
  id: prj-0001:pjr-f6mc-local-config-external-projects
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  difficulty: easy
  registered_at: "2026-11-21T09:03:34Z"
---

# PJR-F6MC ローカル設定で external_projects を宣言できない

## 1. 課題内容

external_projects の path は相手のリポジトリの置き場所で、環境ごとに違う。しかし specdojo.local.config.json が許すキーは version と `projects.<id>.repos` だけで、external_projects を書くと unknown key で止まる。利用者は環境に依存するパスを共有の specdojo.config.json に commit するしかない。ローカル設定で external_projects を宣言・上書きできるようにするかを決める

## 2. 入力

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo（SpecDojo 0.9.2、2026-11-21）。
- 本家へ起票するため .specdojo/specdojo.local.config.json に `external_projects` だけを書いたところ、register add が「unknown key `"external_projects"` (allowed: version, projects)」「version must be 1」で止まった。
- specdojo-config-reference の `external_projects` の節は、ローカル設定で書けないことに触れていない。利用者のプロジェクトでは、共有の specdojo.config.json に `external_projects`（path: ../specdojo）を置いて回避した。

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
