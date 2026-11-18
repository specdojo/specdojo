---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-atc-index-040-20261118t090540z-1365c2b7
  type: exec-result
  task_id: T-KATA-SLIM-2-atc-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-atc-index-040/T-KATA-SLIM-2-atc-index-040-20261118T090540Z-1365c2b7/plan.md
  started_at: "2026-11-18T09:05:50.306Z"
  completed_at: "2026-11-18T09:34:45.774Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - atc-index
    - specdojo:atc-index-rulebook
---

# Edit Result

## 1. 実施内容

- `atc-index-rulebook` から、どの成果物にも共通する文書運用の記述（役割、`status` の扱い、承認、改訂と廃止、品質検査、未決事項の台帳管理など）を外し、共通の正本への参照に置き換えた。
- 全体方針に「共通の運用」を 1 項目だけ置いた。役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照する。
- 型固有の判断基準、標準列と章の受入条件、良い例・悪い例、型固有の禁止事項は残した。
- 受入全体の合格基準・合否集計、判定の流れ、判定証跡（証跡確認者・人間の判定責任者・結果・理由・承認日）、共通列変更時の影響確認を補った。
- 空白を除いた文字数は 8,917 字から 6,149 字（68.96%）に縮小し、目安の 8 割以下を満たした。sld 試行と同様に表区切り行も除くと 8,383 字から 5,747 字（68.56%）で、こちらも 8 割以下である。
- 成果物の標準 9 章の名称・順序・必須区分と Frontmatter は維持した。rulebook 自身の「本文構成（標準テンプレ）」だけを「本文要件」に改称した。
- executor の検査（prettier、`git diff --check`、文字数・章構成の確認、秘密情報検査）は合格した。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も合格した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/atc-index-rulebook.md`: 共通運用の重複記述（役割の表と段落、`status` と承認、改訂と廃止、品質検査、台帳管理、Frontmatter の重複説明）を削り、共通正本への参照に置き換えた。合格基準・合否集計、判定フロー、判定証跡、共通列変更時の影響確認、禁止事項の具体化を追加した。Frontmatter 推奨とメタ情報の記述、章名、最小例、位置づけ図の名称も修正した。差し引き 101 行追加・257 行削除。

## 3. 申し送り

- F012 は未解消である。`docs/ja/specdojo/samples/atc-index-sample.md` が rulebook の標準章構成と不整合だが、sample は今回の編集対象外のため変更していない。次の対応では rulebook を正とし、必須 8 章・任意のメモ章、共通列、合格基準・判定フロー・証跡を具体化し、本文の繰り返しを除く。
- F016 は申し送りである。recipe と template は `undecided` のままで、要否と所在を次の対応で判断する。sample の不整合を解消した後、共通正本に従って人間が ready 化を判断する。
- F006・F007 は、プロジェクト固有の修飾 ID を明記しつつ、プロダクト仕様ではカタログに従う未修飾 ID も維持した。現行標準に全成果物への一律修飾の要求はなく、改訂済みの `sld-rulebook` も両者を区別しているためである。
- F003 と F009 は、共通正本とリポジトリ検証を参照する方針にしたため、個別の担当表・転記手順・lint コマンドは再掲していない。共通正本への追加提案はない。
- 根拠成果物 `atc-index.md` は存在しないが、プラン 4.1 に従い、その不在だけを理由に見送らず、カタログ・sample・grade・規範で判断できる範囲を改訂した。
- 変更ファイルは docs/ja/specdojo/rulebooks/atc-index-rulebook.md のみ。共通運用・Frontmatter の重複説明・各章の見出し指示を整理し、受入全体の合格基準、判定の流れ、判定証跡、共通列変更時の影響確認を補った。result は executor stage の指示に従い編集していない。
- result に記録する文字数: 改行を含む空白除外で8,917→6,149字（68.96%）。sld 試行と同様に表区切り行も除く場合は8,383→5,747字（68.56%）。いずれも80%以下。
- 判断根拠: xp/xep-common-conventions-template、rulebook-authoring-standard、document-metadata-standard、docs-structure-guide、成果物リファレンス、sld-rulebook、PJR-8S4T の展開一覧、atc-rulebook、atc-index-sample、dct-test-specs の対象定義、共通レビュー観点の各 finding 対応 ID と vp-arc-conciseness を確認。prj-0001 のレビュー観点に独自差分はない。grade 正本は execution/grade/results/specdojo.atc-index-rulebook.yaml で、修正前の内容ハッシュと一致した。
- 章の扱い: 成果物の標準9章の名称・順序・必須区分、ケース表の必須4列と推奨6列の順序は維持。rulebook 自身の「本文構成（標準テンプレ）」だけを「本文要件」へ改称した（F014 と記述標準に対応）。内包サンプルは全必須章の輪郭を示す自己完結したコードブロックへ簡潔化した。
- finding 対応: F001/F004/F011 は既存の「本ドキュメントの目的と適用対象」に合格基準・合否集計・判定手順を追加。F002 は証跡確認者・人間の判定責任者・結果・理由・承認日を追加。F005 は共通運用からメンバー定義を参照し、業務手順で実施者・証跡確認者・判定者の記録を辿る要件を追加。F008 は全対象別カタログ・実施記録・集計処理等の追従確認とケース ID 維持を明記。F010 は禁止対象を具体化。F013/F014/F015 はメタ情報・章名・最小例・図の名称を修正。
- F006/F007 はプロジェクト固有の修飾 ID を明記し、プロダクト仕様ではカタログに従う未修飾 ID も維持した。全成果物への一律修飾は現行標準に要求がなく、改訂済み sld-rulebook も両者を区別しているため。F003 の登録簿への引き継ぎと F009 の文書品質検査は、今回の方針に従い共通正本・リポジトリ検証を参照し、個別の担当表・転記手順・lint コマンドを再掲しなかった。共通正本への追加提案はない。
- 未解消 F012: docs/ja/specdojo/samples/atc-index-sample.md は既存の標準章構成と不整合。sample は今回の編集対象外のため変更していない。次の対応では rulebook を正とし、必須8章・任意のメモ章、共通列、合格基準・判定フロー・証跡を具体化し、本文の繰り返しを除く。
- F016 の申し送り: recipe と template は引き続き undecided。次の対応で要否と必要なら所在を判断し、sample の構成不整合を解消してから、共通正本に従って人間が ready 化を判断する。今回、承認条件を rulebook に重複記載せず、Frontmatter の状態も維持した。
- 根拠成果物 docs/ja/product/080-test-specs/060-acceptance-test-catalog/atc-index.md は存在しない。plan の4.1に従い、その不在だけを理由に見送らず、カタログ・sample・grade・規範で判断可能な範囲を改訂した。成果物本体、recipe、template、sample、grade サイドカー、保護設定は変更していない。includes の宣言はなく、併せて編集する記法 rulebook はない。
- 整形・差分・文字数・標準章の維持・Frontmatter の維持・本文 wikilink の参照先を確認済み。指定された lint・schema・型検査・単体/統合テストは親 runner の担当として実行していない。reporter は本 handoff を result の実施内容・変更ファイル・進め方と実践の型の適用へ反映すること。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown rulebook のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下への変更がない。）
- 適用外の検証: `npm run validate:history-links`（executor が変更した登録簿個票・既存 plan・result がない。）

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → rulebook」に切り替え、`atc-index-rulebook` を見直し対象として編集した。根拠は、共通規約テンプレート、`rulebook-authoring-standard`、`document-metadata-standard`、`docs-structure-guide`、`sld-rulebook` と PJR-8S4T の展開一覧、`atc-rulebook`、`atc-index-sample`、`dct-test-specs` の対象定義、`vp-arc-conciseness` などの共通レビュー観点である。grade の正本は修正前の内容ハッシュと一致した。F001・F002・F004・F005・F008・F010・F011・F013・F014・F015 は、合格基準・判定フロー・証跡の追加、共通列変更時の影響確認、禁止対象の具体化、メタ情報・章名・最小例・図の名称の修正で解消した。F006・F007 は修飾 ID の明記で対応し、F003・F009 は共通正本への参照で扱った。F012・F016 は未解消または申し送りとして handoff に記録した。`includes` の宣言はなく、併せて直す記法 rulebook はない。recipe・template・sample・成果物本体・grade サイドカーは変更していない。
