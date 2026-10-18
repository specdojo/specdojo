---
specdojo:
  id: prj-0001:xer-pjr-ccxn-20261018t105600z-bb24
  type: exec-result
  task_id: PJR-CCXN
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-ccxn-20261018T105600Z-bb24-plan.md
  started_at: "2026-10-18T10:56:00.669Z"
  completed_at: "2026-10-18T11:18:19.518Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- devcontainer scaffold 実行時に、常時稼働ホストへの接続用スクリプト (`specdojo-tmux.sh.sample`) と SSH 設定サンプル (`ssh-config.sample`) が `.devcontainer/remote-host/` ディレクトリ内に生成されるよう変更しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 開発内容の記録のために `CHANGELOG.md` を更新しました。
- `docs/ja/specdojo/guides/remote-host-development-guide.md`: リモートホストでの開発に関するガイドラインを更新しました。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスを更新しました。
- `src/commands/init.ts`: `init` コマンドのロジックを更新し、新しいテンプレートの追加に対応させました。
- `src/devcontainer/scaffold.ts`: devcontainer の scaffold 処理において、リモートホスト用のサンプルファイルを生成するロジックを追加しました。
- `tests/src/commands/init.test.ts`: `init` コマンドの変更に対するユニットテストを更新しました。
- `tests/src/devcontainer/scaffold.test.ts`: scaffold 機能の変更に対するテストケースを追加・更新しました。
- `templates/devcontainer/remote-host/specdojo-tmux.sh.sample`: 追加、+70 / -0 行
- `templates/devcontainer/remote-host/ssh-config.sample`: 追加、+17 / -0 行

## 3. 申し送り

- devcontainer scaffold によって生成されるサンプルファイル (`templates/devcontainer/remote-host/*`) が正しく配置されていることを確認してください。

## 4. 進め方

まず、`devcontainer scaffold` を実行した際に、リモートホスト接続用のスクリプトと SSH 設定のサンプルが `.devcontainer/remote-host/` に展開されるように、`src/devcontainer/scaffold.ts` および `src/commands/init.ts` を修正しました。まず、必要なテンプレートファイルを `templates/` 配下に用意し、それらを `scaffold` プロセス内でコピーするように実装しました。その後、既存のコマンドおよび scaffold 機能に対するユニットテストを更新し、変更が正しく動作することを確認しました。
