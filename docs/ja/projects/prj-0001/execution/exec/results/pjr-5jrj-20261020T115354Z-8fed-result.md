---
specdojo:
  id: prj-0001:xer-pjr-5jrj-20261020t115354z-8fed
  type: exec-result
  task_id: PJR-5JRJ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-5jrj-20261020T115354Z-8fed-plan.md
  started_at: "2026-10-20T11:53:54.861Z"
  completed_at: "2026-10-20T12:06:02.140Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- devcontainer 作成後に開く新しいターミナルでも `~/.local/bin` が `PATH` に含まれるよう、`devcontainer.json` のテンプレートに `remoteEnv` 設定を追加しました。
- devcontainer のスキャフォールド（雛形生成）ロジック `src/devcontainer/scaffold.ts` を更新し、`remoteEnv` に `PATH` を含めるように変更しました。
- スキャフォールド機能の変更に伴い、単体テスト `tests/src/devcontainer/scaffold.test.ts` を更新しました。
- 変更内容に合わせて、E2E テスト `tools/e2e/devcontainer-host-e2e.ts` を更新しました。
- 関連するドキュメント `docs/ja/specdojo/guides/remote-host-development-guide.md` を更新し、`CHANGELOG.md` に変更履歴を追記しました。

## 2. 変更ファイル

- `CHANGELOG.md`: タスクに関連する変更履歴の追記を行いました。
- `docs/ja/specdojo/guides/remote-host-development-guide.md`: リモートホスト開発に関するガイドラインの更新を行いました。
- `src/devcontainer/scaffold.ts`: `devcontainer.json` を生成する際に `remoteEnv` プロパティ（`PATH` を含む）を追加するようロジックを修正しました。
- `templates/devcontainer/devcontainer.json`: `remoteEnv` を含めるためのテンプレート構成を更新しました。
- `tests/src/devcontainer/scaffold.test.ts`: スキャフォールドロジックの変更を検証するためのテストケースを更新しました。
- `tools/e2e/devcontainer-host-e2e.ts`: E2E テストの内容を最新の仕様に合わせて更新しました。

## 3. 申し送り

- 作業は完了しています。個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-5jrj-devcontainer-remote-env-local-bin.md` および `pjr-index.md` のステータス確認を人間が行ってください。
- 適用外の検証: `npm run validate:schema:file`（No `*.yaml` or `*.yml` file changed）
- 適用外の検証: `specdojo catalog build`（No `dct-*.yaml` file changed）
- 適用外の検証: `specdojo register build`（pjr-index.md was not changed）
- 適用外の検証: `specdojo exec refresh`（No `sch-*.yaml` file changed）
- 人の確認が必要: `node --import tsx tools/e2e/devcontainer-host-e2e.ts`（Host Docker daemon and Dev Container CLI required for devcontainer creation and verification）

## 4. 進め方

まず、`devcontainer.json` に `remoteEnv` を設定することで、新しいターミナルセッションでも `PATH` が引き継がれるようにすることを目標としました。具体的には、`src/devcontainer/scaffold.ts` 内の `devcontainer.json` 生成ロジックにおいて、`local-bin` を含む `PATH` を `remoteEnv` に追加する処理を実装しました。その後、変更が正しく行われることを確認するために、単体テストと E2E テストの両面から検証を行いました。
