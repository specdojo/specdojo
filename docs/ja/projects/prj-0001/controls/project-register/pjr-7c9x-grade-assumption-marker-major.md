---
specdojo:
  id: prj-0001:pjr-7c9x-grade-assumption-marker-major
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T05:39:27Z"
  derived_from:
    - PJR-ABY4
---

# PJR-7C9X grade の機械的な検査が、sample の標準が求める _ASSUMPTION_ まで major にする

## 1. 課題内容

grade の vp-qe-config-validity の検査は本文に _TODO_ か _ASSUMPTION_ があると major にするが、sample-authoring-standard は未確定の事項を _ASSUMPTION_ で明示するよう求めており、同じ状態の sample でも結果が分かれる

## 2. 入力

- 2026-11-22、第 3 波の 090 で、utc-index・stc-index・tsp-index・itc・atc の sample に「未解決の `_TODO_` / `_ASSUMPTION_` が残っています。」の major が付き、verdict が needs-work になった。utc-index・stc-index・tsp-index は、major がこの 1 件だけだった。
- 同じく `_ASSUMPTION_` を 1 つ持つ utc-sample と imp-test-sample は pass で、この指摘が付いていない。付く条件がぶれている。
- 検査の実装は src/grade/plan.ts の vp-qe-config-validity（本文の最初の `_TODO_` / `_ASSUMPTION_` の行を major とする）。sample の標準は docs/ja/specdojo/standards/sample-authoring-standard.md（未確定の事項は `_UNDECIDED_:` または `_ASSUMPTION_:` として明示する）。
- 利用者（indie）の判断（2026-11-22）: 第 3 波の手直しの合格は、この機械的な指摘を除いて blocker と major がないこととする。この issue が直れば、次の回からは verdict pass をそのまま合格に使う。

## 3. 影響範囲

| 観点         | 影響                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| スコープ     | `src/grade/plan.ts` の `vp-qe-config-validity` の機械的な検査と、その説明の文書                  |
| スケジュール | 第 3 波では合格の基準をこの指摘を除く形にして回避した。次の型の波から verdict をそのまま使える   |
| コスト       | 小さい。検査の条件の変更とテスト                                                                 |
| 品質         | sample の標準どおりの `_ASSUMPTION_` で needs-work にならなくなる。`_TODO_` は今までどおり major |
| 関係者       | 型を整えるオーケストレーターと review の段                                                       |

## 4. 対応方針

| 項目                       | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因                       | 機械的な検査は本文に `_TODO_` か `_ASSUMPTION_` があると major にする。同じ状態の sample で結果が分かれた原因（`utc-sample` には付かず `itc-sample` には付いた）は、executor が調べて対応結果に書く                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 対応策                     | `--target kata` の sample では `_TODO_` だけを major にし、`_ASSUMPTION_` と `_UNDECIDED_` は指摘しない。`--target deliverable` は今のままにする。結果が分かれた原因も直す                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 依存事項                   | なし。`CHANGELOG.md` は変えず、個票の対応結果の `### 5.1. CHANGELOG に書く事項` に区分「変更」と行の文案を書く                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件                   | 上の対応策を単体テストで確かめる。grade のガイドの説明を直す。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証を通す。統合の後、オーケストレーターが `utc-index` の型を評価し直し、sample が verdict `pass` になることを確かめる                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2 回目の実行（2026-11-22） | 統合の後の確かめ（`utc-index` の評価し直し、2026-11-22T08:40Z）で、sample に major（F006、観点 `vp-ops-release-readiness`、文言「未解決の _TODO_ / _ASSUMPTION_ が残っています。」、`_ASSUMPTION_` の行）が残った。grade の plan の手順 7 が「前回の指摘」を agent に渡し、未解消なら同じ文言で含めるよう指示するため、直す前の機械的な検査が付けた指摘が引き継がれ続ける。これが、同じ状態の sample で結果が分かれた原因でもある。`--target kata` では、前回の指摘のうち、この機械的な検査の文言で `_ASSUMPTION_`・`_UNDECIDED_` の行を指すものを「前回の指摘」に渡さない（または解消済みとして扱う）。`_TODO_` を指すものは今までどおり渡す。単体テストで確かめ、原因を個票の対応結果に書く。統合の後、オーケストレーターが `utc-index` を評価し直し、sample の F006 が消えて verdict が `pass` になることを確かめる |

## 5. 対応結果

- 解決内容: `src/grade/plan.ts` の `vp-qe-config-validity` の機械的な検査を、`--target kata` では `_TODO_` だけを major にする形へ変えた。`_ASSUMPTION_` と `_UNDECIDED_` は指摘しない。`--target deliverable` は従来どおり `_TODO_` / `_ASSUMPTION_` を major にする。`docs/ja/specdojo/references/command-reference.md` の grade の説明へ同じ条件を追記した。
- 確認結果: `tests/src/grade/yaml.test.ts` に kata の `_ASSUMPTION_` / `_UNDECIDED_` が指摘されないこと、kata の `_TODO_` が major になること、deliverable の `_ASSUMPTION_` が major のままであることを追加し、`tests/src/grade` の単体テスト 176 件と `npm run typecheck` が通った。
- 結果が分かれた原因: 未確定。`utc-sample` の結果は 2026-11-22T01:07Z、`itc-sample` は 07:13Z の評価で、評価の時期が違う。また `itc-sample` の指摘の `rule` は `vp-ops-release-readiness` であり、`pm-review-viewpoints.yaml` では `vp-qe-config-validity` は `grade_targets: [deliverable]` なので、kata では機械的な検査が走らないはずである。`src` 内で「未解決の」の文言を出すのは `plan.ts` だけで、経路を特定できなかった。統合の後の `utc-index` の再評価で確かめる。
- 再発防止策: 上記のテストで kata の条件を固定した。

### 5.1. CHANGELOG に書く事項

- 区分「変更」: grade の機械的な検査（`vp-qe-config-validity`）が、`--target kata` では `_TODO_` だけを major にし、`_ASSUMPTION_` / `_UNDECIDED_` を指摘しないようにした。`--target deliverable` は変わらない。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
