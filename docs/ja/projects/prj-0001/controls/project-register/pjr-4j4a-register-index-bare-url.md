---
specdojo:
  id: prj-0001:pjr-4j4a-register-index-bare-url
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-23T14:18:29Z"
  completed_at: "2026-10-23T14:32:48Z"
  conclusion: 一覧・派生ビュー・PM ログの表のセルで、素の http・https の URL を山括弧で囲むようにした。全角の括弧や句読点の手前で URL を区切り、既に囲まれたもの・リンク・コードの書式の中は変えない。作り直した develop の生成物は markdownlint を通る
  derived_from:
    - PJR-6SQH
---

# PJR-4J4A 登録簿の一覧のセルで素の URL が囲まれず lint-md が止まる

## 1. 課題内容

一覧の生成はセルの説明や結論に書かれた URL をそのまま描くため、markdownlint の MD034 に当たり、develop から分かれた run の親の検証がすべて止まる。PJR-Y6DG の結論の specdojo.org の URL で起きた

## 2. 影響範囲

| 観点         | 影響                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| スコープ     | `src/register/item.ts` の表のセルを整える処理（`toCell`）                                    |
| スケジュール | 大。develop の生成物が lint-md に当たると、develop から分かれた run がすべて親の検証で止まる |
| コスト       | 止まった run の再開と、記帳の書き直しの手間                                                  |
| 品質         | 生成した一覧の Markdown が規約に合わない                                                     |
| 関係者       | register と exec run の利用者、夜間の自動実行                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------- |
| 原因     | 表のセルを作る処理は、縦棒と強調の記号（PJR-6SQH）はエスケープするが、素の URL を `<...>` で囲まない |
| 対応策   | 表のセルに描く文の素の URL を `<...>` で囲む                                                         |
| 依存事項 | なし                                                                                                 |
| 完了条件 | 下記の完了条件を満たす                                                                               |

### 3.1. 完了条件

- v0.4.4 の範囲とする（2026-10-23、利用者が承認）。PJR-EKRW の親の検証が止まっているため先に行う。
- 登録簿の一覧・派生ビュー・PM ログの表のセルに描く文で、素の `http://`・`https://` の URL を `<...>` で囲む。URL の終わりは、空白、全角の括弧や句読点（`）`・`。`・`、` など）、半角の閉じ括弧の手前までとする。すでに `<...>` の中、Markdown のリンクの中、コードの書式の中にある URL は変えない。何度生成しても結果が変わらない（冪等）。個票と event の内容は変えない。
- 単体テストで、全角の括弧と句点が続く URL（例: `（homepage は https://specdojo.org）。`）、文の途中の URL、すでに囲まれた URL、コードの書式の中の URL を含む文から作った一覧が markdownlint を通り、既存のエスケープ（縦棒・強調の記号）のテストも通ったままであることを確かめる。
- 修正したコードで `register build --project prj-0001` を実行し、生成物を作り直す。作り直した生成物が `npm run lint:md` を通る（今の develop では PJR-Y6DG の結論で MD034 に当たっている）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

- 解決内容:
  - `src/register/item.ts` の `toCell` で、コードスパン・山括弧・Markdown link の外にある素の HTTP(S) URL を autolink に変換するようにした。
  - URL 直後の全角の閉じ括弧・句読点と半角の閉じ括弧を URL の外へ残し、既存の autolink・Markdown link・コードスパンと URL 内の強調記号を保持する冪等な変換にした。
  - 後段の山括弧プレースホルダ変換が HTTP(S) autolink をコード化しないようにし、一覧・派生ビュー・PM ログで同じ表示を維持した。
- 確認結果:
  - `toCell` の単体テストに、全角括弧と句点、文中 URL、半角閉じ括弧、既存 autolink、Markdown link、コードスパン、URL 内のアンダースコア、冪等性のケースを追加した。
  - 個票から一覧・派生ビュー・PM ログを生成するテストに MD034 の検査を追加し、表示時だけ URL が autolink になり、個票は変更されないことを確認するようにした。
  - `node --import tsx src/specdojo.ts register build --project prj-0001` が成功し、PJR-Y6DG の結論にある URL が `<https://specdojo.org>` として生成されることを確認した。
  - `node --import tsx src/specdojo.ts catalog validate --project prj-0001` が既存の参照先未配置に関する警告のみで成功した。
- 再発防止策:
  - 全表セルが通る `toCell` に URL の変換を集約し、各ビューで個別に URL を扱わない構造を維持した。

## 5. 関連ドキュメント

- PJR-6SQH（一覧のセルの強調の記号のエスケープ）
