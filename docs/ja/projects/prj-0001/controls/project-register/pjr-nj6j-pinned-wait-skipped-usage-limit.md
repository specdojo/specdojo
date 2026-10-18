---
specdojo:
  id: prj-0001:pjr-nj6j-pinned-wait-skipped-usage-limit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T10:24:49Z"
  derived_from:
    - PJR-BHMH
---

# PJR-NJ6J --on-rate-limit wait が codex の usage limit で待たずに止まる

## 1. 課題内容

2026-10-18 19:04 に PJR-8TGQ を --on-rate-limit wait と codex-expert-executor で流したところ、codex が「try again at 11:17 PM」の usage limit を返し、runner は Pinned-agent wait skipped: resume time is invalid or exceeds 28800s を出して待たずに waiting で止まった。解除までは約 4 時間で、待てる上限（28,800 秒）より短い。src/exec/limit.ts の解除時刻の読み取りはこの形に対応しているように見えるため、どこで解除時刻が失われるかを調べて直す

## 2. 影響範囲

| 観点         | 影響                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/limit.ts`（解除時刻の読み取り）、`src/exec/run/agent.ts`（pinned の待機の判定） |
| スケジュール | 高い。夜間の連続実行で、上限の解除を待てずに止まったままになる                            |
| コスト       | 解除の後に人が手で再開する手間                                                            |
| 品質         | `--on-rate-limit wait` を指定しても、待つかどうかが分からない                             |
| 関係者       | exec run の利用者と、夜間の自動実行（PJR-6DHY）                                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 未調査。codex の出力は「You’ve hit your usage limit. ... try again at 11:17 PM.」で、`parseProviderReset` の時刻だけの形に当たるように見える。読み取りに渡る出力、limit の種類の判定、待機の判定のどこで解除時刻が失われるかを調べる |
| 対応策   | 原因を直し、codex の usage limit で解除の時刻まで待って同じ段を再開するようにする                                                                                                                                                    |
| 依存事項 | なし                                                                                                                                                                                                                                 |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                               |

### 3.1. 完了条件

- 2026-10-18 19:04 の PJR-8TGQ の実行で待機が飛ばされた原因を特定し、result に書く（evidence の executor.log と run のログを根拠にする）。
- codex の「You’ve hit your usage limit. ... try again at 11:17 PM.」の出力で、解除の時刻を読み取り、待てる上限（`maxWaitSeconds`）より短ければ待って同じ段を再開する。
- 解除の時刻を読み取れなかった場合と、上限を超える場合とで、ログの文言を分ける（今は「invalid or exceeds」で区別できない）。読み取れなかった場合は、元の出力の該当の行をログに出す。
- 日付をまたぐ場合（23 時台に翌 1 時の解除など）と、AM・PM の 12 時の扱いを単体テストで確かめる。テストは時刻を固定する。
- agy の「Resets in 85h46m36s」のような相対の形も読み取れるかを確かめ、読み取れない場合は対応するかを判断して result に書く。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.0] - 未定` の節に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-bhmh-pinned-agent-rate-limit-policy]]（待機を入れた項目）
- [[prj-0001:pjr-8tgq-agent-members-templates-update]]（待機が飛ばされた実行）
