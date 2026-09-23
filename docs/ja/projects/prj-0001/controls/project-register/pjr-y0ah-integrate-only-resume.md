---
specdojo:
  id: prj-0001:pjr-y0ah-integrate-only-resume
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-01T13:48:31Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-02T14:58:18Z"
  conclusion: executor と reporter が成功済みで統合だけ失敗した run を、agent を起動せず統合段から再試行できるようにした。
---

# PJR-Y0AH 統合段のみを再試行できる再開経路を設ける

## 1. 概要

worktree 実行では、executor と reporter が成功しても最後の統合（commit と merge）が
失敗することがある。この状態から回復する経路が現状ない。

`--resume` は「executor 成功・reporter 未完」だけを対象とし、reporter が成功済みだと
`not resumable` として拒否する。残る手段は `--force-restart` による全面再実行で、
成果物が worktree に揃っていても executor からやり直すことになる。

PJR-TA5C で実際にこの状態になった。実装もテストも完成し worktree は clean だったが、
runner では回復できず orchestrator が手動で commit と merge を行った。agent が担う
べき実行と、runner が担うべき記帳の境界が、統合の失敗時にだけ崩れる。

## 2. 完了条件

- executor と reporter が成功済みで統合だけ失敗した run を、統合から再試行できる。
- 再試行は executor と reporter を起動せず、既存の worktree と evidence を再利用する。
- 再試行の成否が register の状態遷移とイベントへ記録される。
- 再試行できない状態（executor 未完など）は、理由を示して拒否する。
- 既存の `--resume` の対象範囲を壊さない。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                                                      |
| --- | ---------------------------------------- | ---- | ---- | --------------------------------------------------------- |
| 1   | pipeline-state に統合段の状態を持たせる  | ARC  | done | `stages.integrate`（任意項目）を追加し schema も更新      |
| 2   | 統合段から再開する経路を実装する         | ARC  | done | `--resume` を拡張し、state から再開段を自動判定           |
| 3   | 再開可否の判定と拒否理由を定める         | ARC  | done | reporter 成功済みは拒否せず統合段の対象へ変更             |
| 4   | 単体テストを追加する                     | ARC  | done | 再開段の選択と統合段の記録を追加                          |
| 5   | command-reference と運用ガイドへ追記する | ARC  | done | `register実行の再開` へ改題し、統合段の扱いと拒否条件追記 |

## 4. 対応結果

`exec run --register --worktree --resume` を、reporter 段だけでなく統合段からも再開できるよう拡張した。再開段は指定せず、対象 worktree に残る最新 run の `pipeline-state.json` から判定する。reporter が未完了なら従来どおり reporter 段、reporter が成功済みなら統合段（commit → merge → worktree 撤去）を agent 起動なしで再試行する。worktree は統合完了時にだけ撤去されるため、reporter 成功済みの worktree が残っていること自体を「統合が未完了」の根拠とし、`integrate` の記録有無に依存しない判定にした。

主な変更は次のとおり。

- `src/exec-pipeline-state.ts`: `PipelineStageRole` と `stages.integrate`（任意項目）を追加し、未記録の段でも `updatePipelineStage` で追記できるようにした。
- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`: `integrate` を任意プロパティとして追加。
- `src/exec-register-resume.ts`: 再開対象へ `stage`（`reporter` / `integrate`）を追加し、`reporter already succeeded` の拒否を撤去した。
- `src/exec-run.ts`: 統合の開始・失敗を `integrate` へ記録し、統合再開時は取り込み済みブランチの再 merge を避ける。worktree 撤去も統合の一部として扱い、失敗しても例外で落とさず `waiting` へ戻す。
- `src/exec-worktree-ops.ts`: `isExecBranchMergedIntoCurrent` を追加。

制約として、統合成功時の `integrate: succeeded` は永続化しない。state は worktree 内にあり、merge 後に書き込むと commit 対象が未コミットのまま残って worktree を撤去できなくなるため、記録するのは開始（`running`）と失敗（`failed`）に限る。

残課題は、統合段再開の E2E（統合失敗を注入して `--resume` で回復する経路）の追加。executor 実行環境では統合テストを起動できないため、本タスクでは単体テストのみを追加した。

- 受け入れ時に orchestrator が、本項目の発端となった PJR-TA5C の状態（executor と reporter が
  成功済みで統合だけ失敗）に対する判定を確認した。当時は `reporter already succeeded` を理由に
  `not-resumable` として拒否されたが、同じ条件で `integrate` 段からの再開を返すようになっている。
  executor と reporter は起動しない。
- `--resume` の説明文も「reporter、または reporter が成功済みなら integrate」を示す記述へ更新
  されている。typecheck、lint:ts、単体テスト1337件の通過を確認した。
- 本項目により、成果物が揃っているのに全面再実行しか選べない状態は解消された。PJR-TA5C では
  この欠落のため orchestrator による手動統合が必要だった。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ta5c-agent-run-primitive]]: 本問題が実際に発生した項目。
- [[prj-0001:pjr-fmz2-integrate-error-stderr]]: 統合失敗の原因追跡に関する項目。
