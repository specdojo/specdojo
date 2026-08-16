---
specdojo:
  id: sysd-index
  type: architecture
  status: draft
  rulebook: specdojo:sysd-index-rulebook
---

# SpecDojo システム設計

SpecDojo のシステム設計情報と、コード・設定ファイルを正本とする SSOT への入口を集約する。本文へ詳細仕様を複製せず、変更時に最初に確認・更新する場所を示す。

## 1. 概要（対象範囲・更新責任）

対象は SpecDojo CLI、ドキュメント生成、agent 実行、Git / worktree 統合、定期処理である。ARC が構成と導線、DEV がコード・schema、PM がプロジェクト実行定義、OPS が運用設定の更新責任を持つ。

## 2. SSOT 一覧

<!-- prettier-ignore -->
| 種別 | SSOT | 参照先 | 更新責任 | 備考 |
| --- | --- | --- | --- | --- |
| CLI Commands | TypeScript source | `src/specdojo.ts`、`src/*-command.ts` | DEV | 公開コマンドと委譲先 |
| Configuration Schema | TypeScript type / JSON Schema | `src/specdojo-config.ts`、`docs/specdojo/schemas/v1/` | DEV / ARC | 設定の型・検証規則 |
| Project Catalog | Deliverables catalog | `docs/ja/projects/prj-0001/010-deliverables-catalog/` | ARC / PM | 成果物の構成・依存・完了条件 |
| Schedule | Strategy YAML | `docs/ja/projects/prj-0001/schedule/sch-strategy-*.yaml` | PM | phase・mode・依存・実行順序 |
| Configurations | Agent runner defaults | `.specdojo/exec-defaults.yaml` | ARC / DEV | provider起動、検証、retry / fallback |
| Configurations | Member registry | `docs/ja/projects/prj-0001/030-project-management/pm-members.yaml` | PM / ARC | member属性、選択条件、優先度 |
| Configurations | Claude Code agents | `.claude/agents/`、`.specdojo/claude/` | ARC | executor / reviewer / reporterと権限 |
| Configurations | Codex agents | `.codex/agents/`、`.codex/config.toml` | ARC | custom agentと実行設定 |
| Configurations | OpenCode agents | `.opencode/agents/`、`opencode.json` | ARC | ローカルLLMを含むagent定義 |
| Configurations | GitHub Copilot agents | `.github/agents/`、`.github/copilot-instructions.md` | ARC | edit / review agentと共通指示 |
| Register State | Register item files | `docs/ja/projects/prj-0001/controls/project-register/` | PM | 個票が正本、一覧は派生ビュー |
| Execution State | Plan / result / event | `docs/ja/projects/prj-0001/execution/` | PM / ARC | eventはappend-only |
| Job / Routine | TypeScript source and definitions | `src/job.ts`、`src/routine.ts` | DEV / OPS | Job Run生成と定期起動 |
| Documentation Site | VitePress configuration | `.vitepress/` | DEV | 文書索引・表示・build |
| Git Integration | Git source and repository policy | `src/exec-worktree.ts`、`src/exec-worktree-ops.ts`、`.github/` | DEV / ARC | branch / worktree / PR境界 |

## 3. 自動生成物

| 生成物             | 入力SSOT               | 生成コマンド              | 生成先                          | 更新方式          |
| ------------------ | ---------------------- | ------------------------- | ------------------------------- | ----------------- |
| 文書索引           | Markdown Frontmatter   | `npm run docs:index`      | VitePress参照用索引             | コマンド生成      |
| ドキュメントサイト | `docs/`、`.vitepress/` | `npm run docs:build`      | VitePress build出力             | CI / ローカル検証 |
| Ready / CPM        | Schedule、event        | `specdojo exec refresh`   | projectの`execution/generated/` | 実行前再生成      |
| 登録簿ビュー       | 登録項目個票           | `specdojo register build` | projectの`generated/`           | 必要時再生成      |

## 4. 変更の入口

| 変更トリガー           | 最初に直す場所（SSOT）                       | 併せて確認する場所                 | 完了条件                      |
| ---------------------- | -------------------------------------------- | ---------------------------------- | ----------------------------- |
| CLIコマンド変更        | `src/`                                       | schema、guide、test                | test・lint・docs build成功    |
| agent/provider変更     | `.specdojo/exec-defaults.yaml`、provider設定 | `pm-members.yaml`、provider別SYSD  | 設定検証と代表実行成功        |
| 並列実行・worktree変更 | `src/exec-run.ts`、`src/exec-worktree*.ts`   | 横断ルール、重要フロー、統合テスト | 競合・block・resume経路を検証 |
| 登録項目ID規則変更     | `src/register.ts`、命名標準                  | register CDFD、重要フロー          | 衝突検出と参照更新を検証      |
| PO承認・PR境界変更     | Git運用標準、登録簿運用ガイド                | register CDFD、重要フロー          | authorとapproverの分離を確認  |
| 運用手順変更           | `docs/ja/product/090-operations/`            | OPD、関連SYSD                      | 手順・完了条件・証跡を確認    |

## 5. 関連ドキュメント導線

| 種別           | ドキュメントID              | 目的                               |
| -------------- | --------------------------- | ---------------------------------- |
| 横断ルール     | `sysd-cross-cutting-policy` | 複数設計へ適用する必須・禁止事項   |
| 重要フロー     | `sysd-critical-flows`       | 事故予防が必要な最大5件のフロー    |
| agent実行      | `sysd-agent-settings`       | 共通設計とprovider別設計へのhub    |
| Job            | `sysd-job-execution`        | Job Definition / Job Runの実行設計 |
| アーキテクチャ | `tsd-index`                 | 採用技術と実行基盤の一覧           |
| データフロー   | `cdfd-task-execution`       | task状態・実行ライフサイクル       |
| データフロー   | `cdfd-register-lifecycle`   | 個票・承認・ID復旧ライフサイクル   |
