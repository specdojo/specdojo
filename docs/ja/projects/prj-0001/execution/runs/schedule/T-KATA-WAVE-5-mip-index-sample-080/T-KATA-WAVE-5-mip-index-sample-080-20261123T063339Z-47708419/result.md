---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-mip-index-sample-080-20261123t063339z-47708419
  type: exec-result
  task_id: T-KATA-WAVE-5-mip-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-mip-index-sample-080/T-KATA-WAVE-5-mip-index-sample-080-20261123T063339Z-47708419/plan.md
  started_at: "2026-11-23T06:33:43.076Z"
  completed_at: "2026-11-23T06:42:21.312Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:mip-index-sample
  condense_records:
    - location: 2. 前提・制約 の対象外の列挙
      category: canonical-restatement
      action: reference
      reason: 対象外の範囲は 4. 移行対象一覧（スコープ/非対象）に同内容があり、参照に置き換えても情報は欠けない
      cause:
        type: document
    - location: 8. カットオーバー概要 のロールバック方針の 1・2 項目目
      category: table-prose
      action: merge
      reason: GO1〜GO3 の失敗時の扱いは表の失敗時の扱い列と重複。表にない情報（切替日の決め直し、ノートが正本で記録が失われないこと）だけを残した
      cause:
        type: document
    - location: 3. 移行方式と期間 のフェーズ表の完了条件と 5. 成功条件の基準
      category: repetition
      action: retain
      reason: フェーズの完了条件と判定者付きの受入基準で役割が異なり、判定に必要なため残した
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- mip-index-sample の冗長 2 箇所を参照置換・統合で整理し、意味は維持した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mip-index-sample.md`: 「2. 前提・制約」における対象外の列挙を「4. 移行対象一覧」への参照に置き換え、「8. カットオーバー概要」におけるロールバック方針の冗長な記述を、表の内容と重複しないよう統合・整理した。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

対象文書から、繰り返しや表・本文の重複といった冗長な箇所を洗い出し、参照への置き換えや情報の統合によって整理を行いました。判断に要する背景や完了条件などの重要な情報は維持しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `2. 前提・制約 の対象外の列挙` | `canonical-restatement` | `reference` | `対象外の範囲は 4. 移行対象一覧（スコープ/非対象）に同内容があり、参照に置き換えても情報は欠けない` | `document` |
| `8. カットオーバー概要 のロールバック方針の 1・2 項目目` | `table-prose` | `merge` | `GO1〜GO3 の失敗時の扱いは表の失敗時の扱い列と重複。表にない情報（切替日の決め直し、ノートが正本で記録が失われないこと）だけを残した` | `document` |
| `3. 移行方式と期間 のフェーズ表の完了条件と 5. 成功条件の基準` | `repetition` | `retain` | `フェーズの完了条件と判定者付きの受入基準で役割が異なり、判定に必要なため残した` | `document` |
