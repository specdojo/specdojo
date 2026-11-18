---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-itc-catalog-schedule-040-20261118t111612z-ef959377
  type: exec-result
  task_id: T-KATA-SLIM-2-itc-catalog-schedule-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-itc-catalog-schedule-040/T-KATA-SLIM-2-itc-catalog-schedule-040-20261118T111612Z-ef959377/plan.md
  started_at: "2026-11-18T11:16:37.312Z"
  completed_at: "2026-11-18T11:48:01.292Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - itc-catalog-schedule
    - specdojo:itc-rulebook
---

# Edit Result

## 1. 実施内容

- `itc-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。
- 空白を除いた文字数は変更前8,119文字、変更後6,142文字で、元の75.65%（24.35%削減）になり、目安の8割以下を満たした。
- 必須6章の名称・順序・必須区分、トレース規則、ケース列と判定条件、ITC固有の禁止事項は維持した。
- grade の F002（`utc-&lt;term&gt;` は `itc-&lt;term&gt;` の誤記）は修正して解消した。
- grade の F001（`itc-sample` が必須6章の完成例になっていない）は未解消である。sample は本段の編集対象外のため、申し送りとする。
- 検証では、executor が実行した Prettier の整形と検査、`git diff --check` が合格した。runner が実行した `npm run lint:fm`・`npm run lint:md`・`npm run lint:mermaid`・`npm run lint:d2`・`npm run validate:schema`・`npm run test:unit`・`npm run test:integration` も合格した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/itc-rulebook.md`: 共通運用の記述を共通の正本への参照に置き換えて簡潔にした。Frontmatter の共通項目表は参照に置換し、文書名は H1 で指定した。命名は ID・ファイル命名標準と改訂済みの `itc-index-rulebook` に合わせた。埋め込み例の 8.1〜8.6 配下は、トレースとケースを示す部分例のコードブロックに集約した。F002 の `utc-&lt;term&gt;` は `itc-&lt;term&gt;` に修正した。差分は 65 行追加、153 行削除。

## 3. 申し送り

- F001 の対応として、次段で `itc-sample` を必須6章の完成例へ改訂する必要がある。完成例には、結合境界・環境前提、トレース表、観点・意図・ケース表と証跡を含める。sample に合わせて rulebook の要件を緩和してはいない。
- 根拠成果物 `docs/ja/product/080-test-specs/030-internal-integration-test-catalog/itc-catalog-schedule.md` が作業ツリーに存在しなかったため、実成果物との適合確認は原本を参照できる段で行う必要がある。
- 共通の正本への追記案と、recipe・template の変更案はない。対象 rulebook に `includes` はなく、付随する記法 rulebook の編集は不要だった。
- 変更ファイルは docs/ja/specdojo/rulebooks/itc-rulebook.md のみ。result、成果物本体、recipe、template、sample、gradeサイドカーは編集していない。resultへの記録はreporterに委ねる。
- 判断根拠：sld-rulebook、pjr-8s4t-sld-kata-slim-pilot「他の型へ広げるときの一覧」、rulebook-authoring-standard、document-metadata-standard、id-and-file-naming-standard、itc-index-rulebook、itc-sample、itc-index-sample、およびITCのgrade resultを確認した。判定には共通レビュー観点の vp-arc-conciseness、vp-qe-kata-conformance、vp-ux-language-consistency を用いた。
- 空白除外文字数は変更前8,119文字、変更後6,142文字（元の75.65%、24.35%削減）。必須6章の名称・順序・必須区分、トレース規則、ケース列と判定条件、ITC固有の禁止事項を維持した。rulebook自身のFrontmatterは変更していない。
- 章構成について、rulebookの主要8章と成果物の必須6章は維持した。埋め込み例の8.1〜8.6配下は、rulebook-authoring-standardに従い、トレースとケースを示す自己完結した部分例のコードブロックへ集約した。完成例の重複を減らすためであり、成果物の章要件は変更していない。
- 共通標準を正として、Frontmatterの共通項目表を参照へ置換し、文書名をH1で指定、`specdojo.rulebook` を明示した。命名もID・ファイル命名標準と改訂済みitc-index-rulebookに合わせた。既存ファイルの改名は行っていない。
- source=gradeのF002は `utc-&lt;term&gt;` を `itc-&lt;term&gt;` に修正して解消。F001は未解消：現行itc-sampleは「目的と適用範囲／入力情報／記述内容／最小記述例／未解決事項」という説明用構成であり、必須6章の完成例になっていない。sampleは本段の編集対象外のため、次段で必須6章、結合境界・環境前提、トレース表、観点・意図・ケース表と証跡を持つ完成例へ改訂する。sampleに合わせてrulebookの要件を緩和しなかった。
- 根拠成果物として指定された docs/ja/product/080-test-specs/030-internal-integration-test-catalog/itc-catalog-schedule.md は作業ツリーに存在しなかった。利用可能な標準・上位rulebook・sample・grade resultから判断可能な範囲を編集し、実成果物との適合確認は原本を参照できる段で行う。
- 対象rulebookに `includes` はなく、付随する記法rulebookの編集は不要。今回の改訂に必要な共通正本の追記案、recipe・templateの変更案はなし。親runner担当の検証はsandbox内で実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルはMarkdownのみで、YAMLファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、既存plan、resultを変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物に及ばない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として進めた。`sld-rulebook` と `pjr-8s4t-sld-kata-slim-pilot` の「他の型へ広げるときの一覧」を手本にした。根拠として、`rulebook-authoring-standard`、`document-metadata-standard`、ID・ファイル命名標準、`itc-index-rulebook`、`itc-sample`、`itc-index-sample`、ITC の grade result を確認した。冗長さの判定には `vp-arc-conciseness` を、grade の判定根拠には `vp-qe-kata-conformance` と `vp-ux-language-consistency` を用いた。ITC 固有の判断基準、必須6章、トレース規則、禁止事項は維持した。章名と必須・条件付きの区分は変えていない。埋め込み例は部分例に集約したが、成果物の章要件は変更していない。F002 は修正して解消した。F001 は sample 側の不備と判断し、rulebook は緩和せず、sample 改訂案として申し送った。
