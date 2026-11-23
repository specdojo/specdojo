---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-sample-080-20261123t174448z-af7b74c3
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-sample-080/T-KATA-WAVE-5-opr-sample-080-20261123T174448Z-af7b74c3/plan.md
  started_at: "2026-11-23T17:44:50.802Z"
  completed_at: "2026-11-23T17:51:27.261Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:opr-sample
  condense_records:
    - location: 6. バックアップ確認・リストア手順 の「達成可否」の箇条書き
      category: repetition
      action: reference
      reason: 判定条件（翌営業日の開店までに前日閉店時点へ復元）が概要の未決事項の表と重複していたため、表への参照に置き換えた。判定内容は概要の表に残り、意味は維持される。
      cause:
        type: document
    - location: 4. 障害対応手順 の導入文の opr-incident への分冊の言及
      category: repetition
      action: retain
      reason: 12 章の表は文書導線、4 章の言及は手順の範囲の宣言で役割が異なり、判断に必要なため残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 運用手順書 `opr-sample.md` の冗長さを整理し、重複する判定条件を概要の未決事項の表への参照に置き換えました。
- 「4. 障害対応手順」における分冊への言及は、文書導線の表とは役割が異なる（手順の範囲の宣言）ため、判断に必要な情報として保持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: 「6. バックアップ確認・リストア手順」における達成可否の箇条書きを、概要の未決事項の表への参照に置き換えることで冗長さを削減しました。また、「4. 障害対応手順」の導入文にある分冊への言及は、文書導線の記述とは役割が異なるためそのまま保持しています。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

既存の文書内の冗長な記述（繰り返し、表と本文の二重説明など）を特定し、削除、集約、または既存の正本（概要の表など）への参照に置き換えることで、意味を維持したまま簡潔にしました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `6. バックアップ確認・リストア手順 の「達成可否」の箇条書き` | `repetition` | `reference` | `判定条件（翌営業日の開店までに前日閉店時点へ復元）が概要の未決事項の表と重複していたため、表への参照に置き換えた。判定内容は概要の表に残り、意味は維持される。` | `document` |
| `4. 障害対応手順 の導入文の opr-incident への分冊の言及` | `repetition` | `retain` | `12 章の表は文書導線、4 章の言及は手順の範囲の宣言で役割が異なり、判断に必要なため残した。` | `document` |
