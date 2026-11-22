---
specdojo:
  id: prj-0001:xer-pjr-bbtw-20261122t135813z-c849b9fc
  type: exec-result
  task_id: PJR-BBTW
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-BBTW/pjr-bbtw-20261122T135813Z-c849b9fc/plan.md
  started_at: "2026-11-22T13:58:13.780Z"
  completed_at: "2026-11-22T14:03:37.242Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- docs:dev のときだけ実行記録を走査から外す判定と、--with-exec-records での含め方を実装した。plan と result は既に build でも dev でも外れていたため、新たに減るのは exec/ や grade/results/ などの少数のページで、短縮幅は小さい可能性がある。起動時間の測定は統合後にオーケストレーターが行う。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/config.mts`: 変更、+6 / -2 行
- `packages/docs-site/.vitepress/exec-record-paths.ts`: 変更、+23 / -0 行
- `packages/docs-site/bin/specdojo-docs-site.js`: 変更、+10 / -2 行

## 3. 申し送り

- 起票時の入力にある execution/ の 5,179 ページの大半（runs 配下の plan.md と result.md）は PJR-T4X7 の時点で srcExclude により dev・build とも走査から外れている。この作業ツリーで plan と result 以外の runs 配下の Markdown は 0 件だった。dev で新たに減るのは exec/、grade/results/ などの少数のページで、効果が小さい可能性がある。
- 判断: 含める指定の名前は --with-exec-records とした。ルートの npm run docs:dev -- --with-exec-records は末尾の npm 呼び出しに付き npm のオプション扱いになるため、`npm_config_with_exec_records` も受け付けるようにした。これで package.json の変更は不要。
- 保護された設定（package.json など）の変更は不要。CHANGELOG.md は変更しておらず、区分 Changed と文案は個票の対応結果「CHANGELOG に書く事項」に記載した。
- 統合後に、オーケストレーターが変更前後の docs:dev 起動時間を測って個票の対応結果へ追記してから close する。効果が小さければ、`controls/project-register/pjr-*.md`（約 1,181 ページ）を dev で外す案を別項目で検討する。
- 個票は prettier で整形した後に読み直していない。
- 人の確認が必要: `docs:dev の起動時間の測定`（executor の sandbox では測れない。統合後にオーケストレーターが変更前後を測り、個票の対応結果に書いてから close する。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
