---
specdojo:
  id: prj-0001:pjr-283n-register-plan-blank-lines-autopilot
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-18T16:40:17Z"
  completed_at: "2026-10-18T17:54:10Z"
  conclusion: orchestrator の最小の修正（register の plan の空行をまとめる）を、全雛形が通る expandTemplate へ移し、2 行以上続く空行を 1 行にまとめるようにした。Job・保守系の approach などの雛形でも空に展開される箇所があり、まとめて直った。印のある個票とない個票の plan に MD012 が出ないことをテストで確かめた。統合後の JSEY で plan の commit が通った
  derived_from:
    - PJR-6DHY
---

# PJR-283N 夜間の承認の印がない個票の plan に空行が重なり、register の run の commit が止まる

## 1. 課題内容

6DHY で xep-register-template に _AUTOPILOT_CONSTRAINTS_ の段落を足した。夜間の承認の印（autopilot）がない個票ではこれが空に展開され、前後の空行と合わせて空行が 3 行続く。plan を commit する pre-commit の hook が markdownlint の MD012 で落ちるため、6DHY の統合（2026-10-19 01:18）の後の exec run --register は記帳の commit で止まる（01:34 の PJR-JSEY で確認）

## 2. 影響範囲

| 観点         | 影響                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| スコープ     | `docs/ja/specdojo/exec-templates/xep-register-template.md`、`src/exec/register.ts`（register の plan の生成） |
| スケジュール | 高い。6DHY の統合の後、`exec run --register` の記帳の commit がすべて止まる                                   |
| コスト       | 止まった run を、修正の後に流し直す手間                                                                       |
| 品質         | plan の Markdown が規約に合わない                                                                             |
| 関係者       | `exec run --register` の利用者、夜間の自動実行                                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 雛形の `_AUTOPILOT_CONSTRAINTS_` の段落が、夜間の承認の印がない個票では空に展開され、前後の空行と合わせて空行が 3 行続く |
| 対応策   | 空に展開される段落があっても、生成した plan に空行が 2 行以上続かないようにする                                          |
| 依存事項 | なし                                                                                                                     |
| 完了条件 | 下記の完了条件を満たす                                                                                                   |

### 3.1. 完了条件

- 夜間の承認の印がない個票と、ある個票の両方で、`exec plan --register` が作る plan に空行が 2 行以上続かない。register の plan 以外（schedule・job など）の雛形にも、空に展開されて空行が重なる箇所がないかを確かめ、あれば同じく直す。
- どう直したか（雛形の置き方を変える、展開の後に空行をまとめる、など）と理由を result に書く。
- 単体テストで、印がない個票と、ある個票から作った plan に空行が 2 行以上続かないことを確かめる。
- この修正の run の plan も、修正前の runner が作るため空行が重なる。統合は orchestrator が plan の空行を直してから行うので、executor はそのまま完了してよい。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変える場合は、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG は、未公開の版の節（なければ `## [0.4.1] - 未定` を作る）に書く。公開済みの版の節は変えない。

## 4. 対応結果

- 解決内容: orchestrator の hotfix（`src/exec/register.ts` の register の plan だけで空行をまとめる処理）を、全雛形が通る `expandTemplate`（`src/shared/text.ts`）へ移した。展開の後に、2 行以上続く空行を 1 行にまとめる。雛形の置き方を変える方法は、空に展開されうる placeholder が多いため採らなかった。生成された plan は `.prettierignore` で整形の対象外になっていて、Prettier では空行がまとまらない。展開の 1 か所でまとめれば、今後足す雛形でも同じ事故を防げる。
- ほかの雛形の確認: agent の Job の plan（`xep-job-template.md` の `_JOB_EXECUTION_`）、保守系の approach の plan（`_PROJECT_CONTEXT_`）、`_GRADE_FINDINGS_`・`_DONE_CRITERIA_GOALS_` などでも、空に展開されると空行が重なりうる。どれも `expandTemplate` を通るため、同じ修正で直る。
- 確認結果: 単体テストを足した。register の plan では、印のある個票とない個票の両方で、生成した plan に空行が 2 行以上続かず MD012 も出ないことを確かめる。Prettier の整形の対象外という条件は、本番に合わせてテストでもそろえた。`expandTemplate` には、空の placeholder の前後の空行がまとまることと、全 exec 雛形で単独行の placeholder を空にしても空行が重ならないことのテストを足した。どのテストも、修正を外すと失敗することを確かめた。
- 再発防止策: 全雛形のテストで、単独行の placeholder を足した雛形も自動で検査の対象になる。

## 5. 関連ドキュメント

- [[prj-0001:pjr-6dhy-night-orchestrator-approved-queue]]（元の項目）
