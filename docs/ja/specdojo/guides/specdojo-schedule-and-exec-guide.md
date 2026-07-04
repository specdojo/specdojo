---
id: specdojo-schedule-and-exec-guide
type: guide
status: deprecated
---

# SpecDojo スケジューリングガイド

SpecDojo Schedule and Execution Guide

このガイドは分割されました。既存リンクを維持するために残しています。

## 1. 移行先

| 読みたい内容                                           | 移行先                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Scheduleの役割、ファイル構成、`sch-strategy`           | [specdojo-schedule-design-guide.md](specdojo-schedule-design-guide.md)             |
| `exec run --auto`、手動実行、blocked復帰、ユースケース | [specdojo-exec-operation-guide.md](specdojo-exec-operation-guide.md)               |
| `exec worktree` の分割コマンドと安全条件               | [specdojo-exec-worktree-guide.md](specdojo-exec-worktree-guide.md)                 |
| plan / result のライフサイクル                         | [specdojo-plan-result-lifecycle-guide.md](specdojo-plan-result-lifecycle-guide.md) |
| エージェント選択、rate limit、provider別同時実行制限   | [specdojo-exec-strategy-guide.md](specdojo-exec-strategy-guide.md)                 |
| コマンド別の短いリファレンス                           | [specdojo-command-reference-guide.md](specdojo-command-reference-guide.md)         |

## 2. 読み替え方

Scheduleを設計する場合は [specdojo-schedule-design-guide.md](specdojo-schedule-design-guide.md) から読みます。タスクを実行する場合は [specdojo-exec-operation-guide.md](specdojo-exec-operation-guide.md) を起点にし、隔離実行や plan/result の詳細だけを個別ガイドで確認します。
