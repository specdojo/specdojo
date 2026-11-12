---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-2-clis-exec-commands-040-20261112t152744z-042a52a4
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-2-clis-exec-commands-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-KATA-2-clis-exec-commands-040/T-BUSINESS-SPECS-KATA-2-clis-exec-commands-040-20261112T152744Z-042a52a4/plan.md
  started_at: "2026-11-12T15:27:49.399Z"
  completed_at: "2026-11-12T15:43:52.268Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - clis-exec-commands
    - specdojo:clis-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/clis-rulebook.md` を改訂し、記述ガイドを章ごとの判断基準・良い例・悪い例の形式に整理しました。
- 正本への委譲方針（PJR-2GD6）に基づき、値や構文の重複記述を削除し、参照に置き換えました。
- REPS-080 の結果を反映し、操作一覧の説明列を任意化するとともに、完了・回復の判断基準を明確化しました。
- `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に準拠し、見出しへの連番付与およびサンプル章の外出し（`sample: specdojo:clis-sample` の維持）を行いました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/clis-rulebook.md`: 章構成を標準に合わせ、記述ガイドの内容を判断基準と対比例（良い例・悪い例）へ再構成しました。重複する詳細仕様を削り、正本への参照を明確化し、完了・回復判断の基準を追記しました。

## 3. 申し送り

- 変更ファイルは `docs/ja/specdojo/rulebooks/clis-rulebook.md` のみ。代表成果物・sample・result・評価サイドカーは編集していません。result の記入は reporter が担当してください。
- 判断根拠: `docs/ja/specdojo/standards/rulebook-authoring-standard.md`、`document-metadata-standard.md`、`recipe-authoring-standard.md`、`template-authoring-standard.md`、`docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の `vp-arc-conciseness`、PJR-2GD6・PJR-K4PM・PJR-25B9、代表成果物 `clis-exec-commands.md`、既存の grade 結果、REPS-080 の condense result、REPS-090 の review result を参照しました。
- 改訂根拠: REPS-080 で操作一覧の説明列がフローとの重複として削除されていたため、意味がフローから分かる場合は説明列を任意化しました。大量の例表・共通メタ情報の再掲を削り、章ごとの判断基準と対比例へ整理しました。入出力の方向・必須情報・正本参照・失敗時の接続は維持し、対象なし、警告継続、終了コード伝播、再開時の保持成果を判断する基準を補いました。
- 維持した規定: PJR-25B9 で人が確定した入力・出力を別箱にする位置づけ図と成果物 ID の規則、`deliverable_type: ui`、`status: draft` を維持しました。plan に展開された finding と既存の rulebook grade の finding はありません。成果物 grade の16件および REPS-080 の condense 記録は `cause.type: document` であり、本作業で成果物側の指摘を解消済みとは扱いません。
- recipe・template の判断: CLI 固有の作成工程や別管理の骨組みを追加する必要はなく、本文要件と章ごとのガイドで案内できるため、両方とも `not-needed` を維持しました。完成例は `sample: specdojo:clis-sample` を維持し、rulebook にサンプル章を設けていません。今回、追加の recipe・template 整備案はありません。
- 後続 sample-maintenance: `docs/ja/specdojo/samples/clis-sample.md` の厚さを維持しつつ、図と本文の手順重複, 入出力欄のデータ項目列挙を整理してください。印刷失敗について入力欄の警告継続と終了コード表の関係を整合させ、回復手順で使う `sales sync` と将来課題との不整合、`sales print-receipt` の操作・参照の不足を解消してください。確認役割と未決事項の担当・解消条件も具体化してください。
- 代表成果物が記録する未作成の `clis-index`・外部 agent 契約、実行内部経路と終了コード全分岐の未確認は、本フェーズの対象外として残ります。成果物側の後続作業で担当・影響・解消条件を追跡してください。lint・型検査・schema・単体／統合テストは指定どおり親 runner に委ねています。
- 後続 sample-maintenance: `docs/ja/specdojo/samples/clis-sample.md` の厚さを維持しつつ、図と本文の手順重複、入出力欄のデータ項目列挙を整理してください。印刷失敗について入力欄の警告継続と終了コード表の関係を整合させ、回復手順で使う `sales sync` と将来課題との不整合、`sales print-receipt` の操作・参照の不足を解消してください。確認役割と未決事項の担当・解消条件も具体化してください。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、変更した YAML/YML ファイルがないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の plan/result を変更していないため。）
- 適用外の検証: `npm run validate:catalog`（変更は `docs/ja/specdojo/rulebooks/` のみで、`docs/ja/projects/` 配下の成果物変更がないため。）

## 4. 進め方と実践の型の適用

代表成果物の実績および review result (REPS-080 等) を根拠に `clis-rulebook` の見直しを実施。 `docs/ja/specdojo/standards/rulebook-authoring-standard.md` に基づき、章構成の正規化と記述ガイドの形式（判断基準・良い例・悪い例）への変換を行い、冗長な仕様再掲を排除して正本への参照を徹底しました。recipe および template は現状の案内で十分であると判断し `not-needed` を維持しています。
