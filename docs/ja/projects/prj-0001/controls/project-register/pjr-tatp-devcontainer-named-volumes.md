---
specdojo:
  id: prj-0001:pjr-tatp-devcontainer-named-volumes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: OPS
  registered_at: "2026-10-11T22:10:19Z"
---

# PJR-TATP worktrees と node_modules を共有フォルダから named volume へ移す

## 1. 概要

ワークスペース全体が virtiofs の bind mount 上にあり、16 個の node_modules と exec の worktree（計 8GB 程度）がファイル I/O を遅くしている。worktrees/ と各 node_modules を Docker の named volume へ移し、routine cron と exec のパス解決への影響を設計する

## 2. 完了条件

- devcontainer で、exec の worktree の置き場（`/workspaces/specdojo-workspace/worktrees`）と、ワークスペースの 11 か所の `node_modules`（このリポジトリの 5 か所、`specdojo-prj-0002` の 4 か所、`specdojo-lp`・`specdojo-assets` の各 1 か所）を named volume にする。
- SpecDojo の設定（`worktree_base` など）は変えない。devcontainer の外（ホストで直接）で実行しても、今と同じく `../worktrees` とホストの `node_modules` を使って動く。
- `post-create.sh` が、volume の持ち主を `node` にそろえ、`package-lock.json` のあるディレクトリで `npm ci` を流す。volume が空の初回でも、作り直しのあとでも、`npm run build`・`npm link`・lefthook が動く。
- `.git` の設定に `gc.worktreePruneExpire=never` を入れ、ホストから見えない container の worktree の記録が `git gc` で消えないようにする。ホストで `git worktree prune` を流さないことと、同じ項目の run をホストと container で同時に流さないことを、運用メモに書く。
- 作り直す前に、ホストの `../worktrees` にある途中の worktree を一覧にし、利用者の確認のうえで片付ける。
- 作り直しのあと、`exec run --register --worktree` を 1 件と `npm run check` を流して動作を確かめ、作り直す前と後の時間（`npm ci`・worktree の作成・`npm run check`）を対応結果に書く。
- devcontainer の設定は利用者の環境の設定のため、orchestrator が feature ブランチで変え、利用者の確認のうえで develop へ取り込む。

## 3. 作業内容

| No  | 作業                                                | 担当                  | 状態 | メモ                                                                                                                                                                                               |
| --- | --------------------------------------------------- | --------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `devcontainer.json` に named volume の mount を足す | specdojo-orchestrator | done | `5704317eb`、develop へ取り込み `6d7839a3b`                                                                                                                                                        |
| 2   | `post-create.sh` に持ち主の調整と `npm ci` を足す   | specdojo-orchestrator | done | `.devcontainer/prepare-workspace-volumes.sh`                                                                                                                                                       |
| 3   | `gc.worktreePruneExpire` と運用メモ                 | specdojo-orchestrator | done | 設定は作り直しのときに `prepare-workspace-volumes.sh` が入れる                                                                                                                                     |
| 4   | 途中の worktree の片付け                            | indie                 | done | 2026-11-21 に利用者の承認で 28 個を消した（取り込み済み 11、終わったタスクの残り 9、orchestrator の作業 3、agent の作業場所 3、prj-0002 の KH17 の 2）。共有の `worktrees/` は 19GB から空になった |
| 5   | container の作り直し                                | indie                 | open | grade のし直し（regrade-kata-2026-11-21）が終わってから                                                                                                                                            |
| 6   | 作り直しのあとの動作と時間の確認                    | specdojo-orchestrator | open | -                                                                                                                                                                                                  |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
