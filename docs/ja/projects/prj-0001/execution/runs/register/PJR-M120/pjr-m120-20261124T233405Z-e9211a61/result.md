---
specdojo:
  id: prj-0001:xer-pjr-m120-20261124t233405z-e9211a61
  type: exec-result
  task_id: PJR-M120
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-M120/pjr-m120-20261124T233405Z-e9211a61/plan.md
  started_at: "2026-11-24T23:34:05.735Z"
  completed_at: "2026-11-24T23:42:08.093Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- register branch-push の初回作成を統合のブランチのリモートの先端（fetch して読む）から行うよう直し、手元にしかない統合ブランチの commit を専用ブランチに含めないようにした。リモートに統合のブランチが無いときだけ手元の先端から作り、案内を出す。--dry-run でも本番と同じ案内（`INITIAL_CHECK_HINT` など）を出す。単体テスト・統合テストを足し、ガイドとコマンドリファレンス、個票を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `src/register/branch-push.ts`: 変更、+94 / -18 行
- `tests/src/register/branch-push.test.ts`: 変更、+31 / -0 行
- `tests/src/register/register-branch-push.integration.test.ts`: 変更、+51 / -4 行

## 3. 申し送り

- 決めた動き: 初回は `git ls-remote` で `&lt;remote&gt;/&lt;integration_branch&gt;` を確かめ、あれば本番では fetch した `FETCH_HEAD` から専用ブランチを作る。初回の検査はその先端を base として、それより後の commit だけを見る（範囲は 0 件、形の検査は先端で流す）。理由: 手元の develop に未 push の commit があると、`--remotes` 除外の範囲ではそれらが範囲の外として挙がり、初回が始められないため。
- リモートに統合のブランチが無いときだけ手元の先端から作り、`&lt;remote&gt;/&lt;integration_branch&gt; does not exist; creating ... from the local ...` の案内を出す。検査で止まるときは `INITIAL_CHECK_HINT` も添える。
- `--dry-run` は従来どおり fetch しない。リモートの統合ブランチの先端の commit が手元に無いときは、fetch してから作ることと、検査は fetch 後に流すことを示して終了コード 0 で返す。
- 単体テストのために `checkLines` と `INITIAL_CHECK_HINT` を `src/register/branch-push.ts` から export した。
- 作業内容 No 5（統合の後、オーケストレーターが試しのリポジトリで初回・復旧・`--dry-run` を確かめる）は open のまま。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
