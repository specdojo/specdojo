---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-ifx-index-040-20261113t184652z-4c8cbb32
  type: exec-result
  task_id: T-KATA-WAVE-1-ifx-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-ifx-index-040/T-KATA-WAVE-1-ifx-index-040-20261113T184652Z-4c8cbb32/plan.md
  started_at: "2026-11-13T18:47:02.694Z"
  completed_at: "2026-11-13T19:04:01.194Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - ifx-index
    - specdojo:ifx-index-rulebook
---

# Edit Result

## 1. 実施内容

- 外部システムI/F一覧の `rulebook` (`docs/ja/specdojo/rulebooks/ifx-index-rulebook.md`) を改訂し、未決事項の扱い、承認責任の明確化、計画管理への接続、および具体的な検証手順を整備しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md`: 未決事項（TBD）の可視化、POによる承認責任の明示、確認者・作業担当・期限等の計画管理への導線、および schema 検証や Prettier の具体コマンドを含む検証手順を追記しました。また、「短く」などの曖昧な判定基準を客観的な要件へ置換し、禁止事項セクションを補強しました。

## 3. 申し送り

- reporter は result の「実施内容」「変更ファイル」「進め方と実践の型の適用」へ本報告を反映してください。変更ファイルは docs/ja/specdojo/rulebooks/ifx-index-rulebook.md のみです。executor は result・成果物本体・grade サイドカーを編集していません。
- 規範として docs/ja/specdojo/standards/rulebook-authoring-standard.md、document-metadata-standard.md、docs/ja/specdojo/guides/docs-structure-guide.md、ryu-guide.md、docs/specdojo/schemas/v1/esil.schema.yaml、および docs/ja/specdojo/defaults/pm-review-viewpoints.yaml の該当11観点を確認しました。プロジェクト側の観点定義は共通定義を継承しています。PJR-2GD6 の正本参照・重複回避方針を維持しました。
- 実態の根拠は docs/ja/product/020-external-interface-specs/ifx-index.yaml、ifx-cmd-ai-provider-cli.yaml、既存 ifx-index の recipe・sample・template、clis-sample.md、T-KATA-WAVE-1-ifx-index-005 の bootstrap result、T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-090 の review result です。review result の過去の検証不能記録は現状の検証結果とは扱わず、実ファイルを照合しました。
- F001 は「詳細参照と未決事項」で論点・影響・担当・解消条件・判断時期・次アクションを要求して対応。F002 は人間の PO に一覧承認・昇格・公開の最終判断を明示。F003〜F006 は「合意・計画・課題への引き継ぎ」で確認者・合意対象・作業担当・期限またはマイルストーン・後続影響・Schedule/PJR/決定記録への導線を定義して対応しました。schema にない管理キーの追加ではなく、コメントと既存管理記録への参照を採用しました。
- F007 は schema 検証・Prettier の具体コマンド、適用条件、終了コード0の合格条件、失敗時対応、内容の手動照合を追記。F008 は「短く」を未完了結果・停止条件・確認対象・担当という判定可能な要件へ置換。F009 は既存の禁止事項と詳細への委譲を維持し、承認の代用・管理キー追加・管理記録複製の禁止を補強。F010 は schema を許容形式の正本として維持し、成果物と完成例の修飾 ID を例示しました。各 finding の問題を現行記述と判定根拠で照合し、根拠不足による見送りはありません。
- 対象 grade は docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-index-rulebook.yaml。F001〜F010 は grade 由来で、anchor の旧章立てを現行の該当箇所に対応づけて判断しました。plan の成果物由来 finding・condense 記録はともになし。既存の標準章構成、階層別連番、完成例を本文に再掲しない構成を維持しました。
- recipe は連携単位・境界・結果不明時の判断に作成手順が必要なため、template は同一キー構成から開始するため必要と再判断しました。frontmatter の `specdojo:ifx-index-recipe`、`specdojo:ifx-index-sample`、`specdojo:ifx-index-template` 宣言を維持しています。
- 後続の recipe・sample・template 整合段では、追加した管理担当・公開判断者、IFごとの確認者、未決事項の判断時期・影響、Schedule/PJR への導線を反映してください。既存 sample は商品照会・売上登録・印字の3連携を持つ完成例です。本フェーズの指定に従い、これらと代表成果物は変更していません。構造・必須性・禁止事項は改訂 rulebook を正とします。
- 型メニューには ifx-index の rulebook・recipe・sample・template がすべて既に登録されているため、`sidebar-config.ts` の変更は不要でした。親指定の lint・schema 全件検査・typecheck・単体／統合テストは runner に委ね、重複実行していません。
- recipe は連携単位・境界・結果不明時の判断に作成手順が必要なため、template は同一キー構成から開始するため必要と再判断しました。frontmatter の specdojo:ifx-index-recipe、specdojo:ifx-index-sample、specdojo:ifx-index-template 宣言を維持しています。
- 型メニューには ifx-index の rulebook・recipe・sample・template がすべて既に登録されているため、sidebar-config.ts の変更は不要でした。親指定の lint・schema 全件検査・typecheck・単体／統合テストは runner に委ね、重複実行していません。
- 適用外の検証: `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/esil.schema.yaml --data docs/ja/product/020-external-interface-specs/ifx-index.yaml`（変更は Markdown rulebook のみで、YAML ファイルを変更していないため。）
- 適用外の検証: `npm run validate:catalog`（executor の変更が docs/ja/projects/ 配下に及ばないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan/result を変更していないため。）

## 4. 進め方と実践の型の適用

grade result から展開された finding (F001〜F010) をもとに、`rulebook-authoring-standard.md` および `pm-review-viewpoints.yaml` の規範に沿って `ifx-index-rulebook.md` を改訂しました。具体的には、POの承認責任や計画管理への導線、客観的な品質判定基準、および具体的な検証手順を追記し、不整合な ID 形式の例示を修正しました。また、recipe および template の必要性を再評価し、現状の宣言を維持しています。
