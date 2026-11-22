---
specdojo:
  id: prj-0001:xer-pjr-9xeg-20261122t114633z-597f4b2f
  type: exec-result
  task_id: PJR-9XEG
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-9XEG/pjr-9xeg-20261122T114633Z-597f4b2f/plan.md
  started_at: "2026-11-22T11:46:35.572Z"
  completed_at: "2026-11-22T12:00:37.925Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- specdojo project move &lt;project-id&gt; --check を追加した。8 つの点検それぞれに ok・needs-cleanup・check-manually を出し、needs-cleanup があると終了コード 1 で終わる。統合テストで作業ツリー・HEAD・refs・worktree が変わらないことを確かめ、command-reference と個票の対応結果（prj-0002 の出力例と CHANGELOG の文案を含む）を書いた。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+21 / -0 行
- `eslint.config.js`: 変更、+1 / -0 行
- `src/shared/specdojo-config.ts`: 変更、+2 / -1 行
- `src/specdojo.ts`: 変更、+2 / -1 行
- `src/project/command.ts`: 追加、+53 / -0 行
- `src/project/move-check.ts`: 追加、+569 / -0 行
- `tests/src/project/move-check.integration.test.ts`: 追加、+161 / -0 行
- `tests/src/project/move-check.test.ts`: 追加、+78 / -0 行

## 3. 申し送り

- prj-0002 の出力例は、git を使わない 6 つの点検だけを specdojo-prj-0002 の checkout に対して流したもの。sandbox がその checkout での git を許可しなかったため。人がその checkout で `specdojo project move prj-0002 --check` を流し、`exec-worktrees` と `integration-branches` を確かめる。
- 決めたこと: 名前は `project move &lt;project-id&gt; --check`。移すこと自体を後で自動化するときに同じ名前を使えるため。今は `--check` を付けないとエラーにする。
- 決めたこと: needs-cleanup の対象は、in-progress・waiting の登録簿の項目、doing・blocked の schedule タスク、exec ブランチと worktree。blocked は claim を持ったままなので含め、review は run が終わっているので含めない。リンク・写す設定・定期実行・kata・見つからない統合先のブランチは check-manually にした。
- 決めたこと: project をまたぐ参照は、wikilink はどこでも、`&lt;project-id&gt;:` 付きの値は frontmatter と YAML だけで拾い、`generated/` は見ない。本文の `specdojo:build` のようなコマンド名を参照と取り違えないため。
- CHANGELOG に書く事項（Added）: `specdojo project move &lt;project-id&gt; --check` を追加しました。project を別のリポジトリへ移す前に、実行中の項目とタスク、exec のブランチと worktree、統合先のブランチ、定期実行、project をまたぐ参照、写す設定、kata の出所を、何も書き換えずに点検します。移す前に片付けが要るものがあると終了コード 1 で終わります。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
