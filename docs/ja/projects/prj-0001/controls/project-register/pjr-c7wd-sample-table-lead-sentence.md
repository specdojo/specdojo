---
specdojo:
  id: prj-0001:pjr-c7wd-sample-table-lead-sentence
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-22T12:17:48Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-8S4T
---

# PJR-C7WD sample の表の前に、その表が何を示すかを 1 文で書く決まりを作成標準に足す

## 1. 概要

sld-sample の表は、何と何の対応か、何を確かめて何を受け入れるかの説明がなく、読み手に分からなかった。どの sample にも当てはまるため、sample の作成標準に決まりとして足す。

## 2. 入力

- 2026-11-22、indie が PJR-8S4T の 2 回目の sld-sample を読み、4 章の 2 つの表が何を示すか分からないと指摘した。8S4T の 3 回目では sld の範囲だけを直す。
- 決まりの案: 表の前に、何と何の対応か、何を確かめて何を受け入れるかを 1 文で書く。列の名前と観点は、読み手が中身を推測しなくて済む言葉にする（隣の仕様の用語をそのまま見出しにしない）。
- 利用者の承認（2026-11-22、indie）で起票した。担当と期限は未定。

## 3. 完了条件

- `sample-authoring-standard` に、次の決まりを足す。表の前に、何と何の対応か、何を確かめて何を受け入れるかを 1 文で書く。列の名前と観点は、読み手が中身を推測しなくて済む言葉にし、隣の仕様の用語をそのまま見出しにしない。
- 決まりの良い例と悪い例を、PJR-8S4T の 3 回目の sld-sample の「関連仕様・実装配置との対応と検証」の直しを材料に書く。
- 既存の sample と rulebook は変えない。決まりに合わない sample の例が見つかれば、型の名前を個票の対応結果に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
