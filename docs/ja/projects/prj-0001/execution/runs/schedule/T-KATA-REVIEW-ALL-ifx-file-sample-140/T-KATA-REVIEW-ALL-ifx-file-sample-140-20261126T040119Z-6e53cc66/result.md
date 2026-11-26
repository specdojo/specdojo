---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-file-sample-140-20261126t040119z-6e53cc66
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-file-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-file-sample-140/T-KATA-REVIEW-ALL-ifx-file-sample-140-20261126T040119Z-6e53cc66/plan.md
  started_at: "2026-11-26T04:01:29.108Z"
  completed_at: "2026-11-26T04:10:01.883Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
    - specdojo:ifx-file-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、ifx-file-sample の事実（modeline、キー、列挙値、終了コード、事象名、参照先、パス、ロール）を rulebook、`src/kata/yaml-schema-modeline.ts`、clis-sample、ifx-index-sample、ifx-api-sample、ifx-cmd-sample、pm-members-sample と突き合わせた。確かめの表は 17 行で、一致 12、不一致で直した 3、確かめられない 2 だった。
- 直した不一致は 3 件。(1) CLI 仕様の入出力表から本契約へ辿るとした記述を、正本スキーマを `schema_ref` と共有する記述に改めた。(2) 重複排除が未整備とした `_UNDECIDED_` を、未整備なのは受付照会だけとする記述に改めた。(3) 事象名「売上登録結果不明（exit code 3）」の 4 か所を「売上登録失敗（exit code 3、受付結果不明）」に揃えた。
- F002 は「取引状態の欠落」の行を、取引未開始（exit code 2）と `sales start` 時の未解決の控え（exit code 3）の 2 行に分け、事象ごとに終了コードと次の手が一意に決まるようにした。
- F001・F003・F005・F006・F007・F008 は前の段までの版で直っていることを確かめ、指摘を繰り返さなかった。F004 は R1・R2 の観点で、この段では扱っていない。
- 検証は、整形（prettier）と markdownlint が通り、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 | docs/ja/specdojo/samples/ifx-file-sample.md の CLI 仕様の入出力表との関係を述べた記述 | CLI 仕様の入出力表から本契約へ辿るとしていたが、clis-sample の記述と食い違っていた。 | 正本スキーマを `schema_ref` と共有する記述に改めた。 | clis-sample、ifx-cmd-sample との突き合わせ | 直した |
| 2 | R4 | docs/ja/specdojo/samples/ifx-file-sample.md の重複排除に関する `_UNDECIDED_` | 重複排除が未整備と書いていたが、未整備なのは受付照会だけで、ifx-api-sample と食い違っていた。 | 未整備なのは受付照会だけとする記述に改めた。 | ifx-api-sample との突き合わせ | 直した |
| 3 | R4 | docs/ja/specdojo/samples/ifx-file-sample.md の事象名「売上登録結果不明（exit code 3）」4 か所 | 事象名が clis-sample の事象名と食い違っていた。 | 「売上登録失敗（exit code 3、受付結果不明）」に揃えた。 | clis-sample、ifx-cmd-sample との突き合わせ | 直した |
| 4 | R4 | docs/ja/specdojo/samples/ifx-file-sample.md の `sales start` が未解決の控えで exit code 3 で止まるとする記述 | clis-sample の入力表（59・62 行目）に `sales start` の入力として `data/sales/` がなく、この停止も定義されていないため、主張を確かめられなかった。 | - | clis-sample の入力表 | 確かめられない |
| 5 | R4 | docs/ja/specdojo/samples/ifx-file-sample.md の正本スキーマ `schemas/kinuya-session.schema.json` と `schemas/kinuya-sales-record.schema.json` の性質 | JSON Schema 2020-12、`additionalProperties: false`、`enum`・`if/then` の制約を確かめたいが、正本が架空の店舗アプリにありリポジトリに実体がない。 | - | リポジトリに正本がない | 確かめられない |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-file-sample.md`: R4 の確かめで見つかった不一致 3 件を直した（CLI 仕様の入出力表との関係の記述、重複排除の `_UNDECIDED_` の範囲、事象名「売上登録失敗（exit code 3、受付結果不明）」への統一 4 か所）。F002 に対応し、「取引状態の欠落」の行を取引未開始（exit code 2）と未解決の控え検出（exit code 3）の 2 行に分けた。差分は 16 行追加、15 行削除。

## 3. 申し送り

- R5 への申し送り: `sales start` が `data/sales/` の未解決の控えを調べて exit code 3 で止める振る舞いは、clis-sample の入力表に定義がなく確かめられなかった。clis-sample に入力と事象を足すか、ifx-file-sample のこの振る舞いを外すかを R5 で決める。
- 正本スキーマ `schemas/kinuya-session.schema.json` と `schemas/kinuya-sales-record.schema.json` の性質は、リポジトリに実体がなく確かめられなかった。学習用の仮定として残した。
- R4 の確かめで「確かめられない」とした主張（No 14）: ifx-file-sample は、`sales start` が `data/sales/` の未解決の控え（`api_sync_status` が `pending` / `unknown` / `rejected`）を調べ、1 件でもあれば exit code 3 で止まると書く。clis-sample の入力表（59・62 行目）には `sales start` の入力として `data/sales/` がなく、この停止も定義されていない。R5 で、clis-sample に入力と事象を足すか、ifx-file-sample のこの振る舞いを外すかを決める。
- R4 の確かめで「確かめられない」とした主張（No 16）: 正本スキーマ `schemas/kinuya-session.schema.json` と `schemas/kinuya-sales-record.schema.json` の性質（JSON Schema 2020-12、`additionalProperties: false`、`enum`・`if/then` の制約）は、正本が架空の店舗アプリにありリポジトリに実体がないため確かめられない。学習用の仮定として残した。
- F004（major/vp-qe-kata-conformance、md 形式から YAML sample への再構成、または rulebook に md とする例外を宣言）は R1・R2 の観点なので、この段では扱っていない。今の版でも直っていないため、人が rulebook 側の例外の宣言と sample の再構成のどちらを採るかを決める。
- F001・F003・F005・F006・F007・F008 は前の段までの版で直っていることを確かめ、指摘を繰り返さなかった。

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の主張ごとに正本（rulebook、`src/kata/yaml-schema-modeline.ts`、関連 sample）と突き合わせた。不一致のものは正本を正として直し、一致するものは維持した。正本がないものは確かめられない主張として表に残し、推測で書き換えなかった。grade の finding のうち、この段の観点に当たる F002 だけを修正した。前の段で解消済みの finding は繰り返さなかった。F004 は R1・R2 の観点で、md 形式から YAML sample への再構成か rulebook への例外宣言かを人が決める必要があり、未解消のまま残る。
