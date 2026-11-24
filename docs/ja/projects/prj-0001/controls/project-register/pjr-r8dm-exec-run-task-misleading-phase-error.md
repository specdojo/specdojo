---
specdojo:
  id: prj-0001:pjr-r8dm-exec-run-task-misleading-phase-error
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T08:16:03Z"
  completed_at: "2026-11-22T02:57:51Z"
  conclusion: exec run --task が、流せないタスクに対し、依存が終わっていない先行のタスク ID や done であることを示して止まるようにした。
  derived_from:
    - PJR-VCER
---

# PJR-R8DM exec run --task が、流せないタスクに段の情報が見つからないという紛らわしいエラーを出す

## 1. 課題内容

依存が終わっていないタスクや done のタスクを --task で指定すると、本当の理由ではなく Cannot resolve phase context ... not found in sch-strategy files と出る

## 2. 入力

- 2026-11-21、T-KATA-WAVE-3-utc-sample-040（依存の T-KATA-WAVE-3-utc-index-sample-080 が未完了）と、done の T-KATA-SLIM-2-prj-overview-040・060・T-KATA-SLIM-2-sch-defaults-040 を exec run --task --dry-run で指定すると、どれも Cannot resolve phase context for ... not found in sch-strategy files で止まった。見出しにタスクの名前も出なかった
- 依存の終わった T-KATA-WAVE-3-tsp-index-sample-040 は、同じ strategy で claim と opus-executor の起動まで dry-run が通った
- メッセージは src/exec/run/schedule-prepare.ts の prepareSingleTask が、agent の候補が無いときに出す

## 3. 影響範囲

| 観点         | 影響                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| スコープ     | `exec run --task` で、流せない状態のタスクを指定したときのエラー                        |
| スケジュール | なし（回避策: `exec status` で状態を確かめる）                                          |
| コスト       | 小さい（runner と CLI の一部の修正）                                                    |
| 品質         | 本当の理由が分からず、調べるのに時間がかかる                                            |
| 関係者       | 利用者のプロジェクト（coderdojo-lessons-specdojo など）と prj-0001 のオーケストレーター |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `src/exec/run/schedule-mode.ts` は、`generated/ready.json` にないタスクの track を、タスク ID を `-` で区切った 2 つ目（`T-KATA-WAVE-3-…` では `KATA`）と推定し、存在しない `sch-track-kata.yaml` を探す。そのため段の情報が引けず、`schedule-prepare.ts` が「Cannot resolve phase context … not found in sch-strategy files」を出す |
| 対応策   | ready にないタスクは、状態（依存が終わっていない・done・doing・cancelled など）を調べ、本当の理由と先行のタスクを示して止める。track は ID の分解ではなく schedule の定義から引く。doing のタスクの再開は今までどおり流せるようにする                                                                                                |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                 |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                                                                                                                                                         |

- 依存が終わっていないタスクを `--task` で指定すると、終わっていない先行のタスクの ID を含むエラーで止まる。
- done のタスクを指定すると、done であることを示すエラーで止まる。
- track の名前に `-` を含むタスク（`T-KATA-WAVE-3-…` など）で、doing のタスクの再開が今までどおり流れる。
- 上の 3 つを単体テストで確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（追加・変更・不具合修正など）と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

### 5.1. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: `exec run --task` が、依存が終わっていないタスクや done・cancelled のタスクに対し、段の情報が見つからないという紛らわしいエラーではなく、先行のタスク ID や done であることを示して止まるようにした。

### 5.2. 解決内容

- `src/exec/run/schedule-mode.ts` に `explainUnrunnableTask` を追加し、`generated/ready.json` にないタスクの状態を調べて本当の理由を出す。依存が未完了なら未完了の先行タスク ID、done・cancelled ならその旨を示して終了コード 1 で止まる。doing・blocked は今までどおり再開できる。
- ready にないタスクの `schedule_file` は、タスク ID の分解より先に schedule の定義から引く。分解は定義が引けないときの代替として残した。
- 単体テスト `tests/src/exec/run/explain-unrunnable-task.test.ts` で、依存未完了・done・track 名に `-` を含む doing の再開を確かめた。

### 5.3. 確認結果

- `npm run typecheck` と `npm run lint:ts`（エラーなし）、追加した単体テストを通した。残りの検証は親 runner が実行する。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
