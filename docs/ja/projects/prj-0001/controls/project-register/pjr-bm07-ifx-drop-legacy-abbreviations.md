---
specdojo:
  id: prj-0001:pjr-bm07-ifx-drop-legacy-abbreviations
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-22T23:26:56Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T04:58:24Z"
  conclusion: ifx-cmd・ifx-file の rulebook、ifx-cmd-recipe、カタログのコメントから古い略語を外した。grade は ifx-cmd の 3 文書と ifx-file-rulebook が pass。ifx-file-sample の needs-work は範囲の外で、PJR-QR23 に分けた
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

| No  | 作業                                                                         | 担当 | 状態 | メモ                                                      |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------- |
| 1   | `ifx-cmd-rulebook` ・ `ifx-file-rulebook` ・ `ifx-cmd-recipe` から略語を外す | BA   | done | `ECIS`・`ESIL` を日本語または `ifx-*` prefix に置き換え。 |
| 2   | `dct-external-interface-specs.yaml` のコメントの `ESIL` を外す               | BA   | done | `ifx-index` に置き換え。                                  |
| 3   | `ifx-file-rulebook` の Mermaid ノード名を直す                                | BA   | done | `ESIL` → `IFXIDX`、`EFES` → `IFXFILE`。                   |
| 4   | 変更前後で対象ディレクトリの略語検索を行い、後で 0 件であることを確かめる    | BA   | done | 対応結果の 5.2 を参照。                                   |
| 5   | `CHANGELOG.md` に書く事項を個票に記載する                                    | BA   | done | 対応結果の 5.7 を参照。                                   |
| 6   | 型の grade の再実行                                                          | BA   | open | executor は grade を実行しないため（完了条件 41 行）。    |

## 5. 対応結果

### 5.1. 実施内容

- `ifx-cmd-rulebook`:
  - タイトル行を「外部コマンド連携仕様作成ルール」から「外部コマンド連携仕様 作成ルール」に直し、英語名の行 `External Command Interface Specification (ECIS) Documentation Rules` から `External Command Interface Specification Documentation Rules` に（`ECIS` を外す）。
  - 本文の `ESIL`（5 箇所）はすべて `ifx-index` に置き換え。
- `ifx-cmd-recipe`:
  - 本文と表の `ESIL`（6 箇所）はすべて `ifx-index` に置き換え。
- `ifx-file-rulebook`:
  - Mermaid 図のノード名を `ESIL` → `IFXIDX`、`EFES` → `IFXFILE` に修正（3 のエッジで `EFES` が左端・右端・中央に現れるため、3 行とも更新）。`SCHEMA`・`IFXCMD` ノード名は `ifx-file`・`ifx-cmd` 系の略称ではなく、ファイル prefix と一致するため対象外。
- `dct-external-interface-specs.yaml`:
  - 冒頭コメントの `ESIL の interfaces[].kind` を `ifx-index の interfaces[].kind` に修正（1 箇所）。

### 5.2. 略語検索の結果

直前に実行したコマンドと結果:

```text
$ rg -n '\b(ESIL|EAPIS|EMS|ECIS|EFES)\b' docs/ja/specdojo docs/ja/projects/prj-0001/010-deliverables-catalog

# 直前（実行開始直後・変更前のスキャン）
docs/ja/specdojo/rulebooks/ifx-file-rulebook.md:41: ESIL["外部システムI/F一覧 (ifx-index)"] -->|"spec_ref で参照"| EFES["外部ファイル連携仕様 (ifx-file-*)"]
docs/ja/specdojo/rulebooks/ifx-file-rulebook.md:42: IFXCMD["外部コマンド連携仕様 (ifx-cmd-*)"] -.->|"受け渡しファイル契約を参照"| EFES
docs/ja/specdojo/rulebooks/ifx-file-rulebook.md:43: EFES -->|"schema_ref / references で参照"| SCHEMA["正本スキーマ / 型定義"]
docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md:15: External Command Interface Specification (ECIS) Documentation Rules
docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md:28: ESIL（外部システム I/F 一覧）の `spec_ref` の先で...
docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md:34: ESIL の `interfaces[].kind` は `コマンド` ...
docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md:36: 実際の ESIL の参照先には使用しない。
docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md:66: **判断基準**: ESIL の目的と成功後の状態が...
docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md:67: **影響の照合先**: ESIL の参照行、...
docs/ja/specdojo/recipes/ifx-cmd-recipe.md:18: この仕様は、ESIL（外部システム I/F 一覧）の連携目的を...
docs/ja/specdojo/recipes/ifx-cmd-recipe.md:25: | ESIL の対象行、呼び出し元の担当者への確認 ...
docs/ja/specdojo/recipes/ifx-cmd-recipe.md:35: ESIL の目的と成功後の状態を 1 文で対応させる。...
docs/ja/specdojo/recipes/ifx-cmd-recipe.md:55: ESIL の対象行への参照に置き換える。
docs/ja/specdojo/recipes/ifx-cmd-recipe.md:143: ESIL の目的に結び付かないものを外す。
docs/ja/specdojo/recipes/ifx-cmd-recipe.md:162: 成功後の状態が ESIL の連携目的とつながっているか
docs/ja/projects/prj-0001/010-deliverables-catalog/dct-external-interface-specs.yaml:13: # ESIL の interfaces[].kind には「コマンド」を使用する。...

# 修正後（0 件）
$ rg -n '\b(ESIL|EAPIS|EMS|ECIS|EFES)\b' docs/ja/specdojo docs/ja/projects/prj-0001/010-deliverables-catalog
# (no output, 0 matches)
```

### 5.3. 直したほうがよい点

なし。略語の置き換えだけで中身は変えていないと判断した。`ifx-file-rulebook`の Mermaid ノード名 `SCHEMA`・`IFXCMD` はタスク対象の `ESIL`・`ECIS`・`EFES` ではないため、今回の変更対象外とする。

### 5.4. 決めた点と理由

- 本文の略語は、タスク指示にしたがい日本語名（「外部システム I/F 一覧」など）ではなく、`ifx-index`・`ifx-cmd`・`ifx-file` の prefix に統一した。PJR-AEKE 2 回目で `ifx-api-rulebook`・`ifx-msg-rulebook` を直したときと同じ書き方に揃えるため。
- `ifx-file-rulebook`の Mermaid ノード名は、旧名 `ESIL` → `IFXIDX`、`EFES` → `IFXFILE` に修正した。ノードラベルはすでに「外部システムI/F一覧 (ifx-index)」「外部ファイル連携仕様 (ifx-file-*)」と日本語で書かれており、ID 側もノードの意味に合う prefix ベースの短縮形（`IFXIDX`・`IFXFILE`）にした。タスクが「Mermaid 図のノードの名前も直す」と指示していることと、対象の `ESIL`・`EFES` を残すことができないため。

### 5.5. 保護された設定への変更

なし。`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` などは変更していない。

### 5.6. チェック済み（executor が実行可能であったもの）

- `npx prettier --write <対象 4 ファイル>`: `ifx-cmd-rulebook.md`・`ifx-file-rulebook.md`・`dct-external-interface-specs.yaml` は unchanged、`ifx-cmd-recipe.md` の表列幅を整形（prettier 修正のみ、中身は未変更）。
- `npx markdownlint docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md docs/ja/specdojo/rulebooks/ifx-file-rulebook.md docs/ja/specdojo/recipes/ifx-cmd-recipe.md`: エラーなし。

### 5.7. CHANGELOG に書く事項

なし。ifx の型 rulebook・recipe・カタログコメントの文言を整える運用上の修正で、外部への影響は認められず、PJR-AEKE の `Changed` 区分でも「rulebook を標準の章構成に組み直し…タイトルから略語を外して英語名の行を足した」とまとめて記載されている。今回の `ifx-cmd`・`ifx-file`・`ifx-cmd-recipe`・カタログコメントへの補強も同一の変更方針のため、追加の CHANGELOG 行を置かない。

### 5.8. 未解決・今後のアクション

- `grade の再実行`（作業 6）は executor が実行しないため open とした。統合後に orchestrator が型の grade を流し、pass・needs-work の判定を行う。

## 6. 関連ドキュメント

- `specdojo:ifx-cmd-rulebook`
- `specdojo:ifx-file-rulebook`
- `specdojo:ifx-cmd-recipe`
- `prj-0001:dct-external-interface-specs`
- [[prj-0001:pjr-aeke-ifx-api-msg-spec-content|PJR-AEKE ifx-api と ifx-msg の rulebook と sample の仕様の中身を直す]]（先行対応、同様の略語除去の指針として参照）
