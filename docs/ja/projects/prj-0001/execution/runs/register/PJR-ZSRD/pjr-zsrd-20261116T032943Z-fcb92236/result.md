---
specdojo:
  id: prj-0001:xer-pjr-zsrd-20261116t032943z-fcb92236
  type: exec-result
  task_id: PJR-ZSRD
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-ZSRD/pjr-zsrd-20261116T032943Z-fcb92236/plan.md
  started_at: "2026-11-16T03:31:20.363Z"
  completed_at: "2026-11-16T04:01:46.456Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 再開の経路で古い grade を使う原因を直した。再開のときは runner が agent の前に grade を流し、評価結果サイドカーを exec branch へ取り込む。取り込みがあった reporter からの再開では executor から流し直す。branch に取り込んだ grade と同じ root の grade では merge を止めない。統合の段からの再開は claim の持ち主で判定する。回帰テストと個票の対応結果も更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/review-guide.md`: 変更、+1 / -0 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+1 / -1 行
- `src/exec/run/schedule-prepare.ts`: 変更、+136 / -17 行
- `src/exec/run/schedule-task.ts`: 変更、+5 / -2 行
- `src/exec/worktree-ops-lifecycle.ts`: 変更、+80 / -47 行
- `src/exec/worktree-ops-merge.ts`: 変更、+7 / -1 行
- `src/exec/worktree-ops.ts`: 変更、+1 / -0 行
- `tests/src/exec/unblock-claim-owner.test.ts`: 変更、+40 / -0 行
- `tests/src/exec/worktree-ops.integration.test.ts`: 変更、+40 / -0 行

## 3. 申し送り

- 判断: 2026-11-11 の grade-stale は、runner の grade（agent の前に実行）が rate limit で失敗したことによる。当時は PJR-M18B の前だった。古い grade を使う経路は再開の側に残っていた。worktree の評価結果サイドカーが最初の checkpoint のままだった。executor からの再開は grade を流していなかった。reporter からの再開は古い executor の結果を使い回していた。root の grade が新しいと merge の前の検査が止めていた。この 4 点を直した。
- 判断: 「別の actor が引き受けている」は PJR-T4G3（`claimActor`）と PJR-M495（`claimed_by`）で直っていた。残っていた統合の段からの再開（`last_by` を使っていた）だけを `claimOwnerOf` に替えた。
- 判断: grade が失敗しても review の agent を起動し、完了の段で blocked にする PJR-M18B の判断は変えていない。案 A（review の段をやめて grade を直接流す）は運用の決定なので、runner の振る舞いは変えていない。
- 残課題: grade の取り込みから reporter の再開の流し直しまでを `runPreparedTask` ごと通す統合テストはない。取り込みと merge は統合テストで確かめた。分岐の配線は型の検査とコードの確認で確かめた。
- 残課題: 代表の review の段を、agent を実際に動かして流す確認は人が行う（agent の起動と利用枠が要る）。
- CHANGELOG に書く事項は、個票の対応結果の「CHANGELOG に書く事項」の節に書いた。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
