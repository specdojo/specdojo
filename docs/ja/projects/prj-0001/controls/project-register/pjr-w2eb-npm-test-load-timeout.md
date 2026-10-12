---
specdojo:
  id: prj-0001:pjr-w2eb-npm-test-load-timeout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-10T22:39:00Z"
---

# PJR-W2EB npm test の一括実行で負荷によりテストがタイムアウトする

## 1. 課題内容

npm test（vitest run）は単体と統合をまとめて既定の並列数で流すため、毎回別のテストが 1〜2 件タイムアウトで失敗する（10/11 に 2 回、exec-pipeline-e2e・exec-worktree-ops・doc-index）。test:unit と test:integration を分けて流すと全件通過する。npm run check が公開判定の基準 2 を満たせない。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | commit 前の hook（lefthook の `test`）と、`npm test` を使う全件の検証                                                                                         |
| スケジュール | v0.3.0 の公開前に直す（2026-10-13、利用者の判断）                                                                                                             |
| コスト       | exec の統合の commit や手動の commit が時間切れで失敗し、再実行や orchestrator による統合の手間が生じる。2026-10-12 には PJR-XY4C の統合が 3 回続けて失敗した |
| 品質         | 中身の誤りではない失敗が混ざり、検証の信頼性が下がる                                                                                                          |
| 関係者       | exec と routine を使う利用者、orchestrator、本リポジトリの開発者                                                                                              |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | commit 前の hook は `npm test`（`vitest run`）を実行し、`vitest.config.ts` を使う。この設定は `maxWorkers` を持たないため、単体と統合の約 2226 件を CPU の数（16）に近い並列で流し、Docker Desktop の共有フォルダ（virtiofs）の上で負荷が急に上がる。さらに統合テストの時間の上限が既定の 5 秒になり、`vitest.integration.config.ts` の 30 秒と食い違う。親検証は `vitest.unit.config.ts`（`maxWorkers: 2`）と `vitest.integration.config.ts`（`testTimeout: 30000`）で別々に流すため通り、hook だけが落ちる |
| 対応策   | `vitest.config.ts` を親検証の 2 つの設定に揃える。(1) `maxWorkers` を 2 に固定する。(2) 統合テスト（`*.integration.test.ts`）の `testTimeout` を 30 秒にし、単体テストは既定のままにする（vitest の projects などでファイルの種類ごとに指定する）。setup・env・include は既存の設定を保つ                                                                                                                                                                                                                    |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | `npm test` が単体と統合の両方を、`maxWorkers` 2 と、統合テストの 30 秒の上限で実行することを確認する（設定の内容と、実行時の表示または単体テストで確かめる）。`npm test` が全件通る。`test:unit` と `test:integration` の挙動は変わらない。lefthook の `test` の段は変えない                                                                                                                                                                                                                                 |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-xy4c-devcontainer-codex-system-bwrap]]: 統合の hook が続けて時間切れで失敗した実行
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: 公開の判定基準（既知の問題から外れる）
