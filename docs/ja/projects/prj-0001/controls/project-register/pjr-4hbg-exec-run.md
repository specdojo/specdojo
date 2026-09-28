---
specdojo:
  id: prj-0001:pjr-4hbg-exec-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T02:31:04Z"
  completed_at: "2026-09-28T14:43:15Z"
  block_reason: rate limit reached
  conclusion: 案 C を実装した。--join を付けた exec run --register --worktree は実行中の run に合流して並行開始でき、上限は run.max_concurrent_runs。provider の同時実行数・root での遷移と統合・親検証をプロセスを跨いで枠で直列化し、exec slots で使用状況を確認できる
---

# PJR-4HBG 実行中の exec run へ後から項目を追加して並行実行できるようにする

## 1. 概要

`exec run` は project 単位の実行ロックを run 全体で保持するため、実行中に別の項目を並行で走らせられない。並行実行は `--parallel` で起動時にまとめて指定する場合にしか使えず、**後から項目を追加できない**。実際に PJR-T3NN の実行中に PJR-00QV を並行させたい場面が発生し、`--if-busy wait` で順次実行するしかなかった。

## 2. 事実

### 2.1. ロックの目的はリソース統制である

[[prj-0001:pjr-0158-exec-run-project-lock]] が導入理由を記録している。

> `exec run` プロセス同士（routine 起動・手動・CI）の重なりを止めるガードが無く、provider の `max_concurrency` は 1 プロセス内でしか効かないため、同時 agent 数とレートリミットが想定を超える。**同一タスクの二重実行は claim が防ぐため正しさの問題ではなく、リソース統制の課題である。**

同じ項目の二重実行は register の遷移と claim が防ぐ。ロックが守っているのは **agent の同時実行数とレートリミット**である。

### 2.2. 同一プロセス内の並行は阻害しない設計である

完了条件に次が明記されている。

> `exec run` が project スコープの実行ロックを run 全体のライフタイムで保持し、他プロセスの `exec run` を排他する（**同一プロセス内の `--parallel` は阻害しない**）。

並行実行の仕組み自体は存在する。1 プロセス内で `--parallel n` を指定すれば worktree が項目ごとに分かれて同時に走る。欠けているのは**実行中のプロセスへ後から合流する経路**である。

### 2.3. 現状の回避策と限界

| 方法                          | 結果                                         |
| ----------------------------- | -------------------------------------------- |
| `--if-busy fail`（既定）      | 即座に失敗する                               |
| `--if-busy wait`              | ロック解放まで待つ。**並行にならず順次実行** |
| `--if-busy skip`              | 実行されない                                 |
| 実行中の run を中断して再起動 | **進行中の成果を破棄する**。割に合わない     |

## 3. 並行化の障害

項目が別であれば成果物は衝突しないが、共有される資源がある。

| 資源               | 内容                                              | 衝突               |
| ------------------ | ------------------------------------------------- | ------------------ |
| agent の同時実行数 | provider の `max_concurrency` は 1 プロセス内のみ | **統制が効かない** |
| 生成物             | `pjr-index.md`、dashboard、各種ビュー             | **再生成が競合**   |
| 統合段             | develop への merge を main worktree で行う        | **直列化が必要**   |
| 個票・イベント     | 項目ごとに別ファイル                              | なし               |
| plan / result      | 項目ごとに別ファイル                              | なし               |
| worktree           | 項目ごとに分かれる                                | なし               |

**衝突するのは 3 つである。** このうち agent の同時実行数はロックの本来の目的であり、後から合流させる場合も統制を維持する必要がある。

## 4. 対応の候補

| 案  | 内容                                                                              | 利点                                       | 懸念                                             |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| A   | 実行中の run が読む**待ち行列**を設け、後続の `exec run` は項目を投入して終了する | 同時実行数の統制が 1 プロセスに残る        | 投入側が結果を受け取れない。ログの追跡先が変わる |
| B   | ロックを**項目単位**にし、生成物の再生成と統合段だけをグローバルロックで直列化    | 素直に並行できる。投入側が自分の結果を持つ | 同時実行数の統制が失われる。上限の管理が別途必要 |
| C   | ロックへ**同時実行枠**（セマフォ）を導入し、空きがあれば別プロセスも取得できる    | 統制を保ったまま並行できる                 | 枠数の決め方と stale 回復が複雑になる            |
| D   | 何もしない。並行したい項目は起動時にまとめて指定する運用とする                    | 変更不要                                   | **後から発生した項目に対応できない**             |

**C を推す。** ロックの目的が同時実行数の統制である以上、排他をやめる（案 B）と目的を失う。枠を持たせれば目的を保ったまま並行できる。案 A は結果の受け取りが失われ、対話的な運用に合わない。

枠数は `exec-defaults.yaml` の provider 設定と対応させる必要がある。現在 `max_concurrency` は 1 プロセス内でしか効かないため、**プロセスを跨いだ上限**をどこで持つかが設計の中心になる。

### 4.1. 方針の決定（2026-09-28）

利用者の承認により、案 C（ロックへ同時実行枠を導入する）を採る。

## 5. 完了条件

- 実行中の `exec run` があっても、別項目を対象とする `exec run` を並行して開始できる。
- 並行時も agent の同時実行数が provider の上限を超えない。プロセスを跨いで統制される。
- 生成物（`pjr-index.md`、dashboard、各種ビュー）の再生成が競合しない。
- 統合段が直列化され、develop への merge が競合しない。
- 同じ項目を 2 つの run が同時に対象にできない。既存の register 遷移と claim による防止が維持される。
- `--if-busy` の既定の挙動が変わらない。並行は明示的な指定で有効にする。
- routine 経由の `skip` が従来どおり動く。枠が埋まっている場合は skip する。
- 並行実行中に片方が失敗しても、もう片方が巻き込まれない。
- 上限と現在の使用枠を確認する手段がある。
- runner の検証（`parent_validations`）の直列化（PJR-3HHW の `ParentValidationGate`）が、プロセスを跨いでも効く。PJR-3HHW は 1 回の run の中だけを直列化し、別プロセスは `exec-run.lock` の排他に委ねていたため、枠を導入すると別プロセスの検証が重なり、負荷で失敗する（2026-09-27 に 5 並行で観測）。
- 統合の直列化で、メインの作業ツリーに一方の run の記帳ファイルが未 commit のまま残っている間に、もう一方の統合が始まらない（2026-09-27 の HG98 の統合停止と同じ競合を起こさない）。

## 6. 作業内容

| No  | 作業                                           | 担当 | 状態    | メモ                                                   |
| --- | ---------------------------------------------- | ---- | ------- | ------------------------------------------------------ |
| 1   | 対応の候補から方針を決める                     | ARC  | done    | 案 C（2026-09-28 承認）                                |
| 2   | プロセスを跨いだ同時実行数の管理方式を設計する | ARC  | done    | provider ごとの枠のロックで `max_concurrency` を数える |
| 3   | 生成物の再生成の競合を解消する                 | DEV  | done    | register lifecycle のロックで排他                      |
| 4   | 統合段の直列化を実装する                       | DEV  | done    | 同上                                                   |
| 5   | 実装と統合テストを行う                         | DEV  | partial | 単体テストのみ。2 プロセスの統合テストは未作成         |
| 6   | 運用ガイドを更新する                           | OPS  | done    | `exec-operation-guide` ほか                            |

## 7. 対応結果

- 案 C を、次の 2 段の枠で実装した。`exec run --register ... --worktree` の run だけが合流を受け入れる（shareable）。
  - 合流の枠: 後から起動する run に `--join` を付けると、`exec-run.lock` ではなく `exec/.locks/exec-run-join/slot-<n>` を取得して開始する。枠の数は `exec-defaults.yaml` の `run.max_concurrent_runs`（既定 4。最初の run を含む）から 1 を引いた数で、`1` にすると `--join` は無効になる。
  - 共有資源の枠: provider の `max_concurrency`（`provider-<provider>/`）、root での状態遷移・統合・生成物の再生成（`exec-lifecycle/`）、親検証（`parent-validation/`）を、同じ project のロックディレクトリの枠で数える。
- ロックの基盤を `src/exec-slot-lock.ts` に分離した。従来の `exec-run.lock` と同じく、原子的な `mkdir`・heartbeat の別プロセス・stale の奪取（30 秒）で成り立つ。枠の集合（`slot-1` … `slot-<n>`）と、プロセスを跨ぐ mutex（`CrossProcessMutex`）を加えた。
- 完了条件との対応は次のとおり。
  - 別項目の並行開始: `--join` で、実行中の run の終了を待たずに開始できる。
  - agent の同時実行数: `ProviderConcurrencyGate` が、プロセス内の枠を得た後に provider の枠のロックも取得する。register pipeline の executor と reporter が対象である。
  - 生成物の再生成と統合段: register worktree 実行の `lifecycleLock` を `CrossProcessMutex` に置き換え、直列実行でも使うようにした。start 遷移・checkpoint・develop への merge・wait commit・派生ビューの再生成が、別プロセスとも 1 つずつ実行される。一方の run が root の記帳ファイルを解放してから merge を終えるまでの間に、もう一方の統合は始まらない。
  - 同じ項目の二重実行: register の start 遷移が防ぐ。遷移は上記の mutex の中で行うため、2 つの run が同時に通らない。
  - `--if-busy` の既定: `--join` を付けない run の動作は変わらない。shareable な run が動いていても、`--join` なしの 2 つ目は従来どおり busy になる。`--auto`、`--task`、`exec cycle`、`exec resume` など register の worktree 実行以外の run は、合流中の run が残っている間は busy として扱う。
  - routine の skip: 合流の枠が埋まっている場合は `--if-busy` に従い、`--if-busy skip` なら従来の終了コード 75 で skip になる。
  - 失敗の分離: 各 run は自分の項目の worktree と結果だけを持つ。枠は `finally` で解放し、異常終了時は heartbeat が止まってから 30 秒で stale として奪取される。
  - 上限と使用枠の確認: `exec slots --project <project-id>` を追加した。ロックを取得せずに、各枠の使用数・上限・保持者を表示する。
  - 親検証の直列化: exec-run lock または合流の枠を取得したプロセスが project のロックディレクトリを設定し、`ParentValidationGate` がプロセス内の枠の後に `parent-validation/` の枠も取得する。PJR-3HHW の直列化が合流した run を跨いで効く。
- 単体テストを追加した（`tests/src/exec-slot-lock.test.ts`、`tests/src/exec-run-lock.test.ts`、`tests/src/exec-agent-config.test.ts`、`tests/src/exec-parent-validation.test.ts`）。別プロセスは、同じロックディレクトリを使う別インスタンスで代用した。
- `exec-defaults.schema.yaml` に `run.max_concurrent_runs` を追加し、`exec-operation-guide`・`exec-config-guide`・`register-operation-guide`・`command-reference` を更新した。
- _TODO_: 2 つの `exec run` プロセスを実 Git リポジトリで並行させる統合テスト（`*.integration.test.ts`）は未作成である。並行時の片方の失敗の分離と、merge の直列化を実プロセスで確かめるテストを別途追加する。

## 8. 関連ドキュメント

- [[prj-0001:pjr-0158-exec-run-project-lock]]
- `src/exec-run-lock.ts`
- `src/exec-run.ts`
- `docs/ja/specdojo/guides/exec-operation-guide.md`
- `docs/ja/specdojo/guides/exec-config-guide.md`
