---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-cpd-specdojo-cli-040-20261118t051555z-ba894f66
  type: exec-result
  task_id: T-KATA-SLIM-2-cpd-specdojo-cli-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-cpd-specdojo-cli-040/T-KATA-SLIM-2-cpd-specdojo-cli-040-20261118T051555Z-ba894f66/plan.md
  started_at: "2026-11-18T05:16:07.970Z"
  completed_at: "2026-11-18T05:44:53.190Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - cpd-specdojo-cli
    - specdojo:cpd-rulebook
---

# Edit Result

## 1. 実施内容

- CPD の rulebook（`cpd-rulebook.md`）と、`includes` で取り込まれる `cpd-mermaid-rulebook.md` から、文書共通の運用の記述を外し、共通の正本への参照に置き換えました。
- 外した記述は、役割の表と段落、status・承認・公開・改訂と廃止の手順、文書検査コマンド表、未決事項の管理台帳の列と登録手順です。
- 残した記述は、CPD 固有の責務分割、単一コンテナ境界、依存方向、関係 ID と標準列、上位目的との対応、観測条件と受入判定、良い例・悪い例、固有の禁止事項です。
- 空白と改行を除いた文字数は、`cpd-rulebook.md` が 7,600 字から 4,744 字（62.42%）、`cpd-mermaid-rulebook.md` が 5,567 字から 4,159 字（74.71%）になりました。どちらも 8 割以下の目安を満たします。
- 検査結果です。prettier 整形、`git diff --check`、独自の構造確認は passed でした。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も passed でした。`lint:ts` と `typecheck` は変更種別により `not_applicable` です。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cpd-mermaid-rulebook.md`: `includes` で取り込まれる記法の rulebook として、共通運用の記述と、ノード別に重複していたコード例を整理し、短い例へ統合しました。形状、配色、境界、ラベル、禁止事項、最小サンプル、凡例は残しました。「標準の色分け」「標準スタイル定義」「適用ルール」は名称と番号を維持し、見出し階層を補正しました。Frontmatter は変えていません。
- `docs/ja/specdojo/rulebooks/cpd-rulebook.md`: 全体方針に「共通の運用」を 1 項目置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard.md` を参照する形にしました。役割表と「作成・確認・合意の分担」小節、文書検査コマンド表、未決事項の管理台帳の列と登録段落を削除しました。CPD 固有の判断基準、標準の列、受入条件、良い例・悪い例、固有の禁止事項は維持しました。Frontmatter と主要章名は変えていません。

## 3. 申し送り

- 後続の変更案（recipe・template・sample）です。`cpd-recipe.md` の確認・合意・公開・台帳登録の手順、`cpd-template.md` の概要の役割・公開記入指示と未決事項の管理列・登録段落、`cpd-sample.md` の役割割当て・承認段落・文書検査参照・未決事項の管理列を、今回の rulebook に合わせて整理してください。`cpd-sample.md` が参照する「検証と合意の判定」から文書検査コマンド表を除いたため、sample 側の追従が必要です。これらは指定どおり今回の変更対象外です。
- 共通正本への変更案です。`document-metadata-standard.md` には、公開前の情報確認と公開可否の承認条件が明文化されていません。公開対象、非公開情報の確認、判断記録、技術検証と公開許可の区別を共通規定として追加する案です。あわせて、`rulebook-authoring-standard.md` の「各 rulebook に役割分担を定義させる」記述は、今回のメンバー定義への集約方針と整合するか検討してください。共通正本は編集していません。
- 変更ファイルは docs/ja/specdojo/rulebooks/cpd-rulebook.md と docs/ja/specdojo/rulebooks/cpd-mermaid-rulebook.md の2件。各全体方針に「共通の運用」を1項目置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ集約した。成果物本体・recipe・template・sample・result・設定・評価サイドカーは変更していない。
- 判断根拠: document-metadata-standard.md、rulebook-authoring-standard.md、sld-rulebook.md、PJR-8S4T「他の型へ広げるときの一覧」、共通レビュー観点の `vp-arc-conciseness`、cpd-specdojo-cli.md、上位の cnd-specdojo.md、CPD の recipe・template・sample と既存 grade result を確認した。plan に展開された finding はない。
- CPD 固有の責務分割、単一コンテナ境界、依存方向、関係 ID と標準列、上位目的との対応、学習用例の例外、通常時・失敗・応答欠落時の観測条件と受入判定、変更影響、良い例・悪い例と固有の禁止事項を維持した。役割表・承認手順・文書検査コマンド表・未決事項の台帳管理列と登録手順を除去した。Mermaid は形状・配色・境界・ラベル・禁止事項・最小サンプル・凡例を残し、ノード別の重複コードを短い例へ統合した。
- 文字数は Frontmatter・表の区切りを含め、空白と改行を除外して計測。cpd-rulebook.md: 7,600字→4,744字（62.42%）。cpd-mermaid-rulebook.md: 5,567字→4,159字（74.71%）。両方とも8割以下の目安を満たす。
- 主要章名と本文要件の必須／条件付き区分は維持。CPD の「作成・確認・合意の分担」小節だけは、役割表と段落を外す指定に従って削除した。Mermaid の「標準の色分け」「標準スタイル定義」「適用ルール」は名称・番号を維持して見出し階層を補正した。Frontmatter は両ファイルとも変更していない。
- 後続変更案: cpd-recipe.md の確認・合意・公開・台帳登録の手順、cpd-template.md の概要の役割・公開記入指示と未決事項の管理列・登録段落、cpd-sample.md の役割割当て・承認段落・文書検査参照・未決事項の管理列を今回の rulebook に合わせて整理する。特に sample が参照する「検証と合意の判定」から文書検査コマンド表を除いたため、旧記述の追従が必要。今回は指定どおり変更対象外とした。
- 共通正本への変更案: document-metadata-standard.md には人による昇格・改訂廃止・未決事項の引き継ぎがある一方、公開前の情報確認と公開可否の承認条件は明文化されていない。公開対象・非公開情報の確認・判断記録・技術検証と公開許可の区別を共通規定として追加する案を申し送る。また rulebook-authoring-standard.md の各 rulebook に役割分担を定義させる記述は、今回のメンバー定義への集約方針との整合を検討する。共通正本は編集していない。
- 親 runner が担当する lint・schema・typecheck・unit/integration 検査は sandbox で重複実行していない。result の必須セクションへの記録は reporter が本報告を用いて行う。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、YAML・YML ファイルを変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル・既存 plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下への成果物変更がない。）

## 4. 進め方と実践の型の適用

実践の型メンテナンス（rulebook-maintenance）として、sld の試行（PJR-8S4T の「他の型へ広げるときの一覧」）と改訂済みの `sld-rulebook.md` を手本にしました。根拠として、`document-metadata-standard.md`、`rulebook-authoring-standard.md`、`vp-arc-conciseness`、`cpd-specdojo-cli.md`、上位の `cnd-specdojo.md`、CPD の recipe・template・sample、既存の grade result を確認しました。plan に展開された finding と、成果物から届いた Kata 起因の finding はありませんでした。共通運用は各 rulebook の全体方針に 1 項目だけ置き、役割・status・承認・改訂と廃止・未決事項の引き継ぎは共通の正本へ集約しました。CPD 固有の判断基準は維持しました。章名と必須・条件付きの区分は原則維持しました。例外は「作成・確認・合意の分担」小節で、役割表と段落を外す指定に従って削除しました。成果物本体、recipe、template、sample、grade サイドカーは変更していません。
