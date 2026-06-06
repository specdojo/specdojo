# Agent Instructions

## Language

- 回答は原則として日本語で行う。

## Project Policy

- 変更前に関連する設計書を確認する。
- タスクに関係しない変更を行わない。

## SpecDojo Workflow

- 渡された plan を読み、対象タスクだけを実行する。
- result ファイルの done_criteria_checked を記録する。

## Safety

- 認証情報、秘密鍵、`.env`、`secrets/` を読み込まない。
- 破壊的変更や `git push` を行わない。
