---
specdojo:
  id: prj-0001:pjr-aar2-milestones-status-follows-last-built-track
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-22T13:28:17Z"
  due_on: "2026-08-31"
---

# PJR-AAR2 sch-milestones の status が最後に build したトラックの strategy に引きずられる

## 1. 課題内容

sch-milestones.yaml はプロジェクト全トラックのマイルストーンを集約する単一ファイルだが、schedule build は毎回 doc.status を対象トラックの strategy の status で上書きする。そのため draft の strategy を持つトラック（新設直後の planning など）を build すると、ready だったプロジェクト全体のマイルストーンが draft へ降格する。逆に draft のまま ready のトラックを build すると ready へ昇格する。集約ファイルの status が最後に build したトラックに依存し、人が昇格させた状態も保持されない。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `sch-milestones.yaml` の `status`。全トラックのマイルストーンを集約する単一ファイルであり、任意のトラックの `schedule build` で書き換わる |
| スケジュール | 直接の遅延はないが、状態が実態と合わないため、マイルストーンの確定判断に使えない                                                          |
| コスト       | 追加の外部コストはなく、影響は状態の再確認と復元に要する作業時間                                                                          |
| 品質         | 人が昇格させた `ready` が、無関係なトラックの build で `draft` へ降格する。状態が最後に build したトラックに依存し、再現性がない          |
| 関係者       | ARC（実装）。Schedule を運用する担当者                                                                                                    |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/schedule.ts` の `updateMilestonesFile` が、build のたびに `doc.status = status`（対象トラックの strategy の status）を代入している。単一トラックの状態を、全トラック集約ファイルの状態として書き込んでいる                  |
| 対応策   | 集約ファイルの status を単一トラックから決めない。候補は、全 strategy が `ready` のときだけ `ready` とする集約判定、`draft` からの昇格のみ許して降格しない片方向遷移、status を人の管理項目として build では触れない、のいずれか |
| 依存事項 | どの方式を採るかの判断。`catalog build` 側が status を昇格させない設計と整合させる                                                                                                                                               |
| 完了条件 | draft の strategy を持つトラックを build しても、集約ファイルの status が降格しないこと。方式が rulebook またはガイドに明記されていること                                                                                        |

## 4. 対応結果

-

## 5. 関連ドキュメント

- 顕在化した実行: [[prj-0001:pjr-qf7t-planning-domain-and-track|PJR-QF7T planning ドメインとトラックを新設し、計画成果物をカタログとScheduleへ載せる]]
- 設計の根拠: [[prj-0001:pjr-wvns-planning-artifacts-catalog-scope|PJR-WVNS 計画成果物をカタログへ載せ、専用の planning ドメインとトラックで所有する]]
- Schedule の設計方針: [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- 該当実装: `src/schedule.ts` の `updateMilestonesFile`
