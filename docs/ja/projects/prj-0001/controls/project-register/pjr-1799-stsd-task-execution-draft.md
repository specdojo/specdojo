---
specdojo:
  id: prj-0001:pjr-1799-stsd-task-execution-draft
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-04T23:37:37Z"
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-FMYK
  approach: draft
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-1799 stsd-task-execution を現行の実装をもとに下書きする

## 1. 概要

stsd の試行（3APD）の段 2。代表の 1 件 stsd-task-execution を、現行の実装（src/exec のイベントと状態の導出）をもとに draft で下書きする

## 2. 入力

- 業務仕様は現行の実装をもとに記述する（2026-11-04 利用者の方針）
- カタログの根拠は src/exec/events.ts（イベント列から状態を再構成し、依存の充足から ready を導く）と src/exec/types.ts（ExecState・ExecEventType）。状態は todo / ready / doing / blocked / done / cancelled（PJR-FMYK）
- `based_on` の bdd-exec-state・bdd-exec-event はまだない

## 3. 完了条件

- [[stsd-task-execution]] の `_TODO_` とプレースホルダー（`_STATE_CODE_` など）を、現行の実装（`src/exec/events.ts`・`src/exec/types.ts` と、それらが使う状態の導出）をもとに埋めている。状態一覧には todo / ready / doing / blocked / done / cancelled が載り、`ready` が記録された状態ではなく依存の充足から導かれることが分かる。
- 遷移の説明の各行が、実装のイベントの種類（`ExecEventType`）と対応している。実装で確かめられないことは推測で埋めず、`_UNDECIDED_` で残して理由を書く。
- 状態遷移図は Mermaid の `stateDiagram-v2` で、状態一覧の全状態を含み、lint-mermaid を通る。
- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書く。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ |
| --- | -------------------------------- | ---- | ---- | ---- |
| 1   | 実装から状態とイベントを洗い出す | BA   | open | -    |
| 2   | 雛形を埋め、図と遷移の説明を書く | BA   | open | -    |
| 3   | 検査を通し、対応結果を書く       | BA   | open | -    |

## 5. 対応結果

- 実施内容: executor（flash-high）が [[stsd-task-execution]] を、`src/exec/events.ts`・`src/exec/types.ts` をもとに下書きした（6b9cdc3ab）。状態一覧の 6 状態、遷移 T-01〜T-13、Mermaid の状態遷移図、今後の検討メモを書いた。
- orchestrator の確認: 状態の導出（`ready` は記録されず依存の充足から導く）、遷移の可否（`advanceTaskState` と各 `can*Task` の判定）、`reopen` は人だけで後続が未着手のときに限ること、`cancel` は未着手のときだけ受け付けることが実装と合っていた。
- 残課題: T-12（完了から終了、「成果物受入」）と T-13（中止から終了、「中止確定」）は実装にないイベントで、推測で埋めている。stsd の rulebook は、終了点を業務上の終了がある場合に限り、ない場合は「概要」に継続状態と理由を書くよう求めている。磨き込み（PJR-Q9AW）で直す。

## 6. 関連ドキュメント

- [[stsd-task-execution]]: 対象の成果物
- [[specdojo:stsd-rulebook]]: stsd の書き方の規範
