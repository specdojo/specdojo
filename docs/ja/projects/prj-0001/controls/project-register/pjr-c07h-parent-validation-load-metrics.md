---
specdojo:
  id: prj-0001:pjr-c07h-parent-validation-load-metrics
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-17T12:22:09Z"
  commit_type: feat
  commit_scope: exec
---

# PJR-C07H 親の検証の時間切れの原因を調べるため、検証の実行時の負荷と待ち時間を記録する

## 1. 概要

並べて流した run の親の検証が時間切れになる原因を特定するため、各検証の開始・終了時刻、検証の順番待ち、同時に動く run、CPU・メモリ・I/O の負荷を記録に残す

## 2. 入力

- 2026-11-16〜17 に、並べて流した run の親の検証（統合テストなど）が時間切れで止まることがあった。親の検証は `parent_validation_concurrency:` 1 で 1 件ずつ流れ、各検証の上限は 10 分である
- orchestrator の調べ（2026-11-17）: 止まった時間帯に動いていたのは opus・sol・sonnet の agent だけで、opencode のローカル LLM（Mac の Ollama）は使われておらず、job も動いていなかった。原因の候補は、親の検証の直列化の外で executor が流すテスト、メモリの圧迫（container は 15GB・swap 4GB のうち 2.9GB 使用）、共有フォルダの I/O の遅さ（PJR-TATP）である
- 利用者が 2026-11-17 に、対策の前に原因を明確にするよう指示し、計測の todo の起票を依頼した。自動の再開（PJR-52EE）は原因が分かるまで保留している

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
