---
specdojo:
  id: prj-0001:pjr-a7cr-night-register-integrate-and-report-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-11T13:31:51Z"
  derived_from:
    - PJR-MJEH
  commit_type: fix
  commit_scope: exec
---

# PJR-A7CR 夜間の register の統合と朝報告を、job の worktree の検査に通す

## 1. 概要

merge のときの commit-msg の hook と、朝報告の frontmatter・見出しを直し、夜間の routine を最後まで通す

## 2. 入力

- PJR-MJEH の修正。0.8.0 に含める（indie が 2026-11-11 に承認）

## 3. 完了条件

- PJR-MJEH の 2 つの原因を確かめ、個票の対応結果に書いている。
  - job の worktree への `git merge --no-ff -m` が、commit-msg の hook（`lefthook.yml` の `npx commitlint --edit $1`）で `.git/worktrees/<job>/COMMIT_EDITMSG` が見つからないと失敗する理由。主の作業ツリーで通るのは古い `COMMIT_EDITMSG` が残っているためか、merge のメッセージを正しく検査しているかも確かめる。
  - `orchestrator night` の朝報告（`execution/reports/night-orchestrator/`）が lint-fm（`type: report` が値の一覧にない・`rulebook` がない）で落ちる理由。見出しの連番など lint-md の決まりにも合っているかを確かめる。
- merge の commit が、主の作業ツリーでも linked worktree でも、その merge のメッセージを commitlint で検査して通る。hook の設定（`lefthook.yml`・`tools/` の hook の入口）など保護された設定の変更が要る場合は executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- 朝報告が frontmatter の schema と Markdown の決まりに合い、`npm run lint:fm`・`npm run lint:md` に通る。schema や型の一覧を変える場合は、既存の文書への影響を確かめている。
- 回帰テストを足している（linked worktree での merge のメッセージの検査、朝報告の frontmatter の検査など）。
- 関連する設計・ガイドを、振る舞いの変化に合わせて直している。
- 修正の後に夜間の register の routine を実際に 1 回流し（PJR-JSEY を使う）、統合と job の review の段まで通ることを確かめ、`rtn-night-approved-register` を有効に戻すのは orchestrator が行う（executor の作業ではない）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run lint:fm` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                           | 担当         | 状態 | メモ |
| --- | ---------------------------------------------- | ------------ | ---- | ---- |
| 1   | 2 つの原因を確かめる                           | executor     | open | -    |
| 2   | 直して回帰テストを足す                         | executor     | open | -    |
| 3   | 保護された設定の変更案を反映する（要る場合）   | orchestrator | open | -    |
| 4   | 夜間の routine を 1 回流して確かめ、有効に戻す | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-mjeh-night-register-integrate-and-report-checks]]
- [[prj-0001:pjr-0x0s-night-register-child-run-env-isolation]]
