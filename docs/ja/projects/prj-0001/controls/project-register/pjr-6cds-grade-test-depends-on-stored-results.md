---
specdojo:
  id: prj-0001:pjr-6cds-grade-test-depends-on-stored-results
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-16T22:32:48Z"
  due_on: null
---

# PJR-6CDS grade の単体テストがリポジトリの実際の評価結果に左右される

## 1. 課題内容

tests/src/grade.test.ts の plan の生成のテストが、リポジトリの本物のサンプルと保存済みの評価結果を読む。定期評価で opr-batch-sample の指摘の anchor に見出しが入り、plan に載ったため、2026-10-17 05:00 の kata の Run の review の検証で失敗した。Run を統合すると develop でも失敗する

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `tests/src/grade.test.ts` のうち、リポジトリの本物の kata（`docs/ja/specdojo/`）と保存済みの評価結果（`docs/ja/projects/prj-0001/execution/grade/results/`）を読んで plan を作るテスト |
| スケジュール | 2026-10-17 05:00 の kata の Run（`JBR-grade-kata-844691df6cfc`）を統合する前に直す                                                                                                     |
| コスト       | 定期評価が保存済みの評価結果を更新するたびに、テストの結果が変わる。Run の review の検証や develop の検証が、コードの誤りではない理由で失敗する                                        |
| 品質         | テストが、リポジトリの状態（評価の内容）に依存している                                                                                                                                 |
| 関係者       | 定期実行、exec の親の検証、開発者                                                                                                                                                      |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                             |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 「lists reference paths without embedding target or reference contents」は、`docs/ja/specdojo/samples/opr-batch-sample.md` の plan に、そのサンプルの見出し `# 運用手順: バッチ再実行・失敗対応 サンプル` が含まれないことを確かめる。plan には保存済みの評価結果の指摘が載り、定期評価で指摘の `anchor` にその見出しが入ったため、plan に見出しの文字列が現れた |
| 対応策   | テストが確かめたいこと（評価対象と参照の本文を plan に埋め込まないこと）を、保存済みの評価結果に左右されない形で確かめる。一時ディレクトリの fixture を使うか、評価結果を読まない条件で plan を作るか、本文の埋め込みを判定できる別の方法（本文にしかない文字列）で確かめる                                                                                      |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                             |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                                                                                                                           |

### 3.1. 完了条件

- 上のテストが、保存済みの評価結果の内容によらず、評価対象と参照の本文を plan に埋め込まないことを確かめる。
- `tests/src/grade.test.ts` のほかのテストも、保存済みの評価結果（`execution/grade/results/`）の内容で結果が変わるものがないかを調べ、あれば同じく直す。調べた範囲と結果を result に書く。
- 直したテストが、2026-10-17 05:00 の kata の Run の出力（`exec/prj-0001-JBR-grade-kata-844691df6cfc` の `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-batch-sample.yaml`）を置いた状態でも通ることを確かめる。
- テストを変えるだけとし、`src/` の動作は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

- `renderGradePlan` の単体テストでは、テストごとに作成した空の一時結果ディレクトリを `resultsDirectory` へ渡す共通 helper を使うようにした。これにより、リポジトリに保存された `execution/grade/results/` のfinding・`anchor`・評価履歴は plan の検証結果に影響しない。
- 評価対象と参考資料の本文を埋め込まないことは、専用 fixture の本文にしかない固有文字列が plan に現れないことで確認する。実サンプルの見出しを否定検証する依存を除いた。
- `tests/src/grade.test.ts` 内の `renderGradePlan` 利用を調べ、前回findingの引き継ぎ自体を確認するテスト以外はすべて上記 helper 経由にした。引き継ぎテストは従来どおり、テスト自身が一時ディレクトリへ作成した固定 sidecar だけを読む。
- `src/` は変更していない。検証結果は exec result に記録する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-yh9q-src-move-grade-register]]: 本件の後に grade のテストを移す。
