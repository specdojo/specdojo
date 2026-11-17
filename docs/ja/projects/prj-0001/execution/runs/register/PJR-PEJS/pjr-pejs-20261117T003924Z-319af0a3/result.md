---
specdojo:
  id: prj-0001:xer-pjr-pejs-20261117t003924z-319af0a3
  type: exec-result
  task_id: PJR-PEJS
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-PEJS/pjr-pejs-20261117T003924Z-319af0a3/plan.md
  started_at: "2026-11-17T00:39:26.340Z"
  completed_at: "2026-11-17T00:52:55.938Z"
  agent: opus-executor
  block_reason: "parent validation failed: typecheck"
---

# Edit Result

## 1. 実施内容

- docs-site のステージングで、利用リポジトリに index.md がないときにサイトのトップ（/&lt;base&gt;/）と project のトップ（/ja/projects/&lt;project-id&gt;/）のページを用意するようにした。利用側に index.md があれば上書きしない。
- docs/ja/index.md がないときは、上のナビゲーションの「ホーム」がサイトのトップを開くようにした。
- 単体テストを追加し、README と個票（対応結果・CHANGELOG に書く事項）を更新した。docs-site の単体テストと型検査は executor の実行で通った。
- runner が実行した `npm run typecheck` は失敗した。`packages/docs-site/.vitepress/kata-staging.ts` の 12 行目で、相対 import に拡張子がなく TS2835 になった。拡張子を `./default-index-pages.js` にする修正が必要である。
- npm pack の配布物を使った dev・build での 404 確認は sandbox で実行できず、人に引き継ぐ。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/config.mts`: docs/ja/index.md がないとき、ナビゲーションの「ホーム」がサイトのトップを開くよう設定を変更した。
- `packages/docs-site/.vitepress/kata-staging.ts`: ステージング処理から default-index-pages を呼び、既定のトップのページを生成するようにした。この import が拡張子なしで、`npm run typecheck` が TS2835 で失敗している。
- `packages/docs-site/README.md`: トップのページを docs-site が用意する挙動と、利用側の index.md が優先されることを追記した。
- `packages/docs-site/.vitepress/default-index-pages.ts`: 新規。利用リポジトリに index.md がないとき、サイトのトップと project のトップのページを用意する処理を追加した。
- `tests/packages/docs-site/default-index-pages.test.ts`: 新規。既定のトップのページの生成と、利用側の index.md を上書きしないことを検証する単体テストを追加した。

## 3. 申し送り

- `npm run typecheck` の失敗（`packages/docs-site/.vitepress/kata-staging.ts` の 12 行目、TS2835）は未解消である。import を `./default-index-pages.js` に直し、`npm run typecheck` を再実行すること。
- 人による確認: 空のリポジトリに npm pack の配布物（specdojo と @specdojo/docs-site）を入れ、`docs:dev` と `docs:build` で /&lt;base&gt;/ と /ja/projects/&lt;project-id&gt;/ が 404 にならないことを、利用側の index.md がある場合とない場合の両方で確かめる。executor の sandbox では build の起動が承認されなかった。下書きは worktree の `tmp/pejs-build-check.sh`（`SPECDOJO_PACKAGE_ROOT` でリポジトリを指す簡易版）。個票の作業内容 No4 は open のまま。
- CLI（`config scaffold`）に組み込まず、`.vitepress/kata-staging` に毎回生成する方式にした。理由は個票の対応結果に記載した。
- 範囲外の残課題: 上のナビゲーションの「プロジェクト」は prj-0001 の prj-overview を固定で開くため、project の ID や構成が違う利用リポジトリでは 404 になり得る。必要なら別の登録項目で扱う。
- CHANGELOG に書く事項は個票の対応結果の「CHANGELOG に書く事項」の節に記載した（CHANGELOG.md は未変更）。
- 人の確認が必要: `specdojo-docs-site build（空の workspace に npm pack の配布物を入れ、index.md の有無の両方で dev・build する）`（sandbox で build の起動が承認されず実行できない。/&lt;base&gt;/ と /ja/projects/&lt;project-id&gt;/ が 404 にならないことを人が確かめる）

## 4. 進め方

利用リポジトリの index.md の有無を見て、ないときだけ既定のトップのページを `.vitepress/kata-staging` の生成物へ加える方式にした。executor は単体テスト、docs-site の型検査、整形、markdownlint、`npm run validate:history-links` を実行し、すべて通った。runner の検査は `npm run typecheck` だけが失敗し、ほかは通った。
