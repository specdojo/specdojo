---
specdojo:
  id: prj-0001:pjr-x3e8-test-git-env-bare-repository
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-22T08:14:13Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-22T08:19:18Z"
  conclusion: テストの git 実行へ gitEnvironment() を渡し、hook 由来の GIT_DIR を除去した。GIT_DIR が linked worktree の gitdir を指す状態で git init を実行すると、その gitdir が bare として再初期化され共有 config へ core.bare=true が書き込まれることを再現実験で特定し、修正後は同条件でも変化しないことを確認した。テストから git を扱う際の規約も vitest.instructions.md へ明記した。
---

# PJR-X3E8 テストの git 実行が環境を隔離せず、メインリポジトリを bare 化する

## 1. 課題内容

PJR-T1JW で追加した exec-agent-protected-config のテストが、git 実行時に gitEnvironment() を経由していなかった。lefthook の pre-commit が npm test を実行する経路では git が GIT_DIR を設定するため、worktree 内での commit 時は GIT_DIR が linked worktree の gitdir を指す。その状態で git init を実行すると、cwd の一時ディレクトリではなく GIT_DIR 側が bare として再初期化され、共有されているメインリポジトリの config へ core.bare=true が書き込まれる。PJR-ZJZD の実行でこれが発火し、統合処理が this operation must be run in a work tree で失敗した。

## 2. 影響範囲

| 観点         | 影響                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| スコープ     | worktree 内で commit を伴う exec 実行すべて。発火するとメインリポジトリで作業ツリー操作（status / commit / merge）が不能になる |
| スケジュール | PJR-ZJZD は executor と reporter が成功した後の統合で失敗し、手動復旧と原因調査が必要になった                                  |
| コスト       | 追加の外部コストはなく、影響は復旧と調査の作業時間。ただし原因が分からないまま再実行すると被害が繰り返される                   |
| 品質         | 成果物は失われないが、リポジトリが壊れた状態で後続の自動処理が連鎖的に失敗する                                                 |
| 関係者       | ARC（実装・運用）。exec を実行する運用者                                                                                       |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | テストの `git init` が `gitEnvironment()` を経由せず、hook 由来の `GIT_DIR` を引き継いだため。`GIT_DIR` が linked worktree の gitdir を指す状態の `git init` は、その gitdir を bare として再初期化する |
| 対応策   | 当該テストの git 実行へ `env: gitEnvironment()` を渡す。あわせてテストから git を実行する際の規約を `vitest.instructions.md` へ明記する                                                                 |
| 依存事項 | なし                                                                                                                                                                                                    |
| 完了条件 | 危険な条件（`GIT_DIR` に worktree の gitdir を設定した状態）で当該テストを実行しても `core.bare` が変化しないこと。テスト内の git 実行がすべて `gitEnvironment()` を経由していること                    |

## 4. 対応結果

解決内容:

- `tests/src/exec-agent-protected-config.test.ts` の `initRepository` が行う 3 つの git 実行へ `env: gitEnvironment()` を渡し、`GIT_DIR` と `GIT_WORK_TREE` を除去した。なぜ必要かをコメントで明記した。
- `.github/instructions/vitest.instructions.md` の `ファイル I/O と一時ディレクトリ` へ、テストから git を実行する場合は `cwd` を一時ディレクトリに指定したうえで必ず `env: gitEnvironment()` を渡す旨と、その理由を追記した。
- テスト内の他の git 実行はすべて `gitEnvironment()` を経由していることを確認した。

確認結果:

- 一時リポジトリでの再現実験により、`GIT_DIR` が linked worktree の gitdir を指す状態の `git init` だけが `core.bare = true` を書き込むことを特定した。`GIT_DIR` がメインの `.git` を指す場合は発生しない。
- 修正後、`GIT_DIR` に実際の worktree gitdir を設定して当該テストを実行し、`core.bare` が `false` のまま変化しないことを確認した。
- 壊れたメインリポジトリは `git config core.bare false` で復旧し、`git fsck` で破損がないこと、コミット履歴と各 worktree が無事であることを確認した。

再発防止:

- 規約への明記により、今後テストで git を扱う際に同じ経路を再現しにくくする。
- 単独実行では再現せず hook 経由でのみ発火するため、`npm test` を伴う commit を worktree で行う経路が実質的な検証となる。

### 追記（対処が不十分であったこと）

本項目の対処は当該テストの個別修正と規約の追記に留まり、agent 起動環境そのものが `GIT_DIR` などを子プロセスへ渡していた点を修正していなかった。そのため PJR-5YW6 の実行で同種の事象が再発した。根本原因の特定と、予防（全 agent 起動の環境隔離）および検知（HEAD と local config の前後比較）の実装は [[prj-0001:pjr-a99j-agent-git-isolation-breach|PJR-A99J agentのgit操作が実リポジトリを破壊する事象が再発した]] で行った。

原因を「テストが `GIT_DIR` を継承したこと」と結論づけた際に、なぜ `GIT_DIR` が設定されていたのかを追わずに閉じたことが、再発を許した判断上の誤りである。

## 5. 関連ドキュメント

- 原因となった変更: [[prj-0001:pjr-t1jw-protected-config-gitignore-false-positive|PJR-T1JW 設定変更ガードが gitignore 済み生成物を誤検知する問題を解消する]]
- 発火した実行: [[prj-0001:pjr-zjzd-dct-index-nested-groups|PJR-ZJZD dct-index にサブグループ階層を追加し、成果物リファレンスの節構成へ揃える]]
- 環境隔離の実装: `src/exec-worktree.ts` の `gitEnvironment`
- 追記した規約: `.github/instructions/vitest.instructions.md`
