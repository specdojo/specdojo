---
specdojo:
  id: prj-0001:pjr-bm07-ifx-drop-legacy-abbreviations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-22T23:26:56Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-AEKE
  depends_on:
    - PJR-AEKE
  commit_type: docs
  commit_scope: kata
---

# PJR-BM07 ifx の型の残りの文書から古い略語（ESIL・ECIS・EFES）を外す

## 1. 概要

ifx-cmd・ifx-file の rulebook、ifx-cmd-recipe、prj-0001 のカタログのコメントに、今は使わない略語が残る。AEKE の 2 回目の ifx-api・ifx-msg と同じ書き方にそろえる

## 2. 入力

- ifx の型の古い略語（ESIL・EAPIS・EMS・ECIS・EFES）は今は使わないので外す（利用者の依頼、2026-11-23）
- ifx-api・ifx-msg の rulebook と sample は PJR-AEKE の 2 回目で直す。ほかの rulebook のタイトルの略語（BDS・CCD など）はファイルの prefix と一致するので対象外

## 3. 完了条件

- `ifx-cmd-rulebook`・`ifx-file-rulebook`・`ifx-cmd-recipe` と、prj-0001 の成果物カタログ `dct-external-interface-specs.yaml` のコメントから、今は使わない略語（`ESIL`・`ECIS`・`EFES`、ほかに見つかったもの）を外す（利用者の決定、2026-11-23、indie）。
- タイトルと英語名の行は、略語なしの形（例: `External Command Interface Specification Documentation Rules`）にする。本文の略語は、日本語の名前か `ifx-index`・`ifx-cmd`・`ifx-file` の prefix に置き換える。`ifx-file-rulebook` の Mermaid 図のノードの名前も直す。書き方は PJR-AEKE の 2 回目で直した `ifx-api-rulebook`・`ifx-msg-rulebook` にそろえる。
- 直す前と後に `rg -n '\b(ESIL|EAPIS|EMS|ECIS|EFES)\b' docs/ja/specdojo docs/ja/projects/prj-0001/010-deliverables-catalog` を流し、後で 0 件になることを確かめて、使ったコマンドと結果を個票の対応結果に書く。過去の個票・plan・result・grade の記録は変えない。
- 略語の置き換えのほかに中身は変えない。直したほうがよい点を見つけたら、個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- yaml-pages で表示のページを作り直してから、`npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
