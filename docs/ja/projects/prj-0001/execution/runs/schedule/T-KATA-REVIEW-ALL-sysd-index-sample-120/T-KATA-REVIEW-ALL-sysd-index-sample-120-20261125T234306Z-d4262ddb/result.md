---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-index-sample-120-20261125t234306z-d4262ddb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-index-sample-120/T-KATA-REVIEW-ALL-sysd-index-sample-120-20261125T234306Z-d4262ddb/plan.md
  started_at: "2026-11-25T23:43:17.108Z"
  completed_at: "2026-11-25T23:51:13.972Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-index-sample
    - specdojo:sysd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `sysd-index-sample` を見直した。SSOT 一覧の行、変更の入口の検証前提の文、関連ドキュメント導線の行を、rulebook の本文構成と template の順に合わせて並べ替えた。
- sample 以外は変更していない。R1-5 で列を削った 6.1 の表は template と一致していたため、追加の直しはない。
- executor の検査（prettier、markdownlint）と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 2. SSOT 一覧（表形式）の「外部コマンド」の行 | 外部連携に当たる行が「設定・実行構成」の後にあり、template の行の順（API・外部連携・非同期連携、データ、モジュール、設定、Job、監視、CI）から外れている。 | 「非同期連携」の行の直後へ移した。 | sysd-index-template の SSOT 一覧の行の順、sysd-index-rulebook の本文要件、`vp-arc-document-structure` | - |
| R2-2 | R2 | 4. 変更の入口（典型ケース）の表の後の文 | 全変更で `npm run lint`、`npm run typecheck`、`npm run build` を実行するという検証の前提が表の後にあり、前提から結論の順に読めない。 | 表の前の段落にある合格基準の文の後へ移し、表の後の文を削った。 | template の変更の入口の指示（検証の実行場所と手順を表の前に書く）、`vp-arc-document-structure` | - |
| R2-3 | R2 | 5. 関連ドキュメント導線の行の順 | 既存文書を先に、未作成文書を後に並べており、rulebook の「上位・同階層・下流」と template の順に沿っていない。 | プロジェクト定義、構成・システム設計、操作仕様、業務・データ契約、外部コマンド契約、非機能・運用、テスト・判断記録の順に並べ替えた。実在と未作成の区別は状態・備考の列とリンクの記法で残る。 | sysd-index-rulebook の本文要件「関連仕様」、sysd-index-template の関連ドキュメント導線の指示、`vp-arc-document-structure` | 要判断 |
| R2-4 | R2 | 4. 変更の入口（典型ケース）の行の順 | 印刷連携・レシート形式の行が CLI・設定の行と Job の行の間にあり、R2-1 で直した SSOT 一覧の行の順（外部コマンドは外部連携の並び）と揃っていない。主な行の順は template に合っているため直していない。 | 揃える場合は、印刷の行を本部 API 契約の行の直後へ移す。行の内容は変えない。 | sysd-index-template の変更の入口の指示、`vp-qe-omissions-consistency` | 要判断 |
| R2-5 | R2 | 6.1. 未決事項と後続作業への影響の表（R1-5 で列を削除） | R1-5 で「担当ロール」の列を削った後の表を確かめた。3 列（項目・対象、現状と影響範囲、解消条件・次アクション）は template の 6.1 と一致しており、追加の直しは要らない。 | 変更なし。R1-5 の要判断は R2 の観点では列の削除を採ってよい。 | sysd-index-template の 6.1 の表の列 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-index-sample.md`: SSOT 一覧の「外部コマンド」の行を「非同期連携」の行の直後へ移した。変更の入口の検証前提の文を表の前の合格基準の後へ移し、表の後の文を削った。関連ドキュメント導線の行を、rulebook と template の順（プロジェクト定義、構成・システム設計、操作仕様、業務・データ契約、外部コマンド契約、非機能・運用、テスト・判断記録）に並べ替えた。

## 3. 申し送り

- R2-4（変更の入口の印刷連携の行の位置）と R2-3（関連ドキュメント導線の並べ替え）は要判断として findings に記載した。R2-4 は sample を変更していない。
- No: R2-1 / 段: R2 / 箇所: 2. SSOT 一覧（表形式）の「外部コマンド」の行 / 指摘: 外部連携に当たる行が「設定・実行構成」の後にあり、template の行の順（API・外部連携・非同期連携 → データ → モジュール → 設定 → Job → 監視 → CI）から外れている / 直した案: 「非同期連携」の行の直後へ移した / 根拠: sysd-index-template の SSOT 一覧の行の順、sysd-index-rulebook の本文要件（見出し順・表の列は template を正本とする）、`vp-arc-document-structure` / 印: -
- No: R2-2 / 段: R2 / 箇所: 4. 変更の入口（典型ケース）の表の後の文 / 指摘: 全変更で `npm run lint`・`npm run typecheck`・`npm run build` を実行するという検証の前提が表の後にあり、前提から結論の順に読めない / 直した案: 表の前の段落にある合格基準の文の後へ移し、表の後の文を削った / 根拠: template の変更の入口の指示（検証の実行場所と手順を表の前に書く）、`vp-arc-document-structure` / 印: -
- No: R2-3 / 段: R2 / 箇所: 5. 関連ドキュメント導線の行の順 / 指摘: 既存文書を先に、未作成文書を後に並べており、rulebook の「上位・同階層・下流」と template の順（構成図・設計分冊・業務フロー・外部連携・非機能・運用・テスト・判断記録）に沿っていない / 直した案: プロジェクト定義 → 構成・システム設計 → 操作仕様 → 業務・データ契約 → 外部コマンド契約 → 非機能・運用 → テスト・判断記録 に並べ替えた。実在と未作成の区別は状態・備考の列とリンクの記法で残る / 根拠: sysd-index-rulebook の本文要件「関連仕様」、sysd-index-template の関連ドキュメント導線の指示、`vp-arc-document-structure` / 印: 要判断
- No: R2-4 / 段: R2 / 箇所: 4. 変更の入口（典型ケース）の行の順 / 指摘: 印刷連携・レシート形式の行が CLI・設定の行と Job の行の間にあり、R2-1 で直した SSOT 一覧の行の順（外部コマンドは外部連携の並び）と揃っていない。主な行の順（API・DB・設定・Job・監視・移動）は template に合っているため直していない / 直した案: 揃える場合は、印刷の行を本部 API 契約の行の直後へ移す。行の内容は変えない / 根拠: sysd-index-template の変更の入口の指示、`vp-qe-omissions-consistency` / 印: 要判断
- No: R2-5 / 段: R2 / 箇所: 6.1. 未決事項と後続作業への影響の表（R1-5 で列を削除） / 指摘: R1-5 で「担当ロール」の列を削った後の表を R2 の観点で確かめた。3 列（項目・対象 / 現状と影響範囲 / 解消条件・次アクション）は template の 6.1 と一致しており、追加の直しは要らない / 直した案: 変更なし。R1-5 の要判断は R2 の観点では列の削除を採ってよい / 根拠: sysd-index-template の 6.1 の表の列 / 印: -
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更しておらず、変更は sample の Markdown だけのため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown の sample だけで、yaml・yml の変更がないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、`sysd-index-rulebook` の本文要件、`sysd-index-template` の行の順と指示、`vp-arc-document-structure` を根拠に、章内の行と文の配置だけを変更した。内容の記述は変えていない。R1 の指摘は繰り返していない。
