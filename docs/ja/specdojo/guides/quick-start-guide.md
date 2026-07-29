---
specdojo:
  id: quick-start-guide
  type: guide
  status: draft
---

# Quick Start ガイド

Quick Start Guide

すでに成果物カタログ（`dct-<domain>.yaml`）とトラック戦略（`sch-strategy-<track>.yaml`）が用意されているプロジェクトを対象に、Schedule 生成からタスク実行、結果確認までを最短手順で体験します。

**対象読者**

- SpecDojo CLI を初めて使い、まず1つのタスクを動かしてみたい開発者

**この文書で分かること**

- Schedule 生成 → タスク化 → 実行 → 結果確認までの最短手順

**次に読む文書**

- 全体像は [全体概要ガイド](specdojo-overview-guide.md)、CLI の詳しい使い方は [CLI概要ガイド](cli-overview-guide.md) を参照してください。

**この文書が扱わないこと**

- 成果物カタログやトラック戦略の設計・作成手順（[トラック設計ガイド](track-design-guide.md)、[Schedule設計ガイド](schedule-design-guide.md) を参照）
- 自動実行・並列実行、register 実行、routine 実行などの応用的な使い方（[schedule実行運用ガイド](schedule-operation-guide.md) 等を参照）

## 1. 前提条件

- `specdojo` CLI が導入済みであること
- 対象プロジェクトに、少なくとも1つの成果物カタログ（`dct-<domain>.yaml`）と、対象トラックの `sch-strategy-<track>.yaml` が存在すること

## 2. Scheduleを生成する

strategy から track の Schedule を生成します。

```bash
specdojo schedule build --project <project-id> --track <track> --force
```

## 3. タスクを展開する

生成した Schedule から、実行可能なタスク（Ready）と CPM を計算します。

```bash
specdojo exec build --project <project-id>
```

着手可能なタスクの一覧が `generated/ready.json` に出力されます。

## 4. 1タスクを実行する

次に実行すべきタスクを確認し、claim してから実行します。

```bash
# 次のタスクを確認する（claimはしない）
specdojo exec scheduler --project <project-id> --by <actor> --dry-run

# claimする
specdojo exec claim --project <project-id> --task <task-id> --by <actor>

# 実行する
specdojo exec run --project <project-id> --task <task-id>

# 完了を記録する
specdojo exec complete --project <project-id> --by <actor>
```

## 5. 結果を確認する

- 成果物の変更内容はカレントの作業ツリーに反映されます。
- 実行結果は `execution/exec/results/` に記録されます。
- 次の Ready タスクを確認するには、再度 `exec build` を実行します。

```bash
specdojo exec build --project <project-id>
```

## 6. 次のステップ

- まとめて自動実行する: [schedule実行運用ガイド](schedule-operation-guide.md)
- 突発の対応を登録簿で追跡する: [登録簿運用ガイド](register-operation-guide.md)
- 定期実行を組む: [routine運用ガイド](routine-operation-guide.md)
- トラック・Schedule の設計から始める: [トラック設計ガイド](track-design-guide.md)、[Schedule設計ガイド](schedule-design-guide.md)
