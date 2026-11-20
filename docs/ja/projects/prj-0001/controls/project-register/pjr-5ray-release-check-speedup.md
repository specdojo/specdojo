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

- `npm run check`・`npm run test:integration`・`npm run docs:build` を、段（typecheck・lint:ts・lint:md・lint:fm・lint:mermaid・lint:d2・validate:schema・validate:catalog・validate:history-links・npm test）ごとに時間を測り、個票の対応結果に表で書く。
- 運用メモ（`pm-orchestrator-playbook.md`）のリリースの手順から、`npm run check` と重なる `npm run test:integration` を外す。外す理由（`npm test` が unit と integration の両方を流すこと）を書く。
- 互いに依存しない lint と検証を並べて流す案と、リリースのときだけテストの並列（`maxWorkers`）を上げる案を、手元で試して所要時間を測る。どちらを採るかと理由を書く。CI と exec の親の検証が検出する不具合は変えない。
- `package.json`・`vitest*.ts` の変更が要る場合は、保護された設定に当たるものは executor が変えず、案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えない。利用者に影響が無いことを対応結果に書く。
- `npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
