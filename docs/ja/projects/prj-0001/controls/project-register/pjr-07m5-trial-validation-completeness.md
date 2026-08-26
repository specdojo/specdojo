---
specdojo:
  id: prj-0001:pjr-07m5-trial-validation-completeness
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-26T14:13:16Z"
  due_on: "2026-09-30"
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

| No  | 作業                                                         | 担当 | 状態 | メモ                                      |
| --- | ------------------------------------------------------------ | ---- | ---- | ----------------------------------------- |
| 1   | trial で親検証を実行するか否かを判断し、理由を記録する       | ARC  | open | 実行時間と比較の歪みを考慮する            |
| 2   | 採用前に検証の不足を確認できるようにする                     | ARC  | open | 採用時に実行する案も含めて検討する        |
| 3   | 完了条件が求める検証の実施状況を客観指標として記録する       | ARC  | open | plan の完了条件と evidence を突き合わせる |
| 4   | 意図して省いた検証と実施しなかった検証を区別できるようにする | ARC  | open | 理由の記録の有無で区別する                |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 対象の仕組み: [[prj-0001:pjr-nw9v-agent-comparison-trial|PJR-NW9V 同一タスクを複数agentで試行し性能を比較できるようにする]]
- 起点指定と reporter 比較を追加した項目: [[prj-0001:pjr-5yw6-agent-trial-base-and-reporter|PJR-5YW6 trialで完了済みtodoを起点に指定しreporterも比較できるようにする]]
- 親検証を導入した項目: [[prj-0001:pjr-qvgx-codex-sandbox-tsx-ipc-eperm|PJR-QVGX codex sandboxで子プロセスが成立せず検証が常に失敗する問題を解消する]]
- 比較の題材となった項目: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT 共通規約のtest実行に関する記述の矛盾を解消する]]
- 実装: `src/exec-trial.ts`、`src/exec-parent-validation.ts`
