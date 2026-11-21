---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-gl-common-040-20261118t013237z-f60edc2a
  type: exec-result
  task_id: T-KATA-SLIM-2-gl-common-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-gl-common-040/T-KATA-SLIM-2-gl-common-040-20261118T013237Z-f60edc2a/plan.md
  started_at: "2026-11-18T01:32:53.101Z"
  completed_at: "2026-11-18T03:19:54.914Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - gl-common
    - specdojo:gl-rulebook
---

# Edit Result

## 1. 実施内容

- `gl-rulebook` から、どの成果物にも共通する運用の記述を外し、共通の正本を参照する形に改めました。具体的には、役割・承認・改訂と廃止・未決事項の引き継ぎを、全体方針の「共通の運用」1項目へ集約しました。
- 用語固有の判断基準、メタ情報6項目・用語11項目の必須/任意の区分、章名、frontmatter、良い例・悪い例、受入条件は維持しました。`includes` で取り込む記法の rulebook はありません。
- 空白と改行を除いた文字数は 5,016 字から 4,004 字になり、79.82% に縮減しました。目安の 8 割以下に収まっています。
- grade の finding のうち F001・F004・F006・F007 は本文で解消しました。F002・F003・F005・F009・F010 は計画の削除方針を優先し、共通手順は正本参照としました。F008 は未解消で、申し送りに残しています。
- executor の検証では、prettier の整形と確認、`git diff --check`、文字数・構成の確認が通りました。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も passed です。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/gl-rulebook.md`: 役割・status・承認・改廃・未決事項の引き継ぎなど共通運用の記述を、全体方針の「共通の運用」1項目と正本参照に置き換えました。あわせて、本文要件の言い直しだけの記述と必須項目の二重説明を削除しました。F001 への対応として、候補語を利用者・確認者と用例・根拠で照合し、未合意なら論点と影響を残す条件を追加しました。F006 への対応として、schema と参照検査のコマンド、modeline、成功条件を明記しました。参照検査が BDD・BR の参照を対象にしない点も書きました。F007 への対応として、翻訳を概念重複禁止の例外とし、言語接尾辞付きの別 ID と原語への参照を定義しました。gl 固有の追従対象（BDD・BR、画面・CLI、実装、テスト・受入条件、生成表示ページ）と、YAML からの再生成・一致確認は残しました。

## 3. 申し送り

- F008 は未解消です。`gl-sample` には接頭辞のない ID があり、`rulebook` の新規採番規則（`tm-&lt;領域&gt;-&lt;概念&gt;`）と合いません。既存 ID の維持という例外に当たる根拠は確認できず、sample は今回の編集対象外のため、規則は維持しました。次の sample 見直しで採番案を検討し、category・`relatedTerms`・外部参照も一括照合してください。
- 共通の正本への変更案です。今回は編集していません。`rulebook-authoring-standard` では、追従対象は各型、役割割り当ては適用先のメンバー定義、共通責務は `document-metadata-standard` 参照という形に整合させる案があります。`document-metadata-standard` では、改廃時に限られている未決事項の引き継ぎを初回作成・通常更新にも適用する案があります。また、ready 判断で構造・参照検査、業務内容の確認、未確定ラベル・候補事項の処置、人間の確認を共通条件として明記する案もあります。
- recipe・template・sample は変更していません。合わせて直すべき点は、上記の採番案と標準変更案のみです。
- reporter 向け実施内容・変更ファイル: 編集したのは docs/ja/specdojo/rulebooks/gl-rulebook.md のみ。役割・承認・改廃・未決事項の引き継ぎを全体方針の「共通の運用」1項目へ集約した。章名、メタ情報6項目・用語11項目の必須/任意、frontmatter は変更なし。includes による記法 rulebook はない。gl-common、sample、recipe、template、grade サイドカー、既存 result は編集していない。
- 大きさ: ファイル全体から空白・改行を除いた文字数は5,016字→4,004字、79.82%（20.18%削減）。sld試行と同様に表の区切り行も除く測定では4,877字→3,865字、79.25%。result に前後の文字数と測定方法を記録する。
- 進め方と実践の型の適用に記録する根拠: [[specdojo:rulebook-authoring-standard|Rulebook記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の各finding該当観点、[[specdojo:ryu-guide|進め方ガイド]]、[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|sld試行]]、[[specdojo:sld-rulebook|SLD作成ルール]] を確認。適用実態は [[gl-common|用語集（共通）]]、[[gl-planning|用語集（計画）]]、[[specdojo:gl-sample|用語集の完成例]]、[[prj-0001:dct-glossary|用語集カタログ]] と照合した。gl schema、参照検査実装、[[prj-0001:pjr-cf15-glossary-term-reference-check|用語参照検査の対応記録]] も確認した。
- findingへの対応: source=grade は execution/grade/results/specdojo.gl-rulebook.yaml のF001〜F010を本文anchorと照合した。F001は候補語を業務の利用者・確認者と用例・根拠で照合し、未合意時の論点・影響を残す条件を追加。F004は必須項目の二重説明を削除。F006はschema・参照検査のコマンド、modeline、成功条件とBDD・BR参照を検査しない限界を明記。F007は翻訳を概念重複禁止の例外とし、別IDの言語接尾辞と原語への参照を定義。gl-common-080のcondense resultも確認したが、記録のcauseはdocumentでありKata原因の追加記録はない。
- F002・F003・F005・F009・F010の扱い: 今回の計画の削除方針を優先し、Role code別の責務、承認・ready昇格、登録簿転送、改廃の共通手順は再掲せず正本参照とした。gl固有の追従対象としてBDD・BR、画面・CLI、実装、テスト・受入条件、生成表示ページを残し、YAMLからの再生成と一致確認を明記した。各findingのRole codeや共通手順の直接追記要求まで解消したとは扱わず、この方針と次の共通標準変更案をresultへ記録する。
- 共通正本の変更案（今回は未編集）: rulebook-authoring-standard の「各rulebookは具体的な追従対象と役割分担を定義する」を、追従対象は各型、役割割り当ては適用先メンバー定義、共通責務はdocument-metadata-standard参照とする形へ整合させる。document-metadata-standardでは、改廃時に限られている未決事項の引き継ぎを初回作成・通常更新にも適用すること、ready判断で構造・参照検査、業務内容、未確定ラベル・候補事項の処置、人間の確認をどう扱うかを共通条件として明記する案を次の標準見直しで検討する。
- F008は未解消として申し送り: gl-sample の接頭辞のないIDに既存確定・参照済みの例外を適用できる根拠は確認できないため、rulebookの新規採番規則は維持した。sampleは今回の編集対象外。次のsample見直しでtm-reorder-point→tm-inventory-reorder-point、tm-standard-product→tm-common-standard-product、tm-safety-stock→tm-inventory-safety-stock、tm-accounts-receivable→tm-sales-accounts-receivable等の採番案を検討し、分類用語・店主のIDを含めcategory・relatedTermsと外部参照も一括照合する。確定・参照済みの証拠があるIDは維持を優先する。
- 親runnerが指定済みのlint・schema・型検査・単体/統合テストを実行するため、executorでは重複実行していない。CHANGELOG文案: 用語集のrulebookから共通運用の記述を外して正本参照へ集約し、候補語の判断、翻訳ID、参照検査の範囲を明確にしました。
- 対象 `gl-common` は未変更: 計画はgl-commonを根拠として紐づくrulebookのみを編集し、成果物本体は変更しないと指定しているため。
- 適用外の検証: `npm run validate:schema:file`（executorが変更したのはMarkdown rulebookのみで、YAML/YML成果物の変更はない。）
- 適用外の検証: `npm run validate:catalog`（executorによる変更はdocs/ja/specdojo/rulebooks/配下のみ。docs/ja/projects/配下の既存差分は再開前のrunner管理ファイルであり、今回は編集していない。）
- 適用外の検証: `npm run validate:history-links`（executorはPJR個票や既存plan/resultなどの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

根拠としたのは、`rulebook-authoring-standard`、`document-metadata-standard`、共通レビュー観点一覧、進め方ガイド、sld 試行の記録、改訂済みの `sld-rulebook` です。`gl-common`、`gl-planning`、`gl-sample`、用語集カタログ、gl schema、参照検査の実装と対応記録も確認し、規定が実際の成果物に合っているかを照合しました。grade の F001〜F010 は本文の anchor と照合しました。`gl-common-080` の condense result も確認しましたが、Kata が原因の追加記録はありませんでした。計画の削除方針を優先し、共通の運用は再掲せず正本参照としました。用語固有の判断基準や例は維持しました。矛盾する場合は rulebook を正としました。F002・F003・F005・F009・F010 の Role code や共通手順の直接追記の要求までは解消していません。この点は共通正本の変更案として申し送りました。
