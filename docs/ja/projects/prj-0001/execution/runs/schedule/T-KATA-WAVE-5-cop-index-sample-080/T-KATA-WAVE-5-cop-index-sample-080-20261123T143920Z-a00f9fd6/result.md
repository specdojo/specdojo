---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-cop-index-sample-080-20261123t143920z-a00f9fd6
  type: exec-result
  task_id: T-KATA-WAVE-5-cop-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-cop-index-sample-080/T-KATA-WAVE-5-cop-index-sample-080-20261123T143920Z-a00f9fd6/plan.md
  started_at: "2026-11-23T14:39:24.035Z"
  completed_at: "2026-11-23T14:46:30.588Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:cop-index-sample
  condense_records:
    - location: 4. 担当者、連絡系統 の表（技術支援の備考）
      category: repetition
      action: reference
      reason: 15 分で切り分けられないときに呼ぶ条件は 8. 障害時判断、エスカレーション の連絡経路に同じ内容があるため、そちらへの参照に置き換えた。意味は保たれている。
      cause:
        type: document
    - location: 6. 切替判定ポイント（GO/NO-GO）の導入文（登録簿への転記）
      category: repetition
      action: retain
      reason: 判定結果の転記義務を定める記述であり、判断に要る。
      cause:
        type: document
    - location: 7. ロールバック手順 末尾の完了条件の文
      category: table-prose
      action: retain
      reason: ロールバック全体の完了条件を定める文であり、表の各手順の完了条件とは別。
      cause:
        type: document
    - location: 1. 概要 と 8. 障害時判断、エスカレーション の SLO
      category: repetition
      action: retain
      reason: 8 章の SLO は判断基準の定義に必要で、概要は範囲の説明であり役割が違う。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/specdojo/samples/cop-index-sample.md` の冗長さを整理しました。
- 「4. 担当者、連絡系統」の表における技術支援の備考について、重複する内容を「8. 障害時判断、エスカレーション」の連絡経路への参照に置き換えました。これにより、情報の集約を図っています。
- 「6. 切替判定ポイント（GO/NO-GO）」の導入文、「7. ロールバック手順」の完了条件、「1. 概要」および「8. 障害時判断、エスカレーション」の SLO については、判断に要る重要な情報であるため、そのまま保持（`retain`）しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cop-index-sample.md`: 冗長な記述を整理・統合しました。具体的には、「4. 担当者、連絡系統」の表における一部の備考を、他の章との重複を避けるために参照への置き換えを行いました。また、判定条件や完了条件に関する重要な文言は、意味を維持するために保持しています。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

既存の文書内の冗長さを、削除・統合・参照置換によって整理しました。判断に不可欠な背景や完了条件は維持することを優先し、意味の変容を防いでいます。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `4. 担当者、連絡系統 の表（技術支援の備考）` | `repetition` | `reference` | `15 分で切り分けられないときに呼ぶ条件は 8. 障害時判断、エスカレーション の連絡経路に同じ内容があるため、そちらへの参照に置き換えた。意味は保たれている。` | `document` |
| `6. 切替判定ポイント（GO/NO-GO）の導入文（登録簿への転記）` | `repetition` | `retain` | `判定結果の転記義務を定める記述であり、判断に要る。` | `document` |
| `7. ロールバック手順 末尾の完了条件の文` | `table-prose` | `retain` | `ロールバック全体の完了条件を定める文であり、表の各手順の完了条件とは別。` | `document` |
| `1. 概要 と 8. 障害時判断、エスカレーション の SLO` | `repetition` | `retain` | `8 章の SLO は判断基準の定義に必要で、概要は範囲の説明であり役割が違う。` | `document` |
