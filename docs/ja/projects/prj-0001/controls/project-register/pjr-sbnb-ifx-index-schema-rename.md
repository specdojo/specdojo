---
specdojo:
  id: prj-0001:pjr-sbnb-ifx-index-schema-rename
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-15T09:33:55Z"
  completed_at: "2026-11-15T22:22:29Z"
  conclusion: ifx-index の schema のファイル名を esil から ifx-index に改めた。大文字の略号 ESIL の残りは範囲外として残課題に記録
  commit_type: refactor
  commit_scope: schema
---

# PJR-SBNB ifx-index の schema のファイル名を古い略号 esil から ifx-index に改める

## 1. 概要

esil.schema.yaml を ifx-index の名前へ改め、参照をそろえる。他プロジェクト向けの互換も扱う

## 2. 入力

- indie の指摘（2026-11-15）: ifx-index の schema が docs/specdojo/schemas/v1/esil.schema.yaml で、改名前の略号（ESIL: 外部システム連携一覧）のまま
- ifx-index は YAML を正本のまま残すため（PJR-QJ41）、schema も残して名前を改める

## 3. 完了条件

- `docs/specdojo/schemas/v1/esil.schema.yaml` を ifx-index の名前（例: `ifx-index.schema.yaml`）へ改め、`$id`・modeline・rulebook・recipe・sample・template・`.vscode/settings.json`・テストの参照をそろえている。
- ほかのプロジェクトの YAML が古い名前の schema を指していても検証が壊れないよう、古いファイルを非推奨の別名として残すか、移し方を書いている。
- 履歴（個票・実行記録）以外に `esil` の略号が残っていない（`grep -rn esil` で確かめる）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run validate:schema`・`npm run lint:md`・`npm run lint:fm`・`npm run test:unit` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------------ | ---- | ---- | -------------------------------- |
| 1   | schema のファイル名と $id を改める               | DEV  | done | `$id` は元から無い               |
| 2   | 参照（modeline・型一式・設定・テスト）をそろえる | DEV  | done | `.vscode/settings.json` は変更案 |
| 3   | 古い名前の互換と移し方を扱う                     | DEV  | done | 非推奨の別名を残した             |

## 5. 対応結果

### 5.1. 実施内容

- schema の正本を `docs/specdojo/schemas/v1/ifx-index.schema.yaml` へ移した。`id` の pattern から古い接頭辞の形式を除き、`ifx-index` と `ifx-index-...`（プロジェクト修飾可）だけを許す形にした。
- 古いファイル名の schema は、`$ref: "ifx-index.schema.yaml"` と `deprecated: true` だけを持つ非推奨の別名にした。古い名前を指す modeline の YAML も、新しい schema と同じ内容で検証される。
- modeline（sample・template・`prj-0001:ifx-index`）と、rulebook・recipe の schema パスを新しい名前にそろえた。
- テストに古い名前への参照はなかった。各 schema に `$id` は無いので、追加していない（ほかの schema に合わせた）。

### 5.2. 決めた内容と理由

- 古いファイルは消さず、`$ref` だけの別名として残した。ほかのプロジェクトの YAML の modeline を壊さないためである。中身を複製しないので、二重管理にはならない。本文に古い略号は無いので、`grep -rn esil` に一致するのはファイル名だけになる。
- 改名すると、rulebook と schema がファイル名の stem で組になり、`validate:schema:rulebook-enums` の対象に入る。enum 値の網羅を満たすため、ready の rulebook `specdojo:ifx-index-rulebook` で `status`・`direction`・`kind`・`format` の値と選び方を書き、「列挙値は schema へ委譲」の文を改めた。あわせて、rulebook の副題と用語表から略号 ESIL を除いた。
- 古い接頭辞の `id`（`<略号>-...`）は、リポジトリ内で使われていない。そのため pattern から除いた。ほかのプロジェクトで使っている場合は、`ifx-index` に改める必要がある（CHANGELOG に書く事項を参照）。

### 5.3. 残課題

- `.vscode/settings.json` は保護対象で、executor が編集できない。変更案: `cSpell.words` から `"esil",` の行を削除する。ほかの rulebook・recipe（`ifx-api`・`ifx-msg`・`ifx-cmd`・`ifx-file`）と `dct-external-interface-specs.yaml` には、大文字の略号 ESIL が残る。schema 名の範囲を超えるため手を入れていない。必要なら別の項目で `ifx-index` へ言い換える。
- 非推奨の別名は、移行期間が過ぎたら削除する。

### 5.4. CHANGELOG に書く事項

- Changed: 外部システムI/F一覧の schema を `docs/specdojo/schemas/v1/ifx-index.schema.yaml` に改名した。古い名前は非推奨の別名として残っており、今後削除する。移行するには、YAML 先頭の modeline を `# yaml-language-server: $schema=<相対パス>/ifx-index.schema.yaml` へ書き換え、`validate:schema:file --schema` の指定も新しい名前にする。
- Changed: 外部システムI/F一覧の `id` に許す形を `ifx-index`・`ifx-index-...` に限った。古い略号を接頭辞にした `id` は検証で失敗する。`ifx-index` 系の `id` に改める。

## 6. 関連ドキュメント

- [[specdojo:ifx-index-rulebook]]
- [[prj-0001:ifx-index]]
