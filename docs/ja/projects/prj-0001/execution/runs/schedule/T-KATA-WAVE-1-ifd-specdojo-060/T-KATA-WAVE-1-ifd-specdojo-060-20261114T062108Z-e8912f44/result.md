---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-ifd-specdojo-060-20261114t062108z-e8912f44
  type: exec-result
  task_id: T-KATA-WAVE-1-ifd-specdojo-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-ifd-specdojo-060/T-KATA-WAVE-1-ifd-specdojo-060-20261114T062108Z-e8912f44/plan.md
  started_at: "2026-11-14T06:21:15.222Z"
  completed_at: "2026-11-14T06:36:18.379Z"
  agent: sol-executor
  execution: agent
  approach: template-maintenance
  targets:
    - ifd-specdojo
    - specdojo:ifd-template
---

# Edit Result

## 1. 実施内容

- IFD template の列名を rulebook に同期し、中継省略・代替配置・検証状態・監視・改訂影響の記入欄を補完しました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/ifd-template.md`: rulebook に基づき、配置表の「上位要素」「情報・到達条件」および通信表の「目的・情報」などの列名を同期し、中継省略、代替配置、検証状態、監視詳細、改訂影響に関する記入欄を補完しました。

## 3. 申し送り

- 変更ファイルは `docs/ja/specdojo/templates/ifd-template.md` のみ。result は pipeline 指示に従い未編集。以下の根拠と判断を reporter が result に記録してください。
- 根拠: `ifd-mermaid-rulebook.md`、`ifd-recipe.md`、`ifd-sample.md`、`template-authoring-standard.md`、`rulebook-authoring-standard.md`、`document-metadata-standard.md`、`ryu-guide.md`、および適用先 `ifd-specdojo.md` と上位 `cnd-specdojo.md`。配置表の「上位要素」「情報・到達条件」と通信表の「目的・情報」は rulebook の推奨列名を優先した。
- 既存の章構成、Mermaid の骨組み、予約済みプレースホルダ、生成物の `frontmatter` は維持。省略した中継と到達条件、代替配置で置き換わる要素、検証予定と実施済み証跡の区別、監視詳細の委譲先、改訂時の追従先を記入する欄を追加した。値・構文・構造の詳細は再掲していない。
- recipe は配置・境界を判断する手順が必要、template は共通の章・表・記入欄が必要なため、rulebook の既存 ID 宣言を維持。sample は完成例として外出し済みで、rulebook にサンプル章はない。IFD の4種はサイドバー登録済みのため追加不要。親 runner が指定の lint・schema・typecheck・unit/integration test を実行する。
- 変更ファイルは docs/ja/specdojo/templates/ifd-template.md のみ。result は pipeline 指示に従い未編集。以下の根拠と判断を reporter が result に記録してください。
- 根拠: ifd-mermaid-rulebook.md、ifd-recipe.md、ifd-sample.md、template-authoring-standard.md、rulebook-authoring-standard.md、document-metadata-standard.md、ryu-guide.md、および適用先 ifd-specdojo.md と上位 cnd-specdojo.md。配置表の「上位要素」「情報・到達条件」と通信表の「目的・情報」は rulebook の推奨列名を優先した。
- 既存の章構成、Mermaid の骨組み、予約済みプレースホルダ、生成物の frontmatter は維持。省略した中継と到達条件、代替配置で置き換わる要素、検証予定と実施済み証跡の区別、監視詳細の委譲先、改訂時の追従先を記入する欄を追加した。値・構文・構造の詳細は再掲していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown template のみで、YAML ファイルの変更なし。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/templates/ 配下のみで、docs/ja/projects/ 配下への変更なし。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイルおよび既存 plan/result を変更していない。）

## 4. 進め方と実践の型の適用

IFD template の構造と項目を最新の rulebook および執筆標準に合わせ、不足していた記入欄（中継省略や検証状態など）を補完することで、成果物作成時の網羅性と整合性を確保しました。recipe と template の必要性を再確認し、既存の ID 宣言を維持しています。
