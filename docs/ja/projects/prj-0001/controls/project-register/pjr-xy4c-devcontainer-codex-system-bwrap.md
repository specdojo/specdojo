---
specdojo:
  id: prj-0001:pjr-xy4c-devcontainer-codex-system-bwrap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-12T12:52:35Z"
  block_reason: "integrate failed: project: git commit failed: format: docs/ja/projects/prj-0001/execution/exec/evidence/PJR-XY4C/20261012T125314628Z-304dabfc/evidence.json 35ms (unchanged); FAIL  tests/packages/docs-…"
---

# PJR-XY4C devcontainer scaffold の codex でシステムの bubblewrap が sandbox を失敗させる

## 1. 課題内容

scaffold が使う typescript-node:22 のイメージに /usr/bin/bwrap があり、codex が同梱の bwrap ではなくそれを使うため codex sandbox が /proc のマウントで失敗する（PJR-27Z9 と同じ事象）。codex の provider を選んだ場合はシステムの bubblewrap を外し、同梱の bwrap を使わせる

## 2. 影響範囲

| 観点         | 影響                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `specdojo devcontainer scaffold --provider codex` が生成する devcontainer（`src/devcontainer-scaffold.ts` と `templates/devcontainer/`） |
| スケジュール | v0.3.0 の公開前に直す（利用者の判断、2026-10-12）                                                                                        |
| コスト       | 生成したコンテナで codex の sandbox が動かず、codex を executor に使えない                                                               |
| 品質         | PJR-EZAF の対応（`seccomp=unconfined`）だけでは、利用者の環境で codex が動かない                                                         |
| 関係者       | devcontainer scaffold で codex を使う利用者                                                                                              |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | scaffold が使う `mcr.microsoft.com/devcontainers/typescript-node:22` には `/usr/bin/bwrap`（システムの bubblewrap）が入っている。codex は PATH 上の `bwrap` を同梱版より優先し、システムの bubblewrap は `/proc` のマウントの失敗を codex の想定と異なる文言で返すため、codex が `/proc` をマウントしない方式へ切り替えられない（openai/codex#44329、本リポジトリでは PJR-27Z9 で同じ対処をした）。2026-10-12 の実機確認で、`/usr/bin/bwrap` の存在と、`sudo apt-get remove -y bubblewrap` の後に `codex sandbox -- sh -c "ls -d /; touch /etc/x"` が `/` を表示し `/etc/x` への書き込みを拒否することを利用者が確かめた |
| 対応策   | `codex` の provider を選んだ場合だけ、生成する post-create の処理で、システムの bubblewrap が入っていれば外し（`sudo apt-get remove -y bubblewrap`）、codex 同梱の bwrap を使わせる。外せなかった場合は警告を出して続ける。PJR-EZAF の `--security-opt=seccomp=unconfined` は残す。`systempaths=unconfined` は使わない                                                                                                                                                                                                                                                                                                   |
| 依存事項 | PJR-EZAF（`seccomp=unconfined` の追加）の続き                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 完了条件 | `--provider codex` を含む場合だけ post-create にシステムの bubblewrap を外す処理が入り、含まない場合は入らないことを単体テストで確認する。command-reference の devcontainer scaffold の codex の説明に、システムの bubblewrap を外す理由（PJR-27Z9 と同じ）を記載する。実機の確認は利用者が行う（生成したコンテナで `command -v bwrap` が見つからず、`codex sandbox -- sh -c "ls -d /; touch /etc/x"` が `/` を表示して書き込みを拒否する）                                                                                                                                                                              |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ezaf-devcontainer-template-codex-sandbox]]: scaffold の codex の sandbox の対応（seccomp）
- [[prj-0001:pjr-27z9-codex-bwrap-proc-mount]]: 本リポジトリの devcontainer で同じ事象に対処した項目
