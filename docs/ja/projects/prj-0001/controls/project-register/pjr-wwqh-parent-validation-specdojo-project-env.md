---
specdojo:
  id: prj-0001:pjr-wwqh-parent-validation-specdojo-project-env
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-21T22:58:30Z"
  due_on: "2026-10-31"
---

# PJR-WWQH exec run の親の検証に SPECDOJO_PROJECT が漏れ、テストが失敗する

## 1. 課題内容

SPECDOJO_PROJECT=prj-0002 のシェル（orchestrator launch の手順どおり）から exec run を流すと、親の検証の test-unit に環境変数が引き継がれ、テストが作る仮のリポジトリの設定に prj-0002 がないため Unknown project で 65 件が失敗する。runner の親の検証の環境またはテストの共通 setup で SPECDOJO_PROJECT を切り離す

## 2. 影響範囲

| 観点         | 影響                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| スコープ     | _TODO_                                                                                                       |
| スケジュール | _TODO_                                                                                                       |
| コスト       | _TODO_                                                                                                       |
| 品質         | `SPECDOJO_PROJECT` を設定したシェルから流す run は、成果物と無関係に `test-unit` が失敗して `waiting` になる |
| 関係者       | _TODO_                                                                                                       |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 親の検証の子プロセスへ `SPECDOJO_PROJECT` がそのまま渡り、テストの CLI が仮のリポジトリの設定にない project を解決しようとする（2026-10-21、prj-0002 の PJR-0WFV の run で観測）                                                                                       |
| 対応策   | runner の親の検証の環境から外すか、テストの共通 setup で `GIT_LOCAL_ENV_VARS` と同じく除去するか、executor が決めて理由を result に書く                                                                                                                                |
| 依存事項 | _TODO_                                                                                                                                                                                                                                                                 |
| 完了条件 | `SPECDOJO_PROJECT` に別の project を設定した環境でも `npm run test:unit` と `npm run test:integration` が通ることをテストで確かめる。`typecheck`・`lint:ts`・`test:unit` と親の検証が通る。runner を変えた場合は統合の後に `exec run --register` を 1 回流して確かめる |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-0wfv-lp-why-register]]: 観測した run の項目。
- [[prj-0001:pjr-sazc-orch-scripts-via-launch]]: `SPECDOJO_PROJECT=prj-0002` で orchestrator を起動する手順を作った項目。
