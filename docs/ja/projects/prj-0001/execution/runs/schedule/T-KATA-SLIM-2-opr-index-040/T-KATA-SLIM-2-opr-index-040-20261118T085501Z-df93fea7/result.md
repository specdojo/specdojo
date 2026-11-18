---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-opr-index-040-20261118t085501z-df93fea7
  type: exec-result
  task_id: T-KATA-SLIM-2-opr-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-opr-index-040/T-KATA-SLIM-2-opr-index-040-20261118T085501Z-df93fea7/plan.md
  started_at: "2026-11-18T08:55:10.486Z"
  completed_at: "2026-11-18T09:24:19.717Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - opr-index
    - specdojo:opr-index-rulebook
---

# Edit Result

## 1. 実施内容

- `opr-index-rulebook` から、どの成果物にも共通する運用の記述（役割・status・承認・改訂と廃止・未決事項の引き継ぎなど）を外しました。全体方針に「共通の運用」を 1 項目だけ置き、メンバー定義と `document-metadata-standard` を参照する形にしました。
- 章名と必須・条件付きの区分は維持しました。12 章それぞれの受入条件、手順表の標準列、実行・模擬と証跡照合による合格条件、作成順序、`rulebook` 指定の必須化を補いました。
- 空白を除いた文字数は 1,558 字から 1,840 字（118.10%）になり、8 割以下という目安は未達です。章別の受入条件と業務の確認手順を補い、判断情報を残すことを優先したためです。
- 整形と差分検査は成功し、runner の検査（`lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`test:integration`・`validate:schema`・`test:unit`）も成功しました。`lint:ts` と `typecheck` は変更種別により対象外です。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/opr-index-rulebook.md`: 共通の運用の記述（役割の表と段落、status・承認・改訂と廃止、共通禁止事項、本文要件を言い直しただけの記述）を外し、全体方針の「共通の運用」1 項目からの参照に置き換えました。12 章の章名と必須区分は維持し、各章の受入条件、手順表の標準列、実行・模擬と証跡照合による合格条件、作成順序、`rulebook` 指定の必須化を追加しました。`recipe` と `template` は `not-needed` とし、その理由を全体方針に記載しました。status は `draft` のままです。

## 3. 申し送り

- F008・F009 は sample が編集対象外のため未解消です。次のアクションは、`opr-index-sample` の準拠先を `specdojo:opr-index-rulebook` に修正し、欠けている章を補って 12 章に合わせることです。対象外の章には理由を、分冊した章には参照を示します。修正後に grade を再実行してください。
- F013 の質問・例外の判断経路は、共通正本で明確でないため残課題です。変更案は、共通正本に適用先のメンバー定義から受付先・判断者へ接続する規則を追加し、各 rulebook には再掲しないことです。
- F004 の lint・schema コマンドの追加は、今回の指示（文書品質の検査を業務の受入条件に入れない）に従って見送りました。
- 指定された成果物 `opr-index.md` と依存先 `opd-index.md` は未作成です。そのため、確認できた規範・sample・個別手順・カタログを根拠に改訂しました。
- 変更ファイルは docs/ja/specdojo/rulebooks/opr-index-rulebook.md のみ。result は executor/reporter 分担に従い未編集。reporter は本申し送りを「実施内容」「変更ファイル」「進め方と実践の型の適用」に記録すること。
- 判断根拠: rulebook-authoring-standard、document-metadata-standard、sld-rulebook、PJR-8S4T の「他の型へ広げるときの一覧」、共通レビュー観点、dct-operations、opr-rulebook、opr-index-sample、opr-agent-cli-update、および opr-index-rulebook / opr-index-sample の grade result を確認した。plan の finding は source=grade として扱い、condense の記録はない。指定された成果物 opr-index.md と依存先 opd-index.md は未作成だが、確認できた規範・sample・個別手順・カタログを根拠に改訂した。
- F002・F003・F005・F006・F010・F011: 作成順序、全12章の受入条件、手順表の標準列、実行・模擬と証跡照合による合格条件、必須の rulebook 指定を明確化した。章名・必須区分はすべて維持し、該当作業がない章は対象外の理由、分冊した手順は参照で満たす。これは opr-rulebook と実在する個別手順の扱いに合わせた。
- F001・F012 および F013 の維持更新部分は「共通の運用」1項目からメンバー定義・メタ情報標準を参照する。F004 の lint・schema コマンド追加は、本フェーズの指示に従って業務の受入条件へ入れず、リポジトリ検証に委ねた。F013 の質問・例外の判断経路は共通正本で明確でないため残課題。変更案として、共通正本に適用先のメンバー定義から受付先・判断者へ接続する規則を追加し、各 rulebook には再掲しない。
- F007: 12章の本文構成と記述ガイドで骨組み・記入基準を提供できるため、sld の試行および opd-index-rulebook と同様に recipe・template を not-needed と判断し、理由を全体方針に記載した。recipe・template・sample 自体は変更していない。
- F008・F009 は sample 編集が対象外のため未解消。次の変更案: opr-index-sample の準拠先を specdojo:opr-index-rulebook に修正し、本文の opr-rulebook 参照を整理する。欠けている章を補って12章に合わせ、対象外には理由、分冊には参照を示す。sample の欠落に合わせて rulebook の必須章を減らすことはせず、構造・必須項目は rulebook を正とした。修正後に grade を再実行すること。
- 空白除外の文字数は変更前1,558字、変更後1,840字（118.10%）。sld 試行と同じく表の区切り行も除く場合は1,447字→1,719字。8割以下の目安は未達。共通メタ情報表・責務の重複・共通禁止事項を除いた一方、F005・F010・F011 等に対応する章別受入条件と業務の確認手順を補い、判断情報の保持を優先したため。
- 機械比較で7つの章見出し、本文構成の12章名と必須区分の維持、および「共通の運用」が1項目であることを確認した。status は draft のまま。includes はなく、追加の記法 rulebook 編集は不要。成果物本体・grade サイドカー・result・設定・Git 状態の変更操作は行っていない。親 runner 指定の検証は実行せず、終了後の結果に委ねる。
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown の rulebook のみで、YAML/YML の変更がない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルおよび既存の plan/result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物に及ばない。）

## 4. 進め方と実践の型の適用

根拠にした資料は、`rulebook-authoring-standard`、`document-metadata-standard`、sld の試行（PJR-8S4T の「他の型へ広げるときの一覧」）と改訂済みの `sld-rulebook`、共通レビュー観点、`opr-rulebook`、`opr-index-sample`、および両者の grade result です。plan の finding は `source=grade` として扱い、condense の記録はありません。 改訂した点は次のとおりです。F001・F012・F013 の維持更新部分は、「共通の運用」からメンバー定義とメタ情報標準を参照する形で解消しました。F002・F003・F005・F006・F010・F011 は、作成順序、12 章の受入条件、手順表の標準列、合格条件、`rulebook` 指定の必須化で対応しました。F003 の指摘（適用先によって不要な章がある）には、章を必須のまま維持し、該当作業がない章は対象外の理由を書く、分冊した手順は参照で満たす、という扱いで対応しました。F007 は、12 章の本文構成と記述ガイドで骨組みと記入基準を提供できるため、`recipe` と `template` を `not-needed` と判断しました。 未解消または見送った点は次のとおりです。F004 は見送りました。F008・F009 は sample 側の修正が必要で、構造と必須項目は rulebook を正とし、sample の欠落に合わせて必須章を減らすことはしませんでした。F013 の判断経路は共通正本の変更案として handoff に残しました。 `recipe`・`template`・`sample` と成果物本体は変更していません。`includes` で取り込む記法の rulebook はないため、追加の編集はありません。
