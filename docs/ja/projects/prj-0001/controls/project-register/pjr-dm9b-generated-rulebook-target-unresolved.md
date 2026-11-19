---
specdojo:
  id: prj-0001:pjr-dm9b-generated-rulebook-target-unresolved
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

### 5.1. 原因

`src/kata/kata.ts` の `resolveKataRefs` は、`targetKind` が `generated` だと rulebook の宣言を見ずに 4 種の参照をすべて `_MISSING_` にする。生成物は CLI が作るので実践の型を参照しない、という前提の短絡である。plan 生成（`src/exec/plans-generation.ts` の edit・review plan）、`targets` の組み立て（`src/exec/plans-core.ts` の `targetDocIds`）、review の前段の grade 対象（`reviewGradeSubject`）、`rulebookIncludesText`、improve-kata の段の review 対象（`src/exec/review-kata.ts`）は、成果物の kind をそのまま渡していた。そのため、型そのものを整備する段でも短絡が効き、編集対象が `_MISSING_`・`unresolved` になった。plan の frontmatter の `rulebook: none` は plan 自身の rulebook を表す固定値で、原因ではない。

### 5.2. 解決内容

- `src/exec/plans-core.ts` に `kataRefTargetKind` と `deliverableKataRefs` を加えた。approach が型の整備の段（`rulebook-maintenance`・`recipe-maintenance`・`sample-maintenance`・`template-maintenance`）のときだけ、`generated` の短絡を外して宣言どおりに解決する。
- edit・review plan の参照と `rulebookIncludesText`、`targetDocIds`、`reviewGradeSubject` は、上の関数を通して解決する。
- `src/exec/review-kata.ts` の improve-kata・bootstrap-kata-set の段の review 対象も、`generated` の短絡を外して解決する。この段は型そのものを評価するためである。
- `resolveKataRefs` の既定の動き（`generated` は `_MISSING_`）は変えていない。rulebook を宣言しない `generated` と、`kind: work` の成果物の結果、型の整備以外の段での `generated` の結果も変わらない。
- 保護された設定は変えていない。

### 5.3. 判断した点

- 対象の段は、型の整備の 4 つの maintenance に限った。authoring・bootstrap・bootstrap-finalize は新しく型を作るか、成果物と型を合わせて確定する段である。`generated` の成果物では CLI が生成物を作るので、広げると生成物を agent が書く plan になりうるからである。必要になれば別の項目で扱う。
- `resolveKataRefs` そのものは変えず、approach を知る plan 側で分けた。`schedule` の kata 判定（`src/schedule/approach.ts` が `generated` を `not-needed` とする扱い）など、approach を持たない呼び出し側の結果を変えないためである。
- `findUniqueDeliverableForKataTarget`（register の型の整備で、型から成果物を逆に引く処理）は変えていない。`generated` を含めると、`specdojo:pjr-rulebook` のように `kind: control` の成果物と同じ rulebook を宣言する場合に一意でなくなり、今の結果が変わるからである。

### 5.4. 確認結果

- `tests/src/exec/plans-generated-kata.test.ts` を加えた。kata-slim-2 の 4 件（pjr-index・pm-issue-log・pm-risk-register・pm-change-request-log）と同じ形の fixture（`kind: generated` で rulebook を宣言）を使う。rulebook-maintenance の edit plan が `docs/ja/specdojo/rulebooks/<id>.md`・`existing` を示し、`targets` に rulebook を含むことを確かめる。review plan が rulebook を示すことも確かめる。
- 同じテストで、rulebook を宣言しない `generated` が今までどおり `_MISSING_`・`unresolved` のままであること、`kind: work` の解決と、型の整備以外の段での `generated` の `targets` が変わらないことを確かめる。
- 関連する既存テスト（`tests/src/exec/plans.test.ts`、`tests/src/kata/`）は通った。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration` は親の runner が実行する。
- 止まっている 4 件の流し直しは、統合の後に orchestrator が行う。

### 5.5. 再発防止策

型の整備の段かどうかで参照の解決を分ける判断を `kataRefTargetKind` の 1 か所にまとめ、plan 生成の呼び出し側はそこを通す。上のテストで、`generated` の宣言ありと宣言なしの両方の結果を固定した。

### 5.6. CHANGELOG に書く事項

- 区分: 不具合修正
- 行の文案: `kind: generated` の成果物がカタログで rulebook を宣言しているとき、rulebook-maintenance などの型の整備の段の plan が、編集対象の型を `_MISSING_`（unresolved）にせず宣言どおりに解決するようにした（PJR-DM9B）。

## 6. 関連ドキュメント

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-slim-2.yaml`（止まった 4 件の段）
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`（4 件の成果物の宣言）
