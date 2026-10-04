---
specdojo:
  id: prj-0001:pjr-d0kf-exec-register-worktree-default
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T05:12:44Z"
  due_on: null
---

# PJR-D0KF exec run --register の既定を worktree にし、in-place を明示指定にする

## 1. 概要

exec run --register は既定で in-place に実行される。in-place の実行中にメインの作業ツリーで commit すると HEAD 検査（agent-git-state-write）で成功した作業が waiting になり、失敗時の変更が作業ツリーに残って後続の実行も止まる（2026-10-04 の PJR-SMET）。worktree なら作業ツリーが分かれ、失敗時の隔離と --resume が使える。既定を worktree にし、in-place は明示指定にする

## 2. 完了条件

- `exec run --register` の既定の実行場所を、`.specdojo/exec-defaults.yaml` で設定できるようにし、本プロジェクトの既定を worktree にする。設定がない利用リポジトリでの既定（in-place のままにするか）は、互換性への影響を評価して決め、記録する。
- in-place で実行したい場合の明示指定（例: `--in-place`）を追加し、`--worktree` と同時に指定した場合はエラーにする。
- `--register-commit`・`--resume`・`--force-restart` など、実行場所に依存するオプションの扱いを、既定の変更後も矛盾しないように整理する。
- worktree の準備時間が見合わない小さな作業向けに、in-place を選ぶ基準を exec 運用ガイドに書く。あわせて、プロジェクト単位の exec-run.lock により worktree でも別の `exec run` は同時に起動できず、並行は1コマンドの `--parallel` で行うことを明記する。
- 対話型 orchestrator（`.claude/agents/specdojo-orchestrator.md` などの SSOT と各環境のラッパー）の提案を新しい既定にそろえる。
- unit test で、設定の既定、`--in-place` の明示、`--worktree` との同時指定のエラーを検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                                       |
| --- | ----------------------------------------------------- | ---- | ---- | ------------------------------------------ |
| 1   | 既定の設定方法と互換性の方針を決める                  | DEV  | open | 利用リポジトリへの影響を評価する           |
| 2   | CLI と exec-defaults の実装                           | DEV  | open | `--in-place` の追加を含む                  |
| 3   | 運用ガイド、コマンドリファレンス、orchestrator の更新 | DEV  | open | exec-run.lock と `--parallel` の説明を含む |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-smet-register-stale-block-reason]]: in-place の実行中の commit で HEAD 検査に止められた実行。
- [[specdojo:exec-operation-guide]]: worktree と in-place の使い分けの説明。
