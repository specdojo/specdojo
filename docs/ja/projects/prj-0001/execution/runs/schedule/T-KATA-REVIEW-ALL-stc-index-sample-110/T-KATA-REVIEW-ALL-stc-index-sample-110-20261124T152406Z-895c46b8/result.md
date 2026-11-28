---
specdojo:
  id: prj-0001:xer-t-kata-review-all-stc-index-sample-110-20261124t152406z-895c46b8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-stc-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-stc-index-sample-110/T-KATA-REVIEW-ALL-stc-index-sample-110-20261124T152406Z-895c46b8/plan.md
  started_at: "2026-11-24T15:24:19.113Z"
  completed_at: "2026-11-24T17:50:44.617Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-index-sample
    - specdojo:stc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施し、`docs/ja/specdojo/samples/stc-index-sample.md` の第8章（ケース表の共通カラム）だけを直しました。
- 指摘 R1-1（要判断）: 第8章に対象別カタログと同じ2ケースを再掲しており、共通方針と個別ケースの責務が重なっていました。個別ケース表を対象別カタログへの参照に置き換え、観測点と値を含む期待値の例は本文に残しました。 - 段: R1 - 箇所: 8. ケース表の共通カラム - 根拠: `vp-qe-kata-conformance`（種別の責務）、`vp-arc-single-responsibility`。`stc-index-rulebook` 第1章、`test-document-scope-standard` 2.2・3.4、Sample 記述標準 第5・6章。 - 迷った点: 少数の記入例を残す案も rulebook の大量列挙禁止には抵触しません。ただし、期待値の例と参照で `done_criteria` を満たせると判断し、削除案を採りました。
- 指摘 R1-2: 共通カラムは定義されていたものの、ケース表の1行が表す単位が明記されていませんでした。「条件と期待値が一意の1テストを1行とする」共通ルールを追加しました。根拠は `vp-qe-kata-conformance`（種別の責務）と `stc-index-rulebook` 6.8 の行単位の定義です。
- executor の検証は、対象 sample の整形（`npx prettier --write`）と `git diff --check` が通過しました。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-index-sample.md`: 第8章で、対象別カタログと重複していた個別ケース表（2ケース）を `stc-sample` への参照に置き換えました。観測点と値を含む期待値の例は本文に残しました。条件と期待値が一意の1テストを1行とする共通ルールを追加しました。2 insertions、9 deletions です。

## 3. 申し送り

- F001（`vp-pm-control-reporting`）は変更していません。kata-guide 6.3 で段のレビューから除外されているためです。引継ぎ先 PJR の記載が kata 相互の整合として必要かは、R5 で判断してください。
- F002 は R1 では直していません。P0 の対象に性能基準（`会計確定応答`）が含まれるかは検証可能性の論点で、R4 に委ねます。次のアクションは、TSP の出口条件と照合し、第7章の P0 対象へ性能基準を含めるか確認することです。
- F003 は R1 では直していません。第2章の店主代表と第7章の QE の役割の矛盾は、`vp-qe-omissions-consistency` を扱う R2 に委ねます。次のアクションは、復元操作と実施・照合・判定の役割分担を確認して記述を揃えることです。
- F004 は R1 では直していません。用紙切れの観点名が概要では `会計維持`、対象別 `stc-sample` では `未確定停止` と食い違っています。kata 相互の整合を扱う R5 に委ねます。対象外の `stc-sample.md` は変更していません。
- F005 は、概要側の個別ケース表の削除で重複記載がなくなりました。対象別の `case_id` とトレースは変更していません。トレース対応の正しさは R5 で確認してください。
- R1-1: R1 / 8. ケース表の共通カラム / 対象別カタログと同じ2ケースを概要にも保持しており、共通方針と個別ケースの責務が重なる / 個別ケース表を対象別カタログへの参照に置き換え、観測点と値を含む期待値の例を本文に残した / `vp-qe-kata-conformance`（種別の責務）、`vp-arc-single-responsibility`。stc-index-rulebook 第1章、test-document-scope-standard 2.2・3.4、Sample 記述標準 第5・6章に基づく。少数の記入例を維持する案も rulebook の大量列挙禁止には抵触しないため迷ったが、期待値の例と参照で `done_criteria` を満たせる案を採った / 要判断
- R1-2: R1 / 8. ケース表の共通カラム / 共通カラムは定義されているが、ケース表の1行が表す単位が明記されていない / 条件と期待値が一意の1テストを1行とする共通ルールを追加した / `vp-qe-kata-conformance`（種別の責務）。stc-index-rulebook 6.8 の行単位の定義に基づく / -
- reporter の「進め方と実践の型の適用」用根拠: [[specdojo:kata-guide|実践の型活用ガイド]] 6.1・6.3・6.5、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:stc-index-rulebook|総合テストカタログ 概要 作成ルール]]、[[specdojo:test-document-scope-standard|テストドキュメントスコープ定義標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]]、`docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml` の対象項目と `done_criteria`、`docs/ja/projects/prj-0001/execution/grade/results/specdojo.stc-index-sample.yaml`、[[specdojo:tsp-index-sample|テスト戦略・方針]]、[[specdojo:stc-sample|総合テストカタログ 対象別]] を確認した。grade の F001〜F005 は anchor と現行本文を照合した。condense 由来の記録は plan にない。rulebook の `recipe`・`template` は `not-needed`。必須章、共通カラム、優先度別合格基準、観測点を含む期待値の例、`based_on`、`status: draft` を維持した。変更ファイルは `docs/ja/specdojo/samples/stc-index-sample.md` のみ。
- F001 の扱い: `vp-pm-control-reporting` は kata-guide 6.3 で段のレビューから除外されているため変更しなかった。TSP の引継ぎ先 `kinuya:pjr-i006`・`kinuya:pjr-i003` とメタ情報標準の規範は確認済み。kata 相互の整合として対応する必要性は後続 R5 で判断する。
- F002 の扱い: P0 の対象に性能基準が含まれるかの検証可能性は R4 に委ねた。次のアクションは、TSP の出口条件と照合し、第7章の P0 対象へ性能基準を含めるか確認すること。
- F003 の扱い: 第2章の店主代表と第7章の QE の役割の矛盾は、`vp-qe-omissions-consistency` を扱う R2 に委ねた。次のアクションは、復元操作と実施・照合・判定の役割分担を確認して記述を揃えること。
- F004 の扱い: 用紙切れの観点名が概要では「会計維持」、対象別では「未確定停止」であることを確認した。kata 相互の整合を扱う R5 に委ねる。対象外の `stc-sample.md` は変更していない。
- F005 の扱い: R1 の責務整理で概要の個別ケース表を削除したため、概要側のトレースの重複記載はなくなった。対象別の `case_id` とトレースは変更していない。トレース対応の正しさは R5 で確認する。親 runner に指定された lint・テスト・schema 検査は executor では実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下に変更がない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

根拠として、kata-guide 6.1・6.3・6.5、Sample 記述標準、`stc-index-rulebook`、`test-document-scope-standard`、ドキュメントメタ情報標準、共通レビュー観点一覧を確認しました。あわせて `dct-kata.yaml` の対象項目と `done_criteria`、grade result（`specdojo.stc-index-sample.yaml`）、`tsp-index-sample`、`stc-sample` も確認しました。grade の F001〜F005 は anchor と現行本文を照合しました。condense 由来の記録は plan にありません。rulebook の `recipe` と `template` は `not-needed` です。改訂した箇所は第8章だけで、根拠は R1 の責務整理（共通方針に個別ケースを重複させない）と rulebook 6.8 の行単位の定義です。必須章、共通カラム、優先度別合格基準、観測点を含む期待値の例、`based_on`、`status: draft` は維持しました。F001〜F004 は R1 の観点に当たらないため、後続の段へ申し送りました。F005 は第8章の整理で解消しました。rulebook など sample 以外は変更していません。
