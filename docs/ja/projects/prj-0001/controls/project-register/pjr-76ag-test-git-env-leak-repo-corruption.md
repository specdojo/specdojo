---
specdojo:
  id: prj-0001:pjr-76ag-test-git-env-leak-repo-corruption
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-08-28T10:10:24Z"
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_90a1afff79f74d12b5be0a023c4ef88e
      ts: "2026-08-28T10:10:24Z"
      action: add
      actor: manual
      from_status: null
      to_status: open
      reason: item added
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: テストがgitフック配下でGIT_DIRを引き継ぎ実リポジトリを破壊する事故が3度目の再発をした
        - field: description
          from: ""
          to: PJR-TPY9 の実行結果をコミットした際、lefthook の pre-commit が npm test を起動し、その中で新規追加されたテストが一時ディレクトリのつもりで git init / add / commit を実行した。git フック配下では親の git が GIT_DIR / GIT_INDEX_FILE を環境変数へ設定するため、env を渡さずに git を起動すると実リポジトリへ適用される。共有 config へ core.bare=true と user.name=test が書き込まれ、worktree ブランチへ不正コミットが作られた。いずれも復旧済みで push 済み履歴には到達していない。PJR-X3E8、PJR-A99J に続く3度目の同型再発であり、規約の記述だけでは再発を止められないことが確認された。
        - field: type
          from: ""
          to: issue
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-28"
        - field: due
          from: ""
          to: "2026-09-30"
    - v: 1
      id: reg_92ffa34aa6a246619efcc2fd368c6fcd
      ts: "2026-08-28T10:21:02Z"
      action: start
      actor: codex-expert-executor
      from_status: open
      to_status: in-progress
      reason: work started
      changes:
        - field: status
          from: open
          to: in-progress
      previous_event_id: reg_90a1afff79f74d12b5be0a023c4ef88e
---

# PJR-76AG テストがgitフック配下でGIT_DIRを引き継ぎ実リポジトリを破壊する事故が3度目の再発をした

## 1. 課題内容

PJR-TPY9 の実行結果をコミットした際、lefthook の pre-commit が npm test を起動し、その中で新規追加されたテストが一時ディレクトリのつもりで git init / add / commit を実行した。git フック配下では親の git が GIT_DIR / GIT_INDEX_FILE を環境変数へ設定するため、env を渡さずに git を起動すると実リポジトリへ適用される。共有 config へ core.bare=true と user.name=test が書き込まれ、worktree ブランチへ不正コミットが作られた。いずれも復旧済みで push 済み履歴には到達していない。PJR-X3E8、PJR-A99J に続く3度目の同型再発であり、規約の記述だけでは再発を止められないことが確認された。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | テスト実行環境（`vitest.config.ts`、`tests/helpers/git-environment.ts`）、git を起動する全テスト、lefthook の pre-commit 構成                         |
| スケジュール | 直接の遅延はない。ただし復旧と調査で PJR-TPY9 の完了が中断した                                                                                        |
| コスト       | 事故のたびに復旧作業が発生する。今回は config 復旧・不正コミット破棄・被害範囲確認を要した                                                            |
| 品質         | 共有リポジトリの config と履歴が壊れる。`core.bare=true` により全 worktree が使用不能になり、汚染された identity でのコミットは後から書き換えられない |
| 関係者       | 全開発者と全 agent。フックを通る操作すべてが経路になる                                                                                                |

### 今回の被害と復旧（確定情報）

| 被害                                                                  | 復旧           |
| --------------------------------------------------------------------- | -------------- |
| 共有 config へ `core.bare=true`                                       | 済             |
| 共有 config へ `user.name=test` / `user.email=test@example.com`       | 済             |
| worktree ブランチへ不正コミット1件（`squashed register transitions`） | 済             |
| `project/prj-0001/develop` および push 済み履歴                       | 到達していない |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | テストプロセスが git フックから継承した `GIT_DIR` / `GIT_INDEX_FILE` / `GIT_WORK_TREE` を落としていない。個々のテストが `env` を渡し忘れると、一時ディレクトリでの git 操作が実リポジトリへ着弾する |
| 対応策   | テスト実行の入口で git の位置を決める環境変数を除去する。呼び出し箇所ごとの規約ではなく、環境そのものを無害化する                                                                                   |
| 依存事項 | なし。`vitest.config.ts` と `src/exec-worktree.ts` の `GIT_LOCAL_ENV_VARS` が既にある                                                                                                               |
| 完了条件 | 下記のとおり                                                                                                                                                                                        |

### 完了条件

- **テストプロセスで git の位置を決める環境変数が除去されている**。`GIT_DIR` を設定した状態で `npm test` を全件実行し、その `GIT_DIR` が指すリポジトリと実リポジトリのいずれも変化しないことを確認する。個々のテストの書き方に依存しないことが要件である。
- 除去する変数の一覧を二重に持たない。`src/exec-worktree.ts` の `GIT_LOCAL_ENV_VARS` を参照するか、共通の定義へ寄せる。
- **既存の identity 注入を壊さない**。`TEST_GIT_ENVIRONMENT` は PJR-EX5E の対策であり、`GIT_AUTHOR_*` / `GIT_COMMITTER_*` / `commit.gpgsign` は引き続き適用される必要がある。
- 現在の検査（`tests/src/git-environment-isolation.test.ts`）を、`env` が渡っているかではなく **`gitEnvironment()` が使われているか**まで見るよう強める。`env: process.env` を通さない。困難な場合は、なぜ強められないかを記録して代替を示す。
- TypeScript 以外からの git 起動の扱いが決まっている。シェルスクリプトや npm scripts は現在の検査の対象外である。フックから呼ばれる経路に限定するか、全体を対象にするかを判断して記録する。
- **3度再発した理由が個別に記録されている**。PJR-X3E8、PJR-A99J とも原因を直したと判断した後に再発した。それぞれで何を見落としたか、今回の対処がその見落としをどう塞ぐかを書く。
- 事故時の復旧手順が文書化されている。`core.bare` の復旧、汚染 config の除去、不正コミットの破棄、被害範囲（push 到達の有無）の確認方法を含める。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- 発生経路は agent の実行中ではなく、**人がコミットしたときの lefthook pre-commit の中**である。PJR-A99J で対処した agent 起動時の隔離とは別の経路である。
- git を起動する既存の13ファイルはすべて `gitEnvironment()` を経由していた。`tests/src/exec-agent-protected-config.test.ts` には今回とまったく同じ失敗を説明するコメントがある。**規約は存在していたが、新しいテストがそれを知らずに書かれた**。
- 暫定対処として `tests/src/git-environment-isolation.test.ts` を追加した。`src` / `tests` / `tools` / `scripts` の git 起動箇所で `env` が渡っていなければ失敗する。`env` を渡さないファイルを置くと実際に検出することを確認済みである。ただし `env: process.env` は通過する。
- 対処後、使い捨てリポジトリを `GIT_DIR` に指定して全1,386件のテストを実行し、その使い捨てリポジトリと実リポジトリのいずれも変化しないことを確認した。
- **対策の仕組みは既に存在し、片手落ちであった**。`vitest.config.ts` は `tests/helpers/git-environment.ts` の `TEST_GIT_ENVIRONMENT` を `test.env` へ渡している。これは PJR-EX5E（identity 混入）の対策で入ったもので、`GIT_AUTHOR_*` / `GIT_COMMITTER_*` / `commit.gpgsign` を注入する。しかし**リポジトリの位置を決める `GIT_DIR` / `GIT_INDEX_FILE` / `GIT_WORK_TREE` は落としていない**。ここを除去していれば、個々のテストの書き方に関係なく今回の事故は起きなかった。
- vitest の `test.env` は値の設定であり、既存の環境変数の削除に使えるかは未確認である。`setupFiles` で `process.env` から削除する方法とあわせて確認する。worker とその子プロセスに適用されればよい。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- 暫定対処を含む実装: [[prj-0001:pjr-tpy9-register-git-github|PJR-TPY9 Register履歴をGitコミット粒度から分離する]]
- 1度目の同型事故: [[prj-0001:pjr-x3e8-test-git-env-bare-repository]]
- 2度目の同型事故: [[prj-0001:pjr-a99j-agent-git-isolation-breach]]
- git identity の混入: [[prj-0001:pjr-ex5e-git-identity-isolation]]
- 検査の実体: `tests/src/git-environment-isolation.test.ts`、`src/exec-worktree.ts` の `gitEnvironment()`
