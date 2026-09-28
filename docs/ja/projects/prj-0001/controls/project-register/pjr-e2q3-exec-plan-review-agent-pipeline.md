---
specdojo:
  id: prj-0001:pjr-e2q3-exec-plan-review-agent-pipeline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T09:47:25Z"
  block_reason: rate limit reached
---

# PJR-E2Q3 exec run --plan で review を executor と reporter の構成で実行できるようにする

## 1. 概要

PJR-KCMH の完了条件（review を agent で 1 件実行し、plan と result を確かめる）のため、2026-09-28 に orchestrator が次を実行した。

1. `exec plan --project prj-0001 --deliverable stsd-register-entry --mode review` で review plan を生成した。
2. `exec run --plan <plan> --review-by claude-expert-review-executor --reporter-by claude-reporter` を実行したが、`--executor-by / --reporter-by require an agent_pipeline task.` で拒否された。
3. `exec run --plan <plan> --by claude-expert-review-executor` で実行した。

3 では、agent は plan の手順どおりに動いた。grade の鮮度を確認し、finding を事実として参照して、タスクの完了可否を判断した（verdict は `incomplete`）。しかし、判断は標準出力に出ただけで、result は更新されなかった。`claude-expert-review-executor` は、executor と reporter を分ける構成で使う前提で、result の記入を reporter に任せる設計のためである。runner は `result incomplete or frontmatter changed despite exit 0` で blocked にした（result は `status: blocked` のまま、`_TODO_` が 5 件残った）。

register 由来と schedule 由来のタスクは `agent_pipeline` で実行できるが、成果物の review を plan から reporter 付きで実行する手段がない。

## 2. 完了条件

- `exec plan --deliverable <localId> --mode review` で生成した plan を、`exec run --plan` で executor と reporter の構成（例: `--executor-by` と `--reporter-by`）で実行できる。または、成果物の review を executor と reporter の構成で実行する別の手段がある。どちらにしたかと、その理由を対応結果に記録する。
- 上記の経路で review を 1 件実行し、reporter が result を新しい書式（評価結果の確認、判断根拠、改善指示、verdict）で記入することを確認している（PJR-KCMH の試行で確認できなかった部分）。
- `--by` に pipeline 用の executor（result を書かない）を指定した場合に、result 未記入の blocked ではなく、構成の誤りとして分かるメッセージで拒否する、または reporter 付きの実行へ導く。
- テストがあり、`npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                                            | 担当 | 状態 | メモ                                                              |
| --- | --------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------- |
| 1   | plan からの実行で agent_pipeline を使えるようにする方式を決める | DEV  | done | `--executor-by` / `--reporter-by` で既定の 2 stage を合成する方式 |
| 2   | 実装とテスト                                                    | DEV  | done | `resolveInPlaceAgentPipeline` と単体テストを追加                  |
| 3   | review を 1 件実行して result を確認する                        | DEV  | open | agent 実行を伴うため人間または orchestrator が実施する            |

## 4. 対応結果

- 方式: `exec run --plan`（および `exec run --deliverable`）に `--executor-by` / `--reporter-by` を指定したとき、既定の executor/reporter 2 stage の `agent_pipeline` を合成し、既存の in-place pipeline（executor evidence、親 runner 検証、reporter による result 描画）で実行する。別の実行経路を新設しなかった理由は、in-place 実行が `agent_pipeline` を持つタスク向けの 2 stage 処理を既に持ち、不足していたのは plan 由来のタスクに `agent_pipeline` を与える手段だけだったためである。
- 片方の stage だけを指定した場合、もう一方は `stage_role` による自動選択で決まる。reporter が scaffold 済み result を記入するため、`--plan` では frontmatter に `task_id` を持つ plan を必須とし、持たない plan は実行前にエラーにする。`--by` との併用もエラーにする。
- `--by` に `stage_role: executor` / `stage_role: reporter` の agent を指定した場合は、result 未記入の blocked にせず、`--executor-by` / `--reporter-by` を使うよう案内するエラーで実行前に拒否する。
- 変更ファイル: `src/exec-run.ts`、`tests/src/exec-run-resolve-command.test.ts`、`docs/ja/specdojo/guides/exec-operation-guide.md`、`docs/ja/specdojo/references/command-reference.md`。
- 確認: 試行の review plan（`stsd-register-entry-20260928T093919Z-6fd7-plan.md`）で `--executor-by claude-expert-review-executor --reporter-by claude-reporter --dry-run` が executor と reporter を解決することを確認した。`--by claude-expert-review-executor --dry-run` は案内付きエラーで終了コード 1 になった。
- 未確認: review を実際に 1 件実行し、reporter が新しい書式で result を記入することの確認（作業内容 No.3）。agent 実行を伴うため、本タスクの executor では実施していない。

## 5. 関連ドキュメント

- PJR-KCMH（試行を行った項目）、PJR-N22N（review テンプレートの改訂）
- [[specdojo:review-guide]]
- `docs/ja/projects/prj-0001/execution/exec/results/stsd-register-entry-20260928T093919Z-6fd7-result.md`（試行で blocked になった result）
