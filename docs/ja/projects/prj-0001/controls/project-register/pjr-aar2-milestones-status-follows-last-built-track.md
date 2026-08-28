---
specdojo:
  id: prj-0001:pjr-aar2-milestones-status-follows-last-built-track
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-22T13:28:17Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-23T00:32:52Z"
  conclusion: schedule build が集約ファイルの status を書き換えないようにした。新規作成時のみ draft を書き、既存ファイルでは保持する。対象トラックの strategy の status を集約ファイルへ反映しないため、build 順による降格も自動昇格も起きない。draft の planning トラックを build しても ready が維持されることを実機で確認した。
  register_events:
    - v: 1
      id: reg_f042f29a1e7047ca8177aa36b3bd431d
      ts: "2026-08-22T13:29:14Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): PJR-AAR2 を起票し PJR-WVNS を decided にする"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: sch-milestones の status が最後に build したトラックの strategy に引きずられる
        - field: description
          from: ""
          to: sch-milestones.yaml はプロジェクト全トラックのマイルストーンを集約する単一ファイルだが、schedule build は毎回 doc.status を対象トラックの strategy の status で上書きする。そのため draft の strategy を持つトラック（新設直後の planning など）を build すると、ready だったプロジェクト全体のマイルストーンが draft へ降格する。逆に draft のまま ready のトラックを build すると ready へ昇格する。集約ファイルの status が最後に build したトラックに依存し、人が昇格させた状態も保持されない。
        - field: type
          from: ""
          to: issue
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-22"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 47bc0d0fe2bd0c114b32a70105c9990121c0ac89
    - v: 1
      id: reg_345d8fc7c559cfb5cb1e375f59492b1d
      ts: "2026-08-23T00:20:00Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-AAR2): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 368e333c8e887c8b501ec2d53d03ad5526778bbd
      previous_event_id: reg_f042f29a1e7047ca8177aa36b3bd431d
    - v: 1
      id: reg_6795892b81337c9f40a98f4f090702d1
      ts: "2026-08-23T00:31:12Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-AAR2): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: dd91cd1a10394784d949c0908885a6f32acc7a91
      previous_event_id: reg_345d8fc7c559cfb5cb1e375f59492b1d
    - v: 1
      id: reg_4cf577a0cfd6a1ec214b7c4babb95b3d
      ts: "2026-08-23T00:32:52Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-AAR2): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-23"
        - field: conclusion
          from: "-"
          to: schedule build が集約ファイルの status を書き換えないようにした。新規作成時のみ draft を書き、既存ファイルでは保持する。対象トラックの strategy の status を集約ファイルへ反映しないため、build 順による降格も自動昇格も起きない。draft の planning トラックを build しても ready が維持されることを実機で確認した。
      legacy_commit: cd0b997134c94963b8d061289bfd83730cfaee4e
      previous_event_id: reg_6795892b81337c9f40a98f4f090702d1
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
| 依存事項 | なし。`kind: generated` は再生成が前提であり、`ready` のまま内容が更新されるのは正常動作として許容する                                                                                                                           |
| 完了条件 | 任意のトラックを build しても集約ファイルの status が変化しないこと。build による自動昇格も起きないこと。方式が rulebook またはガイドに明記されていること                                                                        |

## 4. 対応結果

- `updateMilestonesFile` から対象 strategy の `status` の受け渡しと既存ファイルへの上書きを除去した。既存 `sch-milestones.yaml` の `status` は再構築後も保持し、新規作成時だけ `draft` とする。
- 新規作成時の `draft` と、既存の `draft` / `ready` / `deprecated` を再構築後も保持する回帰テストを追加した。
- [[specdojo:schedule-design-guide|Schedule設計ガイド]] に、strategy の状態から独立して既存 status を保持し、自動昇格しない方式を明記した。

検討時に却下した案を記録する。

- 昇格のみ許して降格しない片方向遷移: `ready` の strategy を持つトラックを build した時点で集約ファイルが自動昇格する。人の確認なしに status を昇格させないという原則に反する。
- 全 strategy が `ready` のときだけ `ready` とする集約判定: 最後の 1 件が `ready` になった build で自動昇格するため、同じ理由で採れない。
- いずれも「降格を防ぐ」ことだけを見ると妥当に見えるが、昇格側の副作用を見落としている。
- `ready` の集約ファイルを build が内容更新する場合に警告する、または `--force` を要求する案: `sch-milestones.yaml` は `kind: generated` で、`schedule build` が毎回全トラック分を再生成する。`ready` のまま内容が更新されるのは通常動作であり、警告や `--force` は build のたびにノイズとなる。既存の `assertNoAgentReadyPromotion` も昇格のみを禁じており、内容変更は意図的に対象外である。したがって追加のガードは設けない。

## 5. 関連ドキュメント

- 顕在化した実行: [[prj-0001:pjr-qf7t-planning-domain-and-track|PJR-QF7T planning ドメインとトラックを新設し、計画成果物をカタログとScheduleへ載せる]]
- 設計の根拠: [[prj-0001:pjr-wvns-planning-artifacts-catalog-scope|PJR-WVNS 計画成果物をカタログへ載せ、専用の planning ドメインとトラックで所有する]]
- Schedule の設計方針: [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- 該当実装: `src/schedule.ts` の `updateMilestonesFile`
