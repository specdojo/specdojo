---
specdojo:
  id: prj-0001:pjr-7mf6-parallel-register-run-integration
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T07:26:49Z"
  due_on: null
  completed_at: "2026-10-05T21:58:45Z"
  conclusion: 並列実行で片方が失敗しても失敗の遷移をそれぞれ commit し、他の項目の統合を妨げないようにした。2026-10-05 の第1陣（3並列）で、3件とも失敗した際に遷移が個別に commit され統合が妨げられないことを実地で確認した
---

# PJR-7MF6 並列の register 実行で、失敗した項目の遷移が他の項目の統合を妨げる

## 1. 課題内容

exec run --register A B --worktree --parallel 2 で A が親検証に失敗すると、A の waiting への遷移と plan・result がメインの作業ツリーに未 commit のまま残り、B の統合の git merge が「ローカルの変更が上書きされる」で失敗する（2026-10-04 の PJR-DAW8 と PJR-KEQQ）。resume では2件の統合 commit が同時に走り、pre-commit の全テストが並行して失敗した。直列に resume し直すと成功した

## 2. 影響範囲

| 観点         | 影響                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| スコープ     | `--parallel` を使う register 実行。1件の失敗が、成功した他の項目の統合を止める  |
| スケジュール | 成功した項目が waiting になり、手動で遷移を commit して resume し直す必要がある |
| コスト       | 手作業の立て直しと、再実行の待ち時間                                            |
| 品質         | 成果物は worktree に残り失われないが、状態が事実と食い違う                      |
| 関係者       | DEV、register を並列実行する利用者                                              |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 失敗した項目の waiting への遷移・plan・result をメインの作業ツリーへ書いたまま commit しない。統合の merge と commit（pre-commit の全テストを含む）を項目ごとに直列化していない     |
| 対応策   | 失敗時の遷移も成功時と同じく register lifecycle の枠で commit する。統合（merge・commit）を項目間で直列化し、他の項目の未 commit の変更で merge が失敗しないようにする              |
| 依存事項 | [[prj-0001:pjr-d0kf-exec-register-worktree-default]]（worktree の既定化で並列実行が増える）                                                                                         |
| 完了条件 | `--parallel 2` で片方が失敗しても、もう片方が統合と commit まで成功する。2件が同時に統合に達しても順に commit される。integration test で再現と修正を確認し、`npm run check` が通る |

## 4. 対応結果

失敗時の root への反映対象を、runner が生成する plan・result に限定した。個票と event は
root に残る検証済み checkpoint 版を基準に `waiting` へ遷移・commit し、親検証で検出された
未検証の個票本文は exec worktree に保持する。wait commit を exec branch へ同期するときは、
root の lifecycle frontmatter と exec worktree の個票本文を合成するため、再開に必要な作業内容を
失わない。

あわせて、片方の親検証が失敗し、その個票を commit hook が拒否する条件でも、もう片方が
`review` への遷移と統合 commit を完了できる integration test を追加した。テスト内の排他 marker
により、項目ごとの commit が同時に走らないことも確認する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-daw8-register-commit-header-length]]: 観測した実行（親検証の失敗で waiting）。
- [[prj-0001:pjr-keqq-devcontainer-template-volumes]]: 統合が妨げられた実行。
- [[prj-0001:pjr-d0kf-exec-register-worktree-default]]
