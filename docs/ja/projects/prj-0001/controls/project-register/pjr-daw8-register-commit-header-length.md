---
specdojo:
  id: prj-0001:pjr-daw8-register-commit-header-length
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T03:46:03Z"
  due_on: null
---

# PJR-DAW8 register の自動 commit がタイトルの長さで commitlint に拒否される

## 1. 課題内容

exec run --register --register-commit は個票タイトルから exec(register PJR-XXXX): `<title>` のヘッダーを作るが、長さを調整しない。PJR-27Z9（109 文字）で header-max-length（100）に拒否され、executor・親検証・reporter が成功した実行が commit incomplete として waiting になった

## 2. 影響範囲

| 観点         | 影響                                                                             |
| ------------ | -------------------------------------------------------------------------------- |
| スコープ     | `--register-commit` を使う register 実行。タイトルが長い個票ほど失敗する         |
| スケジュール | 成功した実行が waiting になり、手動 commit と状態の戻しが必要になる              |
| コスト       | 手作業の commit と遷移の記録が増える                                             |
| 品質         | 実行の成果は staged のまま残り失われないが、状態と block_reason が事実と食い違う |
| 関係者       | DEV、register を実行する利用者                                                   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | commit ヘッダーをタイトルからそのまま組み立て、commitlint の header-max-length を考慮していない                                                             |
| 対応策   | ヘッダーを上限内に収める（タイトルの切り詰め、または固定の短い形式にして全文タイトルは本文へ置く）。commit 前に commitlint と同じ上限で検査する             |
| 依存事項 | なし                                                                                                                                                        |
| 完了条件 | 100 文字を超えるタイトルの個票で `exec run --register --register-commit` が commit まで成功し、unit test で上限の境界を検証している。`npm run check` が通る |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-27z9-codex-bwrap-proc-mount]]: 観測した実行（自動 commit が header-max-length で拒否された）。
