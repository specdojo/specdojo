---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-utc-index-040-20261118t100847z-248318a6
  type: exec-result
  task_id: T-KATA-SLIM-2-utc-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-utc-index-040/T-KATA-SLIM-2-utc-index-040-20261118T100847Z-248318a6/plan.md
  started_at: "2026-11-18T10:08:55.737Z"
  completed_at: "2026-11-18T10:40:35.096Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - utc-index
    - specdojo:utc-index-rulebook
---

# Edit Result

## 1. 実施内容

- `utc-index-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。
- 全体方針に「共通の運用」を1項目だけ置いた。役割は適用先のメンバー定義、状態・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照する。
- 共通メタ情報の再掲と文書 lint の検討例を削減し、未決事項の論点・影響は残した。
- 空白・改行を除く文字数は 9,618 字から 7,140 字になった(74.24%、目安の8割以下)。
- 整形・差分検査は executor で合格した。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も合格した。
- F001(`vp-qe-kata-conformance`)は未解消。原因は対象外の sample `utc-index-sample.md` の構成が rulebook の必須8章と一致しないことで、sample の再構成が必要である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/utc-index-rulebook.md`: 共通運用(役割・状態・承認・改訂と廃止・未決事項の引き継ぎ)を標準への参照に集約した。共通メタ情報の再掲、文書 lint の検討例、本文要件を言い直しただけの記述を削減した。末尾の例示小節 8.1〜8.9 は最小のコードブロック例にまとめ、固有の除外例・例外条件は記述ガイドへ移した。旧例示の SQL 検証の UT 例外は境界/依存の本文と矛盾していたため、本文の IT 委譲に合わせた。既存要件を照合する業務の受入確認を3手順で明示した。成果物9章の名称・順序・必須/任意区分、ケース表の必須・推奨列、Frontmatter は変更していない。

## 3. 申し送り

- F001 は未解消。`docs/ja/specdojo/samples/utc-index-sample.md` が独自の5章構成で、rulebook の必須8章と順序に一致しない。次のアクションは、sample を必須8章を満たす完成最小例に再構成することである。任意の「メモ / 将来課題」には論点・影響を書く。その後に再評価する。grade サイドカーは未編集。
- 根拠成果物 `utc-index.md` とカタログ宣言先の `tsp-index.md` は未作成だった。そのため改訂は、カタログ・関連規範・rulebook・sample・grade result で確認できた範囲に限った。成果物本体は作成・変更していない。
- `recipe` と `template` は `undecided` のまま。`includes` 宣言はないため、同時に簡潔化する記法 rulebook はない。共通の正本への追加提案はない。
- 変更ファイルは docs/ja/specdojo/rulebooks/utc-index-rulebook.md のみ。全体方針の「共通の運用」を1項目とし、役割は適用先のメンバー定義、状態・承認・改訂廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ参照化した。共通メタ情報の再掲と文書 lint の検討例を削減し、未決事項の論点・影響を残した。result は executor/reporter の分担に従って未編集。
- 判断根拠: docs/ja/specdojo/standards/ 配下の rulebook-authoring-standard.md、document-metadata-standard.md、sample-authoring-standard.md、test-document-scope-standard.md、sld-rulebook.md、PJR-8S4T の「他の型へ広げるときの一覧」、共通レビュー観点の `vp-arc-conciseness` と `vp-qe-kata-conformance`、utc-rulebook.md、成果物カタログ dct-test-specs.yaml、utc-index の rulebook/sample と各 grade result を確認した。共通の正本への追加提案はない。
- 空白・改行を除いたファイル全体の文字数は変更前9,618字、変更後7,140字（74.24%、25.76%削減）。SLD試行と同じく表の区切り行も除く集計では9,010字から6,551字。成果物の9章の名称・順序・必須/任意区分、ケース表の必須・推奨列定義、rulebook 自身の Frontmatter は変更していない。
- rulebook の主要8章と記述ガイドの節名は維持した。末尾の例示用小節8.1〜8.9は、本文要件の反復を減らし、記述標準が求める最小のコードブロック例へまとめた。固有の除外例・例外条件は記述ガイドへ移した。旧例示のSQL検証のUT例外は境界/依存の本文と矛盾するため、本文のIT委譲を正として整合させた。既存要件を照合する業務の受入確認を3手順で明示した。
- F001（source=grade、`vp-qe-kata-conformance`）は未解消。docs/ja/specdojo/samples/utc-index-sample.md は独自の5章構成で、rulebook の必須8章と順序に一致しない。sample 記述標準に照らして rulebook の要件を維持した。sample は今回の編集対象外のため、次段で必須8章を満たす完成最小例に再構成し、任意の「メモ / 将来課題」には論点・影響を記載したうえで再評価する。grade サイドカーは未編集。
- 根拠成果物として指定された utc-index.md と、カタログ宣言先の tsp-index.md は未作成だった。カタログ・関連規範・rulebook・sample・grade result で確認できた範囲を改訂根拠とし、成果物本体は作成・変更していない。`recipe` と `template` は `undecided` のまま。`includes` 宣言はなく、同時編集する記法 rulebook はない。
- 親 runner 指定の lint・schema・型検査・単体/統合テストは executor では実行せず、runner の結果を待つ。result の実施内容・変更ファイル・進め方と実践の型の適用には、以上の根拠、文字数、維持事項、F001 の未解消理由と次のアクションを記録すること。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿・plan・result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance。`rulebook-authoring-standard`・`document-metadata-standard`・`sample-authoring-standard`・`test-document-scope-standard`・`sld-rulebook`、PJR-8S4T の「他の型へ広げるときの一覧」、`vp-arc-conciseness`、`vp-qe-kata-conformance`、`utc-rulebook`、成果物カタログ `dct-test-specs.yaml` を読み、共通運用の記述を正本参照に置き換えた。型固有の判断基準・標準列・章の受入条件・禁止事項・業務の受入確認手順は維持した。sample と rulebook が矛盾する箇所は、構造・必須項目・禁止事項で rulebook を正とした。根拠不足の finding を推測で補わず、F001 は理由と次のアクションを申し送りに残した。
