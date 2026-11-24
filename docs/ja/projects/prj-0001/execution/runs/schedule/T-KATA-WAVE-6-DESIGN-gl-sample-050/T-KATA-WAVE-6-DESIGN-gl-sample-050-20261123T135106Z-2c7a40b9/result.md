---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-gl-sample-050-20261123t135106z-2c7a40b9
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-gl-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-gl-sample-050/T-KATA-WAVE-6-DESIGN-gl-sample-050-20261123T135106Z-2c7a40b9/plan.md
  started_at: "2026-11-23T13:51:20.375Z"
  completed_at: "2026-11-23T14:05:43.798Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:gl-sample
    - specdojo:gl-sample
---

# Edit Result

## 1. 実施内容

- 用語集の完成例である `docs/ja/specdojo/samples/gl-sample.yaml` を、`grade` による指摘事項（F001〜F006）に基づいて拡充・修正しました。
- 具体的には、'顧客' および '常連客' の用語追加、全用語における `status` の一貫性の確保、`id` 命名規則の修正、および『商品』の正本に関する案内を追加しました。
- また、'安全在庫' と '発注点' の境界に関する注記の追加、および用語の表記（'店主代表'）の統一を行っています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/gl-sample.yaml`: `grade` の指摘事項 F001〜F006 に基づき、用語の追加（顧客・常連客）、`status` の記述の統一、`id` 規則への適合、および「商品」の正本（`gl-common`）への案内、安全在庫と発注点の境界に関する注記の追加、および店主に関する表記の統一を行いました。

## 3. 申し送り

- 冒頭のコメントで「商品」の正本として挙げた gl-common（`tm-common-product`）は、同梱の sample にはない。rulebook の「記述ガイド」にある「別ファイルの商品は文書リンクで案内する」に合わせた仮の名前。共通用語集の sample を作るか、コメントの書き方を変えるかを今後判断する。
- rulebook の変更案（任意）: 用語の `status` をすべての用語に付けるのか、`candidate` と `deprecated` だけに付けて unspecifed を採用済みとみなすのかを rulebook の「terms の項目」に書くと、今回の F002 のような揺れを防げる。
- rulebook の変更案（任意）: 用語の status をすべての用語に付けるのか、candidate と deprecated だけに付けて無指定を採用済みとみなすのかを rulebook の「terms の項目」に書くと、今回の F002 のような揺れを防げる。

## 4. 進め方と実践の型の適用

`grade` の指摘に基づき、単一店舗の販売・在庫・つけ管理を扱う sample としての厚みを出し、完成例としての有用性を高めました。
