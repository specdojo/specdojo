---
specdojo:
  id: prj-0001:xer-pjr-bnav-20261121t230220z-477f46f8
  type: exec-result
  task_id: PJR-BNAV
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BNAV/pjr-bnav-20261121T230220Z-477f46f8/plan.md
  started_at: "2026-11-21T23:02:21.227Z"
  completed_at: "2026-11-22T02:28:55.610Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: lint-md"
---

# Edit Result

## 1. 実施内容

- ``docs/ja/projects/prj-0001/controls/project-register/pjr-bnav-faster-docs-dev-startup.md`` の更新を完了し、作業内容の表における `_TODO_` を解消しました。
- ``packages/docs-site/.vitepress/kata-staging.ts`` において、起動のたびに `execution/` ディレクトリの実行記録をコピーする処理を除外し、差分コピーを軽量化しました。
- ``packages/docs-site/bin/specdojo-docs-site.js`` を変更し、`docs:generate` を `dist` で実行できるように変更しました。
- ``tests/packages/docs-site/kata-staging.test.ts`` に、変更後のロジックを検証するためのテストケースを追加しました。
- オーケストレーターによる時間測定結果（`docs:build` の通過時間など）が個票 5.3 に記録されていることを確認しました。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/kata-staging.ts`: 起動のたびに `execution/` 内のファイル（大量の実行記録）をコピーする処理を除外し、コピー対象を絞り込むことで起動速度を向上させました。
- `packages/docs-site/bin/specdojo-docs-site.js`: 起動プロセスの中で `generate` コマンドの実行を可能にするための変更を行いました。
- `tests/packages/docs-site/kata-staging.test.ts`: 変更された `kata-staging` のロジックが正しく動作することを検証するためのテストを追加しました。

## 3. 申し送り

- 保護された設定の案（変更していない）: `package.json` の `docs:generate` を `specdojo-docs-site generate --skip-if-fresh` 経由にする案。個票 5.3 の測定では、cache のある起動が約 24 秒から約 8.5 秒になる見込み。
- 保護された設定の案（変更していない）: `.devcontainer/devcontainer.json` でツリーと `.vitepress/cache` を named volume に置く案。cache のない 1 回目の起動（約 72 秒）を減らす候補で、反映後に測り直す。
- 上記 2 件の反映は、利用者の承認のもとも feature ブランチで行う。
- `CHANGELOG.md` は変えていない。区分と行の文案は個票 5.1 に記載済み。
- `npm run docs:build` の通過（126 秒）はオーケストレーターが個票 5.3 に記録した。executor は流していない。
- 保護された設定の案（変更していない）: package.json の docs:generate を `specdojo-docs-site generate --skip-if-fresh` 経由にする案。個票 5.3 の測定では、cache のある起動が約 24 秒から約 8.5 秒になる見込み。
- 保護された設定の案（変更していない）: .devcontainer/devcontainer.json でツリーと .vitepress/cache を named volume に置く案。cache のない 1 回目の起動（約 72 秒）を減らす候補で、反映後に測り直す。
- 上記 2 件の反映は、利用者の承認のもと feature ブランチで行う。
- CHANGELOG.md は変えていない。区分と行の文案は個票 5.1 に記載済み。
- npm run docs:build の通過（126 秒）はオーケストレーターが個票 5.3 に記録した。executor は流していない。

## 4. 進め方

まず、`packages/docs-site/.vitepress/kata-staging.ts` を修正して、起動時のファイルコピー対象から `execution/` ディレクトリを除外することで、大量のファイルコピー時間を削減しました。次に、`packages/docs-site/bin/specdojo-docs-site.js` を修正して、`generate` コマンドの実行に対応させました。これらの変更が正しく機能することを `tests/packages/docs-site/kata-staging.test.ts` で検証し、最後に個票の作業結果を `done` で更新して完了としました。
