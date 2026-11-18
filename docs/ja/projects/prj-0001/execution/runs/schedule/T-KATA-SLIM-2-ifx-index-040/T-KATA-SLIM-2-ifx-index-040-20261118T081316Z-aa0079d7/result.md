---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-ifx-index-040-20261118t081316z-aa0079d7
  type: exec-result
  task_id: T-KATA-SLIM-2-ifx-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-ifx-index-040/T-KATA-SLIM-2-ifx-index-040-20261118T081316Z-aa0079d7/plan.md
  started_at: "2026-11-18T08:13:23.982Z"
  completed_at: "2026-11-18T08:42:27.161Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - ifx-index
    - specdojo:ifx-index-rulebook
---

# Edit Result

## 1. 実施内容

- `ifx-index-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通正本への参照に置き換えました。
- 全体方針に「共通の運用」を1項目だけ置き、役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照する形にしました。
- 連携単位・方向・方式・形式・発生条件・異常時判断、IF ごとの確認者と合意対象、未決論点と影響、表示ページの固有要件など、型固有の判断基準は維持しました。
- 空白（改行を含む）を除いた文字数は 7,388字から 5,432字（73.52%）になり、目安の 8 割以下を満たしました。参考として表の区切り行も除くと 6,682字から 5,127字（76.73%）です。
- 整形検査と差分の空白検査は成功しました。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も成功しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md`: 共通運用の記述を削り、正本への参照に置き換えました。全体方針へ「共通の運用」を1項目追加しました。役割の分担、台帳登録の手順、共通規約と重複する禁止事項、業務の受入確認に入れていた整形検査を削除しました。本文要件の言い直しだった用語表も削除し、第2章を「位置づけと用語定義」から「位置づけ」に改名しました。他の章名、7領域の本文要件、必須・条件付きの区分、frontmatter は維持しました。`draft`・`ready`・`deprecated` の値列挙は、schema の enum 網羅要件に従って残しました。

## 3. 申し送り

- 共通正本への変更案（未実施）: `document-metadata-standard` には、一般の文書について公開可否の判断者・公開対象・公開範囲の記録要件がありません。公開判断と文書成熟度を区別し、適用先の責任者と承認記録に接続する共通規定を追加する案です。
- 共通正本への変更案（未実施）: 未決事項の登録簿への引き継ぎ規定は改訂・廃止に限られています。初回作成時にも適用する案です。
- 関連する型への変更案（未実施）: `ifx-index-recipe` の作成手順・メタ情報・引き継ぎ・検証・レビュー観点、template の冒頭と各 IF のコメント、sample の役割・PO 承認・末尾の Schedule/PJR 登録手順を、改訂後の rulebook に合わせて整理する案です。IF 固有の確認者・合意対象、論点・影響・保留条件は残します。
- result 記載用: 変更ファイルは docs/ja/specdojo/rulebooks/ifx-index-rulebook.md のみ。全体方針に「共通の運用」を1項目追加し、役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ集約。役割分担・台帳登録手順・共通禁止事項を削り、業務の受入確認から整形検査を外した。成果物本体・recipe・template・sample・result・grade サイドカーは変更していない。
- 判断根拠: sld-rulebook、PJR-8S4T「他の型へ広げるときの一覧」、rulebook-authoring-standard、document-metadata-standard、`vp-arc-conciseness`、対象 YAML と対応 schema、宣言された recipe・template・sample、対象 rulebook と成果物の grade result を確認。連携単位・方向・方式・形式・発生条件・異常時判断、IF ごとの確認者と合意対象、未決論点と影響、表示ページの固有要件を維持した。
- result 記載用: 空白（改行を含む）を除く全文文字数は7,388字→5,432字、比率73.52%。参考として表の区切り行も除く場合は6,682字→5,127字、76.73%。本文要件の7領域と必須区分、frontmatter は維持。第2章のみ「位置づけと用語定義」から「位置づけ」へ改名した。本文要件の言い直しとなる用語表を削り、境界の定義と文書間の位置づけを短い段落にまとめたため。その他の章名は維持。`draft`・`ready`・`deprecated` の値列挙は、rulebook 記述標準の schema enum 網羅要件に従い残した。frontmatter の `includes` はなく、同時に編集する記法 rulebook はない。
- 共通正本への変更案（未実施）: document-metadata-standard は `ready` 昇格の主体と改訂・廃止の承認を定めているが、一般の文書公開可否の判断者・公開対象・公開範囲の記録要件は明記していない。公開判断と文書成熟度を区別し、適用先の責任者と承認記録に接続する共通規定を追加する案を result に残す。また未決事項の登録簿への引き継ぎ規定は改訂・廃止に限定されているため、初回作成時にも適用する案を記録する。
- 関連する型への変更案（未実施）: ifx-index-recipe の作成手順・メタ情報・引き継ぎ・検証・レビュー観点、template の冒頭と各 IF のコメント、sample の役割・PO 承認・末尾の Schedule/PJR 登録手順を、改訂 rulebook に合わせて整理する。IF 固有の確認者・合意対象、論点・影響・保留条件は残す。矛盾する共通運用の要求は本タスクの指示と改訂 rulebook を正とした。親 runner 担当の lint・schema・test・typecheck は重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の plan/result を変更していない。）

## 4. 進め方と実践の型の適用

根拠とした資料は次のとおりです。`sld-rulebook`、PJR-8S4T の「他の型へ広げるときの一覧」、`rulebook-authoring-standard`、`document-metadata-standard`、`vp-arc-conciseness`、対象 YAML と対応 schema、宣言された recipe・template・sample、対象 rulebook と成果物の grade result。これらに基づき、共通運用の記述を参照へ置き換え、型固有の判断基準・区分・禁止事項・受入確認・未決の論点と影響は維持しました。frontmatter に `includes` はなく、同時に簡潔化する記法 rulebook はありません。plan に展開された finding と condense の記録はありませんでした。recipe・template・sample は commit の対象外のため変更せず、矛盾する共通運用の要求は本タスクの指示と改訂後の rulebook を正としました。
