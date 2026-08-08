---
specdojo:
  id: prj-0001:pjr-4ahz-routine-exec-cycle-sequential-execution
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  based_on:
    - prj-0001:pjr-0136-exec-limit-resume
    - prj-0001:pjr-0158-exec-run-project-lock
---

# PJR-4AHZ routineでexec resumeからautoを順次実行可能にする

## 1. 概要

定時 routine から利用制限で延期された task の再開と Ready task の自動実行を行う際、現行の `exec-resume` と `exec-auto` は別々の routine として起動する必要があり、実行順はファイル名順または発火時刻の差に依存する。時刻をずらす方式では、先行処理が想定時間を超えると後続処理が busy skip され、次回の定時発火まで実行されない。

利用制限 task の再開、Schedule 状態の再計算、`exec run --auto --loop` を1つの定時実行単位として順次処理できる仕組みを追加する。実行全体でproject単位の排他と順序を保証し、再延期、通常失敗、busy、途中終了時の結果と再実行の扱いを明確にする。

## 2. 完了条件

- 1つの routine 定義で、due な利用制限 task の再開、Schedule 状態の再計算、Ready task の `--auto --loop` 実行をこの順で起動できる。
- 順次実行は routine ファイルの列挙順や、複数 routine の cron 時刻差に依存しない。
- project 単位の実行ロックを一連の処理全体で保持し、step 間に手動実行、別 routine、CI の `exec run` / `exec resume` が割り込まない。
- 開始時に project がbusyの場合だけ定義された `skip` / `wait` / `fail` 方針を適用し、自身の後続stepを再入ロックでbusy skipしない。
- due な再開対象が0件でも状態再計算とauto実行へ進む。再開対象が再度rate limitで延期された場合も、依存しないReady taskの実行を継続できる。
- 通常失敗、再延期、対象なし、busy、途中終了を区別し、step単位の結果とroutine全体の結果を追跡できる。失敗時に後続stepへ進むか中断するかの方針が明確である。
- cronの `missed_run` と `overlap`、`routine-state.json` の `last_run` / `last_result` / `last_scheduled_for` が、複合実行の全体結果と整合する。
- 既存の `exec-auto` と `exec-resume` action、`exec run` / `exec resume` の単独利用と互換性を保つ。
- CLI、routine schema、dry-run表示、運用ガイド、サンプル定義に順次実行の設定と意味が反映される。
- 正常系、再開対象0件、再延期、通常失敗、busy、ロック維持、実行順、結果集約を自動テストで確認できる。

## 3. 作業内容

| No  | 作業                                                                             | 担当 | 状態 | メモ                                                                 |
| --- | -------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------- |
| 1   | 順次実行の action / CLI 形式と、stepごとの継続・中断・結果集約ポリシーを設計する | ARC  | done | 専用action `exec-cycle` と `exec cycle` を採用（汎用sequence不採用） |
| 2   | project lockを保持したままresume、refresh、auto loopを順次実行する制御を実装する | ARC  | done | 単一の `withProjectExecRunLock` 内で3 stepを実行                     |
| 3   | 再延期、通常失敗、busy、途中終了時の状態遷移と結果記録を実装する                 | ARC  | done | step単位failure方針とroutine `last_result` を区別                    |
| 4   | routine schema、CLI検証、dry-run表示、既存actionとの互換性を更新する             | ARC  | done | 既存定義・単独コマンドは変更なしで動作                               |
| 5   | 順序、ロック、各終了パターン、cron状態記録の自動テストを追加する                 | ARC  | done | routine層の arg 生成・検証テストを追加                               |
| 6   | 設計書、コマンドリファレンス、運用ガイド、routineサンプルを更新する              | ARC  | done | routine/exec運用ガイド・コマンドリファレンス・サンプルを更新         |

## 4. 対応結果

- 専用 action kind `exec-cycle` と専用コマンド `exec cycle` を新設し、`exec resume --due` → `exec validate` / `exec refresh` → `exec run --auto` を固定順で順次実行する経路を追加した。実行順は routine ファイル名順・cron 時刻差に依存しない。
- `exec cycle` は `withProjectExecRunLock` で project 実行ロックを一連の処理全体で保持する。resume / refresh / auto の各 step は自身でロックを取り直さないため、後続 step が同一実行のロックで busy skip されることはなく、step 間に手動実行・別 routine・CI が割り込まない。
- step 単位の失敗方針を固定した。resume の失敗（再延期含む）は中断せず Ready task の実行を継続し、validate/refresh 失敗は auto step を中止、auto の失敗は記録のみとする。`[cycle] summary: ...` に step 結果を出力し、いずれか失敗で終了コード 1、routine の `last_result` は `failure` を記録する。開始時 busy は `--if-busy skip` で `skipped` として記録する。再開対象 0 件でも状態再計算と auto 実行へ進む。
- routine schema（`routine.schema.yaml`）に `exec-cycle` を追加し、CLI 検証（`parseRoutineDoc`）・dry-run 表示（`buildExecCycleArgs` / `executeRoutine`）へ反映した。既存 `exec-auto` / `exec-resume` / `job` と単独の `exec run` / `exec resume` の互換性は維持している。
- サンプル `rtn-exec-cycle.yaml`、routine 運用ガイド、exec 運用ガイド、コマンドリファレンスへ順次実行の設定と意味を反映した。
- 実装・変更ファイルの詳細は result（`pjr-4ahz-20260808T071701Z-e014-result.md`）を参照。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0136-exec-limit-resume|agent利用制限後の自動再開]]
- [[prj-0001:pjr-0158-exec-run-project-lock|exec runのproject単位実行ロック]]
- [[sysd-agent-settings|エージェント共通設定]]
- [[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:exec-operation-guide|exec運用ガイド]]
- [[specdojo:exec-config-guide|exec設定ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
