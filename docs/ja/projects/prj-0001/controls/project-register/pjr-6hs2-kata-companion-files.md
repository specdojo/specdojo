---
specdojo:
  id: prj-0001:pjr-6hs2-kata-companion-files
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T23:23:16Z"
  due_on: "2026-10-31"
---

# PJR-6HS2 kata のディレクトリにある付属のファイルが、別の kata として一覧に出る

## 1. 課題内容

`kata list` と `kata status` は kata のディレクトリのファイルをすべて kata として数えるため、sample に付けた CSS などの付属のファイルが、ファイル名を ID とする別の kata（`kata status` では `package-missing`）として表示される。

- 起きた条件: 利用者の project（coderdojo-lessons-specdojo の prj-0001）で、Slidev の sample `edu-scratch:lsd-sample`（`docs/ja/specdojo/samples/edu-scratch/lsd-sample.md`）に、見た目の CSS `lsd-sample.css` を同じディレクトリに付けた。
- CSS を付けた理由: Slidev は `slides.md` の中の `<style>` をそのページだけに当てる。全ページに効く見た目は、`slides.md` と同じディレクトリの `style.css` に置く必要がある。kata の Markdown だけでは、全ページの見た目を持てない。
- 起きたこと:
  - `kata list --kind sample` に `sample repository yes lsd-sample docs/ja/specdojo/samples/edu-scratch/lsd-sample.css` が出る。
  - `kata status` に `sample ejected package-missing lsd-sample …/lsd-sample.css` が出る。
  - `kata show edu-scratch:lsd-sample` は正しく動く。
- 原因の見立て: `src/kata/command.ts` の `filesBelow` は、`generated` のディレクトリ以外のファイルをすべて集める。ID を持たないファイルは、ファイル名から ID を作られる。

## 2. 影響範囲

| 観点         | 影響                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| スコープ     | kata に付属のファイル（CSS・画像など）が要る形式（Slidev など）の sample・template |
| スケジュール | なし                                                                               |
| コスト       | 一覧の読み違いを確かめる手間                                                       |
| 品質         | 一覧と `kata status` に、実在しない kata と `package-missing` が出る               |
| 関係者       | 付属のファイルを持つ kata を作る利用者                                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | kata の一覧が、kata のディレクトリのファイルをすべて kata として数える                                                                                                                                                                                                                                                                   |
| 対応策   | 次のどちらかにする。<br>1. 一覧は ID を持つファイル（`.md`・`.mdx`・`.yaml`・`.json` など）だけを kata として数え、それ以外は kata の付属のファイルとして扱う。<br>2. kata の frontmatter で付属のファイルを宣言できるようにし、`kata eject` でも一緒に写す。<br>どちらの場合も、`kata eject` で付属のファイルが一緒に写ることを確かめる |
| 依存事項 | [[prj-0001:pjr-84f7-scaffold-slidev]]（Slidev の kata の検証）                                                                                                                                                                                                                                                                           |
| 完了条件 | 付属のファイルが別の kata として一覧と `kata status` に出ない。`kata eject` で kata と付属のファイルが一緒に写る。これらを確かめる test がある                                                                                                                                                                                           |

### 追記（2026-10-25、利用者が承認）

- v0.4.6 の範囲とする。対応策は 1（ID を持つ形式のファイルだけを kata として数える）を採る。frontmatter の項目は増やさない。
- kata として数えるのは、ID を読める形式（`.md`・`.mdx`・`.yaml`・`.yml`・`.json`）のファイルとする。それ以外のファイルは一覧と `kata status` に kata として出さない。
- 付属のファイルは、kata と同じディレクトリにあり、拡張子を除いた名前が kata のファイルと同じもの（例: `lsd-sample.md` に対する `lsd-sample.css`）とする。kata と同じ名前のディレクトリの下のファイル（例: `lsd-sample/` の下の画像）も付属のファイルに含めるかは executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
- `kata eject` は、kata と付属のファイルを一緒に写す。既存のファイルは `--force` がない限り上書きしない。`--dry-run` では付属のファイルも表示し、書き込まない。
- `kata status` で、付属のファイルだけが package と違う場合の扱いを決め、個票の対応結果と報告の `handoff` に書く。
- [[specdojo:kata-guide]] に、付属のファイルの置き方（名前の付け方と eject での扱い）を書く。
- 単体テストで、付属のファイルが一覧と `kata status` に出ないこと、`kata eject` で一緒に写ること、ID を持つ形式のファイルは従来どおり kata として数えることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-84f7-scaffold-slidev]]：Slidev の kata を検証できるようにする todo
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）の PJR-S9ZM
