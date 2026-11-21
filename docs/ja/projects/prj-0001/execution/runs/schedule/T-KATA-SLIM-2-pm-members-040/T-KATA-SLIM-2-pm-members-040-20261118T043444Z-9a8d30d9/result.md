---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-members-040-20261118t043444z-9a8d30d9
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-members-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-members-040/T-KATA-SLIM-2-pm-members-040-20261118T043444Z-9a8d30d9/plan.md
  started_at: "2026-11-18T04:34:49.952Z"
  completed_at: "2026-11-18T05:03:19.378Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-members
    - specdojo:pm-members-rulebook
---

# Edit Result

## 1. 実施内容

- pm-members-rulebook から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えました。役割は人と組織の定義標準を参照します。status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準を参照します。
- grade の finding F001〜F003 に対応しました。F001 は nickname の先頭文字と許容文字に最大63文字の制約を追加しました。F002 は任意のルートメタ項目 `supersedes` を追加しました。F003 は schema を優先し、`roles` を必須とする旨を明記しました。未解消の finding はありません。
- 空白と改行を除いた文字数は3,551字から2,830字（79.70％）になり、目安の8割以下に収まりました。章名、既存項目の必須・任意区分、frontmatter は維持しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-members-rulebook.md`: 共通運用の記述（status の維持と昇格、承認、改訂と廃止、未決事項の管理など）を削り、標準への参照に整理しました。F001〜F003 の対応として、nickname の先頭文字・許容文字・最大63文字、任意メタ項目 `supersedes`、`roles` の必須性（schema 優先）を追記しました。差分は27行追加、45行削除です。

## 3. 申し送り

- 範囲外の変更案として、人と組織の定義標準の pm-members 標準フィールド表で `members[].roles` を任意から必須に合わせることを提案します。同標準の agent を含む古い例は、現行の分離方式に整理することも提案します。
- recipe・template・sample に残る共通ルールの再掲は削除候補です。これらは本タスクでは変更していません。
- 変更ファイルは docs/ja/specdojo/rulebooks/pm-members-rulebook.md のみ。章名、既存項目の必須・任意区分、frontmatter は維持。成果物本体、recipe、template、sample、result、grade サイドカーは変更していません。includes の宣言はありません。
- 判断根拠: pm-members.schema.yaml、人と組織の定義標準、ドキュメントメタ情報標準、Rulebook 記述標準、sld-rulebook、PJR-8S4T の展開一覧、および共通レビュー観点の `vp-arc-conciseness`・`vp-qe-verifiability`・`vp-qe-omissions-consistency`・`vp-qe-kata-conformance` を確認しました。
- source=grade: docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-members-rulebook.yaml の F001〜F003 を照合。F001 は nickname の先頭・許容文字に最大63文字を追加。F002 は任意のルートメタ項目 `supersedes` を ID 配列として追加。F003 は schema を優先し `roles` を必須とする旨を明記しました。未解消の finding はありません。
- 実態の根拠: prj-0001 の pm-members・pm-organization・pm-roles、pm-members の recipe・template・sample、T-LAUNCH-pm-members-090 のレビュー結果と T-LAUNCH-pm-members-140 の確定結果を確認。人間名簿と agent 定義の分離、合成後の nickname 一意性、履歴識別子の維持を残しました。
- 大きさは空白・改行のみ除外して3,551字→2,830字（79.70％）。試行と同様に表の区切り行も除外すると3,190字→2,470字（77.43％）。役割・公開情報の共通規定は人と組織の定義標準、status・承認・改訂廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ参照化しました。
- 範囲外の変更案: 人と組織の定義標準の pm-members 標準フィールド表で `members[].roles` を任意から必須へ合わせ、agent を含む古い例を現行の分離方式へ整理してください。recipe・template・sample の共通ルールの再掲は削除候補です。prj-0001 の成果物本体にも agent 向けの古い rules が残っていますが、本タスクでは変更していません。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown の rulebook のみで、YAML ファイルの変更がないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿、plan、result などの履歴ファイルを変更していないため。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していないため。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、pm-members.schema.yaml、人と組織の定義標準、ドキュメントメタ情報標準、Rulebook 記述標準、sld-rulebook、PJR-8S4T の展開一覧を根拠に見直しました。レビュー観点は `vp-arc-conciseness`、`vp-qe-verifiability`、`vp-qe-omissions-consistency`、`vp-qe-kata-conformance` を使いました。型固有の判断基準、人間名簿と agent 定義の分離、合成後の nickname 一意性、履歴識別子の維持は残しました。schema と矛盾する記述は schema を正としました。runner の検証（lint:fm、lint:md、lint:mermaid、lint:d2、validate:schema、test:unit、test:integration）は passed でした。lint:ts と typecheck は変更種別により `not_applicable` でした。
