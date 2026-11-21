---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-atc-sample-080-20261121t190120z-aeff6d12
  type: exec-result
  task_id: T-KATA-WAVE-3-atc-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-atc-sample-080/T-KATA-WAVE-3-atc-sample-080-20261121T190120Z-aeff6d12/plan.md
  started_at: "2026-11-21T19:01:21.911Z"
  completed_at: "2026-11-21T19:09:42.112Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:atc-sample
  condense_records:
    - location: 概要（`cash-sale`） 第2段落 `status` を `ready` にする条件の文
      category: canonical-restatement
      action: delete
      reason: rulebook の全体方針で `status` の昇格はドキュメントメタ情報標準に従い成果物で言い直さないとされ、lint は業務の受入確認に含めない。前提解消の条件は「環境/データ/外部依存」の前提表の前の文に残っているので、判断情報は失われない
      cause:
        type: document
    - location: トレース 章冒頭の `relations.verifies` から本書を特定して `TR-xx` を見直す文
      category: canonical-restatement
      action: delete
      reason: rulebook の推奨 Frontmatter 項目の文とほぼ同じ言い直しで、表の内容には関係しないため削っても判断情報を失わない
      cause:
        type: document
    - location: 概要（`cash-sale`） 第2段落 役割分担の文
      category: canonical-restatement
      action: retain
      reason: 誰がどの受入判断に使うかは rulebook の本文要件でこの章が示すべき内容であり、対象固有の割り当てなので残す
      cause:
        type: document
    - location: 受入観点とケース 観点：会計確定の成立 意図
      category: repetition
      action: retain
      reason: 受入の責務と一部重なるが、意図の節は rulebook の本文要件で必須であり、観点の判定対象を1〜2行で示す役割があるため残す
      cause:
        type: document
    - location: 受入観点とケース 観点：主要操作の自力完了 条件・ケース表の2行
      category: repetition
      action: retain
      reason: 手順と期待値は同じだが、操作する代表（家族利用者代表・店主代表）が違う別の受入シナリオで、`case_id` と証跡を別に持つ必要があるため残す
      cause:
        type: document
    - location: 環境/データ/外部依存 判定保留条件 印刷失敗を AT の Fail にしない文
      category: unneeded-background
      action: retain
      reason: AT の合否判定に要る例外と、ST へ送る範囲の境界なので残す
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/specdojo/samples/atc-sample.md` の冗長さを整理しました。
- 概要の `status` 昇格に関する正本の言い直しと、トレース章冒頭の `relations.verifies` に関する言い直しを削除しました。
- 判断に必要な前提、例外、および完了条件（環境/データ/外部依存の判定保留条件など）は維持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-sample.md`: 概要における `status` の昇格に関する記述および、トレース章冒頭の `relations.verifies` に関する重複した説明を削除し、文書を簡潔にしました。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

文書内の繰り返し、正本の再掲、および目的に不要な背景を特定し、それらを削除または整理することで、意味と必須情報を維持したまま冗長さを排除しました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| ``概要（`cash-sale`） 第2段落 `status` を `ready` にする条件の文`` | `canonical-restatement` | `delete` | ``rulebook の全体方針で `status` の昇格はドキュメントメタ情報標準に従い成果物で言い直さないとされ、lint は業務の受入確認に含めない。前提解消の条件は「環境/データ/外部依存」の前提表の前の文に残っているので、判断情報は失われない`` | `document` |
| ``トレース 章冒頭の `relations.verifies` から本書を特定して `TR-xx` を見直す文`` | `canonical-restatement` | `delete` | `rulebook の推奨 Frontmatter 項目の文とほぼ同じ言い直しで、表の内容には関係しないため削っても判断情報を失わない` | `document` |
| ``概要（`cash-sale`） 第2段落 役割分担の文`` | `canonical-restatement` | `retain` | `誰がどの受入判断に使うかは rulebook の本文要件でこの章が示すべき内容であり、対象固有の割り当てなので残す` | `document` |
| `受入観点とケース 観点：会計確定の成立 意図` | `repetition` | `retain` | `受入の責務と一部重なるが、意図の節は rulebook の本文要件で必須であり、観点の判定対象を1〜2行で示す役割があるため残す` | `document` |
| `受入観点とケース 観点：主要操作の自力完了 条件・ケース表の2行` | `repetition` | `retain` | ``手順と期待値は同じだが、操作する代表（家族利用者代表・店主代表）が違う別の受入シナリオで、`case_id` と証跡を別に持つ必要があるため残す`` | `document` |
| `環境/データ/外部依存 判定保留条件 印刷失敗を AT の Fail にしない文` | `unneeded-background` | `retain` | `AT の合否判定に要る例外と、ST へ送る範囲の境界なので残す` | `document` |
