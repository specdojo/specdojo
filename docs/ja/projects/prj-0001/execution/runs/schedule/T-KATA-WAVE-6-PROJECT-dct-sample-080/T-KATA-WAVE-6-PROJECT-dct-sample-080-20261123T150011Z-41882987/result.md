---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-dct-sample-080-20261123t150011z-41882987
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-dct-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-dct-sample-080/T-KATA-WAVE-6-PROJECT-dct-sample-080-20261123T150011Z-41882987/plan.md
  started_at: "2026-11-23T15:00:14.133Z"
  completed_at: "2026-11-23T19:53:41.089Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - prj-0001:dct-sample
  condense_records:
    - location: dct-sample.yaml 冒頭の `_ASSUMPTION_` コメント「親は同梱の索引 sample とする。」
      category: repetition
      action: delete
      reason: '同じ関係を `part_of: [specdojo:dct-index-sample]` が示しており、コメントは繰り返しだった。例示値の前提は残したため意味は変わらない。'
      cause:
        type: document
    - location: dct-sample.yaml 冒頭の `_ASSUMPTION_` コメントの `prj-0001` が例示値であるという前提
      category: unneeded-background
      action: retain
      reason: SpecDojo 本体のプロジェクトと誤認しないための前提で、判断に要る。
      cause:
        type: document
    - location: dct-sample.yaml の deliverables 先頭の `_ASSUMPTION_` コメント(採用した成果物の理由)
      category: unneeded-background
      action: retain
      reason: 規模の既定に加えて成果物を採用した根拠で、判断に要る。
      cause:
        type: document
    - location: dct-sample.yaml の `brief` のアンカー `&project_baseline_brief` とエイリアス
      category: repetition
      action: retain
      reason: すでにアンカーで共有しており、これ以上まとめる余地がない。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- `dct-sample.yaml` の冗長さを 1 文書内で整理した。冒頭の `_ASSUMPTION_` コメントのうち、`part_of: [specdojo:dct-index-sample]` と重複する「親は同梱の索引 sample とする。」を削除した。
- ほかの候補は判断に要る背景・前提なので保持した。例示値 `prj-0001` の前提、成果物を採用した根拠、`brief` のアンカー `&project_baseline_brief` とエイリアスの 3 件である。
- `condense_records` は 4 件で、内訳は delete が 1 件、retain が 3 件。原因はすべて `document`。
- schema 検査（`validate:schema:file`）は valid だった。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dct-sample.yaml`: 冒頭の `_ASSUMPTION_` コメントから、`part_of` と同じ関係を述べる 1 文を削除した（1 行の変更）。例示値の前提とそれ以外の記述は変えていない。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

condense。繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲の候補を洗い出した。重複していた 1 文だけを削除し、判断に要る前提と既にアンカーで共有済みの記述は retain として理由を記録した。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| ``dct-sample.yaml 冒頭の `_ASSUMPTION_` コメント「親は同梱の索引 sample とする。」`` | `repetition` | `delete` | ``同じ関係を `part_of: [specdojo:dct-index-sample]` が示しており、コメントは繰り返しだった。例示値の前提は残したため意味は変わらない。`` | `document` |
| ``dct-sample.yaml 冒頭の `_ASSUMPTION_` コメントの `prj-0001` が例示値であるという前提`` | `unneeded-background` | `retain` | `SpecDojo 本体のプロジェクトと誤認しないための前提で、判断に要る。` | `document` |
| ``dct-sample.yaml の deliverables 先頭の `_ASSUMPTION_` コメント(採用した成果物の理由)`` | `unneeded-background` | `retain` | `規模の既定に加えて成果物を採用した根拠で、判断に要る。` | `document` |
| ``dct-sample.yaml の `brief` のアンカー `&project_baseline_brief` とエイリアス`` | `repetition` | `retain` | `すでにアンカーで共有しており、これ以上まとめる余地がない。` | `document` |
