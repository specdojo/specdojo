---
specdojo:
  id: prj-0001:pjr-hqve-auto-parallel-staged-event-blocks-merge
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-05T15:55:21Z"
  derived_from:
    - PJR-3APD
---

# PJR-HQVE schedule の --auto --parallel の統合が、index に残った記録のファイルで止まる

## 1. 課題内容

stsd-pilot の schedule を --auto --parallel 2 で流している間に、block の event ファイルが commit されずに index に載ったまま残り、別のタスクの統合の git merge が「local changes would be overwritten」で止まった。原因を調べ、統合が止まらないようにする

## 2. 入力

- 2026-11-05 13:07 に T-STSD-PILOT-stsd-register-entry-070 が block され、その block の event ファイルが index に追加（A）されたまま残った。13:14 の T-STSD-PILOT-stsd-routine-run-070 の統合の git merge が、このファイルを理由に止まった（integrate.log）。index から外すと統合できた
- 同じ時間帯に orchestrator が register add --commit を続けて実行していた（10 件の起票）。そのうち 1 件は利用者の中断で commit の前に止まり、自分の 2 ファイルを index に載せたまま残した。どちらが block の event を index に載せたかは確かめていない
- schedule の --auto で流したタスクの claim・complete・block の event は、統合の後も作業ツリーに untracked のまま残り、orchestrator が手で commit している（exec(schedule): ... を記録する）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
