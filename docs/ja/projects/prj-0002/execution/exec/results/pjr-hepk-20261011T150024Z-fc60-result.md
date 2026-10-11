---
specdojo:
  id: prj-0002:xer-pjr-hepk-20261011t150024z-fc60
  type: exec-result
  task_id: PJR-HEPK
  mode: edit
  status: superseded
  project_id: prj-0002
  origin: register
  plan_ref: exec/plans/pjr-hepk-20261011T150024Z-fc60-plan.md
  started_at: "2026-10-11T15:00:49.043Z"
  completed_at: "2026-10-11T22:32:39.114Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- `specdojo-lp:src/pages/index.astro` を書き換え、PJR-HEPK の個票にあるランディングページの構成と原稿を反映しました。構成は、ヘッダー、マスコット用プレースホルダ付きのヒーロー、課題提示、register の仕組み、始める 5 ステップ、次のステップへのリンク、フッターです。
- コマンドのオプションは CLI ソースとコマンドリファレンスで確認しました。公開ドキュメントサイトの 5 つの URL は、WebFetch で期待したタイトルのまま読み込めることを確認しました。
- 個票はすでに内容が一致していたため変更していません。docs 配下のファイルも変更していません。
- runner が実行した `lint-ts`、`lint-fm`、`lint-md`、`typecheck`、`test-unit`、`test-integration`、`validate-schema` はすべて passed です。ただし、これらは project リポジトリの検査です。LP の変更は `specdojo-lp` 側にあり、LP 自体のビルドは確認できていません。

## 2. 変更ファイル

- `specdojo-lp:src/pages/index.astro`: LP の構成と原稿を全面的に書き換えました。ヘッダー、マスコット用プレースホルダ付きのヒーロー、課題、register の仕組み、始める 5 ステップ、VitePress ドキュメントへの案内リンク、フッターを含みます。差分は 222 行追加、30 行削除です。

## 3. 申し送り

- `specdojo-lp` で `npm run build` を実行できていません。executor の sandbox では npm の実行に承認が必要で、検証は `requires_human` になっています。sandbox の外で実行し、`dist/index.html` が生成されることを確認してください。
- ヒーローのマスコットはプレースホルダのままです。実際の画像に差し替える作業が残っています。
- `specdojo-lp` には Prettier が導入されていないため、整形は実行していません(`not_applicable`)。
- docs 配下に変更がないため `specdojo index build` は実行していません(`not_applicable`)。prj-0002 には `catalog_path` が設定されていないため、`specdojo catalog validate` も実行していません(`not_applicable`)。
- 登録簿の行と個票のステータス項目は、plan の指示どおり変更していません。状態遷移は runner と人間が行ってください。
- 適用外の検証: `npx prettier --write specdojo-lp:src/pages/index.astro`（specdojo-lp package.json does not list prettier in dependencies or devDependencies）
- 適用外の検証: `specdojo index build`（Only specdojo-lp:src/pages/index.astro was edited; no project docs changed）
- 適用外の検証: `specdojo catalog validate`（The ticket states prj-0002 does not set `catalog_path`, so catalog validate does not apply）
- 人の確認が必要: `npm run build (in specdojo-lp)`（Running npm in the LP repo needs approval in the agent sandbox, so it was not run. Run `npm run build` in specdojo-lp outside the sandbox and confirm dist/index.html is produced.）

## 4. 進め方と実践の型の適用

個票の構成と原稿を基準に、`specdojo-lp:src/pages/index.astro` のみを編集しました。コマンドのオプションと文書リンクは、CLI ソース、コマンドリファレンス、公開ドキュメントサイトで実在を確認しました。docs 配下は変更せず、LP のビルド確認は sandbox の制約で人間に引き継ぎます。
