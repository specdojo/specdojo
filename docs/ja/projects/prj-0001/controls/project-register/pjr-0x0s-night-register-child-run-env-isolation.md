---
specdojo:
  id: prj-0001:pjr-0x0s-night-register-child-run-env-isolation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-11T11:57:33Z"
  derived_from:
    - PJR-RX14
  commit_type: fix
  commit_scope: exec
---

# PJR-0X0S 夜間の register の子の run に job の worktree の環境が漏れないようにする

## 1. 概要

orchestrator night から起動する子の exec run の worktree の置き場所と git の環境を、job の worktree から切り離す

## 2. 入力

- PJR-RX14 の修正。v0.8.0 に含める（indie が 2026-11-11 に承認）

## 3. 完了条件

- PJR-RX14 の原因（子の run の worktree が job の worktree の下に入れ子になる置き場所の求め方と、job の worktree から引き継ぐ git の環境変数のどちらで、または両方で落ちるか）を確かめ、個票の対応結果に書いている。
- orchestrator night（job の worktree の中）から起動した子の exec run の worktree が、主の作業ツリーから起動したときと同じ置き場所に作られ、入れ子にならない。
- 子の run の plan・result・実行記録が統合の後に統合先のブランチへ入り、入れ子の worktree に残らない。
- 子の run の git の操作と親の検証は、job の worktree の環境変数を引き継がない。git の環境は `src/shared/git-environment.ts` の `gitEnvironment()` を正本として隔離する。
- job の worktree の中から子の run を起動したときの置き場所と環境の隔離を、回帰テストで確かめている。job の worktree から起動しても `tests/src/exec/job-worktree.integration.test.ts` が通る。
- 関連する設計・ガイドを、振る舞いの変化に合わせて直している。
- 修正の後に夜間の register の routine を実際に 1 回流して確かめ、`rtn-night-approved-register` を有効に戻すのは orchestrator が行う（executor の作業ではない）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                           | 担当         | 状態 | メモ |
| --- | ---------------------------------------------- | ------------ | ---- | ---- |
| 1   | 原因を確かめる                                 | executor     | open | -    |
| 2   | 置き場所と環境を隔離し、回帰テストを足す       | executor     | open | -    |
| 3   | 夜間の routine を 1 回流して確かめ、有効に戻す | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-rx14-night-register-env-leak]]
