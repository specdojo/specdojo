---
specdojo:
  id: prj-0001:pjr-ezaf-devcontainer-template-codex-sandbox
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T05:03:36Z"
  due_on: null
---

# PJR-EZAF devcontainer テンプレートで codex の sandbox が動くか確認し、必要な設定を加える

## 1. 概要

specdojo devcontainer scaffold のテンプレートはシステムの bubblewrap を入れないため、PJR-27Z9 の /proc の問題は起きない見込みである。一方、runArgs を持たず Docker 既定の seccomp が名前空間の作成（unshare / clone の名前空間フラグ）を禁止するため、codex 同梱の bwrap が sandbox を作れない可能性が高い。Docker が必要なため Host Mac で実際に確認し、問題があれば codex provider の指定時だけ設定を加える

## 2. 完了条件

- Host Mac で、テンプレートから作った devcontainer（`--provider codex`）の中で `codex sandbox -- ls -d /` を実行した結果を記録している。ベースイメージ（`mcr.microsoft.com/devcontainers/typescript-node:22`）に bubblewrap が入っているかも記録している。
- sandbox が動かない場合は、原因（seccomp、AppArmor、`/proc` のマスクなど）を特定し、codex provider を指定したときだけ必要な設定（例: `runArgs` の `--security-opt=seccomp=unconfined`）を scaffold が加えるようにしている。隔離を緩める設定は、緩む範囲と採否の理由を記録し、`--security-opt=systempaths=unconfined` のように隔離を大きく弱める設定は使わない。
- 設定を加えた場合、設定後の devcontainer で `codex sandbox` と `codex exec --sandbox workspace-write` が動き、sandbox の外への書き込みが拒否されることを確認している。
- scaffold の unit test、生成される `devcontainer.json`、`docs/ja/specdojo/references/command-reference.md` の `devcontainer scaffold` の説明を更新している。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                                       | 担当 | 状態 | メモ                                         |
| --- | -------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | Host Mac でテンプレートの devcontainer を作り、codex の sandbox を確認する | DEV  | done | 2026-10-13、利用者が Host Mac で確認した     |
| 2   | 原因の特定と、codex provider の指定時だけ設定を加える実装                  | DEV  | done | Docker 既定 seccomp の名前空間作成制限に対応 |
| 3   | 文書とテストの更新、設定後の確認                                           | DEV  | done | PJR-XY4C の修正を含む tarball で確認した     |

### 3.1. 確認の手順

Host Mac で、空のリポジトリにテンプレートを展開して devcontainer を作る。

```bash
mkdir -p ~/tmp/specdojo-template-check && cd ~/tmp/specdojo-template-check
git init
npx specdojo devcontainer scaffold --providers codex
devcontainer up --workspace-folder .
```

devcontainer の中で、bubblewrap の有無と codex の sandbox を確認する。

```bash
devcontainer exec --workspace-folder . bash -lc 'command -v bwrap || echo "no system bwrap"; codex --version'
devcontainer exec --workspace-folder . bash -lc 'codex sandbox -- sh -c "ls -d /; touch /etc/x"'
```

`ls -d /` の結果が表示され、`/etc/x` への書き込みが拒否されれば動いている。`No permissions to create a new namespace` や `Operation not permitted` などで失敗した場合は、エラー文を記録する。`devcontainer` CLI がない場合は、VS Code で同じフォルダーを devcontainer として開き、ターミナルで同じコマンドを実行する。

確認後、コンテナと作業フォルダーを削除する。

## 4. 対応結果

`codex` provider を指定したときだけ、scaffold が生成する `devcontainer.json` の `runArgs` に `--security-opt=seccomp=unconfined` を追加するようにした。Codex 同梱の bubblewrap が user namespace を作成できるよう Docker の syscall filter を無効にする設定であり、追加の Linux capability は付与しない。Docker が保護する `/proc`・`/sys` を公開する `--security-opt=systempaths=unconfined` は、隔離をさらに弱めるため採用していない。Codex を指定しない場合は `runArgs` 自体を生成せず、Docker の既定 seccomp profile を維持する。

scaffold の unit test には、Codex を含む場合に上記 `runArgs` が生成されることと、Codex を含まない場合は生成されないことを追加した。[[specdojo:command-reference|SpecDojo コマンドリファレンス]] には、設定の適用条件、緩和する隔離の範囲、`systempaths=unconfined` を採用しない理由、Codex sandbox を引き続き使うことを記載した。

executor 環境には Docker と Dev Container CLI がないため、Host Mac での実機確認は未実施である。「確認の手順」に従い、ベースイメージの system bubblewrap の有無、変更前の失敗、変更後の `codex sandbox` と `codex exec --sandbox workspace-write`、sandbox 外への書き込み拒否を確認して記録する必要がある。

### 4.1. Host Mac での確認（2026-10-13）

PJR-XY4C の修正（システムの bubblewrap の削除）を含む `npm pack` の tarball を空のリポジトリへ入れ、`devcontainer scaffold --provider claude,codex --editor emacs --tmux --force` で生成した devcontainer を `devcontainer up --remove-existing-container` で作り直して、利用者が確認した。

| 確認                                             | 結果                                                   |
| ------------------------------------------------ | ------------------------------------------------------ |
| `whoami`                                         | `node`                                                 |
| `command -v bwrap`                               | 何も表示されない（システムの bubblewrap は削除された） |
| `codex sandbox -- sh -c "ls -d /; touch /etc/x"` | `/` が表示され、`/etc/x` への書き込みは拒否された      |

修正前（2026-10-12）は、ベースイメージにシステムの bubblewrap（`/usr/bin/bwrap`）が入っており、`bwrap: Can't mount proc` で sandbox が起動しなかった（PJR-XY4C）。`codex exec --sandbox workspace-write` は個別には確認しておらず、同じ sandbox の起動と外への書き込みの拒否を `codex sandbox` で確かめたことで代えた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-27z9-codex-bwrap-proc-mount]]: 本体の devcontainer での同種の問題（システムの bubblewrap による `/proc` の mount の失敗）。
- [[tsd-home-mac-dev-server]]: 本体の devcontainer が codex 同梱の bwrap を使う理由。
- `templates/devcontainer/devcontainer.json`、`src/devcontainer-scaffold.ts`
