---
specdojo:
  id: prj-0001:pjr-07m5-trial-validation-completeness
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-26T14:13:16Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-26T15:31:31Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-git-state-write: Git state changes detected; fields=local-config; agent must leave commits and repository configuration changes …"
  conclusion: trial から親検証を実行し、結果を source が runner の記録として中央 evidence へ保存するようにした。親検証が失敗した trial は採用不可とし、検証が不足したまま成果を採用することを防ぐ。executor へ設定済みの親検証 ID を渡して二重実行を防ぐ。比較記録では executor の所要時間と親検証の所要時間を分けて保存し、親検証の時間が agent の性能評価へ混ざらないようにした。executor の検証報告総数と passed / failed / not_run を runner の件数から分離し、理由付きの not_run により意図して省いた検証と単に実施しなかった検証を区別できるようにした。本実行は agent が git identity を設定しようとして PJR-A99J の検知機構が作動し停止したが、成果物とは無関係であり実リポジトリへの影響もなかった。
  register_events:
    - v: 1
      id: reg_85583732462fe39bd39afb949b6db9db
      ts: "2026-08-26T14:14:39Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): PJR-07M5 trialの検証不足を起票し評価を訂正する"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: trialで親検証が実行されず成果の検証が不完全になる問題を解消する
        - field: description
          from: ""
          to: exec trial は親検証を実行しない。src/exec-trial.ts に runConfiguredParentValidations の呼び出しがなく、実際の比較でも source が runner の記録は残らなかった。executor が親検証に設定された ID のコマンドを not_run とするのは規約どおりだが、trial ではその後に誰も実行しないため、test-unit・validate-schema・test-integration が一度も走らない。agent の振る舞いを比較する目的には支障ないが、trial の成果を採用する場合は検証が不足する。あわせて、完了条件が求める検証を executor が実施したかを客観指標として記録できるようにする。現状は成功した検証の数しか見ておらず、実施しなかった検証が指標に現れない。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-26"
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
      legacy_commit: 3545230a2501e923e56d092f9f34e1b25968b8f0
    - v: 1
      id: reg_871e7372f35ccca24f77c7c6e83d51f5
      ts: "2026-08-26T14:45:23Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-07M5): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 10659b2c5563e6fc84c5097d8a44b38ef7e27aac
      previous_event_id: reg_85583732462fe39bd39afb949b6db9db
    - v: 1
      id: reg_158d750a91f19b7293e7996d391df5f2
      ts: "2026-08-26T14:52:19Z"
      action: wait
      actor: SpecDojo Test
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-07M5): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: block_reason
          from: "-"
          to: "agent exited with non-zero code: agent exited with non-zero code: agent-git-state-write: Git state changes detected; fields=local-config; agent must leave commits and repository configuration changes …"
      legacy_commit: c36541a84ec1098387a9008855a3cf956c6a29df
      previous_event_id: reg_871e7372f35ccca24f77c7c6e83d51f5
    - v: 1
      id: reg_53a9ad708491ea87b967c0df7ae7fcaa
      ts: "2026-08-26T15:20:04Z"
      action: review
      actor: naoji3x
      from_status: waiting
      to_status: review
      reason: "exec(register PJR-07M5): review"
      changes:
        - field: status
          from: waiting
          to: review
      legacy_commit: a32d1cf9475330c698db9a56f520064e8c0252ea
      previous_event_id: reg_158d750a91f19b7293e7996d391df5f2
    - v: 1
      id: reg_acd185b880cc67ee1f3e99d7075b1c77
      ts: "2026-08-26T15:34:22Z"
      action: close
      actor: naoji3x
      from_status: review
      to_status: done
      reason: "docs(register): PJR-07M5 をクローズする"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-27"
        - field: conclusion
          from: "-"
          to: trial から親検証を実行し、結果を source が runner の記録として中央 evidence へ保存するようにした。親検証が失敗した trial は採用不可とし、検証が不足したまま成果を採用することを防ぐ。executor へ設定済みの親検証 ID を渡して二重実行を防ぐ。比較記録では executor の所要時間と親検証の所要時間を分けて保存し、親検証の時間が agent の性能評価へ混ざらないようにした。executor の検証報告総数と passed / failed / not_run を runner の件数から分離し、理由付きの not_run により意図して省いた検証と単に実施しなかった検証を区別できるようにした。本実行は agent が git identity を設定しようとして PJR-A99J の検知機構が作動し停止したが、成果物とは無関係であり実リポジトリへの影響もなかった。
      legacy_commit: 32754535b56587b6098764b69c7776bd276d70b7
      previous_event_id: reg_53a9ad708491ea87b967c0df7ae7fcaa
---

# PJR-07M5 trialで親検証が実行されず成果の検証が不完全になる問題を解消する

## 1. 概要

exec trial は親検証を実行しない。src/exec-trial.ts に runConfiguredParentValidations の呼び出しがなく、実際の比較でも source が runner の記録は残らなかった。executor が親検証に設定された ID のコマンドを not_run とするのは規約どおりだが、trial ではその後に誰も実行しないため、test-unit・validate-schema・test-integration が一度も走らない。agent の振る舞いを比較する目的には支障ないが、trial の成果を採用する場合は検証が不足する。あわせて、完了条件が求める検証を executor が実施したかを客観指標として記録できるようにする。現状は成功した検証の数しか見ておらず、実施しなかった検証が指標に現れない。

## 2. 完了条件

- trial で親検証が実行されるか、実行しない場合はその旨が記録と表示から分かる。どちらの方式を採るかを判断し、理由を記録する。
- trial の成果を採用する前に、検証が不足していないかを確認できる。採用時にだけ実行する、比較時から実行する、採用手順で注意を促す、のいずれでもよい。
- 完了条件が求める検証を executor が実施したかが客観指標として分かる。現状は成功した検証の数しか記録されず、実施しなかった検証が指標に現れない。plan の完了条件と evidence の検証記録を突き合わせる方法は判断してよい。
- executor が意図して省いた検証と、単に実施しなかった検証を区別できる。前者は理由が記録され、後者は記録がない。この差が比較で見える。
- 親検証を trial で実行する場合、実行時間が指標へ与える影響を考慮する。agent の所要時間と検証の所要時間が混ざると比較が歪む。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- `src/exec-trial.ts` に `runConfiguredParentValidations` の呼び出しがない。通常の `exec run` は executor 成功後・reporter 起動前に親検証を実行するが、trial にはこの経路がない。
- 実際の比較（PJR-0FCT を課題とした gemma / qwen の trial）でも、`source` が `runner` の検証記録は残らなかった。
- executor が親検証の ID に対応するコマンドを `not_run` とするのは共通規約どおりである。しかし trial ではその後に誰も実行しないため、`test-unit` / `validate-schema` / `test-integration` が一度も走らない。
- `lint:md` と `lint:fm` は親検証の固定許可リストに含まれず、executor 側の責務である。同じ比較で、qwen は両方を実行したが gemma は実施しなかった。完了条件は両方の成功を求めていたため、実施の有無が比較で見えるべきである。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                     |
| --- | ------------------------------------------------------------ | ---- | ---- | ---------------------------------------- |
| 1   | trial で親検証を実行するか否かを判断し、理由を記録する       | ARC  | done | executor直後に実行し、所要時間は分離した |
| 2   | 採用前に検証の不足を確認できるようにする                     | ARC  | done | 親検証失敗trialは採用不可とした          |
| 3   | 完了条件が求める検証の実施状況を客観指標として記録する       | ARC  | done | executorとrunnerの件数を分離した         |
| 4   | 意図して省いた検証と実施しなかった検証を区別できるようにする | ARC  | done | 報告総数と理由付きnot_runを表示する      |

## 4. 対応結果

trialでも通常のpipelineと同様に、executor成功後・reporter起動前に設定済み親検証を各worktreeで実行する方式を採用した。採用時まで検証を遅らせると、比較時のreporterが不完全なevidenceを評価し、検証失敗trialも成功候補に残るためである。

- `src/exec-trial.ts`から共通の親検証実行処理を呼び、結果を`source: runner`付きで中央evidenceへ保存する。親検証失敗またはexecutor失敗による親検証未実行のtrialは`succeeded`にしない。
- executorへ設定済み親検証IDを含むpipeline promptを渡し、親runnerとの二重実行を防ぐ。
- 比較記録にexecutor時間と親検証時間を分けて保存し、全体時間と併記する。これにより親検証時間をagent性能として扱わずに比較できる。
- executorの検証報告総数と`passed` / `failed` / `not_run`をrunnerの件数から分離した。明示的な`not_run`はevidenceの理由で意図した省略と分かり、報告自体がない場合は報告総数の不足として比較できる。
- `exec trial status`に親検証状態と分離した時間・検証件数を表示し、採用前の確認方法をexec運用ガイドとコマンドリファレンスへ追記した。

残課題はない。

## 5. 関連ドキュメント

- 対象の仕組み: [[prj-0001:pjr-nw9v-agent-comparison-trial|PJR-NW9V 同一タスクを複数agentで試行し性能を比較できるようにする]]
- 起点指定と reporter 比較を追加した項目: [[prj-0001:pjr-5yw6-agent-trial-base-and-reporter|PJR-5YW6 trialで完了済みtodoを起点に指定しreporterも比較できるようにする]]
- 親検証を導入した項目: [[prj-0001:pjr-qvgx-codex-sandbox-tsx-ipc-eperm|PJR-QVGX codex sandboxで子プロセスが成立せず検証が常に失敗する問題を解消する]]
- 比較の題材となった項目: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT 共通規約のtest実行に関する記述の矛盾を解消する]]
- 実装: `src/exec-trial.ts`、`src/exec-parent-validation.ts`
