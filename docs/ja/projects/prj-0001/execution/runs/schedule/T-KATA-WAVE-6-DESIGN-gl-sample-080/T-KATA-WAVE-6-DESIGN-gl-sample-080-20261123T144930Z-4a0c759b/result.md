---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-gl-sample-080-20261123t144930z-4a0c759b
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-gl-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-gl-sample-080/T-KATA-WAVE-6-DESIGN-gl-sample-080-20261123T144930Z-4a0c759b/plan.md
  started_at: "2026-11-23T14:49:32.350Z"
  completed_at: "2026-11-23T14:58:38.098Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - prj-0001:gl-sample
  condense_records:
    - location: tm-sales-customer の `notes`「つけを利用できるのは顧客のうち常連客だけである」
      category: repetition
      action: delete
      reason: tm-sales-regular-customer の `definition`（顧客のうち、店主代表がつけの利用を認めた人）と同じ内容で、顧客の定義の判断に要らない。
      cause:
        type: document
    - location: tm-shop-owner の `notes`「家族が店番をする場合も、常連客や定番商品の選定は店主代表が決める」
      category: canonical-restatement
      action: delete
      reason: 常連客と定番商品の選定者は tm-sales-regular-customer と tm-standard-product の `definition` が正本で、店番の家族の扱いは tm-sales-regular-customer の `notes` に残っている。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- `gl-sample.yaml` において、冗長な `notes` を 2 件削除し、情報の整理を行った。`tm-sales-customer` の `notes` および `tm-shop-owner` の `notes` に含まれていた、他の用語の `definition` で説明されている重複内容を削除した。これにより、定義と補足説明の役割分担を明確にし、意味と必須情報を維持したまま簡素化した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/gl-sample.yaml`: `tm-sales-customer` の `notes` に含まれていた、`tm-sales-regular-customer` の `definition` と重複する記述、および `tm-shop-owner` の `notes` に含まれていた、`tm-sales-regular-customer` と `tm-standard-product` の `definition` で正本として扱われる内容を削除した。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

対象文書の `notes` フィールドを精査し、`repetition`（繰り返し）および `canonical-restatement`（正本の再掲）に該当する箇所を特定して削除した。削除にあたっては、判断に要る背景や制約を損なわないよう留意した。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| ``tm-sales-customer の `notes`「つけを利用できるのは顧客のうち常連客だけである」`` | `repetition` | `delete` | ``tm-sales-regular-customer の `definition`（顧客のうち、店主代表がつけの利用を認めた人）と同じ内容で、顧客の定義の判断に要らない。`` | `document` |
| ``tm-shop-owner の `notes`「家族が店番をする場合も、常連客や定番商品の選定は店主代表が決める」`` | `canonical-restatement` | `delete` | ``常連客と定番商品の選定者は tm-sales-regular-customer と tm-standard-product の `definition` が正本で、店番の家族の扱いは tm-sales-regular-customer の `notes` に残っている。`` | `document` |
