---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-opd-index-040-20261118t082327z-2e3b96ee
  type: exec-result
  task_id: T-KATA-SLIM-2-opd-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-opd-index-040/T-KATA-SLIM-2-opd-index-040-20261118T082327Z-2e3b96ee/plan.md
  started_at: "2026-11-18T08:23:35.341Z"
  completed_at: "2026-11-18T08:52:50.323Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - opd-index
    - specdojo:opd-index-rulebook
---

# Edit Result

## 1. 実施内容

- `opd-index-rulebook` を見直し、共通の運用記述を共通の正本への参照にした。F001（推奨配置先の欠落）と F002（Frontmatter 参照スキーマへの言及なし）には、配置先と標準・成果物 schema への参照を追加して対応した。
- F006・F007 は、本文構成と記述ガイドで骨組みと記入基準が足りると判断した。rulebook 内の recipe・template 宣言を not-needed に変更し、理由を全体方針に記載した。
- F003・F004・F005 は sample 側の不備と判断し、rulebook を正とした。sample は本段の変更対象外のため変更していない。
- 章名と12章・全章必須の区分は維持した。
- 空白を除いた文字数は 1,539字から 1,594字（103.57%）になり、8割以下の目安は未達である。元の文書に削除対象の役割・承認手順・台帳管理の記述がほぼなく、必須章と型固有の判断条件を残したうえで、共通運用の参照と F001・F002 の補完を加えたため。
- 整形・差分検査と、runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` は合格した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/opd-index-rulebook.md`: 共通 Frontmatter 表を正本参照に置き換え、全体方針に「共通の運用」を置いた。推奨配置先とメタ情報標準・成果物 schema への参照を追加した。recipe・template 宣言を not-needed に変更し、その理由を記載した。分断していた本文構成の表を修復した。章名と12章・全章必須の区分、業務の RACI・当番・エスカレーション、定量目標、変更承認・ロールバック、RTO/RPO は維持した。

## 3. 申し送り

- 次段で `opd-index-sample.md` を直す。不足する章（2、5〜11）を補い、章番号を12章構成に合わせ、Frontmatter の rulebook と本文参照を `specdojo:opd-index-rulebook` に整合させる（F003・F004・F005 の解消）。
- 根拠成果物 `docs/ja/product/090-operations/opd-index.md` は存在しなかった。運用カタログ、関連 sample、grade 結果を根拠に判断した。
- `includes` 宣言はなく、記法 rulebook の追加編集は不要だった。共通正本への追記案と保護設定の変更案はない。
- 実施内容・変更ファイル: docs/ja/specdojo/rulebooks/opd-index-rulebook.md のみ編集。共通 Frontmatter 表を正本参照へ置換し、本文構成の分断した表を修復した。成果物・sample・recipe・template・result・grade サイドカーは変更していない。
- 進め方と実践の型の適用: [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:docs-structure-guide|ドキュメント構成ガイド]]、[[specdojo:sld-rulebook|SLD 作成ルール]]、[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|SLD 試行]]、共通レビュー観点の vp-arc-conciseness・vp-qe-omissions-consistency・vp-qe-kata-conformance を確認した。OPD の関連 rulebook・sample 群、運用カタログ、rulebook と sample の grade 結果も照合した。
- 判断根拠: F001 は推奨配置先、F002 はメタ情報標準・成果物 schema への参照を追加して対応。共通標準に合わせて成果物の rulebook 指定を必須として扱う。F006・F007 は本文構成と記述ガイドで骨組み・記入基準が足りるため、rulebook 内の recipe・template 宣言を not-needed に変更し、理由を全体方針に記載した。
- 維持した要件: rulebook の章名と成果物の12章・全章必須区分を維持した。運用カタログの業務継続性・技術設計・検証基準と OPD の関連 rulebook を根拠に、業務の RACI・当番・エスカレーション、定量目標、変更承認・ロールバック、RTO/RPO を維持した。文書作成・承認の役割とは区別した。
- 未解消の F003・F004・F005: sample 側の不備と判断し、rulebook を正とした。次段で opd-index-sample.md に不足する章（2、5〜11）を補い、章番号を12章構成に合わせ、Frontmatter の rulebook と本文参照を specdojo:opd-index-rulebook に整合させる。本段では sample が変更対象外のため変更していない。
- 文字数: ファイル全体の空白・改行除外で1,539字→1,594字（103.57%）。SLD 試行同様に表の区切り行も除外すると1,501字→1,533字（102.13%）。8割以下の目安は未達。元文書には削除対象の役割・承認手順・台帳管理の記述がほぼなく、必須章・型固有の判断条件を残し、共通運用参照と F001・F002 の欠落を補ったため。
- 根拠成果物 docs/ja/product/090-operations/opd-index.md は存在しなかったため、運用カタログ・関連 sample・grade 結果を根拠に判断した。includes 宣言はなく、記法 rulebook の追加編集は不要。共通正本への追記案・保護設定の変更案はなし。lint 等の指定された親検証は runner に委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML・YML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 内のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票・既存 plan・result を変更していない。）

## 4. 進め方と実践の型の適用

根拠として次を確認した。 - rulebook 記述標準 - ドキュメントメタ情報標準 - ドキュメント構成ガイド - 改訂済みの sld-rulebook - SLD 試行の個票（pjr-8s4t） - 共通レビュー観点の `vp-arc-conciseness`・`vp-qe-omissions-consistency`・`vp-qe-kata-conformance` - OPD の関連 rulebook・sample 群、運用カタログ、rulebook と sample の grade 結果 改訂した点は次のとおり。 - 共通の運用は正本参照にした。 - F001・F002 を補完した。 - F006・F007 は recipe・template を not-needed とした。 維持した点は次のとおり。 - 章名と全章必須の区分。 - 業務の RACI・当番・エスカレーション。 - 定量目標。 - 変更承認・ロールバック。 - RTO/RPO。 F003・F004・F005 は sample 側の不備のため、rulebook を正として次段の sample 修正に回す。grade サイドカーは直接編集していない。
