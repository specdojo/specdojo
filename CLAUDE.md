# Agent Instructions

## Language

- 回答は原則として日本語で行う。

## Project Policy

- 変更前に関連する設計書を確認する。
- タスクに関係しない変更を行わない。
- prj-0001 を扱う対話型オーケストレーターは、作業の前に `npx specdojo where playbook --project prj-0001` で引いた運用メモ（`docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`）を読む。

## Safety

- 認証情報、秘密鍵、`.env`、`secrets/` を読み込まない。
- 破壊的変更や `git push` を行わない。push は、対話型オーケストレーターに限り `npx specdojo guarded-push --project <project-id>` で行う。`project/<project-id>/develop` と `feature/<project-id>/*` の範囲で、先に `--dry-run` で送るブランチ・remote・commit の範囲と件数を示し、送るたびに利用者の承認を得る。直接の `git push`、main・タグ・履歴を書き換える push は行わない。executor・reporter はこの入口も使わない。登録簿などの同期専用ブランチへの push は、specdojo のコマンド（`register ... --commit`・`exec run`・`register branch-push`）に任せる。
