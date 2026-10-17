---
specdojo:
  id: prj-0001:pjr-mx4f-integrate-conflict-commit-skips-dist-rebuild
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-17T09:23:53Z"
  due_on: null
---

# PJR-MX4F 記帳の衝突を解いた統合のあとに dist が作り直されない

## 1. 課題内容

exec の統合で登録簿の記帳の衝突を解くと、runner は git commit --no-verify で merge を完了させる。post-merge の hook（build-if-stale）は git merge が完了したときにしか動かないため、この経路では dist が作り直されず、以後の runner が古いコードで動く。2026-10-17 の PJR-BZ9J と PJR-X8Y9 で起きた

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/worktree-ops-merge.ts` の `mergeWorktreeIntoCurrent` と `resolveBranchOwnedConflicts`、統合の後の dist の更新                                                                |
| スケジュール | runner のコードを変える作業が続くため、先に直す                                                                                                                                        |
| コスト       | 統合で記帳の衝突を解いた後、`dist/` が統合前のまま残る。以後の `exec run`・`routine run` が古いコードで動き、統合した修正が効かない。`dist-freshness` の警告は出るが、実行は止まらない |
| 品質         | 本リポジトリのように `dist/` を bin とする開発の作業場所で、統合した変更と実際に動くコードが食い違う                                                                                   |
| 関係者       | 本リポジトリの exec と routine の運用                                                                                                                                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 統合の `git merge` が記帳のファイル（登録簿のイベントと個票）で衝突すると、`resolveBranchOwnedConflicts` が衝突を解き、`git commit --no-verify` で merge を完了させる。`post-merge` の hook は `git merge` が完了したときにしか起動しないため、`lefthook.yml` の `build-if-stale` が動かない                             |
| 対応策   | 統合が完了した後（衝突の有無によらず）、runner が `build-if-stale` と同じ判定（`src/` が `dist/` より新しいときだけ作り直す）を明示的に行う。hook と二重に動いても、`dist/` が新しければ何もしないため問題ない。`build-if-stale` の処理（`src/shared/build-if-stale.ts`）を呼ぶか、`tools/build-if-stale.mjs` を起動する |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                     |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                                                                                   |

### 3.1. 完了条件

- exec の統合で記帳の衝突を解いて merge を完了させた場合も、統合の後に `dist/` が `src/` より古ければ作り直される。衝突のない統合でも同じ判定を行う。
- 作り直しは、`build-if-stale` と同じく `dist/` を bin とするリポジトリ（本リポジトリの開発の作業場所）でだけ行い、利用者のリポジトリ（`node_modules` の specdojo を使う場合）では何もしない。判定の方法は `build-if-stale` の既存の判定に揃える。
- 作り直しに失敗しても統合そのものは失敗させず、警告を出す（hook と同じ best-effort）。
- 統合テストで、記帳の衝突を解く統合の後に作り直しの処理が呼ばれることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 4. 対応結果

解決内容:

- `mergeWorktreeIntoCurrent` が統合に成功した後、scheduler lock を解放する前に、統合先リポジトリの `tools/build-if-stale.mjs` を明示的に起動するようにした。通常の `git merge` と、記帳の衝突を `git commit --no-verify` で解消した場合の両方が同じ後処理を通る。
- `package.json` の `bin.specdojo` が `dist/specdojo.js` を指し、既存の `build-if-stale` 入口を持つ開発 checkout だけを対象とする。入口をそのまま使うため、primary worktree、`tsx` の有無、`src/` と `dist/` の鮮度に関する判定は hook と一致し、利用者リポジトリでは何もしない。
- 起動エラーや非ゼロ終了を警告として扱い、再ビルドに失敗しても完了済みの統合を失敗へ変えない best-effort 動作にした。

確認結果:

- 記帳ファイルの衝突を自動解消する統合テストへ、統合後に `tools/build-if-stale.mjs` が起動されたことを確認する assertion を追加した。
- 変更ファイルの Prettier 整形、register build、catalog validate を実行し、成功した。typecheck、lint、unit test、integration test、schema validate は executor 終了後に親 runner が実行する。
- orchestrator から `exec run --register` を 1 回統合まで流す確認は、この変更自体が統合された後に行う close 条件として runner・人間へ引き継ぐ。

再発防止:

- post-merge hook の発火有無に依存せず、runner 自身が統合成功後の鮮度確認を必ず要求する。hook と重複して起動しても、既に `dist/` が最新なら既存判定により再ビルドされない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-cmyx-exec-dist-parent-validations]]: dist が古いまま動く問題の以前の対応（`build-if-stale` の hook）。
- [[prj-0001:pjr-bz9j-src-exec-run-schedule-subdirs]]・[[prj-0001:pjr-x8y9-src-dependency-direction-rules]]: 事象が起きた統合。
