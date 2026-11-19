---
specdojo:
  id: prj-0001:xer-pjr-8z71-20261119t125414z-4618be24
  type: exec-result
  task_id: PJR-8Z71
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8Z71/pjr-8z71-20261119T125414Z-4618be24/plan.md
  started_at: "2026-11-19T12:54:14.719Z"
  completed_at: "2026-11-19T13:06:54.663Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- isHistoryLinkTargetPath の `pjr-*.md` 判定を docs/ja/projects/&lt;project&gt;/controls/project-register/ 配下に限定し、個票以外の `pjr-*.md` だけを変えた run で validate:history-links の `not_applicable` を受け付ける単体テストを追加した。個票の対応結果を記入した。

## 2. 変更ファイル

- `src/exec/reporter.ts`: 変更、+2 / -2 行
- `tests/src/exec/reporter.test.ts`: 変更、+33 / -0 行

## 3. 申し送り

- 判断: 個票の判定は docs/ja/projects/ 配下の `controls/project-register/pjr-*.md` に限定した。理由: `validate:history-links` の既定 glob（packages/docs-lint/src/validate-history-links.ts）と .github/instructions/markdown.instructions.md の対象がこの範囲のため。
- 本項目の統合後、orchestrator が T-KATA-SLIM-2-pjr-index-040 を `exec resume --task` で再開し、統合まで進むことを確かめる（executor は未実施）。
- CHANGELOG 文案（不具合修正）: `exec`: pjr の rulebook など、登録簿の個票ではない `pjr-*.md` だけを変えた run で、executor が `npm run validate:history-links` を `not_applicable` と報告すると runner が拒んで止まる不具合を修正した（PJR-8Z71）。
- 保護された設定は変更していない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
