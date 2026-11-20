---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-roles-040-20261118t011326z-2a1a4084
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-roles-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-roles-040/T-KATA-SLIM-2-pm-roles-040-20261118T011326Z-2a1a4084/plan.md
  started_at: "2026-11-18T01:13:39.177Z"
  completed_at: "2026-11-18T04:01:27.007Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-roles
    - specdojo:pm-roles-rulebook
---

# Edit Result

## 1. 実施内容

- `pm-roles-rulebook` から、どの成果物にも共通する運用の記述を外し、全体方針の「共通の運用」1項目から正本を参照する形にしました。空白を除いた文字数は 4,970 字から 3,954 字（79.56%、20.44%減）で、目安の8割以下です。
- 外した記述は、役割別の作成・確認責務、状態昇格・承認・改訂廃止・未決事項の引き継ぎ、共通の禁止事項です。
- 残した記述は、採用集合、標準コード、正式名称、下流参照の照合、良い例・悪い例、型固有の禁止事項、受入確認、固有メモの論点と影響です。
- 全見出しと frontmatter は変更していません。`includes` の宣言はないため、取り込み先の rulebook はありません。
- 成果物本体（`pm-roles.yaml`）と recipe・template・sample は変更していません。
- runner の検査では `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` が成功しました。`lint:ts` と `typecheck` は変更種別により適用外です。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-roles-rulebook.md`: 共通の運用（status・承認・改訂と廃止・未決事項の引き継ぎ・役割別責務・共通の禁止事項）を削除し、全体方針の「共通の運用」1項目から正本を参照する形にしました。型固有の判断基準、採用集合、標準コード、正式名称、下流参照の照合、良い例・悪い例、受入確認、固有メモの論点と影響は残しました。章名と必須・任意の区分は変えていません。

## 3. 申し送り

- recipe の文書承認・公開可否確認と、未決事項の判断者・判断時点に関する共通運用が重複しています。template の「PO が承認判断できる」コメントも同様です。別タスクで整理する案です。sample の事業固有の役割と判断内容は維持できます。
- `rulebook-authoring-standard` の「各 rulebook が役割分担を定義する」規定と「各必須章に最低3項目」の規定に、共通運用を正本へ委譲する場合の扱いを明記する変更案があります。`document-metadata-standard` と人と組織の定義標準は、追記不要と判断しました。
- prj-0001 の組織定義は、コードと責務の正本をロール定義と記述しています。一方、上位標準・rulebook・recipe は、採用判断を組織定義に置いています。今回は上位標準に沿う責務境界を維持しました。成果物側の正本表記の整合は別途確認が必要です。
- result 記載用: 編集したのは docs/ja/specdojo/rulebooks/pm-roles-rulebook.md のみ。役割別の作成・確認責務、状態昇格・承認・改訂廃止・未決事項の引き継ぎ、共通の禁止事項を削除し、全体方針の「共通の運用」に集約した。採用集合、標準コード、正式名称、下流参照の照合、良い例・悪い例、固有メモの論点と影響を維持した。全見出しと frontmatter は変更なし。includes の宣言はない。
- 判断根拠: PJR-8S4T「他の型へ広げるときの一覧」、改訂済み sld-rulebook、rulebook-authoring-standard、document-metadata-standard、people-and-organization-definition-standard、共通レビュー観点の `vp-arc-conciseness`、pm-roles の schema・recipe・template・sample、prj-0001 のロール定義・組織定義を確認した。文字数は frontmatter を含むファイル全体から空白を除外して計測し、4,970 字→3,954 字、20.44%削減。
- review 根拠: 編集前の内容ハッシュと一致する grade サイドカーを確認した。rulebook は pass・100 点・finding なし。ロール定義は pass・99 点で、検証手順のコメントを求める minor F001 があるが cause は document。成果物本体は変更せず、rulebook の schema 検証コマンドとコード重複・採用集合・正式名称の照合条件は維持した。サイドカーは更新していない。
- 追従案: pm-roles-recipe の文書承認・公開可否確認と未決事項の判断者／判断時点に関する共通運用の重複、および pm-roles-template の「PO が承認判断できる」コメントを別タスクで整理する。sample の事業固有の役割・判断内容は維持できる。今回は recipe・template・sample を変更していない。
- 共通標準の変更案: rulebook-authoring-standard の「各 rulebook が役割分担を定義する」規定と「各必須章に最低3項目」の規定に、共通運用を正本へ委譲する場合の扱いを明記する。今回は本 plan を優先し、禁止事項を水増しせず型固有の1項目を残した。document-metadata-standard と人と組織の定義標準には、削除した共通運用を参照できる記述があり、追記不要と判断した。
- 既存の整合課題: prj-0001 の組織定義はコードと責務の正本をロール定義と記述している一方、上位標準・rulebook・recipe は採用判断を組織定義に置いている。今回は上位標準に沿う責務境界を維持した。成果物側の正本表記の整合は別途確認する。
- 検査: Prettier と git diff --check は成功。見出し・frontmatter・対象外成果物の不変、共通運用項目が1つであること、文字数が80%以下であることを確認した。親 runner 所有の lint・schema・型検査・テストは実行していない。既存 result と実行管理ファイルは更新していない。
- 対象 `prj-0001:pm-roles` は未変更: rulebook 見直しの根拠として確認した成果物。plan が成果物本体の変更を対象外としているため、内容を維持した。
- 適用外の検証: `npm run validate:schema:file`（executor が編集したのは Markdown rulebook のみで、YAML ファイルの変更はない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿・plan・result などの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として実施しました。PJR-8S4T「他の型へ広げるときの一覧」、改訂済み `sld-rulebook`、`rulebook-authoring-standard`、`document-metadata-standard`、人と組織の定義標準、`vp-arc-conciseness`、pm-roles の schema・recipe・template・sample、prj-0001 のロール定義と組織定義を根拠にしました。編集前の内容ハッシュと一致する grade サイドカーでは、rulebook は pass・100点・finding なしでした。ロール定義は pass・99点で、検証手順のコメントを求める minor の F001 があります。cause は document なので、rulebook は改訂せず、サイドカーも更新していません。schema 検証コマンドとコード重複・採用集合・正式名称の照合条件は維持しました。指摘（finding）の展開はありません。
