---
specdojo:
  id: prj-0001:pjr-sj0g-register-plan-index-input
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T02:56:23Z"
  block_reason: "agent exited with non-zero code: parent validation failed: test-unit"
---

# PJR-SJ0G register の plan が大きい一覧を読ませ、一覧のパスも誤っている

## 1. 課題内容

register の todo の plan（xep-register-template・xep-register-investigate-template）は、進め方の最初で登録簿の一覧の該当行を読ませ、対象項目に一覧のパスを挙げている。一覧は約 479KB あり、文脈が 64k のローカル LLM（gemma26-executor）は分けて読むうちに文脈を使い切り、何も変更せずに終わった（WJE6 の試行 wje6-local-llm）。挙げているパスも controls/project-register/pjr-index.md で、実際の生成先 generated/pjr-index.md と違う。作業に必要なのは個票だけである

## 2. 影響範囲

| 観点         | 影響                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------- |
| スコープ     | `xep-register-template`・`xep-register-investigate-template` と、それを使う register の plan の生成 |
| スケジュール | 急がない                                                                                            |
| コスト       | 文脈の小さい agent が一覧を読んで文脈を使い切り、何も変更せずに終わる                               |
| 品質         | plan が存在しないパスを挙げ、agent が探すために手順を費やす                                         |
| 関係者       | register の todo を exec で流す利用者                                                               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | plan の雛形が、進め方の最初で一覧の該当行を読ませ、対象項目に一覧のパスを挙げている。一覧は約 479KB あり、パスも古い位置（`controls/project-register/pjr-index.md`）のままである |
| 対応策   | plan の対象項目から一覧のパスを外し、進め方の最初を個票を読むことにする                                                                                                          |
| 依存事項 | なし                                                                                                                                                                             |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                           |

### 3.1. 完了条件

- `xep-register-template`・`xep-register-investigate-template` の対象項目から、一覧（`pjr-index.md`）のパスを外す。
- 進め方の最初を「個票を読み、目的・完了条件・制約を把握する」にし、一覧は大きいため読まないことを明記する。
- 「一覧と個票のステータス項目は変更しない」という指示は残す。
- 生成した plan に一覧のパスが含まれないことを、単体テストで確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 4. 対応結果

- 解決内容:
  - `docs/ja/specdojo/exec-templates/xep-register-template.md` および `docs/ja/specdojo/exec-templates/xep-register-investigate-template.md` の「2. 対象項目」から登録簿一覧のパス（`- \`登録簿\`: \`_PJR_INDEX_PATH_\``）を削除しました。
  - 両テンプレートの「3. 進め方」の冒頭を個票のみを読み、一覧は大きいため読まないことを明記する記述（「1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。」および「1. 個票（存在する場合）を読み、問い・リスク内容・判断に必要な条件を把握する。登録簿の一覧は大きいため読まない。」）に改訂しました。
  - 「登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない」指示は完了手順に維持しています。
  - `src/exec/register.ts` の `generateRegisterPlan` から不要になった `_PJR_INDEX_PATH_` の定義を削除しました。
- 確認結果:
  - `tests/src/exec/register-plan-escape.test.ts` に単体テストを追加し、生成された plan に一覧のパスが含まれないこと、および進め方の指示文言が正しく反映されていることを確認しました。
- 再発防止策:
  - register 由来の plan テンプレートでは巨大になりうる一覧ファイルを agent の読み込み対象から外し、個票のみを作業基準とするテストケースを維持します。

## 5. 関連ドキュメント

- [[prj-0001:pjr-wje6-product-repo-branch-guide]]（試行の対象）
