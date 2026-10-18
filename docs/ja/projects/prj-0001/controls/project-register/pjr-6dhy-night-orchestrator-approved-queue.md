---
specdojo:
  id: prj-0001:pjr-6dhy-night-orchestrator-approved-queue
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-18T00:40:14Z"
  due_on: null
  block_reason: "agent exited with non-zero code: parent validation failed: test-unit"
---

# PJR-6DHY 夜の orchestrator が承認済みの todo の並びを流しきる仕組みを作る

## 1. 概要

段階 B。人が完了条件を承認した個票に印を付け、夜の orchestrator が決まった権限と手順の中で順に流し、見つけた問題は derived_from を付けて承認待ちとして起票し、朝に結果をまとめる。 PJR-3DY1 の決定に基づく

## 2. 完了条件

- PJR-T46Y の完了後に行う。
- 人が完了条件を承認した個票に印（例: frontmatter の `autopilot: approved`）を付けられる。付け方（コマンドか手での編集か）を決めて実装し、[[specdojo:register-operation-guide]] に書く。
- 夜の orchestrator は、印のある todo・issue だけを、決まった権限と手順の中で順に（並行にできるものは並行に）流す。
- 夜の orchestrator は、decision の決定、保護された設定の変更、公開・tag・push、公開済みの CHANGELOG の節の変更、印のない todo の実行、完了条件の範囲を広げることをしない。必要になったら承認待ちとして起票し、次へ進む。
- 問題を見つけて起票するときは `derived_from` で元の項目を記録する。
- 安全のための上限（1 晩で流す件数、失敗が続いたら止める条件、rate limit のときの切り替え）を設定で決められる。
- 朝の報告として、close したもの・`waiting` に戻したもの・新しく起票した承認待ちを 1 つの文書にまとめる。
- routine から夜の決まった時刻に起動できる。本リポジトリでの起動の設定は保護された設定のため、案を result に書き、人が反映する。
- 単体テストか統合テストで、印のない個票を流さないこと、上限で止まることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                                      |
| --- | ---------------------------------------------- | ---- | ---- | ----------------------------------------- |
| 1   | 承認済みの個票を夜に流す orchestrator を加える | DEV  | done | `orchestrator night`、Job、routine を追加 |

## 4. 対応結果

- `register update --autopilot approved` で、承認者・理由を event に残しながら夜間 queue へ入れられるようにした。
- `orchestrator night` は承認済みの `open` todo・issue だけを ID 順に選び、worktree、post-review、並列 wave で実行する。件数、並列数、連続失敗停止、rate limit fallback を設定できる。
- 承認範囲外の操作が必要な失敗は `derived_from` 付き issue として起票し、close、`waiting`、新規承認待ちを朝報告へ集約する。
- `job-night-approved-register` と 2 時（Asia/Tokyo）の `rtn-night-approved-register` を追加した。routine は保護された運用設定を人が確認して有効化するため `enabled: false` のままとした。

## 5. 関連ドキュメント

- [[prj-0001:pjr-3dy1-night-orchestrator-autopilot]]（決定）
