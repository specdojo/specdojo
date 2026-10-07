---
specdojo:
  id: prj-0001:xer-pjr-ezaf-20261007t140657z-4dac
  type: exec-result
  task_id: PJR-EZAF
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-ezaf-20261007T140657Z-4dac-plan.md
  started_at: "2026-10-07T14:06:57.233Z"
  completed_at: "2026-10-07T22:08:24.741Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- Codex provider 指定時のみ `runArgs` に `["--security-opt=seccomp=unconfined"]` を追加する変更を `src/devcontainer-scaffold.ts` に実装した。
- 上記変更に伴う `unit test` を追加し、Codex プロジェクトと Claude プロジェクトそれぞれの出力条件を満たしていることを確認した。
- `docs/ja/specdojo/references/command-reference.md` に変更内容を追記した。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-ezaf-devcontainer-template-codex-sandbox.md` を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: devcontainer scaffold における `runArgs` の変更内容を追記。
- `src/devcontainer-scaffold.ts`: Codex 指定時に `seccomp=unconfined` を設定するロジックを追加。
- `tests/devcontainer-scaffold.test.ts`: `runArgs` の条件分岐を検証するテストケースを追加。

## 3. 申し送り

- Host Mac 上の Dev Container 実機を用いた検証が必要です。
- ベースイメージに `bubblewrap` が含まれているか、および `codex sandbox` が正常に起動し、`/etc` への書き込みが拒否されるかを確認してください。
- また、認証済み Codex を用いた `codex exec --sandbox` の動作についても、実環境での確認を求めています。
- 人の確認が必要: `devcontainer up --workspace-folder . && devcontainer exec --workspace-folder . bash -lc 'command -v bwrap || echo "no system bwrap"; codex --version; codex sandbox -- sh -c "ls -d /; touch /etc/x"'`（Docker と Dev Container CLI がないため、Host Mac で bubblewrap の有無、sandbox 起動、/etc への書き込み拒否を確認する。）
- 人の確認が必要: `devcontainer exec --workspace-folder . bash -lc 'codex exec --sandbox workspace-write --skip-git-repo-check "Run pwd with the shell and report the result."'`（認証済み Codex と利用枠が必要なため、Host Mac の生成コンテナで実行確認する。）

## 4. 進め方と実践の型の適用

devcontainer scaffold が生成する `runArgs` に、Codex 用の `seccomp=unconfined` 設定が含まれるよう変更を加え、その動作を `unit test` で保証しました。実機環境における sandbox の挙動については、検証を進めるため事項を `handoff` に残しています。
