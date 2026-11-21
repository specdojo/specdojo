---
specdojo:
  id: prj-0001:pjr-c8j8-docs-site-kata-sidebar-auto
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T21:50:28Z"
  completed_at: "2026-11-15T01:19:43Z"
  conclusion: docs-site の型のメニューを rulebook の frontmatter から自動で作るようにした。develop で sidebar の手修正が不要になった
  commit_type: feat
  commit_scope: docs-site
---

# PJR-C8J8 文書サイトの型のメニューを、型の文書から自動で作る

## 1. 概要

sidebar-config.ts に型の文書を手で足す決まりを、rulebook・recipe・sample・template の frontmatter や置き場所から自動で作る形に変え、足し忘れで develop のテストが落ちないようにする

## 2. 入力

- 2026-11-14 の kata-wave-1 で、初期整備が作った recipe・template を型のメニューに足し忘れ、tests/packages/docs-site/sidebar-kata.test.ts が develop で落ちて、後に続くタスクの親の検証がすべて止まった（cxd・ifx-index など 3 回）
- 段の説明に「メニューにも足す」と書いても守られなかった。executor が足した場合も、develop の直しと sidebar-config.ts でぶつかった

## 3. 完了条件

- `packages/docs-site/.vitepress/sidebar-config.ts` の型のメニュー（rulebook・recipe・sample・template）を、`docs/ja/specdojo/` の型の文書から自動で作る。表示名と並び順は、型の文書の frontmatter（題名・種類・分類）や置き場所から決め、手で並びを決めたい場合の上書きの方法も残す。
- **作り方の方針**（orchestrator の案、indie が承認 2026-11-14）:
  - 非推奨でない rulebook を起点にし、frontmatter の `recipe`・`sample`・`template`・`includes` から、4 種類のメニューの項目と子の項目を作る。`undecided`・`not-needed` の場合の扱いも決める。
  - 分類は rulebook の `deliverable_type` で決める。`deliverable_type` と分類の名前・並び順の対応表、分類の中の並びと表示名の上書きだけを、小さな設定ファイル（例: `sidebar-kata.yaml`）に手で書く。表示名の既定は H1 から作る。
  - **生成物を commit しない**：メニューは文書サイトが設定を読み込むとき（VitePress の config の読み込み）にその場で組み立て、Git に残さない。確かめやすさのために書き出す場合は、`generated/` と同じく `.gitignore` で管理外にする。Git で管理するのは対応表の設定ファイルだけで、既にある分類に型を足すだけなら触らない。
  - 並べて流したタスクがそれぞれ型の文書を作っても、触るファイルが別々でぶつからないことを確かめる。
  - 文書サイトを入れた利用者のリポジトリ（PJR-PEJS）でも、同じ仕組みで型のメニューができる。
  - 今のメニューの表示名・分類・並びを、最初の設定ファイルに写し、見た目が変わらないようにする。
- 非推奨（`deprecated`）の型はメニューに出さない。YAML の sample・template は、今と同じく生成された表示用ページへのリンクにする。
- 新しい型の文書を作っただけで、メニューに出る。`tests/packages/docs-site/sidebar-kata.test.ts` は、自動で作ったメニューに対して、すべての型が出ること・リンク先が実在することを確かめる形に直す。
- 今のメニューと比べて、出る項目と表示名が大きく変わらないことを確かめ、変わった点を個票の対応結果に書く。
- 型の schedule の段の説明に足した「メニューにも足す」の決まり（`sch-strategy-kata-wave-1.yaml` など）は、不要になったら外す変更案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                                  | 担当         | 状態 | メモ                                           |
| --- | --------------------------------------------------------------------- | ------------ | ---- | ---------------------------------------------- |
| 1   | 型の文書からメニューを組み立てる `sidebar-kata.ts` を作る             | sol-executor | done | rulebook 起点。YAML パーサーへの依存は足さない |
| 2   | 今のメニューを写した設定 `sidebar-kata-config.ts` を作る              | sol-executor | done | 分類・並び・表示名の上書きだけ                 |
| 3   | `sidebar-config.ts` から型のデータを外し、`config.mts` で組み立てる   | sol-executor | done | ステージング側の型の文書を読む                 |
| 4   | `sidebar-kata.test.ts` を自動で作ったメニューに対して確かめる形に直す | sol-executor | done | 組み立て規則の単体テストも足した               |
| 5   | 今のメニューとの差分を確かめる                                        | sol-executor | done | 対応結果の「今のメニューとの差分」に記録       |

## 5. 対応結果

### 5.1. 実施内容

- `packages/docs-site/.vitepress/sidebar-kata.ts` を新設した。`docs/ja/specdojo/` の rulebooks・recipes・samples・templates 直下の Markdown と YAML を読み、4 種類の型のメニューを組み立てる。文書サイトが設定を読み込むとき（`config.mts` の評価時）にその場で組み立て、生成物は書き出さない（`.gitignore` の変更は不要）。
- `packages/docs-site/.vitepress/sidebar-kata-config.ts` を新設した。Git で手書き管理するのはこのファイルだけで、分類の名前と並び（`menu`）、`deliverable_type` と分類の対応（`deliverableTypes`）、表示名の上書き（`labels`）、子の並び（`children`）、置き場所の上書き（`attach`）を持つ。今のメニューの表示名・分類・並びをここへ写した。
- `packages/docs-site/.vitepress/sidebar-config.ts` から型の手書きデータ（約 520 行）を外し、`specdojoSidebarItems` 定数を `buildSpecdojoSidebarItems(specdojoDir)` 関数に替えた。ガイド・リファレンス・考え方・標準と、プロジェクト・プロダクト用の定数は変えていない。
- `packages/docs-site/.vitepress/config.mts` は、package 側の型を重ねたステージング（`.vitepress/kata-staging/docs/ja/specdojo`）を読んでメニューを組み立てる。文書サイトを入れた利用者のリポジトリ（PJR-PEJS）でも、同梱の型と利用者が足した型から同じ仕組みでメニューができる。
- `tests/packages/docs-site/sidebar-kata.test.ts` は、自動で作ったメニューに対して、非推奨でないすべての型が出ること・非推奨の型が出ないこと・同じ型が二度出ないこと・リンク先が実在することを確かめる。あわせて、仮のディレクトリに型の文書を作り、組み立て規則（`deliverable_type` による分類、分類に当たらない型の置き場所、非推奨の除外、YAML の表示用ページへのリンク、`includes` の子、複数の sample、接頭辞・`attach` による置き場所）と frontmatter の読み取り・表示名の作り方を確かめるテストを足した。
- 再開時（2026-11-15）に、親の検証の typecheck で落ちた TS2835 を直した。`sidebar-config.ts` と `sidebar-kata.ts` の相対 import に `.js` を付けた（`./sidebar-kata.js`・`./sidebar-kata-config.js`・`./sidebar-config.js`）。`npm run typecheck` と `npx vitest run tests/packages/docs-site`（9 ファイル・95 件）が通ることを確かめた。

### 5.2. 組み立ての規則

1. 起点は非推奨でない rulebook。設定の `menu` に書いた順に置き、書いていない rulebook は `deliverable_type` に当たる分類の末尾へファイル名順で足す。どの分類にも当たらなければ「その他」へ入れる。
2. rulebook のメニューでは、`includes` で 1 つの rulebook だけから参照され、`menu` に書いていない rulebook をその子にする（例: `cxd-mermaid` は `cxd` の子）。複数から参照される記法ルール（`cdfd-mermaid` など）は `menu` に書いた位置へ置く。
3. レシピ・サンプル・テンプレートのメニューでは、rulebook の `recipe`・`sample`・`template` が指す 1 件目をその rulebook の項目にし、2 件目以降を子にする。表示名は rulebook の表示名を使う。値が `undecided`・`not-needed`・空の場合はその種類の項目を作らない（指す文書が無いため）。
4. rulebook から指されていない型は、設定の `attach`、型の frontmatter の `rulebook`、ファイル名の接頭辞（例: `pjr-todo-template` → `pjr`）の順で rulebook に付ける。rulebook 自身がその種類を指していない場合、付いた型が 1 件なら rulebook の表示名で出し、複数ならその位置へ並べる。どれにも当たらない型は「その他」へ入れる。
5. 非推奨（`deprecated`）の rulebook と型は出さない。YAML の型は、今と同じく `generated/` の表示用ページへリンクする。同じ型は 1 つのメニューに一度だけ出す。
6. 表示名の既定は H1（YAML は `title`）から作る。rulebook は「作成ルール」と末尾の英字だけの補足（例: 「（CXD）」）を落とす。そのほかは「サンプル」「作成レシピ」などの接尾辞と「: 」より前を落とす。プレースホルダだけの H1 はファイル名を使う。

### 5.3. 今のメニューとの差分

- 4 種類のメニューの項目・表示名・並び・開閉状態を、変更前の `sidebar-config.ts` と並べて比べた。ガイド・リファレンス・考え方・標準と、ルール・レシピ・テンプレートのメニューは完全に一致した。
- 変わったのはサンプルの「運用」だけで、「運用方針・設計」「運用手順」の 2 つのグループが無くなった。今は rulebook のメニューと同じく「運用方針・設計 全体構成」「運用方針・設計」「運用手順 全体構成」「運用手順」と並び、個別の sample（「権限・アカウント」「バッチ再実行・失敗対応」など）は「運用方針・設計」「運用手順」の項目の下に子として並ぶ。「全体構成」の表示名は、rulebook と同じ「運用方針・設計 全体構成」「運用手順 全体構成」になった。リンク先の増減は無い。

### 5.4. 並べて流すタスクへの影響

- 新しい型の文書を作るタスクは、型の文書と rulebook の frontmatter だけを触ればメニューに出る。既にある分類へ型を足すなら `sidebar-kata-config.ts` は触らないため、並べて流したタスクどうしが同じファイルでぶつからない。テストの「`deliverable_type` で分類に入る」ケースで、設定を変えずに新しい rulebook と sample が出ることを確かめた。
- 表示名を短くしたい・並びを決めたいときだけ `labels`・`menu` に 1 行足す。足し忘れても、メニューから欠けたりテストが落ちたりはしない。

### 5.5. 迷った点と決めた内容

- 設定ファイルの形式: 例に挙がっていた YAML ではなく TypeScript のデータモジュール（`sidebar-kata-config.ts`）にした。`@specdojo/docs-site` は YAML パーサーに依存しておらず、この sandbox では依存の追加（`npm install`）ができなかったため。型検査が効き、コメントも書ける。frontmatter も、型の frontmatter が使う形（字下げした `key: value`、`- item` の並び、`[a, b]`）だけを読む小さな関数で読む。YAML の設定へ移す場合は、`@specdojo/docs-site` の `dependencies` に `yaml` を足す必要がある。
- `undecided`・`not-needed` は、どちらもその種類の項目を作らない扱いにした。リンク先が無いため。
- 複数の sample を持つ rulebook（`opd`・`opr`）では、1 件目を rulebook の項目にし、残りを子にした。今のメニューのグループ分けは再現していない（差分は「今のメニューとの差分」のとおり）。
- `pm-decision-log-template` は frontmatter にもファイル名にも rulebook への手がかりが無いため、`attach` で `dec` に付けた。`agent-members-template` と `exec-human-finalize-recipe` は rulebook を持たないため、`menu` にファイル名で置いた。
- dev サーバーの起動中に型の文書を足した場合、メニューに出るのは設定の読み直し（再起動）の後になる。今の手書きメニューでも再起動が要ったため、同じ扱いにした。

### 5.6. schedule の決まりを外す変更案

[[prj-0001:sch-strategy-kata-wave-1]] の段の説明と、それを展開した [[prj-0001:sch-track-kata-wave-1]] にある次の 1 文は、本対応で不要になる。

```text
新しく作った型の文書（rulebook・recipe・sample・template）は、packages/docs-site/.vitepress/sidebar-config.ts の型のメニューにも足す（tests/packages/docs-site/sidebar-kata.test.ts が確かめる）。
```

- 変更案: strategy の各段の説明からこの 1 文を消し、track を再生成する。分類や表示名を整えたい場合だけ `sidebar-kata-config.ts` を触る旨は、必要なら「新しい分類を作る型だけ `packages/docs-site/.vitepress/sidebar-kata-config.ts` の分類に足す」と置き換える。
- 本タスクでは変更しない。kata-wave-1 の schedule が流れている間に strategy と track を書き換えると、走っているタスクの plan とぶつかるため。本対応が develop へ入った後、orchestrator が strategy を直して track を再生成する。

### 5.7. CHANGELOG に書く事項

- Changed（`@specdojo/docs-site`）: 文書サイトのルール・レシピ・サンプル・テンプレートのメニューを、`docs/ja/specdojo/` の型の文書（rulebook の frontmatter の `recipe`・`sample`・`template`・`includes` と `deliverable_type`）から自動で作るようにした。新しい型の文書を足すだけでメニューに出る。利用者のリポジトリで足した型も同じ仕組みで出る。
- Changed（`@specdojo/docs-site`）: サンプルの「運用」で、「運用方針・設計」「運用手順」のグループを無くし、個別の sample をそれぞれの項目の下に並べるようにした。

## 6. 関連ドキュメント

- [[prj-0001:pjr-pqg3-sidebar-kata-menus]]: 型のメニューを手書きで整えた前回の対応と、`sidebar-kata.test.ts` の導入。
- [[prj-0001:pjr-pejs-docs-site-default-index-pages]]: 文書サイトを入れた利用者のリポジトリでの表示。
- [[prj-0001:sch-strategy-kata-wave-1]]: 「メニューにも足す」の決まりを外す変更案の対象。
