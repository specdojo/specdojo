---
specdojo:
  id: prj-0001:pjr-a99j-agent-git-isolation-breach
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-26T10:59:39Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-26T11:37:52Z"
  conclusion: 原因は PJR-X3E8 の対処が個別テストの隔離に留まり、agent 起動環境そのものが GIT_DIR などを子プロセスへ渡していたことであった。exec-run・exec-trial・exec-worktree-command の全 agent 起動を gitEnvironment 経由へ統一し、job と e2e ツールの直接 Git 実行も揃えた。あわせて exec-agent-git-state を新設し、agent の各試行の前後で HEAD と local config を比較して、差分があれば親検証・reporter・commit・merge へ進む前に失敗させる。予防と検知の2層とした。agent による commit と core.bare 変更の検知、および危険な GIT_DIR が agent へ継承されないことを確認する回帰テストを追加した。統合テストは83件へ増えた。
  register_events:
    - v: 1
      id: reg_72580f9f0cc78423bb7467231839e3f5
      ts: "2026-08-26T11:01:37Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): PJR-A99J agentのgit操作による実リポジトリ破壊を起票する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: agentのgit操作が実リポジトリを破壊する事象が再発した
        - field: description
          from: ""
          to: PJR-5YW6 の実行で、メインリポジトリの core.bare が true に変更され作業ツリーが操作不能になった。あわせて worktree へテスト用フィクスチャのコミット2件が混入し、docs/register-item.md という実在しないファイルが追加された。実装の成果はなく worktree は破棄した。同種の事象は PJR-X3E8 で一度発生しており、テストで git を扱う際は隔離した環境変数を渡す規約を設けたが、再発を防げていない。agent の git 操作が実リポジトリの設定と履歴へ影響しないようにする。
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
          to: "2026-08-26"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: ad5dea8c612638af7a1ca7b471b3f094f113574b
    - v: 1
      id: reg_66dc65594b0f0dbdd9c419ef67f1b28c
      ts: "2026-08-26T11:08:44Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-A99J): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 0cb1ae1e4a05dabf421e6a368bc9d79203e7f7a7
      previous_event_id: reg_72580f9f0cc78423bb7467231839e3f5
    - v: 1
      id: reg_d7ab4196585d9417138e7f536ab2cd76
      ts: "2026-08-26T11:20:07Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-A99J): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 63559916ae63e2c0e3ee780122d6a0a6fe22ed39
      previous_event_id: reg_66dc65594b0f0dbdd9c419ef67f1b28c
    - v: 1
      id: reg_43a1eecd6f8d446baecd3d18efa32d91
      ts: "2026-08-26T11:39:15Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "docs(register): PJR-A99J をクローズし PJR-X3E8 へ追記する"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-26"
        - field: conclusion
          from: "-"
          to: 原因は PJR-X3E8 の対処が個別テストの隔離に留まり、agent 起動環境そのものが GIT_DIR などを子プロセスへ渡していたことであった。exec-run・exec-trial・exec-worktree-command の全 agent 起動を gitEnvironment 経由へ統一し、job と e2e ツールの直接 Git 実行も揃えた。あわせて exec-agent-git-state を新設し、agent の各試行の前後で HEAD と local config を比較して、差分があれば親検証・reporter・commit・merge へ進む前に失敗させる。予防と検知の2層とした。agent による commit と core.bare 変更の検知、および危険な GIT_DIR が agent へ継承されないことを確認する回帰テストを追加した。統合テストは83件へ増えた。
      legacy_commit: 4a488be579bc72479627a26e04df6dbd2aabf20e
      previous_event_id: reg_d7ab4196585d9417138e7f536ab2cd76
---

# PJR-A99J agentのgit操作が実リポジトリを破壊する事象が再発した

## 1. 課題内容

PJR-5YW6 の実行で、メインリポジトリの core.bare が true に変更され作業ツリーが操作不能になった。あわせて worktree へテスト用フィクスチャのコミット2件が混入し、docs/register-item.md という実在しないファイルが追加された。実装の成果はなく worktree は破棄した。同種の事象は PJR-X3E8 で一度発生しており、テストで git を扱う際は隔離した環境変数を渡す規約を設けたが、再発を防げていない。agent の git 操作が実リポジトリの設定と履歴へ影響しないようにする。

## 2. 影響範囲

| 観点         | 影響                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| スコープ     | agent が git を扱う全タスク。実リポジトリの設定と履歴に及ぶ                                                          |
| スケジュール | 事故のたびに実行が失敗し、復旧と原因調査が要る。今回は成果が得られず worktree を破棄した                             |
| コスト       | 実行時間と agent 利用量が無駄になる。復旧に人手が要る                                                                |
| 品質         | 実リポジトリの設定変更に気づかないまま作業を続けると、後続の操作が想定外の結果になる。履歴への混入は追跡を困難にする |
| 関係者       | git を操作するタスクを実行する全 agent                                                                               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `exec trial`を含むagent起動経路が親の`process.env`をそのまま渡し、Git hook由来の`GIT_DIR`をagentとテスト子プロセスへ継承していた。fixtureの`git init`と`git commit`が一時directoryではなくlinked worktreeのgitdirへ向いたため、共有configの`core.bare`変更とexec branchへのfixture commit混入が同時に発生した |
| 対応策   | 全agent起動経路と親検証からrepository固有Git環境変数を除去する。加えてagent前後のHEADとlocal configを比較し、変更時は親検証・reporter・統合前にblockする                                                                                                                                                      |
| 依存事項 | worktree による隔離を前提とした実行方式に関わるため、exec の実行経路を変更する場合は影響範囲を確認する                                                                                                                                                                                                        |
| 完了条件 | 下記のとおり                                                                                                                                                                                                                                                                                                  |

## 3.1. 完了条件

- agent の実行によって実リポジトリの git 設定が変更されない。特に `core.bare` が変わらない。
- agent の実行によって、意図しないコミットが実リポジトリまたはブランチへ混入しない。
- 上記が守られなかった場合に検知できる。実行の前後で git 設定と HEAD を比較するなど、方法は判断してよい。検知したら実行を止めるか、記録に残して報告する。
- PJR-X3E8 で追加した規約（テストから git を実行する際に隔離した環境変数を渡す）が、実際に守られているかを確認する。守られていない箇所があれば是正する。
- 今回の事象の原因が特定されている。特定できない場合は、切り分けのために行った調査と、残る可能性を記録する。
- 復旧手順が記録されている。`core.bare` が変更された場合の戻し方と、混入したコミットの扱いを含む。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 今回の観測

- メインリポジトリの `core.bare` が `true` になり、`git status` が `fatal: this operation must be run in a work tree` で失敗した。`git config core.bare false` で復旧した。
- worktree に `register item` と `before registration` の2コミットが混入し、`docs/register-item.md` が追加されていた。実リポジトリの追跡対象には入っておらず、worktree の破棄で解消した。
- 実装の成果はなく、`src/exec-trial.ts` への変更はなかった。親検証3件は passed と記録されたが、実装が無い状態での結果である。
- PJR-5YW6 は未着手として残る。再実行時は完了条件へ「実リポジトリの git 設定・履歴を変更しない」を明記する。

## 4. 対応結果

解決内容:

- `src/exec-run.ts`、`src/exec-trial.ts`、`src/exec-worktree-command.ts`の全agent起動環境を`gitEnvironment()`経由に変更した。通常worktree、in-place、executor / reporter pipeline、trial、分割worktree commandのいずれでも`GIT_DIR`、`GIT_WORK_TREE`、`GIT_COMMON_DIR`などを子プロセスへ渡さない。
- `src/exec-agent-git-state.ts`を追加し、agentの各試行前後でHEAD（commitとsymbolic ref）およびlocal configを比較するようにした。差分は`agent-git-state-write:`として記録し、親検証、reporter、commit、mergeへ進む前に失敗させる。
- 親検証とworktree依存installにも隔離環境を適用した。残っていた`src/job.ts`と`tools/e2e/exec-run-e2e.ts`の直接Git実行も`gitEnvironment()`経由へ統一し、テスト・tool・本番コードの直接Git起動を再監査した。
- `tests/src/exec-agent-git-state.integration.test.ts`でagentによるcommitと`core.bare`変更の検知を追加し、`tests/src/exec-worktree-command.integration.test.ts`で危険な`GIT_DIR` / `GIT_WORK_TREE`がagentへ継承されないことを確認する回帰ケースを追加した。

原因の切り分け:

- PJR-X3E8は`tests/src/exec-agent-protected-config.test.ts`の個別Git呼び出しだけを隔離したため、そのテストの再発は防いだが、上流のagent起動環境は未修正だった。
- 今回事象で`core.bare`変更とfixture commit 2件が同時に発生したことは、異なる一時repository用Git操作が同じ継承`GIT_DIR`へ向いた場合の挙動と一致する。実際に`exec trial`の`worktreeEnvironment()`が`process.env`を無加工で複製していたことから、再発経路を特定した。

再発防止と復旧:

- 環境隔離を第一防御、HEAD・local config比較を検知防御、既存のcommit許可リストを統合防御とする。設計上の必須ルールを`docs/ja/product/040-system-design/sysd-cross-cutting-policy.md`、運用詳細を`docs/ja/specdojo/guides/exec-config-guide.md`へ反映した。
- 復旧手順を`docs/ja/specdojo/guides/exec-operation-guide.md`へ記録した。`core.bare`は影響確認後に`git config --local core.bare false`で戻し、`git status`と`git fsck`で確認する。混入commitは差分を確認して対象worktree / 未統合branchを破棄し、必要な成果だけを新しいworktreeへ適用する。共有済み履歴のresetやforce pushは行わない。

確認結果:

- executor内で`npm run typecheck`、`npm run lint:ts`、変更Markdownの`prettier` / `markdownlint`、register build、catalog validate、index buildが成功した。catalog validateの既存未作成文書に対するwarningを除き、errorはない。
- `npm run test:unit`、`npm run test:integration`、`npm run validate:schema`はexecutor / reporter pipelineの親検証として設定されているため、sandbox内では重複実行せずrunnerの検証結果を正本とする。

## 5. 関連ドキュメント

- 1回目の発生: [[prj-0001:pjr-x3e8-test-git-env-bare-repository|PJR-X3E8 テストのgit実行でリポジトリがbareになる]]
- 発生した実行: [[prj-0001:pjr-5yw6-agent-trial-base-and-reporter|PJR-5YW6 trialで完了済みtodoを起点に指定しreporterも比較できるようにする]]
- agent の権限方針: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q agent が書き込める設定の範囲]]
- テストでの git 実行規約: `.github/instructions/vitest.instructions.md`
