---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-availability-sample-080-20261123t141053z-a0c23b6d
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-availability-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-availability-sample-080/T-KATA-WAVE-4-nfr-availability-sample-080-20261123T141053Z-a0c23b6d/plan.md
  started_at: "2026-11-23T14:10:55.731Z"
  completed_at: "2026-11-23T14:23:48.523Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:nfr-availability-sample
  condense_records:
    - location: 2. 適用範囲・除外条件 末尾の段落
      category: canonical-restatement
      action: reference
      reason: ホスティング環境と店舗の回線の SLA 未確認の説明が「未決事項」の行と重複していたため、「未決事項」への参照に置き換えた。リスクの置き場所の指示は残した。
      cause:
        type: document
    - location: 3. 可用性要件一覧 導入文
      category: repetition
      action: delete
      reason: 「決まるまでの」は暫定判定の記述と重複していたため削った。暫定判定を併記する旨は残した。
      cause:
        type: document
    - location: 1. 概要の業務影響の箇条書きと 4. 測定・検証方法の判定規則
      category: unneeded-background
      action: retain
      reason: 基準値の厳しさを決める根拠と pass / fail の判定規則であり、判断に必要なので残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- nfr-availability-sample.md の冗長な箇所を、参照への置き換えおよび削除によって整理しました。
- 「2. 適用範囲・除外条件」末尾の段落において、未決事項の行との重複を解消するため、「未決事項」への参照に置き換えを行いました。
- 「3. 可用性要件一覧」の導入文において、暫定判定の記述との重複を避けるため、一部の記述を削除しました。
- 判断に不可欠な基準値の根拠や、pass / fail の判定規則については、意図的に保持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-availability-sample.md`: 「2. 適用範囲・除外条件」における未決事項の説明を、重複を避けるために「未決事項」の行への参照に置き換えました。また、「3. 可用性要件一覧」の導入文から、暫定判定の記述と重複する内容を削除し、冗長さを解消しました。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

既存の文書内の重複（`repetition`）、表と本文の二重説明（`table-prose`）、目的に不要な背景（`unneeded-background`）を特定し、`delete`（削除）、`merge`（統合）、`reference`（参照への置き換え）によって整理しました。判断に要する重要な背景・制約・完了条件は適切に `retain`（保持）しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `2. 適用範囲・除外条件 末尾の段落` | `canonical-restatement` | `reference` | `ホスティング環境と店舗の回線の SLA 未確認の説明が「未決事項」の行と重複していたため、「未決事項」への参照に置き換えた。リスクの置き場所の指示は残した。` | `document` |
| `3. 可用性要件一覧 導入文` | `repetition` | `delete` | `「決まるまでの」は暫定判定の記述と重複していたため削った。暫定判定を併記する旨は残した。` | `document` |
| `1. 概要の業務影響の箇条書きと 4. 測定・検証方法の判定規則` | `unneeded-background` | `retain` | `基準値の厳しさを決める根拠と pass / fail の判定規則であり、判断に必要なので残した。` | `document` |
