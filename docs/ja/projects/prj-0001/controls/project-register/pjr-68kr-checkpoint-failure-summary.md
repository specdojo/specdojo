---
specdojo:
  id: prj-0001:pjr-68kr-checkpoint-failure-summary
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T13:41:13Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-24T22:44:05Z"
  conclusion: 着手の checkpoint・待ち状態の記帳・統合の commit のすべてで、hook の失敗の要約に PJR-0EFN と同じ処理を使い、lefthook の summary で失敗の印が付いた step と最初の error の行を挙げるようにした
---

# PJR-68KR checkpoint の commit の失敗の要約が、失敗していない step を挙げる

## 1. 課題内容

着手の checkpoint と待ち状態の記帳の commit が hook で失敗したとき、runner の要約と `block_reason` が、成功した prettier の step を失敗として挙げる。

- 起きたこと: 着手の checkpoint の commit が失敗したとき、要約と `block_reason` は `format documentation and configuration: Checking formatting...` だった。
- 実際: lefthook の summary では prettier の step（format documentation and configuration）は成功し、失敗の印が付いたのは markdownlint の step（lint Markdown documentation）だった。
- 0.4.1 の PJR-0EFN で直した要約の処理が、着手の checkpoint と待ち状態の記帳の commit では使われていないように見える（報告時の見立て）。
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）のPJR-7W1M（[[prj-0001:pjr-ss72-maintenance-plan-md036]] と同じ run で起きた）。

## 2. 影響範囲

| 観点         | 影響                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| スコープ     | runner の commit の失敗の報告（着手の checkpoint、待ち状態の記帳）          |
| スケジュール | 作業は止めないが、原因の特定に evidence の `integrate.log` を読む必要がある |
| コスト       | 誤った step を先に調べる手間がかかる                                        |
| 品質         | `block_reason` に誤った原因が残る                                           |
| 関係者       | exec run の失敗を調べる利用者                                               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 未確定。要約が hook の出力の最初の step を挙げているように見える                                                                                                    |
| 対応策   | 着手の checkpoint と待ち状態の記帳の commit でも、PJR-0EFN の要約の処理を使い、lefthook の summary で失敗の印が付いた step と最初の error の行を挙げる              |
| 依存事項 | なし                                                                                                                                                                |
| 完了条件 | 着手の checkpoint と待ち状態の記帳の commit が hook で失敗したとき、要約と `block_reason` に失敗した step の名前と error の行が出る。この条件を確かめる test がある |

### 3.1. 完了条件（追記）

- v0.4.6 の範囲とする（2026-10-24、利用者が承認）。上の表の完了条件を満たす。
- 着手の checkpoint・待ち状態の記帳・統合の commit のすべてで、hook の失敗の要約に同じ処理（PJR-0EFN の処理）を使う。lefthook の summary で失敗の印が付いた step と、その step の最初の error の行を挙げる。
- 単体テストで、成功した step（prettier など）の出力が先にあり、失敗した step（markdownlint など）が後にある hook の出力から、失敗した step が選ばれることを確かめる。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ss72-maintenance-plan-md036]]：同じ run で起きた不具合
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）のPJR-7W1M
