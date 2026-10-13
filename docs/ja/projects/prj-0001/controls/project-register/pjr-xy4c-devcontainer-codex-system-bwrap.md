---
specdojo:
  id: prj-0001:pjr-xy4c-devcontainer-codex-system-bwrap
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-12T12:52:35Z"
  completed_at: "2026-10-13T14:00:48Z"
  conclusion: codex を指定した scaffold の post-create でシステムの bubblewrap を削除し、生成した devcontainer で codex の sandbox が動くことを実機で確かめた
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

解決内容: `codex` provider を指定した場合だけ、scaffold が生成する `post-create.sh` にシステムの `bubblewrap` package の導入状態を確認する処理を追加した。導入済みであれば `sudo apt-get remove -y bubblewrap` を実行し、Codex 同梱の bwrap を使わせる。削除に失敗した場合は警告を標準エラーへ出して後続処理を続ける。PJR-EZAF で追加した `--security-opt=seccomp=unconfined` は維持し、`--security-opt=systempaths=unconfined` は使用しない。

確認結果: scaffold の unit test に、Codex を含む provider 構成では package 確認・削除・失敗時警告が生成され、Codex を含まない構成では削除処理が生成されないことの検証を追加した。[[specdojo:command-reference|SpecDojo コマンドリファレンス]] には、ベースイメージのシステム版 bwrap を削除する理由、Codex 同梱版へ切り替えること、削除失敗時の挙動を記載した。Host Mac 上での実機確認は利用者が実施する。2026-10-13 に、修正を含む tarball から作った devcontainer で `command -v bwrap` が何も表示せず、`codex sandbox -- sh -c "ls -d /; touch /etc/x"` で `/` が表示されて `/etc/x` への書き込みが拒否されることを利用者が確認した（記録は PJR-EZAF）。

再発防止策: provider 条件分岐の unit test に bubblewrap の処理を含め、Codex 以外の provider へ隔離緩和や package 削除が波及しないことを継続的に検査する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ezaf-devcontainer-template-codex-sandbox]]: scaffold の codex の sandbox の対応（seccomp）
- [[prj-0001:pjr-27z9-codex-bwrap-proc-mount]]: 本リポジトリの devcontainer で同じ事象に対処した項目
