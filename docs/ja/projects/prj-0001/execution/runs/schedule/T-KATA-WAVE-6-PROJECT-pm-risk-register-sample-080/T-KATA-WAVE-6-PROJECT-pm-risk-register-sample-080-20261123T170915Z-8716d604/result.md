---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-risk-register-sample-080-20261123t170915z-8716d604
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-080/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-080-20261123T170915Z-8716d604/plan.md
  started_at: "2026-11-23T17:09:16.917Z"
  completed_at: "2026-11-23T17:12:31.048Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:pm-risk-register-sample
  condense_records:
    - location: 5.2. 顕在化のトリガーと移管先 の表、RK-004 行の顕在化のトリガー欄
      category: repetition
      action: delete
      reason: 「2026-04-04 に該当」は、一覧の RK-004 の内容欄と、対応計画の RK-004 の期限欄に同じ日付と移管の事実が書かれている。起票先の欄にも IS-002 があるため、削っても意味は変わらない。
      cause:
        type: document
    - location: 5.2. 顕在化のトリガーと移管先 の導入文「顕在化したら当日中に起票し、元のリスクを done にする」
      category: repetition
      action: retain
      reason: 5.1 の表はステータス更新の契機を示し、この文は顕在化時の起票期限という別の運用ルールを示す。判断に要る情報のため残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 「5.2. 顕在化のトリガーと移管先」の表において、`RK-004` 行の「顕在化のトリガー」欄に含まれていた重複する日付および移管の事実に関する注記を削除しました。
- 文書の整形として `prettier` を実行しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-risk-register-sample.md`: 「5.2. 顕在化のトリガーと移管先」の表における `RK-004` の冗長な記述（日付と移管の事実）を削除し、`prettier` による整形を行いました。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

対象文書の冗長さを解消するため、`5.2. 顕在化のトリガーと移管先` の表における `RK-004` の記述を精査しました。他の行や導入文は、運用上の判断に要る重要な情報であると判断し、保持しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `5.2. 顕在化のトリガーと移管先 の表、RK-004 行の顕在化のトリガー欄` | `repetition` | `delete` | `「2026-04-04 に該当」は、一覧の RK-004 の内容欄と、対応計画の RK-004 の期限欄に同じ日付と移管の事実が書かれている。起票先の欄にも IS-002 があるため、削っても意味は変わらない。` | `document` |
| `5.2. 顕在化のトリガーと移管先 の導入文「顕在化したら当日中に起票し、元のリスクを done にする」` | `repetition` | `retain` | `5.1 の表はステータス更新の契機を示し、この文は顕在化時の起票期限という別の運用ルールを示す。判断に要る情報のため残した。` | `document` |
