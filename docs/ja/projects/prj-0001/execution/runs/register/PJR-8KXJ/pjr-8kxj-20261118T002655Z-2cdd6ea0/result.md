---
specdojo:
  id: prj-0001:xer-pjr-8kxj-20261118t002655z-2cdd6ea0
  type: exec-result
  task_id: PJR-8KXJ
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8KXJ/pjr-8kxj-20261118T002655Z-2cdd6ea0/plan.md
  started_at: "2026-11-18T00:27:28.994Z"
  completed_at: "2026-11-18T00:44:48.807Z"
  agent: sol-executor
  block_reason: "parent validation failed: lint-ts; rate limit fallback: sol-executor -> opus-executor at 2026-11-18T00:36:06.643Z"
---

# Edit Result

## 1. 実施内容

- `pipeline.post_integration` で `build-dist`（`npm run build`）を許可リストの ID と `paths` で指定できるようにした。worktree 実行（register・schedule・job）の統合 commit の後に、統合した変更が `paths` に当たるときだけ、親 runner が exec のロックを持ったまま流す。
- build が失敗しても統合は戻さず、`dist/.specdojo-build-failed` を置いて次の run を dist-freshness の判定で止める。結果は run 記録の `post-integration.log` に残す。
- 単体テスト・schema テスト・E2E テストを追加・更新し、command-reference と exec-config-guide に仕様を書いた。
- runner 検証では `npm run lint:ts` が失敗している。`tests/src/exec/post-integration.test.ts` の 25 行目で `import()` 型注釈が `@typescript-eslint/consistent-type-imports` に違反している（error 1 件）。そのほかの検証（`lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`test:integration`、`validate:schema`、`typecheck`、`test:unit`）は成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: `pipeline.post_integration` の設定方法（ID・`paths`・対象は worktree 実行・失敗時の扱い）を exec-config-guide に追記した。
- `docs/ja/specdojo/references/command-reference.md`: `exec run` の統合後処理（`build-dist`、`paths` 判定、失敗時に統合を戻さず次の run を止める挙動）を command-reference に追記した。
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: exec-defaults の schema に `pipeline.post_integration`（許可リストの `id` と必須の `paths`）を追加した。
- `src/exec/agent-config.ts`: exec-defaults の `pipeline.post_integration` を読み込み、検証する処理を追加した。
- `src/exec/run/job.ts`: job の worktree 統合後に、統合後処理を呼び出すようにした。
- `src/exec/run/register-worktree.ts`: register の worktree 統合 commit の後に、統合後処理を呼び出すようにした。
- `src/exec/run/schedule-task.ts`: schedule の worktree 統合後に、統合後処理を呼び出すようにした。
- `src/shared/dist-freshness.ts`: build 失敗の印 `dist/.specdojo-build-failed` を dist-freshness の判定に加え、印がある間は dist を古いものとして扱うようにした。
- `tests/docs/specdojo/schemas/exec-defaults-schema.test.ts`: `pipeline.post_integration` の schema 検証テストを追加した。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: register pipeline の E2E に統合後処理のケースを追加した。
- `src/exec/post-integration.ts`: 新規。統合した変更が `paths` に当たるかを判定し、`build-dist`（`npm run build`）を実行する。失敗時は失敗の印を置き、結果を `post-integration.log` に JSON Lines で記録する。
- `tests/src/exec/post-integration.test.ts`: 新規。統合後処理の単体テスト。`paths` の判定、失敗時の記録と印を検証する。25 行目の `import()` 型注釈が lint の error になっている。

## 3. 申し送り

- `npm run lint:ts` の error 1 件（`tests/src/exec/post-integration.test.ts` 25 行目の `import()` 型注釈）が未解消。`import type` へ置き換えて再実行する必要がある。
- 個票は runner 管理の変更として更新済みで、executor は作業内容と対応結果（決めた点、`exec-defaults.yaml` の案、CHANGELOG の文案）を書いたと報告している。
- 保護された設定の変更案: prj-0001 の `.specdojo/exec-defaults.yaml` の `pipeline` に `post_integration: [{ id: build-dist, paths: ["src/**", "tsconfig*.json"] }]` を足す。利用者の承認のもと feature ブランチで反映する。`package.json` の変更は要らない。
- 決めた点: 失敗の記録先は run の記録の `post-integration.log`（JSON Lines）とした。result は reporter の後に描画済みで、統合の後に書き換えると統合済みの commit と食い違うため。
- 決めた点: tsc は失敗しても新しい JS を出し得るため、失敗の印 `dist/.specdojo-build-failed` を dist-freshness の判定に加えた。成功時と手動の `npm run build`（dist を消してから作る）で印は消える。
- 決めた点: 対象は worktree 実行だけとした（in-place は統合の merge を持たないため）。`paths` は必須とした（docs だけの統合で build を流してロックの保持が延びるのを避けるため）。
- CHANGELOG に書く事項（Added）: `exec run` の worktree 実行で、統合の後に `pipeline.post_integration` の固定処理（`build-dist` = `npm run build`）を、統合した変更が `paths` に当たるときだけ流せるようにした。失敗しても統合は戻さず、次の `exec` は dist-freshness の判定で止まる（PJR-8KXJ）。
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T00:36:06.643Z に再開

## 4. 進め方

exec-defaults の `pipeline.post_integration` を schema・設定読み込み・実行処理の 3 層で追加した。worktree 統合の 3 経路（register・schedule・job）から共通の統合後処理を呼び、失敗は統合を戻さず印ファイルとログで記録して、次の run を既存の dist-freshness 判定に止めさせる設計にした。保護された設定（`exec-defaults.yaml`、`package.json`）は変更せず、案を個票と executor の `handoff` に残した。
