---
specdojo:
  id: prj-0001:pjr-6sqh-register-index-escape-emphasis
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-21T13:56:54Z"
  derived_from:
    - PJR-A6PV
---

# PJR-6SQH 登録簿の一覧のセルで強調の記号がエスケープされず lint-md が止まる

## 1. 課題内容

一覧の生成はセルの縦棒はエスケープするが、アスタリスクとアンダースコアはしない。説明や結論に orch: のあとにアスタリスクを付けた書き方が 2 つあると強調と解釈され、MD037 で親の検証の lint-md が止まり、develop から分かれた run がすべて止まる

## 2. 影響範囲

| 観点         | 影響                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| スコープ     | `src/register/item.ts` ほか、登録簿の一覧・派生ビュー・PM ログの表のセルを作る処理           |
| スケジュール | 大。develop の生成物が lint-md に当たると、develop から分かれた run がすべて親の検証で止まる |
| コスト       | 止まった run の再開と、記帳の書き直しの手間                                                  |
| 品質         | 生成した一覧の Markdown が規約に合わない                                                     |
| 関係者       | register と exec run の利用者、夜間の自動実行                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| 原因     | 一覧の表のセルを作る処理は縦棒だけをエスケープし、強調に読まれるアスタリスクやアンダースコアをそのまま描く |
| 対応策   | 表のセルに描く自由記述の文で、強調に読まれる記号を文の意味を変えずにエスケープする                         |
| 依存事項 | なし                                                                                                       |
| 完了条件 | 下記の完了条件を満たす                                                                                     |

### 3.1. 完了条件

- 0.4.2 の範囲とする（2026-10-21、利用者が承認）。PJR-W93C の親の検証が止まっているため先に行う。
- 登録簿の一覧（`pjr-index.md`）・派生ビュー（`pjr-views-by-*.md`・`pjr-derived-items.md`）・PM ログ（`pm-*-log.md`・`pm-risk-register.md`）の表のセルに描く文で、アスタリスクとアンダースコアを強調に読まれないようエスケープする。既にコードの書式で囲まれた部分と、既にエスケープされた記号は二重に変えない。個票と event の内容は変えない。
- 単体テストで、アスタリスクを 2 つ含む結論や説明（例: `orch:` のあとにアスタリスクを付けた書き方を 2 つ並べた文）とアンダースコアを含む文から作った一覧が、markdownlint を通ることを確かめる。縦棒のエスケープの既存のテストは通ったままにする。
- 修正したコードで `register build --project prj-0001` を実行し、生成物を作り直す。作り直した生成物が `npm run lint:md` を通る（今の develop では PJR-SAZC の結論で MD037 に当たっている）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に新しい版の節がなければ `## [Unreleased]` の節を作って書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
