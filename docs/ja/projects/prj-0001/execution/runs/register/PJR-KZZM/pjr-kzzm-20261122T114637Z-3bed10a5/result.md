---
specdojo:
  id: prj-0001:xer-pjr-kzzm-20261122t114637z-3bed10a5
  type: exec-result
  task_id: PJR-KZZM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-KZZM/pjr-kzzm-20261122T114637Z-3bed10a5/plan.md
  started_at: "2026-11-22T11:48:09.620Z"
  completed_at: "2026-11-22T11:53:54.755Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- exec の --by の Unknown actor エラーに予約名も並べるよう assertValidExecActor を修正。register は既に予約名を並べていたため変更なし。agent 限定の assertValidActor は不変。単体テストを追加し、個票の対応結果（CHANGELOG 文案を含む）を更新。

## 2. 変更ファイル

- `src/shared/specdojo-config.ts`: 変更、+7 / -1 行
- `tests/src/shared/specdojo-config.test.ts`: 変更、+28 / -0 行

## 3. 申し送り

- 判断: assertValidExecActor 内でエラーを独自に組み立て、assertValidActor（grade など agent 限定）には予約名を並べない。
- CHANGELOG に書く事項: 区分 Fixed。exec の --by が名簿にも予約名にもない名前を拒否するとき、エラーの文に予約名も並べるようにした。
- register の記帳は既に予約名を並べていたため、テストの追加のみで実装変更なし。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
