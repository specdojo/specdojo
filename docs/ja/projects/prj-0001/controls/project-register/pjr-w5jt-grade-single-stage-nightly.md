---
specdojo:
  id: prj-0001:pjr-w5jt-grade-single-stage-nightly
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-18T13:12:31Z"
  due_on: "2026-09-25"
  completed_at: "2026-09-21T02:45:48Z"
---

# PJR-W5JT grade を codex 単段にし定期実行を夜間へ寄せる

## 1. 概要

grade は gemma（1・2 段）→ codex-expert（3 段、1・2 段が pass かつ 96 点以上のときだけ）の 3 段構成で運用してきたが、実測で 1・2 段目が門番として機能していない。

| 観点           | 実測                                                                                                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 所要時間       | gemma 1 段 平均 688 秒 × 2 = 約 23 分。codex 3 段目は平均 363 秒。文書あたり 29 分 → 6 分に短縮できる                                                                                                      |
| 判定の質       | gemma は前回の finding を現在内容と照合せず再掲する（`cdfd-orchestrator` / `cdfd-overview`、2026-09-18）。逆に本質的な major を見落として 100 を付ける（`cdfd-do` 100 → codex 95、`cdfd-action` 100 → 81） |
| 3 段目の到達率 | gemma が低く誤判定した文書は codex に評価されないままその点数で確定する                                                                                                                                    |

また定期実行が 0 / 8 / 16 時（Kata）と 6 時（成果物）で、8・16 時は日中の `exec run --register` と衝突し `exec busy` で skip されるか、逆に register の実行を妨げていた。

### 1.1. 決定事項

- grade パイプラインを codex-expert 単段（executor `codex-expert-executor`、reporter `gemma-reporter`）にする。条件付きの 3 段目は廃止する。
- 定期実行は夜間に寄せる。`rtn-grade-deliverable-recheck` は 0:00（上限 10 件）、`rtn-grade-recheck`（Kata）は 2:00（上限 15 件）。cron の `routine run --due` は 0 / 2 / 5 時とする（5 時は PJR-2JYE の dashboard 更新用）。
- `missed_run` は `skip` にする（決定者 ARC、2026-09-18）。container が夜間に停止していた場合は翌起動時に実行せず、翌夜に拾う。変更済み文書が日中に評価されて register の実行と衝突することを避ける。
- `grade apply` の忠実性検証、`content_hash`、finding の挿入、pipeline state による再開は現行どおり維持する。

## 2. 完了条件

- `tools/grade/run-per-document.sh` に `--stages <n>`（既定は現行の 3、`1` で単段）があり、単段では stage 1 を codex-expert-executor / gemma-reporter で実行し、条件付き 3 段目を持たない。
- 既存の `pipeline-state.json`（`stage_total: 3`）を持つ文書が、単段への変更後に誤って incomplete 扱いにならない（`content_hash` が一致していれば完了とみなす）。
- `job-grade-kata` / `job-grade-deliverable` が `--stages 1` で起動し、`results.tsv` と job run の analysis が単段でも成立する。
- `rtn-grade-deliverable-recheck` が `0 0 * * *`・limit 10、`rtn-grade-recheck` が `0 2 * * *`・limit 15、両方 `missed_run: skip` になっている。
- `.devcontainer/specdojo-routine.cron` が 0 / 2 / 5 時に `routine run --due` を呼ぶ。
- 単体テストで `--stages 1` の分岐と、`stage_total` が異なる既存 state の扱いが検証されている。
- `docs/ja/specdojo/guides/routine-operation-guide.md` と grade 関連の guide / command-reference が単段構成と夜間実行に更新されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                       | 担当 | 状態 | メモ                                                           |
| --- | ---------------------------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------- |
| 1   | `run-per-document.sh` に `--stages` を追加し、単段の分岐と既存 state の互換を実装・テストする              | DEV  | done | codex-expert-executor / gemma-reporter / worktree              |
| 2   | job 定義 2 件を `--stages 1` に変更し、guide / command-reference を更新する                                | DEV  | done | 作業 1 と同一タスク                                            |
| 3   | routine 2 件の cron・limit・`missed_run` と cron.d を変更する                                              | OPS  | done | オーケストレーターが直接対応。PJR-2JYE の 5 時追加と整合させる |
| 4   | 単段で `cdfd-orchestrator` / `cdfd-overview` を評価し直し、gemma の再掲 finding が解消されることを確認する | ARC  | done | 作業 1 の後                                                    |

## 4. 対応結果

- `tools/grade/run-per-document.sh` に `--stages 1|3` を追加した。既定の3段構成は互換用に維持し、単段では stage 1 を `codex-expert-executor` / `gemma-reporter` / リファレンスなしで実行して stage 2・3へ進まない。
- 現在本文に対して有効な旧 `stage_total: 3` state は、単段への切り替え時に既存評価を完了済みとして削除する。単段の失敗 state は従来どおり失敗段・連続失敗回数を保存して再開できる。
- `job-grade-kata` と `job-grade-deliverable` を `--stages 1` へ変更し、単段の `results.tsv` を前提とする analysis と新しい冪等キーバージョンへ更新した。
- `rtn-grade-deliverable-recheck` を毎日0時・上限10件、`rtn-grade-recheck` を毎日2時・上限15件へ変更し、両方を `missed_run: skip` とした。routine 本体とスキーマにも `skip` を追加し、現在の cron 分だけを実行対象とする挙動をテストした。
- devcontainer の due runner を0時・2時・5時へ変更し、運用ガイドとコマンドリファレンスを codex 単段・夜間実行・旧 state 移行の説明へ更新した。
- `cdfd-orchestrator` / `cdfd-overview` の実 agent による再評価は、変更を統合して定期 Job の実行環境へ反映した後の運用確認として残す。

### 4.1. 追記（2026-09-19）

初回の 0:00 実行が、直前まで動いていた register の実行（PJR-7WFE）と重なり `exec busy` で skip された。0:00 は日中から続く実行と重なりやすいため、利用者の判断で `rtn-grade-deliverable-recheck` を 1:00、`rtn-grade-recheck` を 6:00 へ移し、cron の `routine run --due` を 1 / 5 / 6 時に変更した（オーケストレーターが直接対応）。5:00 の dashboard 更新（PJR-2JYE）は Kata grade の前になるため、朝の dashboard には前夜の成果物 grade までが反映される。

### 4.2. 追記（2026-09-20）

作業 4 として、gemma の 1・2 段で 96 未満となり codex に届かなかった orchestrator / overview / plan / uc-register を `run-per-document.sh --stages 1 --path` で評価した（`MANUAL-cdfd4-20260920`）。orchestrator 81 → 94、plan 94 → 97、uc-register 95、overview 82 → 77 で、gemma が前回 finding を再掲していた orchestrator の指摘は単段で消えた。夜間の定期実行は 9/20 1:00（成果物 10 件）と 6:00（Kata 8 件）で単段構成のまま完走した。

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]
- [[prj-0001:pjr-2jye-dashboard-daily-briefing]]
- `tools/grade/run-per-document.sh`
- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`
- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`
- `.devcontainer/specdojo-routine.cron`
