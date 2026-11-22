---
specdojo:
  id: prj-0001:pjr-39ab-sysd-cross-cutting-policy-conformance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: ARC
  registered_at: "2026-11-15T04:06:04Z"
---

# PJR-39AB 横断ルールの数値の境界と実装状況を照合する（sysd-cross-cutting-policy の Q1・Q2・Q4）

## 1. 課題内容

exec-defaults と実装を照合し、規則ごとに実装済み・未実装・不明を判定する

## 2. 入力

- sysd-cross-cutting-policy を確定するとき、本文の Q1・Q2・Q4 を期限付きの留保とした（indie が 2026-11-15 に承認）。Q3 は非機能要件・運用設計の整備に回す
- Q1: RET-002 の criticality・signal・attempt・backoff・上限到達時の処置。Q2: TIM-001 の経路別 timeout・終了猶予・子プロセス停止。Q4: CFG-003 の項目別の優先順と反映時点、全規則の実装状況

## 3. 影響範囲

| 観点         | 影響                                                                |
| ------------ | ------------------------------------------------------------------- |
| スコープ     | `sysd-cross-cutting-policy` の留保 Q1・Q2・Q4 と、exec の設定と実装 |
| スケジュール | 留保の期限までに照合の結果が要る                                    |
| コスト       | 中（設定と実装を読んで照らす。コードは変えない）                    |
| 品質         | 設計書の数値の境界が実装と食い違っていても気づけない                |
| 関係者       | オーケストレーター、利用者（留保の解消の判断）                      |

## 4. 対応方針

| 項目     | 内容                                                             |
| -------- | ---------------------------------------------------------------- |
| 原因     | 確定の時点で、規則ごとの実装状況と数値の境界を照らしていなかった |
| 対応策   | 設定と実装を照らして規則ごとに判定し、結果と直す案を個票に残す   |
| 依存事項 | なし                                                             |
| 完了条件 | 下の箇条書きのすべてを満たす                                     |

- Q1・Q2・Q4 の規則ごとに、`.specdojo/exec-defaults.yaml` と実装を照らして「実装済み・未実装・不明」に分け、根拠（ファイルと関数、設定のキー）を個票の対応結果の表に書く。
- 数値の境界（attempt・backoff・timeout・終了猶予）は、設計書の値と実装・設定の値を並べて書き、食い違いを示す。
- `sysd-cross-cutting-policy` は ready のため本文は変えず、直す案を個票の対応結果に書く。未実装で直すべきものは、起票の案を書く。
- コードと設定は変えない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

コードと設定は変えず、`.specdojo/exec-defaults.yaml` と `src/` を読んで照合した。`sysd-cross-cutting-policy` の本文も変えていない。判定は「実装済み・未実装・不明」の 3 つに分ける。

### 5.1. Q1: RET-002 の判定

| 観点                              | 判定   | 根拠                                                                                                                                                                                                                           |
| --------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| retry の上限・待機・倍率          | 実装済 | `rate_limit_policy.on_critical.retry`（`max_attempts`・`initial_wait_seconds`・`backoff_multiplier`・`max_wait_seconds`）を `src/exec/run/agent.ts` の `runWithRetry` が読む。provider 別の上書きは `resolveRateLimitPolicy`。 |
| 候補順の `try_next`               | 実装済 | `runWithRetry` 内の `runPass` が候補を優先順に待たずに切り替える。                                                                                                                                                             |
| 上限到達時の `block`              | 実装済 | 全 pass が rate limit のとき `result: "rate_limit"` を返し、呼び出し側が block する。`on_exhausted` の値は読まれず、`block` 固定の動作である。                                                                                 |
| criticality による policy の選択  | 未実装 | `RateLimitPolicy` 型のコメントのとおり `on_non_critical` は互換用で実行時に無視される。非 critical も `on_critical.retry` を使う。設計書の「criticality に応じて policy を選ぶ」と食い違う。                                   |
| quota exhausted・session limit    | 実装済 | `runWithRetry` は両 kind を待機ループに入れず返す。`limit.ts` の cooldown は `rate_limit` のみ設定される。                                                                                                                     |
| signal 判定と誤検出防止           | 実装済 | `limit.ts` の `limitKind`、`rate_limit_detection`（`exit_codes: []`、`stderr_requires_nonzero_exit` 既定 true）。provider 別の上書きもある。                                                                                   |
| 入力別動作の回帰テスト            | 不明   | `tests/src/exec/limit.test.ts` と `pinned-rate-limit.test.ts` は確認した。`runWithRetry` の backoff 到達と `max_attempts` 境界を直接検証するテストは、検索で見つからなかった。                                                 |
| 汎用 `exit 1` の非判定（RET-001） | 実装済 | 共通既定は `exit_codes: []`。claude・opencode は pattern のみ。                                                                                                                                                                |

#### 5.1.1. 数値の境界（設計書と実装・設定の対比）

設計書は具体値を持たず「正本の上限」へ委ねている。設定の値と実際の動作を並べる。

| 項目                      | 設計書               | `exec-defaults.yaml` の値                           | 実装の動作                                                                                          | 食い違い                                                                                                   |
| ------------------------- | -------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| attempt の数え方          | 有限の attempt       | `max_attempts: 3`（グローバル・opencode とも）      | 1 回目の pass を 1 と数え、全候補を試す pass が `max_attempts` 回まで。待機は pass 2 以降の前だけ。 | 返り値の `attempts` は候補ごとの起動回数で、`max_attempts` の数え方（pass）と単位が違う。                  |
| backoff（グローバル）     | 待機上限を要求       | 60 秒、倍率 3、上限 600 秒。コメントは 60→180→540   | 待機は 60 秒と 180 秒の 2 回。540 秒は `max_attempts: 3` では使われない。                           | コメントの 3 段目が実行されない。                                                                          |
| backoff（opencode）       | 同上                 | 120 秒、倍率 2、上限 600 秒。コメントは 120→240→480 | 待機は 120 秒と 240 秒の 2 回。480 秒は使われない。                                                 | 同上。                                                                                                     |
| 一時 rate limit の再開    | 根拠のある時刻が要る | `cooldown_seconds.rate_limit: 900`                  | reset・retry-after がないとき 900 秒を再開時刻に使う（`limit.ts` の `cooldown_policy`）。           | 設計書の「推測の再開時刻は自動再開しない」と、cooldown を「明示 cooldown」とみなす扱いの境界が文書にない。 |
| in-process 待機（pinned） | 記載なし             | `pinned.max_wait_seconds` 未設定                    | 既定 8 時間（`DEFAULT_PINNED_RATE_LIMIT_MAX_WAIT_SECONDS`）。                                       | 設計書にない上限値。名前指定の agent だけに適用される。                                                    |

### 5.2. Q2: TIM-001 の判定

| 経路                           | 判定   | timeout・猶予の値と根拠                                                                                                                                                                                                             |
| ------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| provider CLI（`executeAgent`） | 未実装 | `src/exec/run/agent.ts` の `executeAgent` は `spawn` したあと `close` を待つだけで、時間上限も打切りもない。`shell: true` で起動し、子プロセスの停止処理もない。設定キーもない。                                                    |
| 親検証（`parent-validation`）  | 実装済 | `src/exec/parent-validation.ts` の定義ごとに `timeoutMs: 10 * 60 * 1_000`（10 分）。到達時は SIGTERM、`VALIDATION_KILL_GRACE_MS` = 10 秒後に SIGKILL、さらに `VALIDATION_CLOSE_GRACE_MS` = 5 秒。プロセスグループへ送る。           |
| command Job の step            | 実装済 | `src/job/job.ts` の `executeJobCommand`。`timeout_seconds`（1〜2147483 の整数、`src/job/definition.ts`）。SIGTERM 後 1 秒で SIGKILL。時間切れは `deferred`（`job-sequence.ts`）で成功扱いにしない。上限が任意で、未指定なら無期限。 |
| Git の一時競合                 | 実装済 | `src/shared/git.ts`: `index.lock` は 1.5 秒間隔で 10 回、以降 5 秒間隔、全体は `run.git_index_lock_wait_seconds`（既定 20 分）。一時失敗は 2・5・10 秒の 3 回。                                                                     |
| scheduler lock の取得          | 実装済 | `--lock-timeout-ms` 既定 10000 ms、`--lock-stale-ms` 既定 300000 ms（`src/exec/core.ts`）。内部の呼び出しは 10 秒を固定で渡す。                                                                                                     |
| Routine 起動からの実行         | 不明   | Routine 固有の timeout 設定は `src/` で確認できなかった。Routine が呼ぶ経路（agent・Job）の上限に従うと見たが、Routine 側の上限は読み切っていない。                                                                                 |

#### 5.2.1. 数値の境界

| 項目                 | 設計書                         | 実装・設定                                    | 食い違い                                                                                           |
| -------------------- | ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 終了猶予             | 「強制終了の猶予」は Q2 待ち   | 親検証 10 秒 + 5 秒、Job 1 秒、いずれも定数   | 経路ごとに値が違い、設定で変えられない。設計書に値の正本がなく、猶予の差の理由が記録されていない。 |
| 上限の設定可否       | 設定キー・値・単位を対応させる | 親検証は定数、Job は定義ごと、provider は無し | provider CLI だけ上限が存在せず、設計書の「無期限の占有を防ぐ」を満たさない。                      |
| 打切り後の子プロセス | 終了と保存状態を確認する       | 親検証と Job はグループ送信。provider は無し  | provider の `shell: true` 起動は孫プロセスが残りうる。                                             |

### 5.3. Q4: CFG-003 と全規則の判定

#### 5.3.1. CFG-003 の項目別の優先順と反映時点

| 項目                              | 判定   | 優先順・反映時点と根拠                                                                                                                                                 |
| --------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 起動する agent（`--by` ほか）     | 実装済 | 「単体指定（`--by`）＞ mode 別（`--edit-by` / `--review-by`）＞ 自動選択」。`command-reference` に記載。                                                               |
| 統合先ブランチ                    | 実装済 | 「run の指定 → `repos[].integration_branch` → 現在のブランチ」。`specdojo-config-reference` に記載。                                                                   |
| rate limit の動作                 | 実装済 | `--on-rate-limit`（未指定なら routing の `on_rate_limit`、`register-core.ts`）。検出と policy は provider 別が全体既定を丸ごと置き換える（`resolveRateLimitPolicy`）。 |
| project / ローカル設定            | 実装済 | `.specdojo/specdojo.local.config.json` は許可リストのキーだけ共有設定を上書きする（`src/shared/specdojo-config.ts`）。`specdojo-config-reference` の「ローカル設定」。 |
| scheduler lock・index.lock の待機 | 実装済 | CLI の `--lock-timeout-ms` 既定 10000、`run.git_index_lock_wait_seconds` を `configureIndexLockWait` で process に反映。不正値は起動前に拒否する。                     |
| 環境変数                          | 不明   | `SPECDOJO_PROJECT`・`SPECDOJO_ACTOR`・`SPECDOJO_EXECUTION_PATH` などを読むが、CLI 指定との優先順を項目ごとに記した正本は見つからなかった。                             |
| 反映時点（実行中の設定変更）      | 不明   | `exec-defaults.yaml` は run の開始時に読み込むと見たが、実行中の変更を既存 run へ適用しない旨の記述を設定リファレンスで確認できなかった。                              |

#### 5.3.2. 全規則の実装状況

| Rule ID          | 判定   | 根拠（ファイル・キー）                                                                                                                                |
| ---------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| EXE-001、EXE-002 | 実装済 | `src/exec/run/` の runner、`.claude/agents/`、mode 別の settings（`exec-defaults.yaml` の `command_template`）、commit 許可リスト。                   |
| SEL-001          | 実装済 | `src/exec/agent-plan.ts`、`agent-config.ts`、`frontier` は `command_params.by_proficiency`。                                                          |
| CFG-001          | 実装済 | `providers.<provider>.command_template`・`command_params`（`claude` の `by_proficiency.frontier: {}` を確認）。                                       |
| CFG-002          | 不明   | 秘密情報の検査は `tools/check-evidence-secrets.mjs` が evidence を対象にする。設定・文書全体への secret scan の実在は確認できていない。               |
| STA-001、STA-002 | 実装済 | `src/exec/events.ts`、`execution/exec/events/` の 1 event 1 JSON。reopen の検査の詳細は読んでいないため、実装済みの根拠は event 保存までとする。      |
| RET-001          | 実装済 | `src/exec/limit.ts`、`rate_limit_detection`。                                                                                                         |
| RET-002          | 一部   | 上の 5.1 のとおり。criticality の切り替えは未実装。                                                                                                   |
| RET-003          | 実装済 | `limit.ts` の `resume_source`（`provider_reset`・`retry_after`・`cooldown_policy`）。再開時の排他の検査は読んでいない。                               |
| GIT-001、GIT-002 | 実装済 | `src/exec/worktree-*.ts`。                                                                                                                            |
| GIT-003          | 実装済 | `src/shared/git.ts` の `runGitWithTransientRetry`。                                                                                                   |
| GIT-004          | 実装済 | `src/shared/git-environment.ts`、`src/exec/agent-git-state.ts`、`tests/src/shared/git-environment-isolation.test.ts`。                                |
| SEC-001          | 不明   | `.specdojo/claude/settings.<mode>.json` と copilot の許可リストは確認した。branch protection と緊急権限の監査証跡は `src/` の外で、確認できていない。 |
| SEC-002          | 実装済 | `src/exec/agent-protected-config.ts`、`worktree-ops.ts`。                                                                                             |
| ERR-001          | 不明   | 失敗の分類は断片的にある（保護違反・利用制限）が、5 分類を共通に示す仕組みは見つからなかった。                                                        |
| IDM-001          | 不明   | register の checkpoint と Job のロック（`src/exec/run/job-lock.ts`）はあるが、同一論理処理の識別を全経路で確認していない。                            |
| TIM-001          | 一部   | 上の 5.2 のとおり。provider CLI は未実装。                                                                                                            |
| LOG-001          | 一部   | `src/routine/failure.ts`、`tools/check-evidence-secrets.mjs`。stdout・stderr の保存前の秘匿化は確認できていない。                                     |
| TRC-001          | 不明   | plan・result・run ディレクトリの識別子はあるが、並列二実行の混在防止の検証を確認していない。                                                          |
| CFG-003          | 一部   | 上の 5.3.1 のとおり。環境変数の優先順と反映時点は不明。                                                                                               |
| MOD-001          | 実装済 | `npm run check:src-imports` と ESLint の `no-restricted-imports`。                                                                                    |

### 5.4. 直す案と起票の案

`sysd-cross-cutting-policy` は ready のため本文は変えない。次を起票または修正の案とする。

| 案                                                                                 | 種別   | 内容                                                                                                                                                                 |
| ---------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| provider CLI に timeout を設ける                                                   | issue  | `executeAgent` に上限と SIGTERM→SIGKILL のプロセスグループ停止を入れる。設定キーは provider 別の `exec-defaults.yaml` に置く。TIM-001 の最優先で、値は人間が決める。 |
| `on_non_critical` の扱いを決める                                                   | change | 実装は互換用で無視している。設計書の記述を合わせるか、criticality 別の policy を実装するかを decision で決める。                                                     |
| backoff のコメントと `max_attempts` の対応を直す                                   | issue  | 3 段目（540・480 秒）が到達しない。`max_attempts` を 4 にするか、コメントを実際の 2 回の待機に直す。attempt の単位（pass と候補）も揃える。                          |
| `runWithRetry` の境界テストを足す                                                  | issue  | 上限到達で `block`、quota・session の即返却、待機の倍率と上限の cap を検証する。                                                                                     |
| 環境変数・反映時点の正本を作る                                                     | issue  | CFG-003 の項目別の表を `specdojo-config-reference` へ足す。実行中の設定変更を既存 run へ適用しない旨も書く。                                                         |
| 不明の規則（CFG-002・ERR-001・IDM-001・LOG-001・TRC-001・SEC-001）を個別に照合する | issue  | 本タスクは `exec-defaults.yaml` と retry・timeout・設定の経路を読んだ範囲で判定した。残りは規則ごとの確認タスクを Schedule へ接続する。                              |

### 5.5. 迷った点と決めた内容

- 「一部」は設計書の MUST の一部だけが実装されているものに使い、判定の 3 分類の補足として併記した。
- `on_exhausted` は型が `"block"` 固定で値が読まれないため、実装済みの動作と判定した。
- Routine の timeout は読み切れず「不明」とした。実装済みと推定しない。
- 環境変数の優先順とテストの有無は、検索で見つからないものを「不明」とし、無いと断定しない。

### 5.6. CHANGELOG に書く事項

なし。

### 5.7. 確認結果

- コード・設定・`sysd-cross-cutting-policy` は変更していない。
- `npm run lint:md` は親の検証で実行される。

## 6. 関連ドキュメント

- [[sysd-cross-cutting-policy|システム設計横断ルール]]
- [[specdojo:specdojo-config-reference|設定リファレンス]]
- [[specdojo:command-reference|コマンドリファレンス]]
