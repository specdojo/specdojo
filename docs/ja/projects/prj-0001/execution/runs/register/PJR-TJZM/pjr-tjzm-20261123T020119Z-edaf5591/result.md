---
specdojo:
  id: prj-0001:xer-pjr-tjzm-20261123t020119z-edaf5591
  type: exec-result
  task_id: PJR-TJZM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-TJZM/pjr-tjzm-20261123T020119Z-edaf5591/plan.md
  started_at: "2026-11-23T02:01:23.046Z"
  completed_at: "2026-11-23T02:09:02.978Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- `Register item:` の行でエスケープ済みタイトルを元に戻して出すようにした（`unescapeMarkdownCell` を追加し 4 か所で使用）。テストと個票の対応結果を更新した。

## 2. 変更ファイル

- `src/exec/run/register-resume.ts`: 変更、+4 / -3 行
- `src/exec/run/register-worktree.ts`: 変更、+2 / -1 行
- `src/shared/text.ts`: 変更、+6 / -0 行
- `tests/src/shared/text.test.ts`: 変更、+13 / -0 行

## 3. 申し送り

- `--dry-run` 専用の `Register item:` の行は見つからなかった。dry-run も修正した 4 か所のどれかを通ると見ているが、確認していない。
- `Register item:` の行そのものを出力して確かめるテストは書いていない。`unescapeMarkdownCell` の単体テストのみ。
- CHANGELOG に書く事項（区分 Fixed と文案）は個票の対応結果 5.1 に記載した。`CHANGELOG.md` は変更していない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
