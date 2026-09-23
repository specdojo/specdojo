---
specdojo:
  id: prj-0001:pjr-q828-reporter-revalidation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-23T13:04:00Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-24T09:43:51Z"
  conclusion: reporter に worktree の実行権限を与えず、親 runner が parent_validations の固定許可リストだけを再実行する方式を採用した。source が runner の failed / not_run のみ再評価して置換し、source が executor の検証は成果物側として保持することで実行環境起因の失敗と区別する。再検証後も失敗する場合は従来どおりブロックする。実行時に失敗した否定側テストは実装ではなく期待値の誤りで、worktree 側の result を参照するよう修正した。source が executor の検証は再評価対象外のため、同種の詰まりは PJR-0FCT と PJR-QVGX の対応が必要である。
---

# PJR-Q828 reporterが解消済みの検証失敗を再評価できない問題を解消する

## 1. 概要

reporter は executor の evidence.json に記録された検証結果のみを読み、worktree を再検証しない。そのため失敗の原因が解消されていても評価は変わらず、正当な理由でブロックし続ける。PJR-K4TA と PJR-JT1Y の2回連続でオーケストレーターによる代行記入が必要になった。失敗原因が実行環境に起因する場合や解消済みの場合に reporter が再検証できる手段、または再検証済みであることを reporter へ伝える手段を用意する。関連して PJR-0FCT の再実行例外と PJR-QVGX のsandbox制約も同じ詰まりに寄与している。

## 2. 完了条件

- executor の検証が失敗した状態から、原因を解消したうえで reporter が再評価し、complete と報告できる手段が用意されている。
- 再評価の手段は、reporter が worktree を再検証できるようにするか、再検証済みであることを reporter へ伝えられるようにするか、いずれの方式でもよい。採用した方式と理由が記録されている。
- 再評価を経ずに古い evidence だけで complete と報告できてしまう抜け道を作らない。失敗が未解消の場合は従来どおりブロックする。
- 実行環境に起因する失敗（PJR-QVGX の sandbox 制約など）と、成果物に起因する失敗を区別できる。
- 上記の挙動を確認する自動テストが追加されている。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit` が成功する。

## 3. 作業内容

| No  | 作業                                                                                               | 担当 | 状態 | メモ                     |
| --- | -------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------ |
| 1   | reporter が evidence のみで判断している箇所を特定する                                              | ARC  | done | `src/exec-run.ts`        |
| 2   | 再評価の方式を選定し、採用理由とともに記録する                                                     | ARC  | done | 親 runner による再検証   |
| 3   | 選定した方式を実装する                                                                             | ARC  | done | 固定許可リストのみ再実行 |
| 4   | 解消済みの失敗から complete へ到達できること、未解消ならブロックすることを確認するテストを追加する | ARC  | done | 双方向を E2E で確認      |

## 4. 対応結果

- reporter 自身に worktree のコマンド実行権限を与えず、親 runner が `pipeline.parent_validations` の固定許可リストだけを再実行する方式を採用した。reporter の read-only 境界を維持し、任意コマンド実行や古い evidence の自己申告による上書きを許さないためである。
- reporter 再開時、保存済み evidence の `source: runner` に `failed` / `not_run` があれば親検証を再実行し、同じ ID の古い runner 結果を置換して永続化してから reporter へ渡す。`source: executor` は成果物側の検証として保持し、再評価対象にしないことで実行環境起因の失敗と区別する。
- 解消後に親検証が成功すれば reporter が `complete` へ到達でき、再検証後も失敗すれば runner が reporter の出力にかかわらず従来どおりブロックする。設定 ID の変更・欠損時は古い結果を流用しない。
- 実装は `src/exec-parent-validation.ts`、`src/exec-evidence.ts`、`src/exec-run.ts`、自動テストは `tests/src/exec-parent-validation.test.ts` と `tests/src/exec-pipeline-e2e.integration.test.ts`、運用説明は `docs/ja/specdojo/guides/exec-config-guide.md` と `docs/ja/specdojo/guides/exec-operation-guide.md` を更新した。残課題はない。

## 5. 関連ドキュメント

- 代行記入が必要になった実行: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 同上: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
- 同じ reporter 段階の課題: [[prj-0001:pjr-e6hg-claude-reporter-json-failure|PJR-E6HG claude-reporterのJSON解析失敗]]
- 詰まりに寄与する制約: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT test:unitの再実行例外]]
- 同上: [[prj-0001:pjr-qvgx-codex-sandbox-tsx-ipc-eperm|PJR-QVGX codex sandboxのtsx IPC制約]]
