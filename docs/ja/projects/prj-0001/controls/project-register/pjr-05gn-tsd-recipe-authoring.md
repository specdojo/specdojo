---
specdojo:
  id: prj-0001:pjr-05gn-tsd-recipe-authoring
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-10-27T11:26:51Z"
  approach: recipe-authoring
  targets:
    - specdojo:tsd-recipe
  sources:
    - docs/ja/product/030-architecture/020-infrastructure/tsd-ollama.md
    - docs/ja/product/030-architecture/020-infrastructure/tsd-ollama-opencode.md
    - docs/ja/product/030-architecture/020-infrastructure/tsd-home-mac-dev-server-usage.md
---

# PJR-05GN tsd-recipe を作る

## 1. 概要

見直した tsd-rulebook に沿って、技術領域ごとの TSD を書く手順を recipe にする。

- tsd-index-rulebook は `recipe: not-needed` のままとする。
- template は作らない。tsd-rulebook は固定した見出しの順を求めず、見出しの順を正本とする template と合わないため（利用者と合意済み）。
- PJR-9SXH と PJR-EVAE で見直した sample を前提とするため、その後に実行する。

## 2. 完了条件

1. `docs/ja/specdojo/recipes/tsd-recipe.md` を [[specdojo:recipe-authoring-standard]] に従って作成する。frontmatter は `id: specdojo:tsd-recipe`、`type: recipe`、`rulebook: specdojo:tsd-rulebook`、`sample: specdojo:tsd-sample` とする。
2. [[specdojo:tsd-rulebook]] の本文要件を、作業の順に辿れる手順と判断にする（一冊にするか分冊にするかの判断、採用値・推奨値・未決事項の区別、動作確認の段階の組み立て、秘密情報の見分け方など）。rulebook の要件を本文へ転載しない。
3. 手本（個票の `sources` の 3 件）から手順を一般化し、手本に固有の製品名・値を必須の条件にしない。手本のファイルは変更しない。
4. [[specdojo:tsd-rulebook]] の frontmatter に `recipe: specdojo:tsd-recipe` を追加する。`tsd-index-rulebook.md` と sample は変更しない。
5. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
6. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | 手本と rulebook・sample から手順と判断を抽出する | ARC  | open | -    |
| 2   | recipe を書く                                    | ARC  | open | -    |
| 3   | rulebook の frontmatter に recipe を宣言する     | ARC  | open | -    |
| 4   | 検査を流し、対応結果を記録する                   | ARC  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:tsd-rulebook]]
- [[specdojo:tsd-sample]]
- [[specdojo:recipe-authoring-standard]]
- [[prj-0001:pjr-9sxh-tsd-index-sample-maintenance]]
- [[prj-0001:pjr-evae-tsd-sample-maintenance]]
