---
specdojo:
  id: prj-0001:xer-pjr-m495-20261115t143302z-3b772eb1
  type: exec-result
  task_id: PJR-M495
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-M495/pjr-m495-20261115T143302Z-3b772eb1/plan.md
  started_at: "2026-11-15T14:39:17.201Z"
  completed_at: "2026-11-15T15:20:58.350Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 人が exec unblock しても claim の持ち主（`claimed_by`）を agent のまま保つようにし、complete・block・release の確かめ、completion preflight、resume の actor 解決を持ち主で判定するようにした。人が引き取る場合に使う human 限定の `exec unblock --take-over` を足し、ガイドに続行と引き取りの区別を書いた。回帰テストを追加し、個票の対応結果を記入した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+11 / -0 行
- `src/exec/commands.ts`: 変更、+10 / -3 行
- `src/exec/core.ts`: 変更、+12 / -0 行
- `src/exec/events.ts`: 変更、+34 / -7 行
- `src/exec/limit.ts`: 変更、+1 / -1 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+7 / -4 行
- `src/exec/run/schedule-mode.ts`: 変更、+4 / -5 行
- `src/exec/run/shared.ts`: 変更、+3 / -2 行
- `src/exec/types.ts`: 変更、+3 / -0 行
- `tests/src/exec/unblock-claim-owner.test.ts`: 追加、+217 / -0 行

## 3. 申し送り

- 決めたこと: 完了条件の 2 案のうち、runner が再開のたびに claim を引き継ぐ案ではなく、claim の持ち主を保つ案を採った。引き継ぐ案では、人が引き取ったのか続けさせたいのかを runner が区別できず、人の claim を agent が奪うおそれがあるため。区別は `exec unblock --take-over`（roster の human のみ）で人が明示する。
- 決めたこと: `--take-over` なしの unblock を既定で続行とした。人が unblock してそのまま `exec complete` する従来の手順は、今後 `--take-over` を付けるか `exec complete --force` を使う必要がある。利用者に見える変更として、個票の「CHANGELOG に書く事項」に書いた。
- 決めたこと: 過去の event も同じ規則で読み直すため、過去に人が unblock して作業中のタスクは、claim の持ち主が agent に戻る。すでに完了したタスクには影響しない。
- 決めたこと: `exec status` の `by` 列と `--by` の絞り込みを claim の持ち主で表すようにした。同じ秒の event を並べ替える処理（`orderSameTimestampEventsByState`）は、既存の順序づけへの影響を避けるため `last_by` のまま残した。
- PJR-T4G3 との整合: claim の持ち主を `claimed_by` で判定するので、人の unblock の後に agent の段が失敗したときも block が通る。PJR-T4G3 は未実装で、実装するときは `claimOwnerOf` で claim した actor を記録できる。
- CHANGELOG に書く事項は、個票の対応結果の「CHANGELOG に書く事項」の節に書いた（CHANGELOG.md は変えていない）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
