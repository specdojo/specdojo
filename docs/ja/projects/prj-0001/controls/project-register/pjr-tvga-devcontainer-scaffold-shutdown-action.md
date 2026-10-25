---
specdojo:
  id: prj-0001:pjr-tvga-devcontainer-scaffold-shutdown-action
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

| 観点         | 影響                                                                |
| ------------ | ------------------------------------------------------------------- |
| スコープ     | devcontainer の配布雛形・生成処理・検証・利用ガイド                 |
| スケジュール | 2026-10-31 期限                                                     |
| コスト       | devcontainer 生成物の更新および既存環境での設定追加・リビルドの手間 |
| 品質         | scaffold で生成する終了設定の不足を解消する                         |
| 関係者       | DEV                                                                 |

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

### 4.1. 解決内容

- `templates/devcontainer/devcontainer.json` に `"shutdownAction": "none"` を追加した。
- [[specdojo:remote-host-development-guide]] の 2.1 節および 6.4 節に、`shutdownAction: "none"` の説明と既存環境への設定追加手順を追記した。
- [[specdojo:command-reference]] に `shutdownAction: "none"` について追記した。
- `CHANGELOG.md` の `## [Unreleased]` 不具合修正節に変更内容を追記した（公開済みの版は変更せず）。

### 4.2. 確認結果

- `tests/src/devcontainer/scaffold.test.ts` に、scaffold で生成される `devcontainer.json` に `shutdownAction: "none"` が含まれることのテストケースを追加した。
- 一時ディレクトリに空のリポジトリを作成し、実際に `devcontainer scaffold` を実行して、生成された `.devcontainer/devcontainer.json` に `"shutdownAction": "none"` が設定されることを確認した。
- 親 runner による検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）に委譲する。
- なお、VS Code やエディタ切断時にコンテナが実際に停止しないことの実機確認は、Docker daemon とクライアント環境が揃ったホスト実機環境で行う必要がある。

### 4.3. 再発防止策

- Dev Container の雛形および scaffold 生成物において、常時稼働や切断・再接続を前提とするライフサイクル設定（`shutdownAction`、`init` など）の意図・既定値を明示し、テンプレートとガイドの両方で整合性を保つ。

## 5. 関連ドキュメント

- [[specdojo:command-reference]]
- [[specdojo:remote-host-development-guide]]
