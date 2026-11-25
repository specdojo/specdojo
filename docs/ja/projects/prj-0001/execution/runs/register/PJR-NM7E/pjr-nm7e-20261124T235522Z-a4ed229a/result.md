---
specdojo:
  id: prj-0001:xer-pjr-nm7e-20261124t235522z-a4ed229a
  type: exec-result
  task_id: PJR-NM7E
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-NM7E/pjr-nm7e-20261124T235522Z-a4ed229a/plan.md
  started_at: "2026-11-24T23:55:22.851Z"
  completed_at: "2026-11-25T00:01:14.314Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- grade run の作業ディレクトリ `execution/grade/generated/runs/**` を VitePress の srcExclude（`EXEC_RECORD_SRC_EXCLUDE`）へ追加して ENAMETOOLONG を回避した。単体テストを追加し、個票の対応結果を更新した。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/exec-record-paths.ts`: 変更、+3 / -0 行
- `tests/packages/docs-site/exec-record-paths.test.ts`: 変更、+19 / -0 行

## 3. 申し送り

- 直し方: 生成ページ名の短縮や VitePress の asset 名の変更ではなく、grade run の作業ディレクトリをサイトの対象から外した。理由は、run ID と stem が利用者の task ID・sample 名に依存して上限を保証できないこと、gradePlanFilename を変えると既存の criteria ファイル名と食い違うこと、VitePress の sanitizeFileName は設定で差し替えても描画側が元の関数を使うため設定から変えられないこと。
- 生成ページへのリンクはなく、既存の生成物は変更しない（サイトに載らなくなるだけ）。execution/grade/generated/plans/ は引き続き対象。
- CHANGELOG に書く事項（Fixed）: 文書サイトのビルドが、task ID や sample 名が長い grade run の作業ディレクトリのページで ENAMETOOLONG により止まる問題を修正した。execution/grade/generated/runs/ をサイトの対象から外した。
- 統合後に、オーケストレーターが長い名前の grade の記録を持つ試しのリポジトリでサイトをビルドし、止まらないことを確かめてから close する（executor では実行不可）。
- 適用外の検証: `npm run validate:history-links`（個票は変更したが、変更した個票に Markdown リンクを追加しておらず、wikilink も使っていない）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
