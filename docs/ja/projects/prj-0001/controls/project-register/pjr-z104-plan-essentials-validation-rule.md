---
specdojo:
  id: prj-0001:pjr-z104-plan-essentials-validation-rule
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-18T12:23:00Z"
  completed_at: "2026-10-18T13:04:52Z"
  conclusion: 共通の規約の要点に検査の扱い（適用条件で流す検査を決め、当てはまらない検査は not_applicable と理由、not_run は流せたのに流さなかった検査に限る）を移し、詳細側は要点を参照する形にした。6EF8 とあわせて、npm init -y で作った空のリポジトリで 0.4.0 の tarball の最初の実行が close まで通った
  derived_from:
    - PJR-2219
---

# PJR-Z104 plan の要点に検査の扱いがなく、新しいリポジトリの最初の実行が止まる

## 1. 課題内容

2219 で plan の共通の規約を参照へ改めた後、plan の本文に残す要点に検査の扱い（当てはまる検査を流し、当てはまらない検査は not_applicable と理由を報告する）が入っていない。0.4.0 の tarball を空のリポジトリへ入れて exec run --register --worktree を流すと、executor（sonnet-executor）は参照先を読まずに command none・not_run と報告し、runner は executor validation failed or not run で waiting にした（2026-10-18）。0.3.1 では同じ手順で通っていた

## 2. 影響範囲

| 観点         | 影響                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| スコープ     | `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` の要点（`plan-essentials` の間） |
| スケジュール | 高い。0.4.0 の公開を止める。新しく導入した利用者の最初の実行が必ず止まる                              |
| コスト       | 利用者が原因を調べて手で再開する手間                                                                  |
| 品質         | 検査の扱いが plan の本文から抜け、executor が参照先を読まないと検査の報告を誤る                       |
| 関係者       | 0.4.0 を導入する利用者                                                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 2219 で plan の本文に残す要点を選んだとき、検査の扱いの規則（適用条件を確かめ、当てはまらない検査は `not_applicable` と理由を記録し、`not_run` は流せたのに流さなかった検査に限る）を要点に入れなかった。executor が参照先を読まないと、検査の報告を誤る |
| 対応策   | 検査の扱いの規則を要点に入れる。検査の一覧の表は参照先に残し、適用条件は参照先の表で決めることを要点に書く                                                                                                                                               |
| 依存事項 | なし                                                                                                                                                                                                                                                     |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                   |

### 3.1. 完了条件

- 共通の規約の断片の要点（`plan-essentials` の間）に、次を入れる。要点の中でも詳細の中でも同じ規則を 2 か所に書かず、原本は 1 か所にする。
  - 検査を流す前に `package.json` と hook の設定を読み、参照先の表の適用条件で、流す検査を決めること。
  - 当てはまらない検査は流さず、`not_applicable` と理由を報告すること。当てはまる検査が 1 つもない場合も同じとすること。
  - `not_run` は、流せたのに流さなかった検査にだけ使うこと（runner は `not_run` を失敗と扱う）。
- 要点は、守らないと失敗に直結するものに限る方針を保つ。検査の一覧の表は参照先に残す。
- 単体テストで、生成した plan の要点に検査の扱いの規則が入っていることを確かめる。
- npm script も Markdown の lint もない空のリポジトリで、`exec run --register --worktree` の最初の実行が `review` まで進むことを確かめる（orchestrator が tarball で行う。executor の sandbox で行えない場合は `requires_human` とする）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.0] - 未定` の節で、2219 の記載に合わせて直すか書き足す。公開済みの版の節は変えない。

## 4. 対応結果

- 解決内容: `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` の要点（`plan-essentials` の間）に、検査の扱いの規則を 3 項目で加えた（`package.json`・`.specdojo/specdojo.config.json`・hook 設定を読み、詳細の検査表の適用条件で実行する検査を決める／当てはまらない検査は `not_applicable` と理由を記録し、当てはまる検査が 1 つもない場合も同じ／`not_run` は実行できたのに実行しなかった検査だけに使い、runner は失敗と扱う）。詳細側の同じ規則は要点を参照する一文に改め、原本を要点の 1 か所にした。検査の一覧の表は詳細に残した。
- 確認結果: `tests/src/exec/plans.test.ts` に、生成した edit plan の本文へ検査の扱いの規則が入ることを確かめる検査を加えた。親の検証（`typecheck`・`lint-ts`・`test-unit` ほか）は runner が実行する。空のリポジトリで `exec run --register --worktree` の最初の実行が `review` まで進むことの確認は、orchestrator が tarball で行う（executor の sandbox では行えない）。
- 再発防止策: 要点に残す規則を単体テストで固定し、要点から検査の扱いが抜けると単体テストが失敗するようにした。CHANGELOG の 0.4.0 の節に、2219 の記載へ続けて追記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2219-exec-plan-conventions-reference]]（元の項目）
- [[prj-0001:pjr-hzw3-release-v0-4-0]]（0.4.0 の公開）
