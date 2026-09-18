---
specdojo:
  id: prj-0001:pjr-7wfe-schedule-agent-by-name
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-09-18T13:16:03Z"
  due_on: "2026-09-30"
  block_reason: "agent exited with non-zero code: runner による検証 `test-unit` が失敗したため。具体的に `tests/src/exec-strategy.test.ts` 内のproficiency を維持したまま phase assignment と per-deliverable override を解決するテストケースで失敗が発生している。"
---

# PJR-7WFE Schedule の phase に agent の by-name 指定を追加する

## 1. 概要

Schedule（`sch-strategy-<track>.yaml`）の phase は `agent_pipeline.stages[].proficiency` と capability による自動選択だけで agent を決めており、nickname を埋め込まない設計になっている。自動選択は「条件を満たす agent を priority 順に選ぶ」だけで、provider ごとの利用制限（rate limit）の枠を計画できない。実際に次の状況が起きている。

- codex の利用制限に当たり、claude へ切り替えて再開した（PJR-08K1、PJR-19HX）。
- review-pass で strategy の `proficiency: expert` が `generated/ready.json` の `agent_pipeline` に反映されず normal（qwen）が選ばれたため、`--executor-by` で明示して回避した（2026-09-17）。
- 夜間の grade（codex）と日中の register 実行（codex）が同じ枠を消費する。

「この track の refine は codex、review は claude、夜間 grade は codex」のように枠を割り当てて設計するため、job が既に持つ `agent.executor` / `agent.reporter` と同じ by-name 指定を strategy の phase にも追加する。自動選択は「誰でもよい」タスク向けに残し、両方を使い分ける。

### 1.1. 決定事項

- strategy の phase（`phase_sets.<name>[]` と `cross_deliverable_passes[]`）に `agent: { executor: <nickname>, reporter: <nickname> }` を追加する。`agent_pipeline` と併存可。`owner_rules[].phase_overrides` でも上書きできる。
- 解決順序は `--executor-by` / `--reporter-by`（緊急の差し替え）> phase の `agent`（by-name）> `agent_pipeline` の proficiency / capability による自動選択。
- by-name で指定した agent が rate limit 中の場合、他の agent へフォールバックせず待つ（`exec run --auto` は対象タスクを選ばず、`exec resume` の再開対象として扱う）。差し替えは人が `--executor-by` で行う。
- nickname は `pm-members.yaml` に存在し `stage_role` が一致することを `schedule build` で検証する（job と同じ検証）。
- job / routine は現行の `agent` 指定で足りるため変更しない。grade の単段化（PJR-W5JT）では `run-per-document.sh` の `--stage-1-executor codex-expert-executor` を明示する。

## 2. 完了条件

- `sch-strategy.schema.yaml` の phase と cross_deliverable_pass に `agent`（executor 必須、reporter 任意）があり、`owner_rules[].phase_overrides` でも指定できる。
- `schedule build` が nickname の存在と `stage_role` の一致を検証し、不一致は build を失敗させる。
- `sch-track-<track>.yaml` と `generated/ready.json` に by-name が引き継がれ、`exec run --auto` / `--task` がその agent で claim する。
- 指定 agent が rate limit 中のとき自動選択へ落ちず、待機として記録される。`--executor-by` による差し替えが by-name より優先される。
- review-pass で `proficiency: expert` が ready.json に反映されなかった原因が特定・修正され、自動選択の track でも strategy の proficiency が守られる。
- `sch-strategy-data-flow-pdca.yaml` の review-pass を `agent: { executor: codex-expert-review-executor, reporter: gemma-reporter }` に書き換え、`schedule build --force` 後の `exec run --dry-run` がその agent を表示する。
- 単体テストで解決順序、検証、待機動作が検証され、`docs/ja/specdojo/guides/schedule-design-guide.md` と `exec-config-guide.md` に by-name の使い分けが記載されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                           | 担当 | 状態 | メモ                                                            |
| --- | -------------------------------------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------- |
| 1   | schema に `agent` を追加し、`schedule build` で nickname と `stage_role` を検証する                            | DEV  | done | phase・override・cross-deliverable pass に対応                  |
| 2   | `exec-strategy` / `exec-run` で解決順序と rate limit 時の待機動作を実装し、テストを追加する                    | DEV  | done | CLI > by-name > 自動選択。by-name は候補を1件に固定             |
| 3   | review-pass の proficiency が ready.json に落ちない原因を特定して修正する                                      | DEV  | done | strategy index の track 間衝突と Ready 外タスクの復元漏れを修正 |
| 4   | `sch-strategy-data-flow-pdca.yaml` の review-pass を by-name に書き換え、track を再生成して dry-run で確認する | ARC  | done | codex-expert-review-executor / gemma-reporter を確認            |
| 5   | schedule-design-guide / exec-config-guide に自動選択と by-name の使い分けを記載する                            | DEV  | done | 解決順序、rate limit、通常固定と緊急差し替えの使い分けを追記    |

## 4. 対応結果

- strategy と生成 track に `agent.executor` / `agent.reporter` を保持し、`exec refresh` で Ready タスクへ引き継ぐようにした。`owner_rules[].phase_overrides` と `cross_deliverable_passes` にも対応した。
- `schedule build` は `pm-members.yaml` の nickname の一意な存在と、executor / reporter の `stage_role` 一致を検証する。
- 実行時は CLI の `--executor-by` / `--reporter-by`、phase の by-name、自動選択の順に解決する。by-name は実行候補を1件に固定するため、rate limit 時に別 agent へフォールバックせず待機となる。
- review-pass の事象は、strategy index が同名の phase set / suffix を track で区別せず、後から読んだ別 track の normal 条件で expert 条件を上書きしていたことが主因だった。index のキーを track 修飾し、同名 phase の回帰テストを追加した。あわせて Ready 外（claim 済みなど）の `--task` 実行で `agent_pipeline` を復元していなかった経路も修正し、by-name と stage 条件を保持した。
- `data-flow-pdca` の review-pass を codex-expert-review-executor / gemma-reporter に固定し、track 再生成後の dry-run で両 agent を確認した。
- [[specdojo:schedule-design-guide]] と [[specdojo:exec-config-guide]] に自動選択との使い分け、解決順序、rate limit 時の動作を追記した。残課題はない。

## 5. 関連ドキュメント

- [[specdojo:schedule-design-guide]]
- [[specdojo:exec-config-guide]]
- [[prj-0001:pjr-w5jt-grade-single-stage-nightly]]
- `docs/specdojo/schemas/v1/sch-strategy.schema.yaml`
- `docs/specdojo/schemas/v1/job.schema.yaml`
- `src/exec-strategy.ts`
- `src/exec-run.ts`
