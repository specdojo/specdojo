---
specdojo:
  id: prj-0001:pjr-6hs2-kata-companion-files
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
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

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-84f7-scaffold-slidev]]：Slidev の kata を検証できるようにする todo
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）の PJR-S9ZM
