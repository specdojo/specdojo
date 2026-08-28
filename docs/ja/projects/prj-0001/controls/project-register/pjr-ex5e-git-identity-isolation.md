---
specdojo:
  id: prj-0001:pjr-ex5e-git-identity-isolation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-26T15:20:09Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-26T22:33:54Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-git-state-write: Git state changes detected; fields=HEAD, local-config; agent must leave commits and repository configuration ch…"
  conclusion: テストが直接実行していた git config user.name / user.email を全廃し、共通の TEST_GIT_ENVIRONMENT を worker と子プロセスへ渡して identity を供給する方式へ変更した。config へ書き込む限り書き込み先を誤れば同じ事故が起きるため、そもそも config を変更しない方式を選んだ。実リポジトリの local config へ identity が書き込まれないことを検証するテストを追加し、テスト実行後も user.name / user.email が0件であることを確認した。PJR-A99J の検知機構は変更しておらず、検知を弱めずに漏洩経路を塞いだ。過去のコミット1,877件は履歴の改変になるため author を書き換えていない。
  register_events:
    - v: 1
      id: reg_72ddc555d96ff16f73df51a023fc1f82
      ts: "2026-08-26T15:22:21Z"
      action: add
      actor: naoji3x
      from_status: null
      to_status: open
      reason: "docs(register): PJR-EX5E と PJR-ENK0 を起票する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: テストとagentによるgit identity設定が実リポジトリへ及ぶ経路を隔離する
        - field: description
          from: ""
          to: PJR-07M5 の実行で agent が git の local config（user.name / user.email）を設定しようとし、PJR-A99J の検知機構が作動して停止した。検知は正しく働き実リポジトリへの影響はなかったが、設定しようとする経路自体は残っている。あわせて本体リポジトリの local config にテスト用の識別情報が残っており、global 設定を上書きしていた。その結果、複数のコミットがテスト用の author で記録されている。tests 配下に git config user.name を実行する箇所が複数あり、隔離されていない経路を特定して塞ぐ。過去のコミットの author は履歴の改変になるため書き換えない。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-27"
        - field: due
          from: ""
          to: "2026-09-30"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: c14ab796eb88bff66c1ebb7b7abeaa6fcdfc2519
    - v: 1
      id: reg_991d43dba378c053da1d2ba00b5c1275
      ts: "2026-08-26T15:38:46Z"
      action: start
      actor: naoji3x
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-EX5E): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 6177648e1d8e289877edf58140ccec33103f69df
      previous_event_id: reg_72ddc555d96ff16f73df51a023fc1f82
    - v: 1
      id: reg_562b3f269be41b695532baacd8463c0b
      ts: "2026-08-26T15:46:39Z"
      action: wait
      actor: naoji3x
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-EX5E): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: block_reason
          from: "-"
          to: "agent exited with non-zero code: agent exited with non-zero code: agent-git-state-write: Git state changes detected; fields=HEAD, local-config; agent must leave commits and repository configuration ch…"
      legacy_commit: 06ff5b21cca268f4a3ce6bd89dac16b02756ec5b
      previous_event_id: reg_991d43dba378c053da1d2ba00b5c1275
    - v: 1
      id: reg_5665cfbf9c2eafa343373ddd05f7b2c6
      ts: "2026-08-26T15:51:10Z"
      action: review
      actor: naoji3x
      from_status: waiting
      to_status: review
      reason: "exec(register PJR-EX5E): review"
      changes:
        - field: status
          from: waiting
          to: review
      legacy_commit: 260b177e2ea9e12a684c1df9335aac90be797708
      previous_event_id: reg_562b3f269be41b695532baacd8463c0b
    - v: 1
      id: reg_e65f2edb3ab2128b739b5ebae4e6ee9d
      ts: "2026-08-26T22:35:41Z"
      action: close
      actor: naoji3x
      from_status: review
      to_status: done
      reason: "docs(register): PJR-EX5E をクローズし PJR-44CW を起票する"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-27"
        - field: conclusion
          from: "-"
          to: テストが直接実行していた git config user.name / user.email を全廃し、共通の TEST_GIT_ENVIRONMENT を worker と子プロセスへ渡して identity を供給する方式へ変更した。config へ書き込む限り書き込み先を誤れば同じ事故が起きるため、そもそも config を変更しない方式を選んだ。実リポジトリの local config へ identity が書き込まれないことを検証するテストを追加し、テスト実行後も user.name / user.email が0件であることを確認した。PJR-A99J の検知機構は変更しておらず、検知を弱めずに漏洩経路を塞いだ。過去のコミット1,877件は履歴の改変になるため author を書き換えていない。
      legacy_commit: 093801a97d1af7023d0ff0d216565ea814d337f3
      previous_event_id: reg_5665cfbf9c2eafa343373ddd05f7b2c6
---

# PJR-EX5E テストとagentによるgit identity設定が実リポジトリへ及ぶ経路を隔離する

## 1. 概要

PJR-07M5 の実行で agent が git の local config（user.name / user.email）を設定しようとし、PJR-A99J の検知機構が作動して停止した。検知は正しく働き実リポジトリへの影響はなかったが、設定しようとする経路自体は残っている。あわせて本体リポジトリの local config にテスト用の識別情報が残っており、global 設定を上書きしていた。その結果、複数のコミットがテスト用の author で記録されている。tests 配下に git config user.name を実行する箇所が複数あり、隔離されていない経路を特定して塞ぐ。過去のコミットの author は履歴の改変になるため書き換えない。

## 2. 完了条件

- テストが実行する `git config user.name` / `user.email` が、実リポジトリの設定へ影響しない。一時ディレクトリ内に限定される。
- agent が git identity を設定しようとする経路が特定され、必要なら worktree 内に限定するか、設定なしでも動作するようにする。
- 実リポジトリの local config に `user.name` / `user.email` が設定されていない状態を保てる。global 設定が使われる。
- 上記が守られなかった場合、PJR-A99J の検知機構が引き続き作動する。検知を弱めない。
- 過去のコミットの author は書き換えない。履歴の改変になるため対象外とする。影響範囲（テスト用 author で記録されたコミットの範囲）を記録するに留める。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- `tests/src/exec-agent-protected-config.test.ts` と `tests/src/exec-agent-git-state.integration.test.ts` が `git config user.name` / `user.email` を実行している。前者は PJR-X3E8 で `env: gitEnvironment()` を渡す修正を受けたが、identity 設定の隔離までは扱っていない。
- 実リポジトリの local config にテスト用の識別情報（`SpecDojo Test` / `specdojo@example.invalid`）が残っており、global 設定（`naoji3x`）を上書きしていた。オーケストレーターが `git config --local --unset` で削除した。
- 削除前に作成されたコミットの author はテスト用の名前で記録されている。push 済みの分を含む。
- PJR-07M5 の実行では、agent が identity を設定しようとして PJR-A99J の検知機構が作動し停止した。実リポジトリへの影響はなかった。検知は正しく機能している。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------------------------ | ---- | ---- | -------------------------------- |
| 1   | テストの git identity 設定が実リポジトリへ及ぶ経路を特定する | ARC  | done | Vitest 3設定とE2E toolへ集約した |
| 2   | 一時ディレクトリ内に限定するか、設定なしで動作するようにする | ARC  | done | process環境だけへidentityを注入  |
| 3   | agent が identity を設定しようとする経路を確認し対処する     | ARC  | done | executor promptで親管理を明示    |
| 4   | 影響を受けたコミットの範囲を記録する                         | ARC  | done | 1,877件を記録し履歴は維持した    |

## 4. 対応結果

テストで直接実行していた`git config user.name` / `user.email`を全廃した。Vitestの3設定は共通の`TEST_GIT_ENVIRONMENT`をworkerと子プロセスへ渡し、author / committer identityと`commit.gpgsign=false`をprocess環境だけに限定する。`tools/e2e/exec-run-e2e.ts`も同じ方式へ変更した。fixture commit後のlocal configにidentityがないことと、commit authorがテスト用identityになることを統合テストで確認する。

PJR-07M5でagentがidentityを設定しようとした経路はexecutor stageであった。executor promptへ、commitとrepository設定は親runnerが所有し、agentは`git commit`およびlocal / global / system config（`user.name` / `user.email`を含む）を変更しないという契約を追加した。既存のPJR-A99JによるHEAD・local config前後比較は変更せず、違反時に親検証・reporter・commit・mergeより前でblockする検知を維持した。

履歴は書き換えていない。`git log --all`で`SpecDojo Test <specdojo@example.invalid>`を監査した時点では、2026-06-24T11:23:30Zの`2beff3bd`から2026-08-26T23:52:19+09:00の`c36541a8`まで1,877 commitが該当した。全refを対象とした観測件数であり、既存branchの削除やauthorの修正は行わない。対応後の実repositoryではlocalの`user.name` / `user.email`が未設定で、globalの`naoji3x <naoji.3x@gmail.com>`が有効であることを確認した。残課題はない。

## 5. 関連ドキュメント

- 検知機構を実装した項目: [[prj-0001:pjr-a99j-agent-git-isolation-breach|PJR-A99J agentのgit操作が実リポジトリを破壊する事象が再発した]]
- 1回目の事象: [[prj-0001:pjr-x3e8-test-git-env-bare-repository|PJR-X3E8 テストのgit実行でリポジトリがbareになる]]
- 検知が作動した実行: [[prj-0001:pjr-07m5-trial-validation-completeness|PJR-07M5 trialで親検証が実行されず成果の検証が不完全になる問題を解消する]]
- テストでのgit実行規約: `.github/instructions/vitest.instructions.md`
