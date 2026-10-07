---
specdojo:
  id: prj-0001:pjr-r8wr-parent-validation-failure-output
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-05T22:00:10Z"
  due_on: null
  completed_at: "2026-10-07T10:12:35Z"
  conclusion: 失敗した親検証の stdout / stderr を秘匿処理のうえ各 1MiB まで evidence のログ（parent-validation-output）に保存し、resume ごとに attempt 番号で追記する。要約は先頭と末尾を残して中間を省略する。成功時は要約だけを残す
---

# PJR-R8WR 親検証が失敗したとき、出力の全文を evidence に残し、要約に末尾を含める

## 1. 概要

親検証の出力は evidence に先頭から 1,000 文字までの要約としてだけ保存される（src/exec-parent-validation.ts の truncate）。vitest などは失敗したケースの名前と件数を出力の末尾に出すため、失敗の肝心な部分が毎回切り捨てられ、全文も残らない。2026-10-04〜06 の PJR-GBEV・PJR-D0KF・PJR-7MF6 の調査では、作業者がテストを流し直すかテストを一時的に書き換えて出力を取り出す必要があった。PJR-7MF6 の一時的な統合テストの失敗は、再開で evidence が上書きされ特定できなくなった

## 2. 完了条件

- 親検証が失敗したとき、その出力の全文（上限を設ける場合はその上限と超過時の扱い）を evidence のディレクトリにログとして保存し、evidence の `log_refs` から参照できる。成功時の保存の要否も決めて記録する。
- evidence の要約は、先頭だけでなく末尾（失敗したケースの名前と件数が出る部分）を含める。例: 先頭と末尾を残して中間を省略する。
- 再開（`--resume`）や再実行で、前の実行の親検証のログが失われない。
- 保存するログに秘密情報が含まれないよう、既存の evidence の秘匿処理（redact）を適用する。
- reporter に渡す evidence の上限（PJR-GBEV の bounded evidence）とは独立に扱い、reporter の入力が大きくなりすぎないようにする。
- unit test で、末尾を含む要約、ログの保存と参照、秘匿処理を検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                                           |
| --- | -------------------------------------------------- | ---- | ---- | ---------------------------------------------- |
| 1   | 要約の作り方（先頭と末尾）と、ログの保存形式の設計 | DEV  | done | 1,000 文字の両端要約、失敗時だけログ保存       |
| 2   | 実装と、再開時にログを失わない扱い                 | DEV  | done | attempt 連番で追記し、過去ログを保持           |
| 3   | 秘匿処理とテスト                                   | DEV  | done | 既存 redact を適用し unit / integration を追加 |

## 4. 対応結果

親検証の要約を先頭と末尾を残す 1,000 文字の形式へ変更した。失敗時は stdout / stderr を各 1MiB まで取得し、既存の秘匿処理を適用したログを evidence ディレクトリへ保存して `log_refs` から参照する。上限超過時は各ストリームの中間を省略して `truncated` を記録する。成功時はログを保存せず要約だけを残す。

再開や統合段の再検証では attempt 連番のログを追加し、以前の失敗ログと参照を保持する。reporter へ渡るのは従来どおり bounded な evidence とログ参照だけで、ログ本文は渡さない。通常実行と trial の双方で同じ保存処理を使い、要約の末尾、ログ参照、秘匿、再検証時の保持を検証するテストを追加した。残課題はない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-gbev-exec-reporter-machine-facts]]、[[prj-0001:pjr-0ecy-reporter-changed-files-count-mismatch]]: 失敗の調査でテストの出力を取り出す必要があった実行。
- [[prj-0001:pjr-7mf6-parallel-register-run-integration]]: 一時的な統合テストの失敗を特定できなかった実行。
- `src/exec-parent-validation.ts`、`src/exec-evidence.ts`
