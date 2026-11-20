---
specdojo:
  id: prj-0001:pjr-5ray-release-check-speedup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-20T13:49:36Z"
  derived_from:
    - PJR-D25E
---

# PJR-5RAY リリースの前の確認を速くする

## 1. 概要

リリースの前の npm run check・統合テスト・docs:build が 20 分を超えるため、重複を外し、並べて流せるものを並べ、テストの並列を見直して短くする

## 2. 入力

- 利用者の依頼（2026-11-20）: リリースの前の確認を速くしたい。todo として起票する。担当 DEV、期限は未定、0.9.1 には入れない
- orchestrator の調べ（2026-11-20）: npm run check の最後の npm test は vitest.config.ts の projects で unit と integration の両方を流す。リリースの手順でその後に流している test:integration は重複で、0.9.1 の前の実測で約 112 秒
- orchestrator の調べ（2026-11-20）: npm test は unit・integration とも maxWorkers 2。この環境は 16 コアで、テストの実時間は約 205 秒（テストの合計は約 367 秒）。check の lint と検証は && で 1 本ずつ流れている。lint ごとの所要時間は測っていない

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
