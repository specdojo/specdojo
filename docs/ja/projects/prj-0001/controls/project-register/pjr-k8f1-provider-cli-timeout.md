---
specdojo:
  id: prj-0001:pjr-k8f1-provider-cli-timeout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
