---
specdojo:
  id: prj-0001:pjr-yq32-exec-scope-reservation-leak-on-setup-failure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T04:56:14Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0JVB
  commit_type: fix
  commit_scope: exec
---

# PJR-YQ32 準備の段で失敗した run が変更範囲の予約を blocked のまま残す

## 1. 課題内容

朝の cycle で人の確定の 13 件が予約を残し、後の run が blocked by unintegrated で止まった。準備の段の失敗で予約を外し、古い予約を片付ける

## 2. 入力

- 利用者の決定（2026-11-23）: オーケストレーターの推奨どおり起票する
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 準備の段（plan の生成など）で失敗したタスクの変更範囲の予約が blocked のまま残り、片付けは終わった項目しか対象にしない（PJR-B6NS） |
| 対応策   | 準備の段の失敗で予約を外し、todo のまま worktree も lock もない古い予約を片付ける                                                  |
| 依存事項 | なし                                                                                                                               |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                       |

- `exec run`（`--auto`・`exec cycle` を含む）が準備の段（plan の生成など）で失敗したとき、そのタスクの変更範囲の予約（`exec/.locks/change-scopes/`）を `blocked` のまま残さず外す。2026-11-23 の朝の cycle で、第 3 波の人の確定の 13 件が予約を残し、後の `exec run --register PJR-E73Z` が「blocked by unintegrated」で止まった（オーケストレーターが 13 件を手で消した）。
- worktree も lock もなく、状態が todo のままのタスクの古い予約を、次の予約の判定で片付ける（PJR-B6NS の終わった項目の片付けと同じ考え方）。
- 単体テストを足す（準備の段の失敗で予約が残らないこと、古い予約が片付くこと）。
- 関連する設計・ガイド・CLI リファレンスを直す。
- runner の動きを変える場合は、統合の後に orchestrator が `exec smoke` を流して確かめてから close する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
