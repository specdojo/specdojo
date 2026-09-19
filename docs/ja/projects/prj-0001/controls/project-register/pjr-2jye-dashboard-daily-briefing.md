---
specdojo:
  id: prj-0001:pjr-2jye-dashboard-daily-briefing
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: PM
  registered_at: "2026-09-17T23:01:42Z"
  due_on: "2026-09-30"
---

# PJR-2JYE dashboard に routine の実行状況・着手可能な登録項目のおすすめ順・要対応一覧を追加し毎朝 5 時に更新する

## 1. 概要

現行の dashboard（Schedule / タイムライン / 登録簿の件数 / routine の最終実行）には「今日なにをすべきか」を判断する情報がない。次の 3 節を追加し、毎朝 5:00 に routine で再生成する。

- 昨日実行した routine と本日予定の routine の実行状況
- 着手可能な登録項目のおすすめ順（`exec run --register` の候補）
- 要対応（解除待ち）: 登録簿の `waiting` 項目と exec の `blocked` タスク

### 1.1. 決定事項

- routine の実行履歴は新設する（決定 B）。`routine run` が routine ごとの実行を `routines/generated/routine-runs.jsonl` へ追記し（routine id、`scheduled_for`、開始・終了時刻、結果、job run id）、dashboard はこれを読む。`routine-state.json` の `last_run` / `last_result` は現行どおり維持する。
- 「着手可能」は `item_status: open` かつ実行対象 type（todo / issue / change-request / question / risk）に限り、`waiting` は含めない。
- `waiting`（登録簿）と `blocked`（exec タスク）は「要対応（解除待ち）」として別節に出し、理由（最新の `wait` イベントの reason、最新の `block` イベントの msg）と次の行動を添える。
- おすすめ順は、期日超過 → 期日が近い → 優先度（high > medium > low）→ 関連ドキュメントに open の PJR があるものは後ろ → 登録日が古い順とし、上位 10 件を根拠列付きで表示する。
- 毎朝の更新は cron 直叩きではなく routine `rtn-dashboard-refresh`（`0 5 * * *`、job `job-dashboard-build`）で行い、実行記録を残す。`.devcontainer/specdojo-routine.cron` の `routine run --due` に 5:00 と 6:00 を追加する（6:00 の `rtn-grade-deliverable-recheck` が 8:00 まで待たされ `exec busy` で skip される問題も併せて解消する）。

## 2. 完了条件

- `routine run` が `routines/generated/routine-runs.jsonl` へ 1 実行 1 行を追記し、schema が `docs/specdojo/schemas/v1/` に定義され `npm run validate:schema` を通過している。
- dashboard に「routine 実行状況（昨日・本日）」「着手可能な登録項目（おすすめ順）」「要対応（解除待ち）」の節があり、それぞれ上記の決定事項どおりの列と根拠を持つ。
- `rtn-dashboard-refresh` と `job-dashboard-build` が定義され、`routine run --id rtn-dashboard-refresh` で dashboard が再生成される。
- `.devcontainer/specdojo-routine.cron` が 0,5,6,8,16 時に `routine run --due` を呼ぶ。
- 単体テストで、履歴の追記、昨日・本日の抽出（Asia/Tokyo 境界）、おすすめ順のソート、waiting / blocked の理由抽出が検証されている。
- `docs/ja/specdojo/guides/routine-operation-guide.md` と `command-reference.md` に履歴ファイルと dashboard の新節が記載されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                    | 担当 | 状態 | メモ                                               |
| --- | --------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------- |
| 1   | `routine run` に `routine-runs.jsonl` の追記を実装し、schema とテストを追加する         | DEV  | done | 1実行1行の JSON Lines 履歴と schema を追加         |
| 2   | dashboard に routine 実行状況（昨日・本日）の節を追加する                               | DEV  | done | Asia/Tokyo の日付境界で実績と予定を集計            |
| 3   | dashboard に着手可能な登録項目のおすすめ順と要対応（waiting / blocked）の節を追加する   | DEV  | done | 根拠列、解除理由、次の行動を表示                   |
| 4   | `rtn-dashboard-refresh` / `job-dashboard-build` を定義し、cron に 5:00・6:00 を追加する | OPS  | done | 5時更新と due runner の追加確認枠を定義            |
| 5   | guide / command-reference を更新する                                                    | DEV  | done | 履歴正本、dashboard 新節、cron 設定を記載          |
| 6   | 生成結果を確認し、順位付けの根拠列や表の粒度を調整する                                  | PM   | done | 上位10件に期日・優先度・関連項目数・登録日時を表示 |

## 4. 対応結果

- `routine run` が完了時に `routines/generated/routine-runs.jsonl` へ実行枠、開始・終了時刻、結果、Job Run ID を追記するようにした。
- dashboard に昨日・本日の routine、着手可能な登録項目の上位10件、register の `waiting` と exec の `blocked` をまとめた解除待ち一覧を追加した。
- `job-dashboard-build` と毎朝5時の `rtn-dashboard-refresh` を追加し、devcontainer の due runner を0時・1時・5時・6時・8時・16時に起動する構成へ更新した。既存の1時の成果物評価枠は維持した。
- 単体テストへ履歴追記、Asia/Tokyo の日付境界、候補の並び順、最新の `wait` / `block` 理由抽出を追加した。
- 残課題はない。routine の実行履歴は次回の実運用実行から蓄積される。

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]
- [[specdojo:command-reference]]
- `src/dashboard.ts`
- `src/routine.ts`
- `.devcontainer/specdojo-routine.cron`
