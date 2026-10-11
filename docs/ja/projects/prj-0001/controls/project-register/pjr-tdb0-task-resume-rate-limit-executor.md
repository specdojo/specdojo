---
specdojo:
  id: prj-0001:pjr-tdb0-task-resume-rate-limit-executor
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T08:55:12Z"
  completed_at: "2026-09-26T13:23:09Z"
---

# PJR-TDB0 task 経路の resume で rate limit 後の executor が再起動しない

## 1. 概要

`exec resume --task <id>` で rate limit 後の executor が再起動しない。再開条件 `canResumeBlockedPipeline` は `executor` を含むが、rate limit 後のタスク状態または `pipeline_state_ref` の meta 書き込みが条件を満たしていない。[[prj-0001:pjr-1y9p-resume-executor-plan]] の統合テスト 1 件を `it.skip` として残しており、本項目で解明する。

## 2. 事実

### 2.1. 症状

`tests/src/exec-pipeline-e2e.integration.test.ts` の `rechecks every plan target when an executor resumes after a rate limit` で、resume 後の executor 呼び出しが観測されない。

```text
invocations=["executor"]   （1 件。期待は 2 件）
```

1 回目の executor（rate limit）だけが記録され、resume で再起動していない。

### 2.2. 再開条件は executor を含んでいる

```typescript
// src/exec-run.ts
const canResumeBlockedPipeline =
  taskState?.state === "blocked" &&
  (blockedPipelineStage === "executor" ||
    blockedPipelineStage === "reporter" ||
    blockedPipelineStage === "integrate") &&
  typeof taskState.meta?.pipeline_state_ref === "string";
```

下流の stage 解決も `executor` を扱える。

```typescript
snapshot.tasks[taskId]?.meta?.pipeline_stage === "reporter"
  ? "reporter"
  : snapshot.tasks[taskId]?.meta?.pipeline_stage === "executor"
    ? "executor"
    : undefined;
```

`pipelineFailureStage` の初期値は `"executor"` であり、`pipelineRecoveryMeta` は `pipeline_stage` を書く。**条件は満たされるように見える。**

### 2.3. register 経路では動作している

`src/exec-register-resume.ts` は同等の判定を持ち、[[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] で実際に executor が再起動して 11 分実行された。**経路によって挙動が異なる。**

### 2.4. 未検証の仮説

| 仮説 | 内容                                                                  |
| ---- | --------------------------------------------------------------------- |
| A    | rate limit は `blocked` ではなく deferred limit として別の状態を作る  |
| B    | `pipeline_state_ref` が meta に書かれていない                         |
| C    | `exec resume --due` が rate limit 用の経路で、`--task` は対象外である |

`exec resume --due` と `selectDueDeferredLimitTasks` が存在することは、rate limit が通常の `blocked` と別扱いである可能性を示す。

## 3. 完了条件

- rate limit 後のタスク状態と meta の実際の値が特定されている。
- `--task` 経路で executor が再起動しない理由が説明できている。
- 仕様として正しい挙動が決まっている。`--task` で再開すべきか、`--due` を使うべきかを明示する。
- 再開すべきなら実装が修正され、`it.skip` を外したテストが通る。
- `--due` を使う仕様なら、テストをその経路へ書き換えるか削除し、理由を記録する。
- `exec-operation-guide.md` に rate limit 後の再開手順が記載されている。利用者が `--task` と `--due` を選べる。
- register 経路と `--task` 経路の差異が意図的なものか、揃えるべきかが決まっている。

## 4. 調査の起点

1. rate limit 発生時に書かれる event と meta を実データで確認する。`execution/exec/events/` を見る。
2. `selectDueDeferredLimitTasks` の選択条件を読み、`--task` との関係を確認する。
3. `pipelineRecoveryMeta` が rate limit 経路で呼ばれているかを確認する。

## 5. 作業内容

| No  | 作業                                        | 担当 | 状態   | メモ                                        |
| --- | ------------------------------------------- | ---- | ------ | ------------------------------------------- |
| 1   | rate limit 後の状態と meta を実データで確認 | DEV  | closed | `pipelineRecoveryMeta` がドロップされていた |
| 2   | `--due` と `--task` の役割分担を確認する    | DEV  | closed | 運用ガイドで明示                            |
| 3   | 正しい挙動を決める                          | ARC  | closed | どちらでも再開可能とする                    |
| 4   | 実装またはテストを修正する                  | DEV  | closed | `it.skip` を外し、pass                      |
| 5   | 運用ガイドへ再開手順を記載する              | OPS  | closed | `--task` と `--due` 併記                    |

## 6. 対応結果

- 仮説Bが正解でした。`src/exec-run.ts` の block イベント書き込み処理において、`limitEventMeta` にスプレッド演算子で `pipelineRecoveryMeta` の結果（`pipeline_state_ref` 等）を渡していましたが、`limitEventMeta` 側が `attempts` と `worktree` 以外をドロップする仕様となっていたため、meta に出力されていませんでした。
- 実装を修正し、`limitEventMeta` の結果と `pipelineRecoveryMeta` の結果を個別に展開してマージするように変更しました。
- `tests/src/exec-pipeline-e2e.integration.test.ts` に残されていた rate limit の resume テストの `it.skip` を外してテストが通ることを確認しました。
- `docs/ja/specdojo/guides/exec-operation-guide.md` の「レートリミット対応」に追記し、定時の自動復旧には `--due`、手動の早期再開・動作確認には `--task` が利用できる旨を明記しました。

### 6.1. 評価（2026-09-26）

原因を特定して直し、仕様も明確にした。完了条件をすべて満たす。

| 完了条件                                        | 判定                                              |
| ----------------------------------------------- | ------------------------------------------------- |
| rate limit 後のタスク状態と meta を特定している | 満たす。`pipeline_state_ref` が書かれていなかった |
| `--task` で再起動しない理由を説明できる         | 満たす（下記）                                    |
| 正しい挙動を決めている                          | 満たす。`--task` でも再開する                     |
| `it.skip` を外したテストが通る                  | 満たす。統合テスト 111 件、skip 0 件              |
| ガイドへ再開手順を記載している                  | 満たす。`--due` と `--task` の使い分けを記載      |
| register 経路との差異を判断している             | 満たす。同じ条件で再開する形に揃った              |

### 6.2. 原因

rate limit の block イベントを書く処理で、`pipelineRecoveryMeta` の結果が `limitEventMeta` の**引数の中**へ展開されていた。`limitEventMeta` は知らないキーを捨てるため、`pipeline_state_ref` が meta に書かれず、resume の条件（`pipeline_state_ref` が文字列であること）を満たさなかった。

`limitEventMeta` の結果と `pipelineRecoveryMeta` の結果を、それぞれ外側で展開する形に直した。仮説 A（rate limit が別の状態を作る）と仮説 C（`--task` は対象外という仕様）は当たらなかった。

### 6.3. 私が加えた修正

`it.skip` は外されていたが、テストの前に「executor が再起動しない」という古いコメントが残っていた。現在の内容に合わせて書き換えた。

### 6.4. 検証

| 検証                    | 結果                            |
| ----------------------- | ------------------------------- |
| `typecheck` / `lint:ts` | 通過                            |
| `test:unit`             | 1567 件すべて通過               |
| `test:integration`      | **111 件すべて通過、skip 0 件** |

[[prj-0001:pjr-1y9p-resume-executor-plan]] から持ち越していた統合テストが通った。PJR-1Y9P の網羅の検証が、`--task` 経路の resume でも通しで確かめられた。

## 7. 関連ドキュメント

- [[prj-0001:pjr-1y9p-resume-executor-plan]]
- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- `src/exec-run.ts`
- `src/exec-register-resume.ts`
- `tests/src/exec-pipeline-e2e.integration.test.ts`
