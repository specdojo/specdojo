---
specdojo:
  id: prj-0001:pjr-tatp-devcontainer-named-volumes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: OPS
  registered_at: "2026-10-11T22:10:19Z"
  completed_at: "2026-11-21T07:37:03Z"
  conclusion: devcontainer で exec の worktree と 11 か所の node_modules を named volume に置いた。worktree の作成は 2 分超から 2.6 秒、npm run check は 461 秒から 281 秒になった。ホストで直接動かす場合の設定は変えていない
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
| 5   | container の作り直し                                | indie                 | done | 2026-11-21                                                                                                                                                                                         |
| 6   | 作り直しのあとの動作と時間の確認                    | specdojo-orchestrator | done | PJR-77JB・PJR-N5D2 の exec run --register --worktree が統合まで通った                                                                                                                              |

## 4. 対応結果

- `.devcontainer/devcontainer.json` に、exec の worktree の置き場（`/workspaces/specdojo-workspace/worktrees`）と 11 か所の `node_modules` の named volume を足した（`5704317eb`、develop へ取り込み `6d7839a3b`）。`worktree_base` は `../worktrees` のまま変えていない。
- `.devcontainer/prepare-workspace-volumes.sh` を足し、`post-create.sh` から `npm run build` の前に呼ぶ。volume の持ち主を `node` にそろえ、空の `node_modules` に `npm ci` を流し、`gc.worktreePruneExpire=never` を入れる。
- 作り直しの前に、利用者の承認で共有の `worktrees/` の 28 個の worktree を消した（19GB から空へ）。
- 2026-11-21 に利用者が container を作り直したあと、12 か所がすべて ext4 の volume（作り直す前は共有フォルダの `fakeowner`）で持ち主が `node`、11 か所の `node_modules` が `npm ci` 済み、`gc.worktreePruneExpire` が `never` であることを確かめた。
- 時間の比べ（作り直す前 → あと）。

| 処理                                | 作り直す前                             | 作り直したあと |
| ----------------------------------- | -------------------------------------- | -------------- |
| `git worktree add`                  | 2 分を過ぎても終わらない               | 2.6 秒         |
| worktree のルートの `npm ci`        | 計っていない（共有フォルダの上で数分） | 2.7 秒         |
| `npm run check`                     | 461 秒（PJR-5RAY の計測）              | 281 秒         |
| `npm run check:release`（PJR-5RAY） | -                                      | 141 秒         |

- 運用メモの「落とし穴」に、ホストで `git worktree prune` を流さないこと、同じ項目の run をホストと container で同時に流さないこと、ホストで直接動かすときは一度 `npm ci` を流すことを書いた。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
