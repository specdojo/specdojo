---
specdojo:
  id: prj-0001:xer-pjr-6xg2-20261124t173316z-d1db0a56
  type: exec-result
  task_id: PJR-6XG2
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-6XG2/pjr-6xg2-20261124T173316Z-d1db0a56/plan.md
  started_at: "2026-11-24T17:33:24.122Z"
  completed_at: "2026-11-24T17:39:22.083Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- メニューの project の入口を複数 project 対応にし、deploy.yml の変更案と CHANGELOG 文案を個票に記載した。手元ビルドと workflow への反映は残課題としてオーケストレーターへ引き継ぐ。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/config.mts`: 変更、+25 / -4 行

## 3. 申し送り

- deploy.yml の変更案（差分）は個票 pjr-6xg2 の対応結果の「workflow の変更案」の節にある。Build the next site の cd の直後、npm ci の前に、prj-0002 のブランチから docs/ja/projects/prj-0002/ だけを git checkout で重ね、ビルド用 worktree の共有設定へ prj-0002 を足し、product-repos.ts がある版だけ specdojo-lp を token なしで git clone して repos に宣言する。
- 設定の足し方の決定: .specdojo/specdojo.local.config.json は使わない。CLI の local config は共有設定に無い project を足せず、docs-site の loadProductRepos と readProjectEntries も共有設定の projects だけを走査するため。代わりにビルド用の detached worktree の共有設定へ足す。この worktree は commit せず捨てる。
- specdojo-assets は public でないため宣言しない。specdojo-lp は actions/checkout の path が `GITHUB_WORKSPACE` の下に限られるため git clone で `$RUNNER_TEMP/specdojo-lp` に置く。clone は既定ブランチを取るので、develop の文書を出す場合は --branch develop が要る（要判断）。
- CHANGELOG に書く事項: 区分は Added（文書サイト）。案は「文書サイトの開発中の版（/specdojo/next/）に prj-0002 の project の文書と specdojo-lp の product の文書を出す。上のメニューの「プロジェクト」は、文書のある project が複数あるときドロップダウンになる。」
- 作業 4（手元で同じ重ね方をしたビルドで、prj-0002 のページ、wikilink の解決、登録簿の表示ページの生成を確かめる）と作業 5（deploy.yml への反映、利用者の承認のもと）は open のまま。担当 DEV・期限 2026-11-30 は利用者の確認待ち。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
