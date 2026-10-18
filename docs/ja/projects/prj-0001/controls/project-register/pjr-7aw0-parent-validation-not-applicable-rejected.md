---
specdojo:
  id: prj-0001:pjr-7aw0-parent-validation-not-applicable-rejected
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T14:46:06Z"
  derived_from:
    - PJR-Z104
---

# PJR-7AW0 親検証の検査を executor が not_applicable と報告すると runner が退けて止まる

## 1. 課題内容

2026-10-18 23:45 に PJR-WJE6 を qwen-executor で流したところ、qwen は親 runner が流す検査（npm run lint:md など 7 件）を、規約どおり自分では流さず not_applicable（理由: parent runner runs）と報告した。runner は script があるため当てはまると判定して not_applicable を退け、親検証の 7 件はすべて通っていたのに executor validation failed or not run で waiting にした。親検証に設定された検査についての executor の報告は、親 runner の結果で置き換えるか無視するべきである

## 2. 影響範囲

| 観点         | 影響                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/reporter.ts`（executor の検証の報告を確かめる処理）、共通の規約の検査の扱い    |
| スケジュール | 高い。親検証の検査を報告に含める agent（ローカル LLM など）の run が、通っていても止まる |
| コスト       | 通った run を人が確かめて再開する手間                                                    |
| 品質         | 規約どおりの報告が失敗と扱われる                                                         |
| 関係者       | exec run の利用者、夜間の自動実行                                                        |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner は executor の `not_applicable` を script の有無で確かめる。親検証に設定された検査（executor は流さない約束）を executor が `not_applicable` と報告すると、script があるため退け、親検証の結果とは別に失敗と扱う |
| 対応策   | 親検証に設定された検査についての executor の報告は、親 runner の結果を正とし、executor の `not_applicable` / `not_run` で run を失敗にしない                                                                            |
| 依存事項 | なし                                                                                                                                                                                                                    |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                  |

### 3.1. 完了条件

- executor の報告のうち、親検証に設定された検査（`pipeline.parent_validations` の ID に対応するコマンド）についての `not_applicable` と `not_run` は、親 runner がその検査を流した場合、run を失敗にしない。親 runner の結果（passed / failed）を正とする。
- 親検証に設定されていない検査についての `not_applicable` の確かめ方（script の有無など、6EF8 の扱いを含む）は今のまま。
- 共通の規約の要点に、親検証に設定された検査は executor の報告に含めなくてよく、含める場合は親 runner の結果が正になることを書く。
- 単体テストで、親検証の検査を executor が `not_applicable` と報告し親 runner が通した場合に run が失敗しないこと、親検証でない検査の誤った `not_applicable` は今までどおり退けることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG は、未公開の版の節（なければ `## [0.4.1] - 未定` を作る）に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-z104-plan-essentials-validation-rule]]（元の項目）
- [[prj-0001:pjr-wje6-product-repo-branch-guide]]（止まった実行）
