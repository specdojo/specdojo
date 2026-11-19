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

| 観点         | 影響                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| スコープ     | rulebook-maintenance などの型の整備の段で、`kind: generated` の成果物の編集対象の rulebook を解決する処理 |
| スケジュール | kata-slim-2 の 4 件が止まり、後に続く段へ進めない                                                         |
| コスト       | executor を起こしても変更なしで終わり、割り当てを無駄に使う                                               |
| 品質         | 生成物の型（pjr・pm-issue-log・pm-risk-register・pm-change-request-log）の rulebook が整備から漏れる      |
| 関係者       | DEV（runner の修正）、BA（型の整備）                                                                      |

## 4. 対応方針

| 項目     | 内容                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | _UNDECIDED_: executor が調べ、個票の対応結果に書く                                                                                |
| 対応策   | カタログで rulebook を宣言している `kind: generated` の成果物でも、型の整備の段の plan が rulebook と編集対象を解決するようにする |
| 依存事項 | なし                                                                                                                              |
| 完了条件 | 下の「完了条件」を満たす                                                                                                          |

完了条件:

- 原因（どの処理が `kind: generated` の成果物の rulebook を解決しないか）を調べ、個票の対応結果に書く。
- カタログで rulebook を宣言している `kind: generated` の成果物について、rulebook-maintenance・recipe-maintenance など型の整備の段の plan が、frontmatter の `rulebook` と編集対象（kind・path）を解決する。`_MISSING_`・unresolved にならない。
- rulebook を宣言していない `kind: generated` の成果物と、`kind: work` の成果物の今の結果は変えない。
- 上の 2 点を確かめる単体テストがある。kata-slim-2 の 4 件（pjr-index・pm-issue-log・pm-risk-register・pm-change-request-log）と同じ形の fixture を使う。
- 止まっている 4 件の流し直しは orchestrator が統合の後に行う。executor は流し直さない。
- 保護された設定は変えない。変更が要る場合は、案を個票の対応結果に書き、報告の `handoff` にも書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証（test-integration）を通す。
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項`（Markdown の連番ルールに従う）に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-slim-2.yaml`（止まった 4 件の段）
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`（4 件の成果物の宣言）
