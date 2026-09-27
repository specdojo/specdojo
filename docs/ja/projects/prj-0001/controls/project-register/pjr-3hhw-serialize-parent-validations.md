---
specdojo:
  id: prj-0001:pjr-3hhw-serialize-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-09-27T02:44:20Z"
---

# PJR-3HHW 並行実行中の runner 検証を同時に走らせないようにする

## 1. 概要

`exec run --register ... --worktree --parallel <n>` では、executor の終了後に各項目の worktree で runner の検証（`pipeline.parent_validations` の `test-integration`、executor が実行する `test-unit` など）が走る。複数項目の executor がほぼ同時に終わると、検証も同時に走る。vitest はそれぞれが複数の worker を起動するため、コンテナ（16 コア、メモリ 11GB）の負荷が高まり、テストが時間切れで失敗する。

2026-09-27 に観測した事実は次のとおり。

- 第 1 回（4 並行）では、E8FY・QJAD・HG98 のうち QJAD と HG98 が `test-integration` の失敗で `waiting` になった。単独で再実行すると 114 件すべて通った。これを受けて、`vitest.integration.config.ts` の `testTimeout` を 30 秒へ延ばした（f6db1d19）。
- 再実行（5 並行）では、executor は 5 件とも成功した。しかし 4 件（QJAD・HG98・06RE・6V3D）が runner の検証で失敗した。QJAD では、単体テスト 1 件（`個票の part_of と pjr-index wikilink が生成された登録台帳へ解決する`）に 116 秒かかった。6V3D は sample 1 ファイルの変更で、単独では統合テストが全件通った。
- 失敗は成果物の内容と関係がなく、並行数に依存する。タイムアウトを延ばすだけでは解消しない。

検証が落ちると reporter の申し送りで `waiting` になり、`--resume` での再開が必要になる。並行実行の利点が失われ、手作業での切り分けも増える。

## 2. 完了条件

- 1 つの `exec run` の中で、runner の検証（`parent_validations`）が同時に 1 本までしか実行されない。または、同時数を設定で制限できる。
- 既定値は、並行実行でも検証を直列に行う値とする。
- 待っている間、どの項目がどの検証を待っているかがログに出る。
- executor と reporter の並行性は維持され、直列化されるのは検証だけである。
- 別々の `exec run` プロセスが同時に動く場合の扱い（直列化の対象に含めるか、対象外とするか）が決まっており、ガイドに記載されている。
- 2 項目以上を並行で実行し、検証が重ならないことを確かめるテストがある。
- `docs/ja/specdojo/guides/exec-worktree-guide.md` または exec 設定ガイドに、検証の直列化が記載されている。
- `npm run test:unit` と `npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                                                |
| --- | ------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------- |
| 1   | `runConfiguredParentValidations` の呼び出しを run 全体の排他で包む  | DEV  | done | reporter の再開時に検証を再実行する経路も対象にする |
| 2   | executor が行う `test-unit` の扱いを確認する（runner 側へ寄せるか） | DEV  | done | QJAD の失敗は `test-unit` だった                    |
| 3   | 待機のログとテストを追加する                                        | DEV  | done | -                                                   |
| 4   | ガイドへ記載する                                                    | DEV  | done | -                                                   |

## 4. 対応結果

- `src/exec-parent-validation.ts` に `ParentValidationGate` を追加した。1 つの `exec run` 内で親検証を同時に実行できる項目数を制限し、待機は到着順に処理する。gate は exec-defaults の設定オブジェクト単位で共有する（`parentValidationGateFor`）。1 回の run では設定オブジェクトが 1 つなので、run 全体の排他になる。
- 同時数は `pipeline.parent_validation_concurrency`（正の整数）で設定できる。省略時は `1` として直列化する。不正値は exec-defaults 読み込み時にエラーになる。schema（`exec-defaults.schema.yaml`）にも項目を追加した。
- `runConfiguredParentValidations` を gate で包んだ。これにより、executor 成功後の追記、reporter 再開前の再実行（`refreshParentValidationsForReporterResume`）、`exec trial` のすべての経路が直列化の対象になる。executor と reporter は gate の外で並列に動く。
- 待機時は `Waiting for parent validation slot: <項目> (<検証 ID>); running: <実行中の項目>` を出力し、枠を得たときは `Parent validation slot acquired: <項目>` を出力する。項目名には evidence の `task_id` を使う。
- executor の `test-unit`: executor が sandbox 内で実行する検証は runner では制御できない。現行の `.specdojo/exec-defaults.yaml` では `test-unit` が `parent_validations` に含まれており、executor には実行させない。この方針をガイドに明記し、設定は変更していない。
- 別プロセスの扱い: 直列化の対象外とした。同じ project の `exec run` は `exec-run.lock` で排他される。別 project の run どうしは調整しない。この判断をガイドに記載した。
- テストを追加した。`tests/src/exec-parent-validation.test.ts` では gate、設定値の検証、待機ログを確認する。`tests/src/exec-run-parent-validation-gate.test.ts` では、3 項目の並列 worker pool で executor が並列のまま検証が重ならないこと、同時数 2 の設定が反映されることを確認する。
- ガイドへの記載: `exec-config-guide.md` の exec-defaults 章と `register-operation-guide.md` の並列実行の説明に追記した。

## 5. 関連ドキュメント

- [[specdojo:exec-worktree-guide]]
- `src/exec-run.ts`（`runConfiguredParentValidations`、`refreshParentValidationsForReporterResume`）
- `vitest.integration.config.ts`
