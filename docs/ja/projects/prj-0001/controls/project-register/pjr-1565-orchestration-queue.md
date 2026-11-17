---
specdojo:
  id: prj-0001:pjr-1565-orchestration-queue
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-17T22:58:15Z"
  due_on: "2026-11-30"
---

# PJR-1565 grade・register の実行・build を混ぜた順番の予約を、specdojo の機能で流す

## 1. 概要

orchestrator が scratchpad のシェルスクリプトで grade・exec run・build の順番を予約しており、セッションが終わると消え、利用者から見えないため、specdojo の機能で予約して流せるようにする

## 2. 入力

- 利用者の問い（2026-11-18）: 実行の予約は specdojo の機能か、orchestrator が script を書いているのか
- orchestrator の調べ（2026-11-18）: 予約は orchestrator が書いたシェルスクリプト（前の出力に終わりの行が出るまで 30 秒ごとに確かめ、次の npx specdojo を実行する）。specdojo にあるのは exec run --register A B C（--on-failure）、register の --depends-on、--if-busy wait（同じ種類のロックだけ）。grade・exec run・npm run build を混ぜた順番と、別の種類の作業の終わりを待つ機能はない。job は validate と list だけで、routine から起動される
- 利用者の決定（2026-11-18）: 方式（job の定義に段を並べる、exec run に予約を持たせる など）は executor が比べて決め、理由を書く。予約の中身と進み具合が登録簿か exec status から見えること。dist の作り直しは統合の後の処理の項目に任せる

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
