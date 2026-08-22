---
specdojo:
  id: prj-0001:pjr-6hf3-hook-script-dependency-free-entry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-22T23:09:24Z"
  due_on: "2026-08-31"
---

# PJR-6HF3 git hook から呼ぶスクリプトが devDependency に依存し、新規 worktree で失敗する

## 1. 課題内容

post-checkout hook が npm run build:if-stale を実行し、その実体は tsx src/build-if-stale.ts である。exec run --worktree が新規 worktree を作る時点では node_modules が無く、tsx を解決できずに hook が非ゼロ終了する。その結果 git worktree add が失敗し、checkpoint failed として claim がロールバックされる。build-if-stale.ts には linked worktree なら何もしない判定を入れてあるが、その判定へ到達する前に起動が失敗しており、ガードが自分の前提条件に依存する構造になっている。routine 経由の自動実行が claim と release を繰り返す状態になっている。

## 2. 影響範囲

| 観点         | 影響                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| スコープ     | worktree を新規作成する全タスク。`exec run --worktree` と routine 経由の `exec cycle` が該当する |
| スケジュール | 自動実行が claim と release を繰り返し、Ready タスクが進まない。実質的に自動実行が停止している   |
| コスト       | 追加の外部コストはなく、影響は復旧と再実行に要する作業時間                                       |
| 品質         | データ破損は起きない。ロールバックは正しく動作し、claim も解放されている                         |
| 関係者       | ARC（実装）。自動実行を利用する運用者                                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | hook から呼ぶ入口が `tsx` に依存している。新規 worktree では `node_modules` が無く、TypeScript のガード（linked worktree なら何もしない）へ到達する前に起動が失敗する                                                                                     |
| 対応策   | Node 標準だけで動く plain JS の入口（`tools/build-if-stale.mjs` など）を追加し、linked worktree と依存未インストールを判定して即終了する。条件を満たす場合のみ既存の判定処理へ委譲する。`prepare` の `node tools/install-lefthook.mjs` と同じ方式に揃える |
| 依存事項 | なし。`npx tsx` へ切り替える案は、依存が無い環境ではレジストリ取得を試みるため採らない                                                                                                                                                                    |
| 完了条件 | 新規 worktree の作成で hook が失敗しないこと。primary worktree でのブランチ切り替えでは従来どおり再ビルド判定が働くこと                                                                                                                                   |

## 4. 対応結果

-

検討時に却下した案を記録する。

- `npx tsx` へ切り替える: 新規 worktree では親ディレクトリを遡っても `node_modules` が無く、`npx` はレジストリ取得を試みる。ネットワークの無い実行環境では失敗し、ある環境でも worktree 作成のたびに取得が走る。
- `post-checkout` から外して `post-merge` だけにする: worktree 作成での失敗は消えるが、primary worktree でのブランチ切り替え後に dist が古いままになり、当初の目的を一部失う。

## 5. 関連ドキュメント

- hook を追加した項目: [[prj-0001:pjr-cmyx-exec-dist-parent-validations|PJR-CMYX exec 実行が古い dist ビルドを使い設定済み parent_validations が実行されない]]
- 同種の見落とし: [[prj-0001:pjr-x3e8-test-git-env-bare-repository|PJR-X3E8 テストの git 実行が環境を隔離せず、メインリポジトリを bare 化する]]
- 影響を受けた実行: `docs/ja/projects/prj-0001/execution/exec/events/` の `T-PLANNING-dct-index-010` の claim と release
- 変更対象: `lefthook.yml`、`package.json` の `build:if-stale`、`src/build-if-stale.ts`
- 同方式の前例: `tools/install-lefthook.mjs`
