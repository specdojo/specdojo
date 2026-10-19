---
specdojo:
  id: prj-0001:pjr-dkd8-reporter-fallback-on-connection-error
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-19T21:41:24Z"
  derived_from:
    - PJR-BHMH
---

# PJR-DKD8 ローカル LLM につながらないとき reporter が切り替わらずに止まる

## 1. 課題内容

2026-10-20 06:33 に PJR-16S0 の reporter（gemma26-reporter）が、ホストの Ollama が止まっていたため Cannot connect to API で失敗し、--fallback-reporter-by claude-reporter を指定していたのに切り替わらずに waiting になった。切り替えは rate limit のときだけ働き、つながらないエラーは対象にしていない

## 2. 影響範囲

| 観点         | 影響                                                                              |
| ------------ | --------------------------------------------------------------------------------- |
| スコープ     | reporter の切り替えの判定（`src/exec/run/agent.ts` などの fallback の処理）       |
| スケジュール | 中。ローカル LLM が止まっていると、executor が通った run も reporter の段で止まる |
| コスト       | 人が reporter を替えて再開する手間                                                |
| 品質         | `--fallback-reporter-by` を指定しても切り替わらない                               |
| 関係者       | ローカル LLM を reporter に使う利用者、夜間の自動実行                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 指名した agent の切り替え（BHMH）は rate limit のときだけ働き、つながらないエラー（`Cannot connect to API`・接続の拒否など）は対象にしていない |
| 対応策   | つながらないエラーも、切り替えの対象にする                                                                                                     |
| 依存事項 | なし                                                                                                                                           |
| 完了条件 | 下記の完了条件を満たす                                                                                                                         |

### 3.1. 完了条件

- `--fallback-reporter-by`・`--fallback-executor-by` を指定した run で、agent がつながらないエラー（opencode の `Cannot connect to API`、`ECONNREFUSED` など）で失敗した場合、指定した代わりの agent へ切り替える。`--on-rate-limit` の指定（wait・fallback・stop）との関係を決めて実装し、理由を result に書く。
- つながらないエラーの文言は、provider の設定（`exec-defaults.yaml` の provider ごとの検出の設定など）で持ち、rate limit の検出と同じ仕組みに寄せる。
- 切り替えたことをイベントと result に記録する（rate limit の切り替えと同じ形）。
- 単体テストで、つながらないエラーで代わりの reporter へ切り替わること、代わりを指定していなければ今までどおり失敗することを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-bhmh-pinned-agent-rate-limit-policy]]（元の項目）
