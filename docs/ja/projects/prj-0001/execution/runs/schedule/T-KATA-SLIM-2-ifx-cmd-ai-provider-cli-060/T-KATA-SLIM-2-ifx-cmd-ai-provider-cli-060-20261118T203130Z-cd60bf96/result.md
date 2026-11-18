---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-ifx-cmd-ai-provider-cli-060-20261118t203130z-cd60bf96
  type: exec-result
  task_id: T-KATA-SLIM-2-ifx-cmd-ai-provider-cli-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-ifx-cmd-ai-provider-cli-060/T-KATA-SLIM-2-ifx-cmd-ai-provider-cli-060-20261118T203130Z-cd60bf96/plan.md
  started_at: "2026-11-18T20:31:36.293Z"
  completed_at: "2026-11-18T21:07:54.593Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - ifx-cmd-ai-provider-cli
    - specdojo:ifx-cmd-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/ifx-cmd-recipe.md` を改訂し、共通の運用記述や rulebook と重複する判断基準を削除してスリム化した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/ifx-cmd-recipe.md`: 文書の共通運用記述、rulebook と重複する判断基準（終了状態カテゴリ、シェル起動例外、`version` 系の違い等）、および深掘り手順とレビュー観点・仕上げチェックの重複箇所を削除。condense の指摘に基づき、provider 一覧の正本参照に関するコツと具体例を追加した。

## 3. 申し送り

- 大きさ: ifx-cmd-recipe は空白と表の区切り行を除いた文字数で、前 6,908 字、後 3,594 字（比 52.0%）。測り方は PJR-7M9J と同じ。
- condense の指摘（`prj-0001:xer-t-business-specs-reps-ifx-cmd-ai-provider-cli-080-20261109t045935z-868c17fe`、cause=kata:recipe）への対応: 「コマンドと正本参照」のコツに、`executable` の括弧・コメントと `purpose` の括弧に provider 名を並べないこと、一覧は起動設定の鍵が持つこと、認証の参照名は残すことを書いた。良い例 / 悪い例にも provider 一覧の行を 1 つ置いた。同じ確認はレビュー観点・仕上げチェックから外し、1 か所にまとめた。
- rulebook と同じ判断の言い直しとして外した記述: 終了状態のカテゴリの使い分け, シェル起動の例外条件, `files` の入出力が無い場合の表し方, `based_on` と `command.reference` の違い, `version` と `version_constraint` の違い, 委譲先の文書の指定（exec 設定ガイドの wikilink を含む）。正本の選び方は「作成前に集める情報」の取り出し元の列に、何をどこから取り出すかとして残した。
- 変更案: rulebook・sample・template は今回の範囲では変える点が見つからなかった（commit の対象外のため変えていない）。
- rulebook と同じ判断の言い直しとして外した記述: 終了状態のカテゴリの使い分け、シェル起動の例外条件、`files` の入出力が無い場合の表し方、`based_on` と `command.reference` の違い、`version` と `version_constraint` の違い、委譲先の文書の指定（exec 設定ガイドの wikilink を含む）。正本の選び方は「作成前に集める情報」の取り出し元の列に、何をどこから取り出すかとして残した。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown の recipe だけで、`*.yaml` / `*.yml` を変更していない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

recipe-maintenance
