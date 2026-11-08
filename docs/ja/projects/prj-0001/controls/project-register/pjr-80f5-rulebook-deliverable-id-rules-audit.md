---
specdojo:
  id: prj-0001:pjr-80f5-rulebook-deliverable-id-rules-audit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  difficulty: easy
  registered_at: "2026-11-08T12:31:17Z"
  derived_from:
    - PJR-25B9
---

# PJR-80F5 rulebook の成果物の ID の決まりを命名の標準と照らして直す

## 1. 概要

rulebook の「ファイル命名・ID規則」の章に、成果物の例へ specdojo: を付けるなど命名の標準と違う決まりが残っていないかを洗い出し、プロダクト文書は namespace なし、プロジェクト文書は `<project-id>`:、specdojo: は同梱の型だけ、に揃える

## 2. 入力

- 2026-11-08、clis と uis の rulebook で成果物の例に specdojo: を付けた行が見つかり、orchestrator が直した（bdd・cdt・sf は正しかった）。ほかの rulebook は未確認。

## 3. 完了条件

- `docs/ja/specdojo/rulebooks/` のすべての rulebook の「ファイル命名・ID規則」の章（または ID の決まりを書いた箇所）を、[[specdojo:id-and-file-naming-standard]] と照らしている。照らした rulebook の一覧と、直したもの・直さなかったものを個票の対応結果に書いている。
- 成果物の ID の決まりを、プロダクト文書は namespace なし、プロジェクト文書は `<project-id>:`、`specdojo:` は SpecDojo が同梱する型（rulebook・sample・template など）だけ、に揃えている。成果物の例に `specdojo:` を付けた記述を直している。
- 直したのは ID の決まりの記述だけで、ほかの規則や章立てを変えていない。直した clis と uis の rulebook は変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                                  | 担当   | 状態 | メモ |
| --- | ----------------------------------------------------- | ------ | ---- | ---- |
| 1   | rulebook の ID の決まりを洗い出し、命名の標準と照らす | _TODO_ | open | -    |
| 2   | 違う記述を直す                                        | _TODO_ | open | -    |
| 3   | 検査を流し、照らした一覧と結果を対応結果に書く        | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-25b9-clis-kata-confirm-diagram-references]]
- 規範: [[specdojo:id-and-file-naming-standard]]
