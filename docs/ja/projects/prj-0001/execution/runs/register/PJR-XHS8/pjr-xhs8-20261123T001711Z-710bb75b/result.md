---
specdojo:
  id: prj-0001:xer-pjr-xhs8-20261123t001711z-710bb75b
  type: exec-result
  task_id: PJR-XHS8
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-XHS8/pjr-xhs8-20261123T001711Z-710bb75b/plan.md
  started_at: "2026-11-23T00:17:12.154Z"
  completed_at: "2026-11-23T01:10:32.032Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- 個票の 5.2 に索引の前後比較（本文の文字は変わらず、差は時刻の 3 語と Shiki 由来の `x26`・`x3c` のみ）と起動時間の 3 回測定（平均 23.7 秒から 15.9 秒）を転記した。作業内容の No 4 を done にし、5.4 の残課題を更新した。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/config.mts`: 変更、+12 / -1 行
- `packages/docs-site/.vitepress/kata-staging.ts`: 変更、+2 / -1 行
- `tests/packages/docs-site/kata-staging.test.ts`: 変更、+22 / -0 行

## 3. 申し送り

- dev 判定は `bin` が渡す `SPECDOJO_DOCS_COMMAND` が `dev` かどうかで行い、`md.options.highlight` を一時的に外して描画後に戻す。build の索引とページ表示を変えないため。
- CHANGELOG に書く事項は個票の対応結果 5.3 に記載済み（区分 Performance）。`CHANGELOG.md` は未変更。
- 保護された設定の変更は不要だった。
- 利用者の依頼時の 58.4 秒は devcontainer 作り直し直後の別条件の値で、orchestrator の測り（平均 23.7 秒から 15.9 秒）とは直接比べていない。
- 適用外の検証（runner の判定）: `npm run validate:history-links`（変更に 履歴蓄積ファイル（登録簿の個票 `controls/project-register/pjr-*.md` など、pjr-index.md と runner が書く plan・result を除く） がない）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
