---
specdojo:
  id: prj-0001:pjr-dm9b-generated-rulebook-target-unresolved
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-18T13:34:49Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-MNM5
---

# PJR-DM9B 生成物（kind: generated）の成果物で rulebook-maintenance の編集対象の rulebook を解決できない

## 1. 課題内容

kind: generated の成果物はカタログに rulebook を宣言していても、rulebook-maintenance の plan で rulebook が none・編集対象が _MISSING_（unresolved）になり、executor が止まる。原因を調べて直す

## 2. 入力

- orchestrator の観測（2026-11-18）: kata-slim-2 の T-KATA-SLIM-2-pjr-index-040・pm-issue-log-040・pm-risk-register-040・pm-change-request-log-040 が、plan の frontmatter で rulebook: none、編集対象が kind: rulebook・path: `_MISSING_`・state: unresolved になり、executor が手順どおり変更なしで exit 1 した
- orchestrator の調べ（2026-11-18）: 4 件はいずれも dct-project-management.yaml で kind: generated と rulebook（specdojo:pjr-rulebook・pm-issue-log-rulebook・pm-risk-register-rulebook・pm-change-request-log-rulebook）を宣言している。strategy の `include_kinds` は generated を受け付ける
- 利用者の依頼（2026-11-18）: issue を起票する。担当 DEV、期限 11 月末

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
