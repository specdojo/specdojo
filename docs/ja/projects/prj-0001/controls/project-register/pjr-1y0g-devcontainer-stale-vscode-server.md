---
specdojo:
  id: prj-0001:pjr-1y0g-devcontainer-stale-vscode-server
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: OPS
  registered_at: "2026-09-17T22:14:56Z"
  due_on: "2026-09-30"
---

# PJR-1Y0G devcontainer に残る vscode-server の残骸プロセスを抑止・掃除する

## 1. 概要

devcontainer は `"shutdownAction": "none"` でコンテナを生かし続ける運用のため、VS Code の再接続や更新のたびに旧 commit の `server-main.js`、親を失った extension host・language server・拡張のデーモン（`openai.chatgpt` の `codex` など）がコンテナ内に残り、メモリを圧迫していた。grade の background job がメモリ不足で停止した際、VS Code 系だけで約 3 GB（12 GB 中）を占めていた。

原因は次の 2 点。

- PID 1 が devcontainer 既定の `sh -c "while sleep 1 & wait $!"` で、孤児プロセスの回収も停止時のシグナル伝播も行わない。
- VS Code 更新後は新しい commit ディレクトリで server が起動し、旧 server は誰にも止められず残る。

## 2. 完了条件

- `devcontainer.json` に `"init": true` が設定され、rebuild 後に PID 1 が init になる。
- 最新 commit 以外の server とその子孫、および PID 1 の子になった vscode-server 系プロセスだけを停止するスクリプトがあり、`--dry-run` / `--list` で対象を確認できる。稼働中の接続は対象にしない。
- VS Code 接続時（`postAttachCommand`）に自動実行され、`npm run vscode:ps` / `npm run vscode:kill-stale` で手動実行もできる。
- `shellcheck` / `shfmt` が通り、CONTRIBUTING に使い方が書かれている。

## 3. 作業内容

| No  | 作業                                                                                         | 担当 | 状態 | メモ                                                          |
| --- | -------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------- |
| 1   | `devcontainer.json` に `init: true` と `postAttachCommand` を追加する                        | OPS  | done | オーケストレーターが直接対応                                  |
| 2   | `.devcontainer/kill-stale-vscode.sh` を作成し、`vscode:ps` / `vscode:kill-stale` を追加 | OPS  | done | 孤児の疑似プロセスで検出・停止を確認                          |
| 3   | CONTRIBUTING に掃除の手順と `init` 反映に rebuild が必要な旨を記載する                       | OPS  | done | -                                                             |
| 4   | コンテナを rebuild して PID 1 が init になることと、接続時の自動掃除を確認する               | OPS  | open | 利用者が rebuild 後に `ps -p 1` と `npm run vscode:ps` で確認 |

## 4. 対応結果

- `.devcontainer/devcontainer.json`: `"init": true`、`"postAttachCommand": "bash .devcontainer/kill-stale-vscode.sh"` を追加。
- `.devcontainer/kill-stale-vscode.sh`: bash と `ps` だけで動く。最新 commit の `server-main.js` を正とし、(1) 他 commit の server とその子孫、(2) PPID が 1 の vscode-server 系プロセス（生きている server 本体は除外）を SIGTERM → 3 秒後に SIGKILL で停止する。`--dry-run` で対象表示、`--list` で全 vscode-server 系プロセスをメモリ順に表示する。
- `package.json`: `vscode:ps`、`vscode:kill-stale` を追加。
- `CONTRIBUTING.md`: 「残った VS Code Server のプロセスを掃除する」を追加。
- 検証: `shellcheck` / `shfmt -i 2` 通過。`/home/node/.vscode-server/fake/orphan-test` を名乗る孤児プロセスを起動し、`--dry-run` で `[orphan]` として検出、実行で停止することを確認。現行の稼働中プロセスは対象外（`no stale processes`）。
- 残課題: `init` は rebuild 後に有効。`openai.chatgpt` 拡張の `codex` デーモン（約 390 MB）はユーザー設定 `remote.extensionKind` でホスト側実行にすると更に軽くなるが、個人設定のため本 todo では扱わない。

## 5. 関連ドキュメント

- `.devcontainer/devcontainer.json`
- `.devcontainer/kill-stale-vscode.sh`
- `CONTRIBUTING.md`
