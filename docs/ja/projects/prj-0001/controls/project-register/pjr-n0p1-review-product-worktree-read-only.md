---
specdojo:
  id: prj-0001:pjr-n0p1-review-product-worktree-read-only
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-11-21T02:09:29Z"
  derived_from:
    - PJR-08EK
---

# PJR-N0P1 review の段でもプロダクトの worktree への書き込みを許している

## 1. 課題内容

exec の review の段の agent に、プロダクトの worktree への edit の許可（opencode の注入、claude の Edit など）が edit の段と同じく渡る。review は読み取りだけで足りるため、読み取りに絞るかを調べる

## 2. 入力

- 2026-11-21、OpenFisca-Japan-specdojo（0.7.0）の回避策との照合で見つけた。回避策では review-executor に読むための `external_directory` だけを足し、edit は許していない
- src/exec/task-repos.ts の withAgentExtraRoots は mode を見ず、src/exec/run/agent.ts・src/exec/worktree-command.ts・src/exec/run/in-place.ts から、review の段でもプロダクトの worktree を書き込みの root として渡している
- review の段が書き込むのは project の worktree（個票・review の result・evidence）で、これは agent の定義の edit の規則で許されており、この件の対象ではない
- 調べること: review の段でプロダクトの worktree を読み取りだけにできるか（provider ごと）。review の段でプロダクトに変更が出たときに runner がすでに止めているなら、それを確かめて閉じる

## 3. 影響範囲

| 観点         | 影響                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| スコープ     | exec の review の段で agent に渡す、プロダクトの worktree への権限                      |
| スケジュール | なし                                                                                    |
| コスト       | 小さい（runner と CLI の一部の修正）                                                    |
| 品質         | review の agent がプロダクトを書き換えても止まらないおそれがある                        |
| 関係者       | 利用者のプロジェクト（coderdojo-lessons-specdojo など）と prj-0001 のオーケストレーター |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
