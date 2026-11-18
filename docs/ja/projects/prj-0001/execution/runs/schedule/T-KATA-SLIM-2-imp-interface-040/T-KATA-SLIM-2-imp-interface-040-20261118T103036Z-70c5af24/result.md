---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-imp-interface-040-20261118t103036z-70c5af24
  type: exec-result
  task_id: T-KATA-SLIM-2-imp-interface-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-imp-interface-040/T-KATA-SLIM-2-imp-interface-040-20261118T103036Z-70c5af24/plan.md
  started_at: "2026-11-18T10:30:46.714Z"
  completed_at: "2026-11-18T11:12:49.326Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:imp-interface
    - specdojo:imp-interface-rulebook
---

# Edit Result

## 1. 実施内容

- 影響調査（I/F）の rulebook から、どの成果物にも共通する文書運用の記述を外し、共通正本への参照に置き換えました。
- 全体方針に「共通の運用」を1項目置きました。役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照します。
- grade の finding F001（推奨配置の明記）と F002（空行で壊れた表）はどちらも解消しました。未解消の finding はありません。
- 文字数は空白を除いて2,680字から2,006字（74.85%）になり、目安の8割以下です。
- 整形、構造確認、`git diff --check` は合格しました。親 runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit` も合格しました。`test:integration` も exit 0 で、evidence は出力を途中で省略しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-interface-rulebook.md`: 共通の文書運用を正本参照に置き換えて簡潔にしました。全体方針に「共通の運用」を1項目追加しました。用語表、共通 Frontmatter 表、未解決事項の担当・期限・次回レビュー管理、共通規約の重複転記を削除しました。第2章名は「位置づけ」に変更しました。推奨配置 `docs/ja/projects/&lt;project-id&gt;/050-impact-analysis/imp-interface.md` を追記し、F001 を解消しました。空行で壊れていた Frontmatter 表は、共通正本参照と型固有値の文章に置き換え、F002 を解消しました。必須6章・標準6列、型固有の判断基準、未解決事項の論点と影響、対応方針の実施担当・時期は維持しました。

## 3. 申し送り

- `imp-interface-sample` の未解決事項表から決定期限・担当を外し、判断・対応への影響と当面の扱いを示す変更案があります。sample は今回の commit 対象外のため未変更です。
- `imp-interface-sample` の grade が指摘する対象期間と高・中・低の尺度の欠落は成果物側の不備です。rulebook 側の規定は維持し、sample 改訂時に補う想定です。
- recipe・template に追加で直す点はなく、共通正本への追記も不要と executor は判断しています。
- 第2章名の変更理由は次のとおりです。用語表は本文と標準列の言い直しのため削除しました。契約・互換性・障害波及・利用者影響の判断対象は残しました。成果物側の章名と必須区分は変更していません。
- 文字数は、表区切り行も除く sld 試行と同じ数え方では2,389字から1,867字（78.15%）です。
- 変更ファイル: docs/ja/specdojo/rulebooks/imp-interface-rulebook.md のみ。成果物本体、sample、recipe、template、grade 結果、result は変更していない。
- result 記載用の判断根拠: xp/xep 共通規約、rulebook-authoring-standard、document-metadata-standard、id-and-file-naming-standard、docs-structure-guide、共通レビュー観点の `vp-ux-readability`・`vp-arc-conciseness`、sld-rulebook、PJR-8S4T の展開一覧、imp-interface-sample とその grade、imp-interface-rulebook の grade、dct-impact-analysis、改訂済み imp-business-rulebook を確認した。指定された成果物本体は未作成だが、カタログ・sample・規範により改訂を判断できた。
- 実施内容: 全体方針に「共通の運用」を1項目置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは document-metadata-standard を参照した。用語表、共通 Frontmatter 表、未解決事項の担当・期限・次回レビュー管理、共通の重複転記禁止を削除。未解決事項には論点・不足情報・影響・当面の扱いを要求する。対応方針の実施担当・時期は I/F 対応に必要なため維持した。
- finding 対応: F001 は推奨配置 docs/ja/projects/&lt;project-id&gt;/050-impact-analysis/imp-interface.md と適用先カタログに従う旨を追記して解消。F002 は空行で壊れていた Frontmatter 表を共通正本参照と型固有値の文章へ置換して解消。残る2表は Markdown parser で正常な表として解析でき、必須6章・標準6列も確認した。未解消 finding はない。
- 章名変更の理由: rulebook 第2章を「位置づけと用語定義（必要に応じて）」から「位置づけ」へ変更。用語表は本文・標準列の言い直しのため削除し、契約・互換性・障害波及・利用者影響の判断対象は残した。成果物側の章名・必須区分は変更していない。
- 文字数: Frontmatter・表区切り行を含み、改行を含む空白を除いて2,680字から2,006字、74.85%。sld 試行と同じく表区切り行も除く場合は2,389字から1,867字、78.15%。いずれも8割以下。
- 後続変更案: imp-interface-sample の未解決事項表から決定期限・担当を外し、判断・対応への影響と当面の扱いを示す。既存 grade が指摘する対象期間と高・中・低の尺度の欠落は成果物側の不備として維持し、sample 改訂時に補う。recipe・template は undecided、includes はなく、今回の追加編集対象はない。共通正本への追記は不要と判断した。
- CHANGELOG 文案（変更）: 影響調査（I/F）の rulebook から共通の文書運用と重複定義を外して正本参照へ集約し、推奨配置を明記しました。親 runner が担当する lint・schema・test 等は executor では実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、YAML ファイル変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ に及ばない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、`imp-interface-rulebook` を共通正本（`document-metadata-standard`、`rulebook-authoring-standard` など）と sld 試行の一覧に照らして見直しました。型固有の判断基準、標準列と章の受入条件、未解決事項の論点と影響は残しました。共通の運用記述は参照に置き換えました。grade の F001・F002 は判定根拠に照らして解消を確認しました。判断根拠は、xp/xep 共通規約、`sld-rulebook`、PJR-8S4T の展開一覧、`imp-interface-sample` とその grade、`dct-impact-analysis`、改訂済み `imp-business-rulebook` です。
