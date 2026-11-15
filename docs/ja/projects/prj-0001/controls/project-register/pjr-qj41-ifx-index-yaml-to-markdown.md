---
specdojo:
  id: prj-0001:pjr-qj41-ifx-index-yaml-to-markdown
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T09:31:50Z"
  commit_type: docs
  commit_scope: kata
---

# PJR-QJ41 ifx-index の型を YAML から Markdown に変える

## 1. 概要

ifx-index の正本を Markdown にし、型一式と代表をそろえて移す

## 2. 入力

- indie の依頼（2026-11-15）: ifx-index は YAML のためレビューがしにくい。Markdown に変換したい
- 対象は ifx-index の型一式（rulebook・recipe・sample・template）と、prj-0001 の代表 docs/ja/product/020-external-interface-specs/ifx-index.yaml

## 3. 完了条件

- `specdojo:ifx-index-rulebook` の `target_format` を `md` にし、章立て・記述ガイド・禁止事項を Markdown の一覧表として書き直している。YAML のキーで定めていた必須項目は、表の列や章の必須事項に置き換えている。
- `ifx-index-sample` と `ifx-index-template` を Markdown（`*.md`）で作り直し、YAML の版（`ifx-index-sample.yaml`・`ifx-index-template.yaml`）は削除するか非推奨にしている。recipe も Markdown の正本に合わせている。
- prj-0001 の代表 `ifx-index.yaml` を `ifx-index.md` に移し、内容（対象の連携・未決事項・留保）を失わずに表へ移している。成果物カタログの `path`、文書の id は変えず、wikilink（`[[ifx-index]]` など）が解決する。
- 個別仕様（`ifx-cmd-*` などの YAML）と、一覧から個別仕様への参照（`spec_ref` に相当する対応）が、Markdown の表から辿れる。
- 既存の利用者（ほかのプロジェクト）が YAML の ifx-index を持っている場合の移し方を、ガイドかリリースの注意として書いている。
- 型一式を `grade run --target kata` で grade し、pass である。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | rulebook を Markdown の正本として書き直す       | ARC  | open | -    |
| 2   | sample・template・recipe を Markdown にそろえる | ARC  | open | -    |
| 3   | prj-0001 の代表を ifx-index.md に移す           | ARC  | open | -    |
| 4   | 移し方の注意を書き、型を grade する             | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:ifx-index-rulebook]]
- [[prj-0001:ifx-index]]
