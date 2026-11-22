---
specdojo:
  id: prj-0001:pjr-k8f1-provider-cli-timeout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: hard
  registered_at: "2026-11-22T12:24:42Z"
  derived_from:
    - PJR-39AB
---

# PJR-K8F1 agent の CLI の起動に時間の上限がなく、固まると run が枠を占め続ける

## 1. 課題内容

executeAgent は provider の CLI を起動したあと終了を待つだけで、時間の上限も打ち切りも子プロセスの停止もない。agent が固まると run と実行枠が無期限に占められる（sysd-cross-cutting-policy の TIM-001）。

## 2. 入力

- PJR-39AB の照合（2026-11-22）: src/exec/run/agent.ts の executeAgent は spawn のあと close を待つだけで、時間上限と打切りがない。shell: true で起動し、孫プロセスを止める処理もない。設定のキーもない。
- ほかの経路は上限がある: 親の検証は 10 分で SIGTERM、10 秒後に SIGKILL。command Job の step は `timeout_seconds` で、SIGTERM 後 1 秒で SIGKILL。
- 39AB の案: 上限と SIGTERM から SIGKILL へのプロセスグループの停止を入れ、設定キーは exec-defaults.yaml の provider 別に置く。上限の値は人が決める。
- 利用者の承認（2026-11-22、indie）で起票した。39AB の直す案 6 件のうち、この 1 件だけを起票する。担当と期限は未定。

## 3. 影響範囲

| 観点         | 影響                                                         |
| ------------ | ------------------------------------------------------------ |
| スコープ     | exec の agent の起動（provider の CLI）と、その設定と schema |
| スケジュール | 固まった agent があると、夜間の列が朝まで進まない            |
| コスト       | 中〜大（起動の処理・設定・テストの変更）                     |
| 品質         | 実行枠が無期限に占められ、ほかの run が待たされる            |
| 関係者       | オーケストレーター、夜間の実行、利用者のリポジトリ           |

## 4. 対応方針

| 項目     | 内容                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| 原因     | `executeAgent` は CLI の終了を待つだけで、時間の上限・打ち切り・子プロセスの停止がない |
| 対応策   | provider ごとの時間の上限の設定と、上限に達したときのプロセスのグループの停止を足す    |
| 依存事項 | なし                                                                                   |
| 完了条件 | 下の箇条書きのすべてを満たす                                                           |

- `exec-defaults.yaml` の provider ごとに、agent の起動の時間の上限のキーを足し、schema を直す。上限の値は人が決めるため、既定は上限なし（今と同じ動き）にする（利用者の決定、2026-11-22、indie）。
- 上限に達したら、起動したプロセスのグループを SIGTERM で止め、猶予の後に SIGKILL で止める。猶予の値と、設定で変えられるかは executor が決める。孫のプロセスが残らないようにする。
- 上限で止めた run は block にし、上限で止めたことと設定のキーを理由に残す。rate limit や接続の失敗と見分けられる。
- 単体テストと、眠り続ける偽の agent を使う統合テストで確かめる。上限なしのときは今までどおり待ち続けることも確かめる。
- `exec-config-guide` と `specdojo-config-reference` に、キーの書き方と動きを書く。
- prj-0001 の `.specdojo/exec-defaults.yaml` は保護された設定のため変えない。値を入れる案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner の動きを変えるため、統合の後にオーケストレーターが JSEY を流して確かめてから close する。

## 5. 対応結果

### 5.1. 実施内容

| 作業                                                      | 状態 | メモ                                                                                                                                                                                                  |
| --------------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| provider ごとの上限のキーと schema                        | done | `providers.<provider>.agent_timeout_seconds`（1〜2147483 の整数）を `ExecDefaultsConfig` と `exec-defaults.schema.yaml` に足した。未指定は上限なし。不正な値は `resolveAgentTimeout` が起動前に止める |
| 上限でのプロセスグループの停止                            | done | 新しい `src/exec/run/agent-timeout.ts` の `waitForAgentExit`。上限ありの起動だけ `detached` で専用 group にし、SIGTERM、10 秒後に SIGKILL。close 後も group に残る孫は SIGKILL で止める               |
| 起動の経路への適用                                        | done | `executeAgent`（`runWithRetry` 経由の executor・reporter）、`src/exec/agent-plan.ts` の起動、`spawnAgentInPlace`（in-place・register・Job の in-place 起動）                                          |
| 上限で止めた run の block と理由                          | done | stderr に `blocked: agent timed out after <秒>s (<キー>)` を出し、`extractBlockReason` はこの行を優先する。rate limit・接続エラーの検出に掛けず、別の agent への切り替えもしない                      |
| 単体テストと統合テスト                                    | done | `tests/src/exec/run/agent-timeout.test.ts`（14 件）と `tests/src/exec/run/agent-timeout.integration.test.ts`（3 件、眠り続ける偽の agent と孫、上限なしで待ち続ける場合）                             |
| `exec-config-guide` と `specdojo-config-reference` の記述 | done | provider のキーの一覧と、動き・例を書いた                                                                                                                                                             |
| prj-0001 の `.specdojo/exec-defaults.yaml` に値を入れる案 | open | 保護された設定のため executor は変えない。下の申し送りの案を人が判断して入れる                                                                                                                        |
| 統合の後の JSEY での確認                                  | open | 完了条件どおり統合の後にオーケストレーターが流す。executor からは実行できない                                                                                                                         |

### 5.2. executor が決めた点

- 猶予は親の検証と同じ 10 秒（SIGTERM から SIGKILL まで）、SIGKILL の後に出力の pipe の close を待つのは 5 秒に固定し、設定のキーは足さない。猶予を変えたい要望が出てから足す方が、キーを増やすより単純なため。
- キーは provider 別だけに置き、全体の既定は置かない。完了条件と 39AB の案が provider 別を求めており、全体の値を足すと既定が上限なしという決定とずれる余地が生じるため。
- 上限なしの起動は従来どおり runner と同じ process group で起動する。専用 group にすると端末の Ctrl-C が届かなくなるため、上限があるときだけ専用 group にし、runner への SIGINT・SIGTERM・SIGHUP は既存の `trackValidationProcessGroup` で転送する。
- 不正な値は上限なしへ戻さず、エラーで止める。誤記で上限が黙って外れるのを避けるため（`run.git_index_lock_wait_seconds` と同じ扱い）。
- Job の in-place 起動は、これまで provider を渡していなかったため、`resolveInPlaceCommand` が返す provider を渡すようにした。

### 5.3. 申し送り

- prj-0001 の `.specdojo/exec-defaults.yaml` に入れる値の案: `providers.claude.agent_timeout_seconds: 7200`、`providers.codex.agent_timeout_seconds: 7200`、`providers.copilot.agent_timeout_seconds: 7200`、`providers.opencode.agent_timeout_seconds: 5400`。根拠は実測ではなく、hard の項目の executor でも 2 時間を超える起動は固まったとみなせるという仮定（_ASSUMPTION_）。人が過去の run の所要時間を見て決める。
- `src/exec/run/job.ts` は変更前から 1,000 行を超えており（ESLint の `max-lines` の warn）、今回 16 行増えた。分割は本件の範囲外とする。

### 5.4. CHANGELOG に書く事項

- 区分: 追加
- 文案: `exec-defaults.yaml` の `providers.<provider>.agent_timeout_seconds` で、agent の CLI の 1 回の起動の時間の上限を設定できるようにしました。上限に達すると、runner は CLI とその子のプロセスを SIGTERM、10 秒後に SIGKILL で止め、run を block にして理由に設定のキーを残します。未設定なら従来どおり上限はありません（PJR-K8F1）。

## 6. 関連ドキュメント

- [[specdojo:exec-config-guide|exec設定ガイド]]: キーの書き方と動きを追記した。
- [[specdojo:specdojo-config-reference|specdojo設定リファレンス]]: `exec_defaults` の説明にキーを追記した。
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: `ProviderOverride` に `agent_timeout_seconds` を足した。
- 起票の元: PJR-39AB。
