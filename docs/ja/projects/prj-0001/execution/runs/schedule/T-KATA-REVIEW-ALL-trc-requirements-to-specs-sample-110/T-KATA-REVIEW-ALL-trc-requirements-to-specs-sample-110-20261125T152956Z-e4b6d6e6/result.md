---
specdojo:
  id: prj-0001:xer-t-kata-review-all-trc-requirements-to-specs-sample-110-20261125t152956z-e4b6d6e6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-110/T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-110-20261125T152956Z-e4b6d6e6/plan.md
  started_at: "2026-11-25T15:30:06.189Z"
  completed_at: "2026-11-25T15:37:05.414Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-specs-sample
    - specdojo:trc-requirements-to-specs-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `trc-requirements-to-specs-sample` を確かめ、要らない内容 2 件を削り、導入文と中身の不一致 1 件を直した。
- grade の F001（使う人の欄の表記）は観点 `vp-ux-language-consistency` で R3 が扱うため、この段では直さず申し送った。
- 検証は prettier、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ほかは変更種別により非適用だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | 「トレース対象の前提」の末尾 | 「本書が参照する要求一覧と仕様文書は、いずれも未同梱の架空参照名である。」は sample についての注記で、トレースビューの責務に入らない、要らない内容。 | 文を削除した。 | Sample 記述標準の「記述ガイド」、`vp-po-purpose-alignment` | - |
| 2 | R1 | 「ギャップと対応方針」の末尾 | 「実案件の PJR 個票は未同梱である。」は sample についての注記で、成果物の内容ではない。 | 文を削除し、担当と期限を登録簿で追うという rulebook の求めの 1 文だけを残した。 | rulebook の「記述ガイド」の「ギャップと対応方針」、Sample 記述標準の「記述ガイド」 | - |
| 3 | R1 | 「充足状況サマリ」の優先リストの導入文 | 導入文は「優先して解消する要求と理由」だが、3 番目の項目は仕様の `bes-product-master` で、導入文と中身が合わない。 | 導入文を「優先して解消する要求と、要求に対応しない仕様、その理由は次のとおり。」に直した。rulebook は「優先して解消する要求 ID と理由」を求めるので、3 番目を外して要求 ID だけにする案もある。 | rulebook の「本文要件」の「充足状況サマリ」の行、`vp-qe-kata-conformance` | 要判断 |
| 4 | R1（R3 へ申し送り） | 「目的と適用範囲」の使う場面の表の「使う人」の欄（grade F001） | 使う人の欄が通称（開発担当・店主代表・同行レビュー担当）で書かれ、Role code にそろっていない。観点 `vp-ux-language-consistency` は R3 が扱うため、R1 では直していない。 | R3 で、Role code（DEV・PO など）にそろえるか、Sample 記述標準の「共通サンプル文脈」の役割名のままにして理由を残すかを決める。 | kata-guide の「kata の観点の組」、Sample 記述標準の「共通登場人物」 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/trc-requirements-to-specs-sample.md`: 「トレース対象の前提」末尾の未同梱の架空参照名の注記と、「ギャップと対応方針」末尾の PJR 個票未同梱の注記を削った。担当と期限を登録簿で追う 1 文は残した。「充足状況サマリ」の優先リストの導入文は、要求に対応しない仕様 `bes-product-master` も並ぶ中身に合わせて直した。

## 3. 申し送り

- F001 は R3 に申し送る。R1 では「使う人」の欄を、成果物が扱う利用場面の関係者として残した。
- 成果物カタログにこの型の `done_criteria` は見つからず、R1 は rulebook と Sample 記述標準を基準に確かめた。
- No: 1 / 段: R1 / 箇所: 「トレース対象の前提」の末尾 / 指摘: 「本書が参照する要求一覧と仕様文書は、いずれも未同梱の架空参照名である。」は sample についての注記で、トレースビューの責務（rulebook の「本文要件」）に入らない、要らない内容 / 直した案: 文を削除した / 根拠: Sample 記述標準の「記述ガイド」（ない文書はバッククォートで仮置きする規約は標準が持つ）、`vp-po-purpose-alignment` / 印: なし
- No: 2 / 段: R1 / 箇所: 「ギャップと対応方針」の末尾 / 指摘: 「実案件の PJR 個票は未同梱である。」は sample についての注記で、成果物の内容ではない / 直した案: 文を削除し、担当と期限を登録簿で追うという rulebook の求めの 1 文だけを残した / 根拠: rulebook の「記述ガイド」の「ギャップと対応方針」、Sample 記述標準の「記述ガイド」 / 印: なし
- No: 3 / 段: R1 / 箇所: 「充足状況サマリ」の優先リストの導入文 / 指摘: 導入文は「優先して解消する要求と理由」だが、3 番目の項目は仕様の `bes-product-master` で、導入文と中身が合わない / 直した案: 導入文を「優先して解消する要求と、要求に対応しない仕様、その理由は次のとおり。」に直した。rulebook は「優先して解消する要求 ID と理由」を求めるので、3 番目を外して要求 ID だけにする案もある / 根拠: rulebook の「本文要件」の「充足状況サマリ」の行、`vp-qe-kata-conformance` / 印: 要判断
- No: 4 / 段: R1（R3 へ申し送り） / 箇所: 「目的と適用範囲」の使う場面の表の「使う人」の欄（grade F001） / 指摘: 使う人の欄が通称（開発担当・店主代表・同行レビュー担当）で書かれ、Role code にそろっていない。観点 `vp-ux-language-consistency` は R3 が扱うため、R1 では直していない。R1 では、この欄を成果物が扱う利用場面の関係者と見て残した / 直した案: R3 で、Role code（DEV・PO など）にそろえるか、Sample 記述標準の「共通サンプル文脈」の役割名のままにして理由を残すかを決める / 根拠: kata-guide の「kata の観点の組」、Sample 記述標準の「共通登場人物」（責務を表す項目は Role code、本文と表の表示名は役割名） / 印: 要判断
- 成果物カタログに、この型の `done_criteria` は見つからなかった（docs/ja/specdojo と docs/specdojo を検索して該当なし）。R1 は rulebook と Sample 記述標準を基準に確かめた。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは `*.md` だけで、`*.yaml` / `*.yml` を変更していない）

## 4. 進め方と実践の型の適用

sample 以外は変更せず、rulebook の「本文要件」「記述ガイド」と Sample 記述標準を基準に、要る内容の欠落と要らない内容の混入を確かめた。sample についての注記は成果物の内容ではないため削った。優先リストの導入文は中身に合わせて直した。ただし 3 番目の項目を外して要求 ID だけにする案もあり、要判断とした。
