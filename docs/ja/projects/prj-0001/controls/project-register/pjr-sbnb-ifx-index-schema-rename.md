---
specdojo:
  id: prj-0001:pjr-sbnb-ifx-index-schema-rename
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-15T09:33:55Z"
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

- PJR-QJ41 の結果を見て、ifx-index の schema を残すかを決めている。YAML の正本がなくなり使う場面がなければ、schema は非推奨にして新しい名前を作らない判断もありうる。決めた内容と理由を対応結果に書いている。
- 残す場合は、`docs/specdojo/schemas/v1/esil.schema.yaml` を ifx-index の名前（例: `ifx-index.schema.yaml`）へ改め、`$id`・modeline・rulebook・recipe・sample・template・`.vscode/settings.json`・テストの参照をそろえている。
- ほかのプロジェクトの YAML が古い名前の schema を指していても検証が壊れないよう、古いファイルを非推奨の別名として残すか、移し方を書いている。
- `grep -rn esil` で、履歴（個票・実行記録）以外に古い略号が残っていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ |
| --- | ------------------------------------------- | ---- | ---- | ---- |
| 1   | schema を残すかを PJR-QJ41 の結果から決める | DEV  | open | -    |
| 2   | ファイル名と参照を改める（残す場合）        | DEV  | open | -    |
| 3   | 古い名前の互換と移し方を扱う                | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:ifx-index-rulebook]]
- [[prj-0001:ifx-index]]
