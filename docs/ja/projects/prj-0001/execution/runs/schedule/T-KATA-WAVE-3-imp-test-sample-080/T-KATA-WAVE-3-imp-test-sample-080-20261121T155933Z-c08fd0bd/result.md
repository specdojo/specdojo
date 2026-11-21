---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-imp-test-sample-080-20261121t155933z-c08fd0bd
  type: exec-result
  task_id: T-KATA-WAVE-3-imp-test-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-imp-test-sample-080/T-KATA-WAVE-3-imp-test-sample-080-20261121T155933Z-c08fd0bd/plan.md
  started_at: "2026-11-21T15:59:34.593Z"
  completed_at: "2026-11-21T16:04:35.150Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:imp-test-sample
  condense_records:
    - location: 対応方針の章、受入確認の箇条書き
      category: repetition
      action: merge
      reason: 変更要求の概要の章の「すべて達成した場合に受入確認を合格とする」と同じ合格基準を繰り返していたため、成功条件の参照にまとめた。判定日・判定者・PO 承認・未達時の手順は残した
      cause:
        type: document
    - location: 影響分析サマリの章、影響度別件数の表の「主な影響対象テスト」列
      category: table-prose
      action: retain
      reason: 影響詳細一覧と重なるが、rulebook の本文要件でこの列が必須
      cause:
        type: document
    - location: 影響詳細一覧の章、判断根拠の列の「最大値規則により」
      category: repetition
      action: retain
      reason: rulebook の記述ガイドが、評価観点ごとの事実に集約規則を当てはめた結果を行ごとに書くよう求めている
      cause:
        type: document
    - location: 対応方針の章、表の前提条件の列にある決定期限
      category: repetition
      action: retain
      reason: 未解決事項の章と同じ日付だが、対応の期限に間に合うかをその行で判断するのに要る
      cause:
        type: document
    - location: 対応方針の章、PJR-T5D1 の箇条書きにある欠陥検出時の全件実行の条件
      category: repetition
      action: retain
      reason: 影響詳細一覧の備考にある「リリース後 2 週間以内」とは異なる例外条件で、判断に要る
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- imp-test-sample の対応方針の章にあった、合格基準の繰り返し 1 件をまとめた。
- 表の必須列・集約規則の当てはめ・期限の参照・例外条件の 4 件は、判断に要る情報として保持している。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-test-sample.md`: 「対応方針」の章における合格基準の重複を削除し、成功条件への参照にまとめることで冗長さを整理した。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

対象文書における冗長な記述を特定し、意味を維持したまま「削除」「統合」「参照への置換」を行った。具体的には、受入確認の箇条書きが「変更要求の概要」と重複していたため、成功条件への参照に集約した。一方で、`rulebook` の要件を満たすための必須情報（表の列や集約規則、期限、例外条件）については、判断の根拠として必要であるため保持した。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `対応方針の章、受入確認の箇条書き` | `repetition` | `merge` | `変更要求の概要の章の「すべて達成した場合に受入確認を合格とする」と同じ合格基準を繰り返していたため、成功条件の参照にまとめた。判定日・判定者・PO 承認・未達時の手順は残した` | `document` |
| `影響分析サマリの章、影響度別件数の表の「主な影響対象テスト」列` | `table-prose` | `retain` | `影響詳細一覧と重なるが、rulebook の本文要件でこの列が必須` | `document` |
| `影響詳細一覧の章、判断根拠の列の「最大値規則により」` | `repetition` | `retain` | `rulebook の記述ガイドが、評価観点ごとの事実に集約規則を当てはめた結果を行ごとに書くよう求めている` | `document` |
| `対応方針の章、表の前提条件の列にある決定期限` | `repetition` | `retain` | `未解決事項の章と同じ日付だが、対応の期限に間に合うかをその行で判断するのに要る` | `document` |
| `対応方針の章、PJR-T5D1 の箇条書きにある欠陥検出時の全件実行の条件` | `repetition` | `retain` | `影響詳細一覧の備考にある「リリース後 2 週間以内」とは異なる例外条件で、判断に要る` | `document` |
