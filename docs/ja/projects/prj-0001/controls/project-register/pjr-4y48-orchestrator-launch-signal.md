---
specdojo:
  id: prj-0001:pjr-4y48-orchestrator-launch-signal
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-10-10T01:05:02Z"
  due_on: "2026-10-31"
---

# PJR-4Y48 orchestrator launch が Ctrl-C で先に終了し provider の CLI が取り残される

## 1. 課題内容

specdojo orchestrator launch は SIGINT の既定動作で即座に終了し、Ctrl-C を入力の取り消しに使う claude や codex の CLI だけが動き続けて端末の操作が壊れる。子の実行中は SIGINT/SIGQUIT を無視し、SIGTERM/SIGHUP を転送する。

## 2. 影響範囲

| 観点         | 影響                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| スコープ     | `src/orchestrator.ts` の `runOrchestratorLaunch` とそのテスト                                    |
| スケジュール | PJR-ZGJ4 の close の前提になる                                                                   |
| コスト       | シグナル処理の小規模な追加                                                                       |
| 品質         | `npm run orch:*` の対話中に Ctrl-C を押すと npm 側が終了し、provider の CLI が端末に取り残される |
| 関係者       | `orch:*` で orchestrator を起動する全利用者                                                      |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `runOrchestratorLaunch` が子プロセスを `stdio: "inherit"` で起動するが、親の Node は SIGINT の既定動作で終了する。端末の Ctrl-C は前面のプロセスグループ全体へ送られるため、子が SIGINT を処理して続行しても親だけが終わる（偽の provider で、親が即時に終了し子が動き続けることを再現済み） |
| 対応策   | 子の実行中は親で SIGINT と SIGQUIT を無視し（子には端末から直接届く）、SIGTERM と SIGHUP は子へ転送する。子の終了後にハンドラを外す                                                                                                                                                          |
| 依存事項 | PJR-ZGJ4                                                                                                                                                                                                                                                                                     |
| 完了条件 | 下記「完了条件」のとおり                                                                                                                                                                                                                                                                     |

### 3.1. 完了条件

- `specdojo orchestrator launch` の実行中に SIGINT と SIGQUIT を受けても、起動用のプロセスは終了せず、子の終了を待つ。
- SIGTERM と SIGHUP を受けた場合は子へ転送し、子の終了を待ってから終了する。
- 子が終了コードで終われば同じ終了コード、シグナルで終われば `128 + シグナル番号` を終了コードにする。
- 子の終了後、追加したシグナルハンドラが残らない。
- unit test で上記を確かめる。実プロセスへシグナルを送るテストが必要な場合は `*.integration.test.ts` に置く。
- `command-reference` の `orchestrator launch` の説明にシグナルの扱いを書き、CHANGELOG の PJR-ZGJ4 の記載に含める。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run lint:md` が通る。

### 3.2. 作業内容

- `src/orchestrator.ts` の `runOrchestratorLaunch` にシグナル処理を加える。
- テストと文書を更新する。
- 保護設定（`package.json`、`.agents/`・`.claude/` などの orchestrator 本文とラッパー）は変更しない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- PJR-ZGJ4（orchestrator のプロダクトリポジトリへのアクセス）
