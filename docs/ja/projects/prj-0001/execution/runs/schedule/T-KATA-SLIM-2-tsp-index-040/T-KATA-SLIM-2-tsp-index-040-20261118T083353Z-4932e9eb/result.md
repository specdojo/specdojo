---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-tsp-index-040-20261118t083353z-4932e9eb
  type: exec-result
  task_id: T-KATA-SLIM-2-tsp-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-tsp-index-040/T-KATA-SLIM-2-tsp-index-040-20261118T083353Z-4932e9eb/plan.md
  started_at: "2026-11-18T08:34:02.160Z"
  completed_at: "2026-11-18T09:03:52.080Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - tsp-index
    - specdojo:tsp-index-rulebook
---

# Edit Result

## 1. 実施内容

- `tsp-index-rulebook.md` から、どの成果物にも共通する文書運用の記述を外し、正本への参照に置き換えた。全体方針に「共通の運用」を 1 項目だけ置いた。役割は適用先のメンバー定義を参照する。status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard.md` を参照する。
- grade の finding のうち F001・F002・F003 は解消した。F004 は sample が今回の編集対象外のため未解消で、後続の sample-maintenance に送る。
- 空白（改行を含む）を除いた文字数は 10,527 字から 8,394 字になり、比率は 79.74%（目安の 8 割以下）。表の区切り行も除く sld 試行と同じ数え方では 8,853 字から 6,965 字で、比率は 78.67%。
- 章名・見出し順・必須／任意の区分は変更していない。runner の検査（`lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration`）はすべて passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/tsp-index-rulebook.md`: 共通の文書運用（役割の表と段落、status・承認・改訂と廃止、未決事項の管理台帳の記述、共通規約と同じ禁止事項）を削り、全体方針の「共通の運用」1 項目から正本を参照する形にした。責任分界の要求は「テストレベル一覧」に集約し、曖昧表現の禁止は Rulebook 記述標準への参照に置き換えた。集約 ID の例は `tsp-index` に統一し、埋め込みメタ情報の例は `specdojo` 名前空間と rulebook 指定の形式に直した。標準列の途中の空行を除いて表を 1 つにした。用語表からは本文要件の言い換えを除き、回帰・スタブ・モック・スモークは残した。レベル一覧の標準 4 列、外部 I/F の区分と代替方式の選択基準、業務の品質ゲートと受入判定は維持した。

## 3. 申し送り

- F004 の対応は後続の sample-maintenance に回す。`docs/ja/specdojo/samples/tsp-index-sample.md` は入力情報や記述内容を説明する文書になっていて、完成例ではない。rulebook の本文構成に沿って、概要、レベル一覧と観点／条件設計原則、スコープ、環境・データ、品質ゲート、メモ／将来課題を具体化した完成例に改訂する。論点と影響を示し、文書運用の再掲は加えない。
- plan に記載の成果物パス `docs/ja/product/080-test-specs/010-test-strategy-and-policy/tsp-index.md` は存在しない。対象 rulebook は存在し、finding・関連標準・既存 sample から改訂を判断できたため、成果物を新規作成していない。
- 共通の正本（`document-metadata-standard.md` など）への追記は不要と、executor が判断した。recipe・template・sample は変更しておらず、合わせて直す点は上記の sample のみ。
- 変更ファイルは docs/ja/specdojo/rulebooks/tsp-index-rulebook.md のみ。全体方針に「共通の運用」を1項目設け、役割は適用先のメンバー定義、status・承認・改訂・廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ委譲した。成果物本体・recipe・template・sample・grade サイドカー・result は編集していない。
- 判断根拠: docs/ja/specdojo/standards/ 配下の rulebook-authoring-standard.md、document-metadata-standard.md、test-document-scope-standard.md、id-and-file-naming-standard.md、sample-authoring-standard.md、および deliverable-frontmatter.schema.yaml を確認した。sld-rulebook.md と pjr-8s4t-sld-kata-slim-pilot.md の展開一覧、対象 rulebook・sample・grade result も照合した。
- F001: 責任分界の要求を「テストレベル一覧」に集約し、全体方針の反復を削除した。F002: 曖昧表現・実装詳細についての共通禁止事項を Rulebook 記述標準への参照に置き換え、例の規約再掲を具体的な判定例にした。F003: 集約 ID の例を tsp-index に統一し、埋め込みメタ情報例を specdojo 名前空間・rulebook 指定の形式へ修正した。
- F004 は未解消。docs/ja/specdojo/samples/tsp-index-sample.md は入力情報・記述内容を説明する文書であり、完成例ではない。今回は sample が編集対象外のため、後続の sample-maintenance で rulebook の本文構成に沿う完成例へ改訂する。概要、レベル一覧と観点／条件設計原則、スコープ、環境・データ、品質ゲート、メモ／将来課題を具体化し、論点と影響を示す。文書運用の再掲は加えない。
- 章名・見出し順・必須／任意の区分は変更していない。レベル一覧の標準4列、責任分界の推奨列、外部 I/F の区分と代替方式の選択基準、業務の品質ゲート・受入判定を維持した。標準列の途中の空行を除去し、単一の表に修正した。用語表から本文要件の言い換えを除き、回帰・スタブ・モック・スモークは残した。includes による記法 rulebook の取り込みはない。
- 空白（改行を含む）を除いた文字数は変更前10,527字、変更後8,394字、比率79.74%。sld 試行と同じく表の区切り行も除く場合は8,853字から6,965字、78.67%。見出し・本文構成・frontmatter の維持、共通運用項目の一意性、参照先 ID、変更範囲、文字数を確認した。
- 指定された docs/ja/product/080-test-specs/010-test-strategy-and-policy/tsp-index.md は存在しない。対象 rulebook は存在し、finding・関連標準・既存 sample から改訂を判断できたため、成果物を新規作成せず作業した。共通正本への追記は不要と判断した。親 runner 指定の lint・schema・型検査・テストは executor では実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更対象は Markdown rulebook のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルおよび既存 plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance の手順で、参照の向きを成果物から rulebook へ切り替えて見直した。根拠にしたのは、sld 試行（`pjr-8s4t-sld-kata-slim-pilot.md`）の展開一覧、改訂済みの `sld-rulebook.md`、`rulebook-authoring-standard.md`、`document-metadata-standard.md`、`test-document-scope-standard.md`、`id-and-file-naming-standard.md`、`sample-authoring-standard.md`、`deliverable-frontmatter.schema.yaml`、および対象 rulebook・sample・grade result である。残した記述は、型固有の判断基準と区分、標準の列と章の受入条件、外部 I/F の区分と代替方式の選択基準、業務の品質ゲートと受入判定、良い例・悪い例である。外した記述は、共通の文書運用と、本文要件の言い直しだけの用語である。F001 は責任分界の要求を「テストレベル一覧」に集約して解消した。F002 は共通禁止事項を Rulebook 記述標準への参照に置き換えて解消した。F003 は集約 ID の例を `tsp-index` に統一して解消した。F004 は sample が編集対象外のため未解消で、理由と次のアクションは handoff に記した。includes で取り込む記法 rulebook はなかった。
