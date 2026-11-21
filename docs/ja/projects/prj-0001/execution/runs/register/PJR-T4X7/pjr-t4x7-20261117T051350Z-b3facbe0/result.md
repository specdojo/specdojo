---
specdojo:
  id: prj-0001:xer-pjr-t4x7-20261117t051350z-b3facbe0
  type: exec-result
  task_id: PJR-T4X7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-T4X7/pjr-t4x7-20261117T051350Z-b3facbe0/plan.md
  started_at: "2026-11-17T05:13:51.053Z"
  completed_at: "2026-11-17T05:26:55.217Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- run 単位の plan・result の除外と GitHub リンク変換を修正し、回帰テスト・README・個票を更新しました。親検証と統合後のビルド確認が残っています。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/config.mts`: 変更、+12 / -14 行
- `packages/docs-site/.vitepress/exec-record-links.ts`: 変更、+5 / -3 行
- `packages/docs-site/README.md`: 変更、+4 / -2 行
- `tests/packages/docs-site/exec-record-links.test.ts`: 変更、+47 / -0 行
- `packages/docs-site/.vitepress/exec-record-paths.ts`: 追加、+28 / -0 行
- `tests/packages/docs-site/exec-record-paths.test.ts`: 追加、+66 / -0 行

## 3. 申し送り

- 変更ファイル: packages/docs-site/.vitepress/exec-record-paths.ts（配置判定・除外 glob を新設）、config.mts（ページ・サイドバー・検索の除外と frontmatter 参照）、exec-record-links.ts（新配置のリンク変換）、packages/docs-site/README.md（対象配置）、tests/packages/docs-site/exec-record-links.test.ts・exec-record-paths.test.ts（新旧配置の回帰テスト）、個票 pjr-t4x7-docs-site-exclude-run-records.md（実績・検証・申し送り）。
- 判断: 除外は runs/&lt;origin&gt;/&lt;item&gt;/&lt;run&gt;/ の plan.md・result.md に限定し、旧配置の除外を維持しました。通常文書と実行記録の入口ページは対象に残します。保護された設定の変更案はありません。
- 型検査・単体／結合テスト・lint・schema 検証は設定済みの `pipeline.parent_validations` に委ねています。追加テストも親 runner で実行してください。
- orchestrator は統合後に npm run docs:build を既定ヒープ 8GB で実行し、終了コード・所要時間・dead link 件数・run の plan/result が HTML に含まれないことを確認してください。OOM 解消の実測は未確認で、個票の作業行 3 は理由付き open です。
- CHANGELOG 文案（不具合修正）: 文書サイトのビルド対象から run 単位の plan・result を除外し、実行記録一覧などのリンクを GitHub の正本へ向ける。配置移行後にビルドの対象ページが増え、メモリ不足になる原因を修正。
- 人の確認が必要: `npm run docs:build`（個票の指定により orchestrator が統合後に既定 8GB で実行し、時間・dead link 件数を確認する。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
