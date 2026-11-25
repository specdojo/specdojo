---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-index-sample-120-20261125t210102z-760793ad
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-index-sample-120/T-KATA-REVIEW-ALL-ifx-index-sample-120-20261125T210102Z-760793ad/plan.md
  started_at: "2026-11-25T21:01:11.406Z"
  completed_at: "2026-11-25T21:07:10.006Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-index-sample
    - specdojo:ifx-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの R2（構成）として `ifx-index-sample.yaml` を見直した。冒頭のコメントと末尾の `_TODO_` の並びで、前提と残作業の置き場を整理した。
- 冒頭にあった詳細仕様の状態と TBD の扱いの 2 行を削った。同じ内容が各連携の中のコメントにあり、rulebook の「詳細参照と未決事項」の繰り返しだったため。
- 末尾の「スコープ・方式の変更時は ARC が…」の 2 行を冒頭のロール参照の直後へ移した。冒頭を対象範囲・前提・取り決め、末尾を未完了の `_TODO_` だけにした。
- schema 検査と Prettier 検査は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。
- grade の F001 は観点 `vp-qe-kata-conformance` で R2 の観点ではない。この段では扱わず、R5 へ回した。template の食い違いは人の判断に回した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R2 | docs/ja/specdojo/samples/ifx-index-sample.yaml 冒頭のコメント（旧 17〜18 行「本部の詳細仕様は、売上登録が作成済みで…」「未作成の `spec_ref` は TBD とし…」） | 連携ごとの詳細仕様の状態を一覧の冒頭にも書いていて、各連携の中のコメント（商品照会の `_TODO_`、売上登録の「詳細契約:」）と同じ内容が 2 か所にある。2 文目の TBD の扱いは rulebook の「本文要件」と「詳細参照と未決事項」の繰り返し。rulebook は、冒頭には共通の条件を、契約ごとの条件は連携の側に置くとしている。 | 2 行を削り、詳細仕様の状態は各連携の中のコメントだけに残した（sample へ反映済み）。 | ifx-index-rulebook の「詳細参照と未決事項」、`vp-arc-document-structure` | - |
| 2 | R2 | docs/ja/specdojo/samples/ifx-index-sample.yaml 末尾のコメント（旧 95〜96 行「スコープ・方式の変更時は ARC が…」） | 末尾は Schedule・PJR への登録依頼などの `_TODO_` の並びで、その直後にラベルのない「いつも守る変更時の手順」が続いている。表示のページでは TODO の続きに読め、前提（取り決め）と残作業の区別がつかない。 | 2 行を冒頭のロール参照の直後へ移し、冒頭は対象範囲・前提・取り決め、末尾は未完了の `_TODO_` だけにした（sample へ反映済み）。 | ifx-index-rulebook の「ファイル命名・ID規則」「合意・計画・課題への引き継ぎ」「表示ページでのレビュー」、`vp-arc-document-structure` | - |
| 3 | R2 | docs/ja/specdojo/templates/ifx-index-template.yaml 冒頭の `_TODO_`（「一覧の管理担当 Role code、人間の PO による承認・公開判断の対象と公開先を記す」） | template は一覧の冒頭に管理担当と、PO の承認・公開判断を書くよう求めている。一方、rulebook の「本文要件」の冒頭コメントは対象範囲・境界・対象外・仮定だけを求め、承認は「全体方針」でドキュメントメタ情報標準に任せている。R1 は rulebook に合わせて sample からこの記述を削った。sample と template の冒頭の構成が合っていない。 | template の該当の `_TODO_` を削り、rulebook の冒頭コメントの要件（対象範囲・境界・対象外・仮定）に合わせる案。template は変更していない。直すかどうかは人が決める。 | ifx-index-rulebook の「全体方針」と「本文要件」の冒頭コメント、ifx-index-template.yaml の冒頭 2 行目の `_TODO_` | 要判断 |
| 4 | R2 | grade の finding F001（売上登録の `spec_ref: specdojo:ifx-api-sample` と specdojo:clis-sample の入出力表の参照） | 観点 `vp-qe-kata-conformance` は kata-guide で R1・R5 に割り当てられ、R2 の観点（`vp-arc-document-structure`、`vp-qe-omissions-consistency`）ではないため、この段では扱っていない。 | R5（整合）で、specdojo:clis-sample の入出力表の `ifx-api-kinuya-sales.yaml` の参照を specdojo:ifx-api-sample にそろえる案を clis-sample の側へ出す。 | kata-guide の「kata の観点の組」、plan の「このフェーズで行うこと」（この段の観点に当たる finding だけを扱う） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-index-sample.yaml`: 冒頭の詳細仕様の状態と TBD の扱いのコメント 2 行を削除した。末尾にあった変更時の手順のコメント 2 行を冒頭のロール参照の直後へ移した。2 行追加・4 行削除。

## 3. 申し送り

- F001（売上登録の `spec_ref` と `specdojo:clis-sample` の参照のずれ）は R5（整合）で扱う。No: 4 に案を書いた。
- No: 3 は template の変更を伴うため、この段では変更せず、直すかどうかを人が決める。
- No: 1 / 段: R2 / 箇所: docs/ja/specdojo/samples/ifx-index-sample.yaml 冒頭のコメント（旧 17〜18 行「本部の詳細仕様は、売上登録が作成済みで…」「未作成の `spec_ref` は TBD とし…」） / 指摘: 連携ごとの詳細仕様の状態を一覧の冒頭にも書いていて、各連携の中のコメント（商品照会の `_TODO_`、売上登録の「詳細契約:」）と同じ内容が 2 か所にある。2 文目の TBD の扱いは rulebook の「本文要件」と「詳細参照と未決事項」の繰り返し。rulebook の「詳細参照と未決事項」は、冒頭には共通の条件を、契約ごとの条件は連携の側に置くとしている。 / 直した案: 2 行を削り、詳細仕様の状態は各連携の中のコメントだけに残した（sample へ反映済み） / 根拠: ifx-index-rulebook の「詳細参照と未決事項」（共通条件は一覧冒頭、契約固有条件は詳細仕様が正本）、`vp-arc-document-structure` / 印: -
- No: 2 / 段: R2 / 箇所: docs/ja/specdojo/samples/ifx-index-sample.yaml 末尾のコメント（旧 95〜96 行「スコープ・方式の変更時は ARC が…」） / 指摘: 末尾は Schedule・PJR への登録依頼などの `_TODO_` の並びで、その直後にラベルのない「いつも守る変更時の手順」が続いている。表示のページでは TODO の続きに読め、前提（取り決め）と残作業の区別がつかない。 / 直した案: 2 行を冒頭のロール参照の直後へ移し、冒頭は対象範囲・前提・取り決め、末尾は未完了の `_TODO_` だけにした（sample へ反映済み） / 根拠: ifx-index-rulebook の「ファイル命名・ID規則」（連携の追加・廃止・方式変更で影響を特定する）と「合意・計画・課題への引き継ぎ」、「表示ページでのレビュー」（行頭から始まるコメントは一覧全体の注記になる）、`vp-arc-document-structure` / 印: -
- No: 3 / 段: R2 / 箇所: docs/ja/specdojo/templates/ifx-index-template.yaml 冒頭の `_TODO_`（「一覧の管理担当 Role code、人間の PO による承認・公開判断の対象と公開先を記す」） / 指摘: template は一覧の冒頭に管理担当と、PO の承認・公開判断を書くよう求めている。一方、rulebook の「本文要件」の冒頭コメントは対象範囲・境界・対象外・仮定だけを求め、承認は「全体方針」でドキュメントメタ情報標準に任せている。R1 は rulebook に合わせて、sample からこの記述を削った。sample と template の冒頭の構成が合っていない。 / 直した案: template の該当の `_TODO_` を削り、rulebook の冒頭コメントの要件（対象範囲・境界・対象外・仮定）に合わせる（template は変更していない。直すかどうかは人が決める） / 根拠: ifx-index-rulebook の「全体方針」の共通の運用と「本文要件」の冒頭コメント、ifx-index-template.yaml の冒頭 2 行目の `_TODO_` / 印: 要判断
- No: 4 / 段: R2 / 箇所: grade の finding F001（売上登録の `spec_ref: specdojo:ifx-api-sample` と specdojo:clis-sample の入出力表の参照） / 指摘: 観点 `vp-qe-kata-conformance` は kata-guide で R1・R5 に割り当てられ、R2 の観点（`vp-arc-document-structure`、`vp-qe-omissions-consistency`）ではないため、この段では扱っていない。 / 直した案: R5（整合）で、specdojo:clis-sample の入出力表の `ifx-api-kinuya-sales.yaml` の参照を specdojo:ifx-api-sample にそろえる案を clis-sample の側へ出す / 根拠: kata-guide の「kata の観点の組」、plan の「このフェーズで行うこと」（この段の観点に当たる finding だけを扱う） / 印: -
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ifx-index-sample.yaml だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R2 として、`ifx-index-rulebook` の「詳細参照と未決事項」「本文要件」「表示ページでのレビュー」と `vp-arc-document-structure` を根拠に、冒頭と末尾のコメントの構成だけを直した。rulebook と template など sample 以外は変更していない。F001 は R2 の観点に当たらないため扱わず、No: 4 として R5 に回した。
