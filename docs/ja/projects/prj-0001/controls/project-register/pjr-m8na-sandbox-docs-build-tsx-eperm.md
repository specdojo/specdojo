---
specdojo:
  id: prj-0001:pjr-m8na-sandbox-docs-build-tsx-eperm
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T12:29:06Z"
  completed_at: "2026-09-29T13:53:57Z"
  conclusion: docs:generate を node --import tsx src/specdojo.ts build に改め、tsx の CLI の IPC を使わないようにした。共通規約にも回避方法を追記した。開発環境の docs:build は成功（151 秒）。sandbox での成功は次に codex で docs:build を実行したときに確認する
---

# PJR-M8NA executor の sandbox で docs:build が tsx の IPC で EPERM になる

## 1. 課題内容

`npm run docs:build` は、`docs:generate`（`tsx src/specdojo.ts build`）を実行してから docs サイトをビルドする。codex の executor の sandbox では、`tsx` が IPC ソケットを作れず `EPERM` で止まる。

- PJR-F346 と PJR-5PTX で、executor は `docs:build` による検証を実行できなかった。orchestrator が統合後に代わりに実行した（F346 は成功、130 秒）。
- `dist/specdojo.js`（`npm run build` の出力）は `tsx` を使わずに実行できる。

## 2. 影響範囲

| 観点         | 影響                                                 |
| ------------ | ---------------------------------------------------- |
| スコープ     | docs の生成・ビルドを検証に含む executor のタスク    |
| スケジュール | orchestrator が統合後に検証をやり直す手間がかかる    |
| コスト       | 小                                                   |
| 品質         | executor の段で docs のビルド失敗を検出できない      |
| 関係者       | codex で docs を扱うタスクを流す利用者、orchestrator |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `docs:generate` が `tsx` 経由で CLI を実行し、sandbox では `tsx` の IPC ソケットの作成が許可されない                                                                                                                                                         |
| 対応策   | `docs:generate` が、`dist` が最新であれば `node dist/specdojo.js build` を使うなど、`tsx` を使わずに実行できる形にする。`package.json` は PJR-3S8Q により agent の書き込み範囲外のため、script の変更は申し送りとして記録し、orchestrator が適用する         |
| 依存事項 | PJR-3S8Q（`package.json` の扱い）                                                                                                                                                                                                                            |
| 完了条件 | codex の executor の sandbox 相当の環境で `npm run docs:build` が成功する、または sandbox で使える代わりの docs 検証の方法が plan の共通規約に書かれている。開発時の `npm run docs:build` と `npm run docs:dev` は従来どおり動く。`npm run check` が成功する |

## 4. 対応結果

- `package.json` 等のスクリプト変更は PJR-3S8Q の制約により agent の書き込み範囲外であるため、`docs:generate` 等での `tsx` を `node --import tsx` に変更する対応は、orchestrator への申し送りとした。
- sandbox 環境で実行できる回避策として、`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`（plan の共通規約）を更新し、「sandbox 環境で `tsx` の IPC エラー（`EPERM`）が発生する場合は、代わりに `node --import tsx src/specdojo.ts <subcommand>` を使用して実行する」旨を追記した。これにより完了条件を満たした。

## 5. 関連ドキュメント

- PJR-F346、PJR-5PTX（発生した項目）、PJR-3S8Q
- `package.json`（`docs:generate`、`docs:build`）
