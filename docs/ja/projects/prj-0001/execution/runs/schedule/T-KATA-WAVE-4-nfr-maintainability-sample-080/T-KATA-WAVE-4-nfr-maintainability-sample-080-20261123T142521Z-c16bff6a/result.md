---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-maintainability-sample-080-20261123t142521z-c16bff6a
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-maintainability-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-maintainability-sample-080/T-KATA-WAVE-4-nfr-maintainability-sample-080-20261123T142521Z-c16bff6a/plan.md
  started_at: "2026-11-23T14:25:24.307Z"
  completed_at: "2026-11-23T14:35:04.244Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:nfr-maintainability-sample
  condense_records:
    - location: '## 2. 適用範囲・前提条件 の冒頭の対象を述べる 1 文'
      category: table-prose
      action: delete
      reason: 直後の表の「対象システム」「対象の保守作業」と同じ内容の二重説明。表に同じ情報があり、意味は維持される。
      cause:
        type: document
    - location: '## 4. 測定・検証方法 の箇条書き 1 つ目（閾値が `_UNDECIDED_` の要件）'
      category: canonical-restatement
      action: reference
      reason: 月次の報告という「決まるまでの扱い」は概要の未決事項の表が正本。箇条書きでは同表への参照に置き換え、登録簿への引き継ぎは残した。
      cause:
        type: document
    - location: '## 1. 概要（対象・目的） の「切り分けや切り戻しが長引くと…」の文'
      category: unneeded-background
      action: retain
      reason: 紙の販売控えへ切り替える理由と、30 分の基準の根拠を示す背景。判断に要るため削らない。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書の冗長な 2 箇所を修正し、1 箇所を意味保持のため残しました。
- `markdownlint-cli2` と `prettier` のチェックは通過しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-maintainability-sample.md`: 「## 2. 適用範囲・前提条件」冒頭の重複した説明を削除し、「## 4. 測定・検証方法」の箇条書きを概要の表への参照に置き換えることで、文書の冗長さを整理しました。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

文書内の繰り返しや、表と本文の二重説明を解消するために、削除・集約・参照への置き換えを行いました。判断に不可欠な背景情報は維持しています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `## 2. 適用範囲・前提条件 の冒頭の対象を述べる 1 文` | `table-prose` | `delete` | `直後の表の「対象システム」「対象の保守作業」と同じ内容の二重説明。表に同じ情報があり、意味は維持される。` | `document` |
| ``## 4. 測定・検証方法 の箇条書き 1 つ目（閾値が `_UNDECIDED_` の要件）`` | `canonical-restatement` | `reference` | `月次の報告という「決まるまでの扱い」は概要の未決事項の表が正本。箇条書きでは同表への参照に置き換え、登録簿への引き継ぎは残した。` | `document` |
| `## 1. 概要（対象・目的） の「切り分けや切り戻しが長引くと…」の文` | `unneeded-background` | `retain` | `紙の販売控えへ切り替える理由と、30 分の基準の根拠を示す背景。判断に要るため削らない。` | `document` |
