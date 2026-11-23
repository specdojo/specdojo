---
specdojo:
  id: prj-0001:pjr-qj41-ifx-index-yaml-pages
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T09:31:50Z"
  completed_at: "2026-11-19T12:12:07Z"
  conclusion: ifx-index の YAML から表形式の閲覧ページを yaml-pages build で生成するようにした
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

| No  | 作業                                     | 担当 | 状態 | メモ                                                                     |
| --- | ---------------------------------------- | ---- | ---- | ------------------------------------------------------------------------ |
| 1   | ifx-index の表の描画を yaml-pages に足す | DEV  | done | `src/docs/yaml-pages.ts` に要約・連携の一覧・連携ごとの表を追加          |
| 2   | リンク・注記・正本の折りたたみを足す     | DEV  | done | `spec_ref` の wikilink、コメントの注記と目印、YAML の折りたたみ          |
| 3   | テストと説明を足し、生成ページを確かめる | DEV  | done | テスト 3 件と rulebook「表示ページでのレビュー」を追加。生成ページを確認 |

## 5. 対応結果

### 5.1. 実施内容

- `src/docs/yaml-pages.ts`: ファイル名が `ifx-index*.yaml`・`type: api`・`interfaces` が配列の YAML を表で描くようにした。用語集と同じく、要約の表（id・状態・連携の数・`TBD` の数）、連携の一覧（8 列）、連携ごとの詳細の表と注記、一覧全体の注記、折りたたんだ YAML の正本を出す。
- `tests/src/docs/yaml-pages.test.ts`: 実在の ifx-index と sample の全連携が行と詳細に出ること、コメントの振り分け・目印・`spec_ref` の修飾・`|` のエスケープ、テンプレートは従来のコードブロックのままであることを確かめるテストを足した。
- `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md`: 記述ガイドに「表示ページでのレビュー」を足し、表の列と見出しの決め方、コメントの位置と注記の対応を書いた。YAML（正本・sample・template）は変えていない。
- `npm run docs:build` で `generated/ifx-index.md`・`generated/ifx-index-sample.md` が表形式で生成されることを確かめた。

### 5.2. 決めた内容と理由

- 未決事項・留保は rulebook がコメントに書くと定めているため、コメントを注記として取り出した。連携の直前（`- name` と同じ字下げ）と内側のコメントはその連携、行頭のコメントは一覧全体の注記とした。現行の一覧と sample がこの書き方に揃っているため。
- 連携ごとの「状態」は schema に項目がないため、詳細仕様の有無（`TBD` は「未整備（TBD）」）と注記の目印（`_TODO_`・`_UNDECIDED_`・`_ASSUMPTION_`）で示した。schema にないキーを足さないため。
- 連携の一覧は連携先を載せ、連携元・タイミング・異常時の扱いは連携ごとの表に回した。一覧の列を読める幅に収めるため。
- 修飾のない `spec_ref` は一覧の `id` の修飾を補って wikilink にした。成果物の wikilink は project 修飾 ID で解決するため。
- テンプレート（`type: template`）は従来どおりコードブロックで出す。プレースホルダの表はレビューの役に立たないため。
- 保護された設定の変更はない。

### 5.3. CHANGELOG に書く事項

- `specdojo yaml-pages build` が外部システムI/F一覧（`ifx-index*.yaml`）を、用語集と同じく表形式の表示ページで生成するようになった。連携の一覧・連携ごとの詳細・YAML のコメントの注記を表示し、YAML の正本は折りたたみで添える。

### 5.4. 残課題

- なし

### 5.5. 統合の後の確認（orchestrator）

- 2026-11-19 に develop で `specdojo yaml-pages build` を流し、`docs/ja/product/020-external-interface-specs/generated/ifx-index.md` に一覧の要約（id・状態・連携の数・詳細仕様が未整備の数）、連携の一覧（連携名・連携先・向き・種別・形式・詳細仕様・注記）、連携ごとの詳細の表が生成されることを確かめた。詳細仕様は wikilink、未整備は「未整備（TBD）」と表示された。
- 統合の後の develop で `npm run docs:build` が通った（2026-11-18、PJR-5CTM の確認の中で実施）。

## 6. 関連ドキュメント

- [[specdojo:ifx-index-rulebook]]
- [[ifx-index]]
