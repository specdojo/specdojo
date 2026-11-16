---
specdojo:
  id: prj-0001:pjr-qj41-ifx-index-yaml-pages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T09:31:50Z"
  commit_type: feat
  commit_scope: docs
---

# PJR-QJ41 ifx-index の YAML から表形式の閲覧ページを生成する

## 1. 概要

YAML を正本のまま、用語集と同じく yaml-pages で表形式の Markdown を生成し、レビューしやすくする

## 2. 入力

- indie の依頼（2026-11-15）: ifx-index は YAML のためレビューがしにくい
- 方針（indie が 2026-11-15 に決定）: 用語集（`gl-*`）と同じく YAML を正本とし、Markdown は yaml-pages build で生成する。Markdown を正本にはしない
- 生成物は `docs/**/generated/` に出し、Git には入れない（用語集と同じ）

## 3. 完了条件

- ifx-index の YAML は正本のまま変えない。`yaml-pages build` が、用語集（`gl-*`）と同じく `generated/` に表形式の Markdown を生成する。
- 生成するページには、一覧の要約（id・状態・連携の件数）と、連携ごとの表（相手・方式・向き・詳細仕様・状態など、schema の項目から選ぶ）がある。詳細仕様（`ifx-cmd-*` など）へのリンクと、未決事項・留保の注記を、表から辿れる。YAML の正本は折りたたみで添える。
- 文書サイトと wikilink（`[[ifx-index]]`）は、生成したページへ解決する（yaml-pages build のリンクの付け替えに従う）。
- 表の列や見出しの決め方を、ifx-index の rulebook か yaml-pages の説明に書いている。型（rulebook・sample・template）の YAML の構造は変えない。
- 生成のテストを `tests/src/docs/yaml-pages.test.ts` に足し、表の中身（列・リンク・注記）を確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通り、`npm run docs:build` で生成ページが表示される。

## 4. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | ifx-index の表の描画を yaml-pages に足す | DEV  | open | -    |
| 2   | リンク・注記・正本の折りたたみを足す     | DEV  | open | -    |
| 3   | テストと説明を足し、生成ページを確かめる | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:ifx-index-rulebook]]
- [[prj-0001:ifx-index]]
