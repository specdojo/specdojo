---
specdojo:
  id: prj-0001:pjr-zg0a-empty-register-views-blank-lines
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-25T02:42:15Z"
  block_reason: "parent validation failed: test-unit"
---

# PJR-ZG0A 登録簿に項目がないと、担当者別と状態別の派生ビューが markdownlint の MD012 に当たる

## 1. 課題内容

登録簿に項目が 1 件もないと、`register build` が生成する担当者別と状態別の派生ビューの空の章に空行が 2〜3 行続き、markdownlint の `MD012`（no-multiple-blanks）に当たる。

- 起きた条件: 空のリポジトリで `init --yes --provider claude --lefthook --slidev` を実行した直後（[[prj-0001:pjr-50yh-markdownlint-cli2-overrides|PJR-50YH]] の確認中、2026-10-25）。
- 起きたこと: markdownlint-cli と markdownlint-cli2 の両方で、次の 4 件が出た。
  - `generated/pjr-views-by-owner.md:17` と `:18`（Expected: 1; Actual: 2 と 3）
  - `generated/pjr-views-by-status.md:17` と `:18`（同上）
- 影響: `init` の直後に生成物を commit すると、`init --lefthook` が入れる commit hook の markdownlint で止まる見込みである。本リポジトリは項目があるため表に出ていなかった。
- 原因の見立て: `src/register/views.ts` で、項目のない章の表を空文字列として差し込み、前後の空行が重なる。

## 2. 影響範囲

| 観点         | 影響                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| スコープ     | 項目のない登録簿の担当者別・状態別の派生ビュー。ほかの派生ビューも確かめる |
| スケジュール | 導入直後の最初の commit で止まる                                           |
| コスト       | 原因の調査と、生成物を手で直す手間（再生成で戻る）                         |
| 品質         | 生成物が markdownlint を通らない                                           |
| 関係者       | SpecDojo を新しく導入する利用者                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 項目のない章で、空の表の差し込みの前後の空行が重なる                                                                                                       |
| 対応策   | 項目のない章でも空行が 1 行に収まるよう生成を直す。項目のない章に「該当なし」などを書くかは executor が決め、理由を個票の対応結果と報告の `handoff` に書く |
| 依存事項 | なし                                                                                                                                                       |
| 完了条件 | 項目が 0 件の登録簿の派生ビュー（一覧・状態別・優先度別・担当者別・派生項目・PM ログ）がすべて markdownlint を通る。これを確かめる test がある             |

### 追記（2026-10-25、利用者が承認）

- v0.4.6 の範囲とする。
- 項目がある場合の生成物は変えない（本リポジトリの `register build` で差分が出ない）。
- test は、項目が 0 件の登録簿で生成した派生ビューに空行の連続がないことを確かめる。本リポジトリの依存にある markdownlint で確かめられる場合は、それを使う。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

- 解決内容: `src/register/views.ts` の `renderGroupedTables` が、グループが 0 件のとき空文字列ではなく「該当なし」を返すようにした。空文字列が章見出しの後の空行と重なり、`MD012` に当たっていた。項目がある場合の出力は変えていない。
- 「該当なし」を書く理由: 章の本文が空のままだと、見出しの直後に何も無い章になり、読み手が生成漏れと区別できない。空行を詰めるだけより、項目が無いことを明示する方が意図が伝わる。
- 確認結果: `tests/src/register/empty-views.test.ts` を追加した。項目が 0 件の登録簿で全派生ビュー（一覧・状態別・優先度別・担当者別・派生項目・PM ログ）を生成し、本リポジトリの依存の markdownlint で `MD012` の違反が無いことを確かめる。優先度別・派生項目・PM ログは固定の表を持つため元から通る。
- 再発防止策: 上記の test。CHANGELOG の `## [Unreleased]` に追記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-50yh-markdownlint-cli2-overrides]]：見つけたときの確認
