---
specdojo:
  id: prj-0001:pjr-3hhw-serialize-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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
| 1   | `runConfiguredParentValidations` の呼び出しを run 全体の排他で包む  | DEV  | open | reporter の再開時に検証を再実行する経路も対象にする |
| 2   | executor が行う `test-unit` の扱いを確認する（runner 側へ寄せるか） | DEV  | open | QJAD の失敗は `test-unit` だった                    |
| 3   | 待機のログとテストを追加する                                        | DEV  | open | -                                                   |
| 4   | ガイドへ記載する                                                    | DEV  | open | -                                                   |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:exec-worktree-guide]]
- `src/exec-run.ts`（`runConfiguredParentValidations`、`refreshParentValidationsForReporterResume`）
- `vitest.integration.config.ts`
