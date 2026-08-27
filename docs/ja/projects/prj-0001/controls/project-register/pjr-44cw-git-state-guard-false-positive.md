---
specdojo:
  id: prj-0001:pjr-44cw-git-state-guard-false-positive
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-26T22:34:03Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-27T10:57:56Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-git-state-write: Git state changes detected; fields=HEAD, local-config; agent must leave commits and repository configuration ch…"
  conclusion: 誤検知の原因は2つあった。local config 側は VS Code が runner 作成の worktree branch を発見した際に付与する branch のメタデータであり、HEAD 側は比較対象が実リポジトリになっていたため runner の register 遷移コミットを拾っていた。前者は当該メタデータのみを除外し、順序と重複は保持して同名設定の順序依存の変化を引き続き検知できるようにした。後者は除外規則を設けず、比較対象を agent の cwd で解決した worktree へ限定することで解決した。網羅的な除外リストは設けていない。広く除外すると検知すべき変更を見逃すためである。検知の範囲は弱めておらず、agent が worktree 内で作ったコミットと core.bare の変更は引き続き検知する。runner のコミットと agent の変更が混在する場合も検知できることを含め、双方向のテストを追加した。修正が適用されるのは次回の実行からであり、実運用での裏付けはそこで得られる。
---

# PJR-44CW git状態の検知がrunner自身の操作を誤検知して実行を止める

## 1. 概要

PJR-A99J で追加した検知機構が、agent の操作と runner 自身の操作を区別できていない。PJR-07M5 と PJR-EX5E の2回連続で実行が停止したが、いずれも成果物に問題はなく、検知された HEAD の変化は exec の register 遷移コミット（start / wait）という runner 自身の操作であった。正当な実行が毎回止まると、そのたびにオーケストレーターの代行が必要になり運用の妨げになる。検知の目的である事故の防止を保ちながら、runner 自身の操作を除外する。

## 2. 完了条件

- runner 自身の操作（register の遷移コミットなど）が検知の対象から外れる。agent が起動している区間の変化だけを見る、比較対象を worktree に限る、など方法は判断してよい。
- agent による実リポジトリの変更は引き続き検知される。検知の目的を弱めない。`core.bare` の変更と意図しないコミットの混入は検知できる状態を保つ。
- 誤検知と真の検知を区別できることを、自動テストで確認する。runner の遷移コミットだけがある場合は通り、agent の変更がある場合は止まる、の双方を検証する。
- 過去に停止した2件（PJR-07M5、PJR-EX5E）が、修正後の条件では停止しないことを確認する。実際の記録を用いて判定できるとよい。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- 検知は `src/exec-agent-git-state.ts` の `captureAgentGitStateSnapshot` が HEAD（commit と symbolic ref）と local config を agent 起動の前後で比較する方式である。
- PJR-07M5 の停止理由は `fields=local-config`、PJR-EX5E は `fields=HEAD, local-config` であった。後者の HEAD の変化は `exec(register PJR-EX5E): start` と `wait` という runner 自身のコミットである。
- 2件とも成果物に問題はなく、オーケストレーターが検証したうえで統合した。実リポジトリへの被害もなかった。
- 一方で検知そのものは有効に働いている。PJR-5YW6 の1回目では同種の事象で実リポジトリが bare 化し復旧が必要だったが、検知の導入後は被害が出ていない。検知を外す方向の対処は採らない。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ                                                 |
| --- | --------------------------------------------------- | ---- | ---- | ---------------------------------------------------- |
| 1   | 誤検知の発生条件を特定する                          | ARC  | done | 共有 config の branch 表示用 metadata を検知していた |
| 2   | runner 自身の操作を対象から外す                     | ARC  | done | agent worktree の HEAD と動作設定は監視を継続        |
| 3   | 誤検知と真の検知を区別するテストを追加する          | ARC  | done | 双方向の回帰ケースを追加                             |
| 4   | 過去に停止した2件が修正後は停止しないことを確認する | ARC  | done | PJR-07M5 / PJR-EX5E の遷移commitを再現               |

## 4. 対応結果

- agentのcwdから解決したHEADだけを比較する既存の境界を維持し、別worktreeでrunnerが行うregister遷移commitを検知対象外とした。
- local configは、runnerが作成したworktree branchをVS Codeが発見した際に付与する`branch.*.vscode-merge-base`だけを除外した。その他のentryは順序と重複を含めて比較するため、`core.bare`を含むrepository動作設定の変更は引き続き検知する。
- PJR-07M5の`wait`とPJR-EX5Eの`start`に相当するcommitをroot worktreeへ作る回帰ケースを追加した。runner遷移だけなら通過し、同じ区間にagent worktreeのcommitがあれば`HEAD`、`core.bare`変更があれば`local-config`として検知する。
- 残課題はない。

## 5. 関連ドキュメント

- 検知機構を実装した項目: [[prj-0001:pjr-a99j-agent-git-isolation-breach|PJR-A99J agentのgit操作が実リポジトリを破壊する事象が再発した]]
- 誤検知で停止した実行: [[prj-0001:pjr-07m5-trial-validation-completeness|PJR-07M5 trialで親検証が実行されず成果の検証が不完全になる問題を解消する]]
- 同上: [[prj-0001:pjr-ex5e-git-identity-isolation|PJR-EX5E テストとagentによるgit identity設定が実リポジトリへ及ぶ経路を隔離する]]
- 検知が有効だった事例: [[prj-0001:pjr-5yw6-agent-trial-base-and-reporter|PJR-5YW6 trialで完了済みtodoを起点に指定しreporterも比較できるようにする]]
- 実装: `src/exec-agent-git-state.ts`
