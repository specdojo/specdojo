---
specdojo:
  id: prj-0001:xer-pjr-2srr-20261108t022929z-0b13323b
  type: exec-result
  task_id: PJR-2SRR
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-2SRR/pjr-2srr-20261108T022929Z-0b13323b/plan.md
  started_at: "2026-11-08T02:29:30.266Z"
  completed_at: "2026-11-08T02:48:42.454Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- docs:build の実行時に発生するメモリ不足（JavaScript heap out of memory）を回避するため、`NODE_OPTIONS=--max-old-space-size=8192` を設定する方式を決定しました。
- メモリ上限値は実測に基づき 8GB（8192MB）と定め、現在のドキュメント増加状況（4,039 文書）において 4GB では不足することを確認済みです。
- `package.json` 内の `docs:build` スクリプトおよび GitHub Actions のワークフローファイル（`.github/workflows/deploy.yml`）に対する変更案を作成し、個票および `handoff` に記録しました。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 【設定方式の決定と選定理由】手元での `npm run docs:build` のメモリ上限設定方式として、`package.json` の `scripts` 方式を採用しました。`@specdojo/docs-site` は独立した汎用 npm パッケージであり、4,000 件以上の大量ドキュメントを抱える specdojo 本体（prj-0001）固有の大規模事情に起因するメモリ要件（8GB）を汎用 CLI のコード（`specdojo-docs-site.js`）にハードコードすべきではないためです。また、汎用 CLI 側で一律 8GB を前提とするとメモリ 8GB 以下の小型開発環境や軽量コンテナで OS スワップや OOM キラーを招く恐れがあるため、プロジェクト固有のリポジトリ設定で管理するのが適切と判断しました。
- 【メモリ上限値の決定と CI との統一】上限値は 8GB（`--max-old-space-size=8192`）と決定しました。2026-10-11（2,536 文書）時点では 4GB で通過していましたが、2026-11-08 現在は 4,039 文書に増加しており、PJR-HMV6 の実測でも既定 heap では OOM（`Fatal error: Ineffective mark-compacts near heap limit`）となり 4GB でも不足、8GB（8192MB）にて 665 秒で正常完了したためです。CI の `.github/workflows/deploy.yml` は現在 `NODE_OPTIONS: --max-old-space-size=4096` となっており現在の規模では CI でも失敗するリスクが高いため、手元とそろえて 8192 に引き上げる案としました。
- 【package.json 反映案】Line 96 の "docs:build" スクリプトを以下のように変更してください: "docs:build": "npm run docs:generate && `NODE_OPTIONS=--max-old-space-size=8192` npm --prefix packages/docs-site run docs:build"
- 【.github/workflows/deploy.yml 反映案】Lines 71-76 の Build VitePress site ステップを以下のように変更してください: `env.NODE_OPTIONS` を `--max-old-space-size=8192` に更新。
- 【残課題・申し送り】`package.json` および `.github/workflows/deploy.yml` は保護された設定のため本タスク（executor）では直接変更していません。利用者の承認のもと feature ブランチにて上記変更案を反映し、手元および CI で `docs:build` の通過を確認してください。また、反映コミットに合わせて `CHANGELOG.md` の [Unreleased] の変更または不具合修正に本対応を記録してください。
- 【設定方式の決定と選定理由】手元での npm run docs:build のメモリ上限設定方式として、package.json の scripts 方式を採用しました。@specdojo/docs-site は独立した汎用 npm パッケージであり、4,000 件以上の大量ドキュメントを抱える specdojo 本体（prj-0001）固有の大規模事情に起因するメモリ要件（8GB）を汎用 CLI のコード（specdojo-docs-site.js）にハードコードすべきではないためです。また、汎用 CLI 側で一律 8GB を前提とするとメモリ 8GB 以下の小型開発環境や軽量コンテナで OS スワップや OOM キラーを招く恐れがあるため、プロジェクト固有のリポジトリ設定で管理するのが適切と判断しました。
- 【メモリ上限値の決定と CI との統一】上限値は 8GB（--max-old-space-size=8192）と決定しました。2026-10-11（2,536 文書）時点では 4GB で通過していましたが、2026-11-08 現在は 4,039 文書に増加しており、PJR-HMV6 の実測でも既定 heap では OOM（Fatal error: Ineffective mark-compacts near heap limit）となり 4GB でも不足、8GB（8192MB）にて 665 秒で正常完了したためです。CI の .github/workflows/deploy.yml は現在 `NODE_OPTIONS:` --max-old-space-size=4096 となっており現在の規模では CI でも失敗するリスクが高いため、手元とそろえて 8192 に引き上げる案としました。
- 【.github/workflows/deploy.yml 反映案】Lines 71-76 の Build VitePress site ステップを以下のように変更してください: `env.NODE_OPTIONS` を --max-old-space-size=8192 に更新。
- 【残課題・申し送り】package.json および .github/workflows/deploy.yml は保護された設定のため本タスク（executor）では直接変更していません。利用者の承認のもと feature ブランチにて上記変更案を反映し、手元および CI で docs:build の通過を確認してください。また、反映コミットに合わせて CHANGELOG.md の [Unreleased] の変更または不具合修正に本対応を記録してください。
- 適用外の検証: `npm run validate:schema:file`（No changed `*.yaml` or `*.yml` files; only markdown ticket was updated）

## 4. 進め方

`npm run docs:build` がメモリ不足で停止する問題を解決するため、プロジェクト固有の設定として `NODE_OPTIONS=--max-old-space-size=8192` を付与する計画を立てました。まず、個票の内容に基づき、現在のドキュメント規模では 4GB では不足し 8GB が必要であることを実測値から導出しました。次に、汎用的なツール側の設定を変更するのではなく、プロジェクトのリポジトリ設定（`package.json` および CI 設定）で管理する方針を決定し、具体的な変更方法を成果物である個票に記述しました。
