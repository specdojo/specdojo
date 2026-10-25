---
specdojo:
  id: prj-0001:pjr-tvga-devcontainer-scaffold-shutdown-action
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
  registered_at: "2026-10-25T08:40:40Z"
  due_on: "2026-10-31"
---

# PJR-TVGA devcontainer scaffold の shutdownAction を補う

## 1. 課題内容

scaffold の devcontainer 雛形に shutdownAction がない。none を明示し、空のリポジトリで生成結果を確認する。既存環境の修正手順も記載する。

## 2. 影響範囲

| 観点         | 影響                                                |
| ------------ | --------------------------------------------------- |
| スコープ     | devcontainer の配布雛形・生成処理・検証・利用ガイド |
| スケジュール | 2026-10-31 期限                                     |
| コスト       | _TODO_                                              |
| 品質         | scaffold で生成する終了設定の不足を解消する         |
| 関係者       | DEV                                                 |

## 3. 対応方針

| 項目     | 内容                                                                             |
| -------- | -------------------------------------------------------------------------------- |
| 原因     | `templates/devcontainer/devcontainer.json` に `shutdownAction` がない            |
| 対応策   | 雛形へ `shutdownAction: "none"` を追加し、生成結果と既存環境の修正手順を確認する |
| 依存事項 | ホスト上の動作確認が必要な場合は利用者の確認を残す                               |
| 完了条件 | 下記の検証条件を満たす                                                           |

- 空のリポジトリで scaffold を実行し、生成された devcontainer に `shutdownAction: "none"` があることを確認する。
- 既存環境に設定を追加する手順を利用ガイドに記載する。
- 生成処理の関連テスト、型検査、lint を通し、親の検証を通す。
- CHANGELOG は `Unreleased` に記載し、公開済みの版は変更しない。
- 実施内容と検証結果を対応結果へ記録する。ホストでしか確認できない条件が残る場合は明記する。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:command-reference]]
- [[specdojo:remote-host-development-guide]]
