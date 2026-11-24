---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsp-index-sample-120-20261124t141308z-77ee27eb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsp-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsp-index-sample-120/T-KATA-REVIEW-ALL-tsp-index-sample-120-20261124T141308Z-77ee27eb/plan.md
  started_at: "2026-11-24T14:13:17.317Z"
  completed_at: "2026-11-24T14:24:51.285Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsp-index-sample
    - specdojo:tsp-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `tsp-index-sample` を見直した。F001 は R2 の対象として修正し、章構成の分割も行った。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 2.1. テストレベル一覧、4.2. I/F の確認範囲と代替方法 | F001: 内部 DB 経路を外部結合テストへ割り当てていた | `PATH-04`・`PATH-07` を内部結合テストへ移し、目的・範囲・委譲先・接続方法を整合させた。外部結合の保管サービス経路は `PATH-05`・`PATH-06` とした | `vp-qe-omissions-consistency`。[[specdojo:tsp-index-rulebook\|テスト戦略・方針 作成ルール]] 5.1・6.2・6.4、[[specdojo:ifd-sample\|インフラ構成図]] 2・4章、[[specdojo:utc-index-sample\|単体テストカタログ概要]] 3章 | - | | R2-2 | R2 | 4. テスト環境・テストデータ | 環境表の後に内部経路・外部I/F・データ方針が小節なしで続き、参照する論点の境界が不明確だった | 4.1 環境区分と用途、4.2 I/F の確認範囲と代替方法、4.3 テストデータに分割し、確認範囲を内部結合から外部結合・総合・受入の順に配置した | `vp-arc-document-structure`。[[specdojo:tsp-index-rulebook\|テスト戦略・方針 作成ルール]] 5章の章順と内容を維持し、[[specdojo:sample-authoring-standard\|Sample 記述標準]] 5章に従った | - |
- 検証は executor の整形・差分検査と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` がいずれも passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsp-index-sample.md`: F001 に対応し、`PATH-04`・`PATH-07` を内部結合テストへ移して外部結合テストの経路を `PATH-05`・`PATH-06` に整合させた。4章を 4.1 環境区分と用途、4.2 I/F の確認範囲と代替方法、4.3 テストデータに分割した。章順・必須表・品質ゲート・回帰範囲、R1 の F003 修正は維持した。

## 3. 申し送り

- F002（開発環境の印刷スタブと `utc-index-sample` の印刷要求モックの食い違い）は R2 の対象外として未変更。後続の R5 で、単体テストと内部結合テストの扱いを書き分け、rulebook の既定から外れる理由を示す必要がある。
- R2-1: R2 / 2.1. テストレベル一覧、4.2. I/F の確認範囲と代替方法 / F001: 内部 DB 経路を外部結合テストへ割り当てていた / `PATH-04`・`PATH-07` を内部結合テストへ移し、目的・範囲・委譲先・接続方法を整合させた。外部結合の保管サービス経路は `PATH-05`・`PATH-06` とした / `vp-qe-omissions-consistency`。[[specdojo:tsp-index-rulebook|テスト戦略・方針 作成ルール]] 5.1・6.2・6.4、[[specdojo:ifd-sample|インフラ構成図]] 2・4章、[[specdojo:utc-index-sample|単体テストカタログ概要]] 3章 / -
- R2-2: R2 / 4. テスト環境・テストデータ / 環境表の後に内部経路・外部I/F・データ方針が小節なしで続き、参照する論点の境界が不明確だった / 4.1 環境区分と用途、4.2 I/F の確認範囲と代替方法、4.3 テストデータに分割し、確認範囲を内部結合から外部結合・総合・受入の順に配置した / `vp-arc-document-structure`。[[specdojo:tsp-index-rulebook|テスト戦略・方針 作成ルール]] 5章の章順と内容を維持し、[[specdojo:sample-authoring-standard|Sample 記述標準]] 5章に従った / -
- reporter 記録用: 変更ファイルは `docs/ja/specdojo/samples/tsp-index-sample.md` のみ。実施内容には上記2件を指定列の Markdown 表として1回だけ記載する。判断根拠として kata-guide 6.1・6.3・6.5、Sample 記述標準、TSP rulebook、テストドキュメントスコープ定義標準、`dct-kata.yaml` の対象の `done_criteria`、grade result、R1 result、ifd-sample、utc-index-sample を確認した。finding は `source=grade`、condense 記録なし。rulebook の `recipe`・`template` はともに `undecided`。章順・必須表・品質ゲート・回帰範囲と R1 の F003 修正を維持した。result と grade サイドカーは編集していない。lint・テスト等の親検証は runner に委ねる。
- 後続 R5 への申し送り: F002 は段の対象外として未変更。4.1 の印刷スタブと utc-index-sample 7章の印刷要求 Mock の違いについて、単体・内部結合の扱いを書き分け、TSP rulebook 6.4 の既定から外れる理由を示す。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan/result を変更していない。）

## 4. 進め方と実践の型の適用

根拠として kata-guide の 6.1・6.3・6.5、Sample 記述標準、TSP rulebook、テストドキュメントスコープ定義標準、`dct-kata.yaml` の `done_criteria`、grade result、R1 result、`ifd-sample`、`utc-index-sample` を確認した。finding は `source=grade` のみで、condense 記録はない。rulebook の `recipe` と `template` はともに `undecided` で、構造・必須項目は rulebook を正とした。F001 は修正して解消した。F002 は R2 の対象外のため未変更で、R5 に回す。F003 は R1 で修正済みの内容を維持した。rulebook、result、grade サイドカーは編集していない。
