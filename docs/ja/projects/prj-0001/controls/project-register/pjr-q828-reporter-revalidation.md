---
specdojo:
  id: prj-0001:pjr-q828-reporter-revalidation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-23T13:04:00Z"
  due_on: "2026-08-31"
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

| No  | 作業                                                                                               | 担当 | 状態 | メモ                      |
| --- | -------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------- |
| 1   | reporter が evidence のみで判断している箇所を特定する                                              | ARC  | open | `exec` の reporter 段階   |
| 2   | 再評価の方式を選定し、採用理由とともに記録する                                                     | ARC  | open | 再検証 / 再検証済みの伝達 |
| 3   | 選定した方式を実装する                                                                             | ARC  | open | 抜け道を作らない          |
| 4   | 解消済みの失敗から complete へ到達できること、未解消ならブロックすることを確認するテストを追加する | ARC  | open | 双方向の確認              |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 代行記入が必要になった実行: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 同上: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
- 同じ reporter 段階の課題: [[prj-0001:pjr-e6hg-claude-reporter-json-failure|PJR-E6HG claude-reporterのJSON解析失敗]]
- 詰まりに寄与する制約: [[prj-0001:pjr-0fct-test-unit-rerun-after-fix|PJR-0FCT test:unitの再実行例外]]
- 同上: [[prj-0001:pjr-qvgx-codex-sandbox-tsx-ipc-eperm|PJR-QVGX codex sandboxのtsx IPC制約]]
