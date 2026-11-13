---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cnd-specdojo-060-20261113t231741z-7c9bd1e0
  type: exec-result
  task_id: T-KATA-WAVE-1-cnd-specdojo-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cnd-specdojo-060/T-KATA-WAVE-1-cnd-specdojo-060-20261113T231741Z-7c9bd1e0/plan.md
  started_at: "2026-11-13T23:17:45.862Z"
  completed_at: "2026-11-13T23:31:28.991Z"
  agent: sol-executor
  execution: agent
  approach: template-maintenance
  targets:
    - cnd-specdojo
    - specdojo:cnd-template
---

# Edit Result

## 1. 実施内容

- CND template を改訂後の rulebook に同期させ、必要な記入欄（承認範囲、観測結果、検証記録など）を追加しました。
- `packages/docs-site/.vitepress/sidebar-config.ts` の C4 メニューに CND recipe および template を追加し、サイト上のナビゲーションを整備しました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/cnd-template.md`: 承認範囲・確認者、上位図の経路対応、ローカル／リモートと読み書きの境界、正常・失敗・結果不明時の観測結果、検証・承認・公開照合記録、改訂時の担当、未決事項の転送先・判断者・判断時点の記入欄を追加し、rulebook と同期させました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: CND recipe および template を C4 コンテナ図（CND）のメニュー項目として追加しました。

## 3. 申し送り

- reporter 向け変更記録: docs/ja/specdojo/templates/cnd-template.md に承認範囲・確認者、上位図の経路対応、ローカル／リモートと読み書きの境界、正常・失敗・結果不明時の観測結果、検証・承認・公開照合記録、改訂時の担当、未決事項の転送先・判断者・判断時点の記入欄を追加した。既存の主要章・表の列名・生成物 Frontmatter は維持した。packages/docs-site/.vitepress/sidebar-config.ts に CND recipe・template を追加した。pipeline 指示に従い result は編集していない。
- 判断根拠: specdojo:cnd-rulebook の本文要件・記述ガイド、specdojo:template-authoring-standard、specdojo:rulebook-authoring-standard、specdojo:document-metadata-standard、specdojo:cnd-recipe、specdojo:cnd-sample、cnd-specdojo と cxd-specdojo を照合した。template は記入欄の骨組みに限定し、PJR-2GD6 と `vp-arc-conciseness` に従い、値・構文・データ構造・検査手順の詳細を正本へ委ねた。plan に展開された finding はない。
- 型の要否判断: 実行・配備単位と連携経路を組み立てる問いが必要なため recipe を維持し、共通の章・図・定義表・検証欄が開始点となるため template を維持した。主 rulebook の既存宣言 specdojo:cnd-recipe／specdojo:cnd-template を採用し、not-needed への変更は不要と判断した。完成例は既存の specdojo:cnd-sample を参照し、template へ転載していない。
- 判断根拠: specdojo:cnd-rulebook の本文要件・記述ガイド、specdojo:template-authoring-standard、specdojo:rulebook-authoring-standard、specdojo:document-metadata-standard、specdojo:cnd-recipe、specdojo:cnd-sample、cnd-specdojo と cxd-specdojo を照合した。template は記入欄の骨組みに限定し、PJR-2GD6 と vp-arc-conciseness に従い、値・構文・データ構造・検査手順の詳細を正本へ委ねた。plan に展開された finding はない。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML／YML ファイルがないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿や既存 plan／result などの履歴ファイルを変更していないため。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/ と packages/docs-site/ に限られ、docs/ja/projects/ 配下の成果物変更がないため。）

## 4. 進め方と実践の型の適用

改訂された `specdojo:cnd-rulebook` および執筆標準に基づき、`docs/ja/specdojo/templates/cnd-template.md` の構造と必須記入項目を同期させました。また、ドキュメントサイトのメニュー設定である `packages/docs-site/.vitepress/sidebar-config.ts` に当該型のメニューを追加することで、ユーザーからの到達性を確保しました。PJR-2GD6 および `vp-arc-conciseness` の方針に従い、テンプレート内には骨組みのみを維持し、詳細な定義は正本（rulebook 等）を参照する構成としています。
