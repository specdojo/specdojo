---
specdojo:
  id: prj-0001:pjr-6ef8-npm-init-placeholder-test-script
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-18T12:45:37Z"
  completed_at: "2026-10-18T13:04:38Z"
  conclusion: runner が npm test の not_applicable を確かめるとき、npm init の仮の test script（引用符・空白の違いを含む）は script がないものとみなすようにし、共通の規約の検査の表にも同じ扱いを書いた。本物の script は今までどおり退ける。npm init -y で作った空のリポジトリで、0.4.0 の tarball の最初の実行が close まで通った
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

- 解決内容: `src/exec/reporter.ts` に、`test` の script が `npm init` の仮の script（`echo "Error: no test specified" && exit 1` と、引用符の有無・種類や空白だけが違う変種）かを判定する処理を加え、`not_applicable` の主張の確認と機械的な非適用の判定で、仮の script を script がないものとみなすようにした。仮の扱いは `test` の script だけに限り、本物の test script がある場合は従来どおり `not_applicable` を退ける。
- 検査の表: 共通の規約（`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`）の検査の表の `npm test` の行の適用条件と本文に同じ扱いを書き、executor への pipeline の指示（`src/exec/run/agent.ts`）にも書き加えて、executor と runner の判断をそろえた。
- `specdojo init` は変更しておらず、利用者の `package.json` を書き換えない。
- 確認結果: `tests/src/exec/reporter.test.ts` に、仮の script の変種で受け付けること、本物の script で退けること、他の script 名では仮の中身でも script があるとみなすことの単体テストを加えた。npm init -y で作ったリポジトリで最初の実行が `review` まで進むかは、tarball による人の確認（orchestrator）に残す。
- CHANGELOG の `## [0.4.0] - 未定` の不具合修正に記載した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-z104-plan-essentials-validation-rule]]（元の項目）
- [[prj-0001:pjr-hzw3-release-v0-4-0]]（0.4.0 の公開）
