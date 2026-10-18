---
specdojo:
  id: prj-0001:pjr-6ef8-npm-init-placeholder-test-script
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-18T12:45:37Z"
  derived_from:
    - PJR-Z104
---

# PJR-6EF8 npm init の仮の test script があると not_applicable が退けられて最初の実行が止まる

## 1. 課題内容

npm init -y は package.json に test の仮の script（echo "Error: no test specified" && exit 1）を入れる。LP の手順どおりに作ったリポジトリで 0.4.0 の tarball を試すと、executor は npm test を not_applicable と報告したが、runner は test の script があるため当てはまると判定して退け、executor validation failed or not run: npm test で waiting にした（2026-10-18）。LP の手順で導入した利用者は全員がここで止まる

## 2. 影響範囲

| 観点         | 影響                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/reporter.ts`（`not_applicable` の主張を確かめる処理）、共通の規約の検査の表 |
| スケジュール | 高い。0.4.0 の公開を止める。LP の手順で導入した利用者の最初の実行が必ず止まる         |
| コスト       | 利用者が原因を調べ、`package.json` を直して再開する手間                               |
| 品質         | executor の正しい判断を runner が退ける                                               |
| 関係者       | 0.4.0 を導入する利用者                                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner は `npm run <script>` / `npm test` の `not_applicable` を、`package.json` にその script があれば退ける。`npm init` が入れる仮の test script も「ある」と判定している |
| 対応策   | `npm init` が入れる仮の test script を、script がないものとみなす。共通の規約の検査の表にも同じ扱いを書く                                                                   |
| 依存事項 | なし                                                                                                                                                                        |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                      |

### 3.1. 完了条件

- runner が `npm test` の `not_applicable` を確かめるとき、`test` の script が `npm init` の仮の script（`echo "Error: no test specified" && exit 1` と、空白や引用符の違いなどの変種）なら、script がないものとみなして受け付ける。
- 本物の test script がある場合は、今までどおり `not_applicable` を退ける。
- 共通の規約の検査の表（`npm test` の行の適用条件）に、仮の script は script がないものとみなすことを書く。executor と runner の判断をそろえる。
- `specdojo init` は利用者の `package.json` を書き換えない。
- 単体テストで、仮の script の場合に受け付けること、本物の script の場合に退けることを確かめる。
- npm init -y で作った空のリポジトリで、`exec run --register --worktree` の最初の実行が `review` まで進むことを確かめる（orchestrator が tarball で行う。executor の sandbox で行えない場合は `requires_human` とする）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [0.4.0] - 未定` の節に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-z104-plan-essentials-validation-rule]]（元の項目）
- [[prj-0001:pjr-hzw3-release-v0-4-0]]（0.4.0 の公開）
