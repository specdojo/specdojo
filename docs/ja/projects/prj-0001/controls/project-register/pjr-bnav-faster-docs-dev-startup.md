---
specdojo:
  id: prj-0001:pjr-bnav-faster-docs-dev-startup
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T12:22:43Z"
  completed_at: "2026-11-22T02:47:07Z"
  conclusion: 閲覧用のツリーへのコピーを差分にして実行の記録を外し、dist で流す generate と --skip-if-fresh を足した。cache のある起動は 10.9 秒から 8.4 秒。package.json と .devcontainer の案は対応結果に残した。
---

# PJR-BNAV npm run docs:dev の起動して開けるまでの時間を縮める

## 1. 概要

docs:dev は起動のたびに docs/ の 17,321 ファイルを共有フォルダの上で閲覧用のツリーへコピーし直し、tsx で specdojo build を流す。実行の記録をコピーから外し、重ねる型がないときのコピーを減らし、docs:generate を dist で流せるようにして起動を速くする

## 2. 入力

- 利用者の観察（2026-11-21、indie）: npm run docs:dev は、起動して開けるまでが特に遅い
- packages/docs-site/.vitepress/kata-staging.ts の stageBundledKata は、起動のたびに .vitepress/kata-staging を消し、docs/ 全体（17,321 ファイル、178MB）をコピーし直す。そのうち 14,213 ファイルは execution/ の実行の記録（2026-11-21 に確かめた）
- SpecDojo 自身のリポジトリでは重ねる型が 0 件。ツリーと .vitepress/cache は、ホストとの共有フォルダ（bind mount、fakeowner）の上にある
- docs:dev は先に docs:generate（node --import tsx src/specdojo.ts build）を流す
- 利用者の決定（2026-11-21、indie）: 起動の時間に絞って直す。書き換えの見張りの軽量化はこの項目では扱わない

## 3. 完了条件

- 変える前に、`npm run docs:dev` の段ごとの時間（`docs:generate`、閲覧用のツリーのコピー、VitePress の起動、最初のページが開けるまで）を測り、個票の対応結果に表で書く。測り方（コマンド・回数・ほかの run が流れていたか）も書く。
- 閲覧用のツリー（`.vitepress/kata-staging`）へのコピーから、サイトに出さない実行の記録（`docs/**/execution/` のうち、ページとして出さない log・json・plan・result など）を外す。サイトに出すページ・画像・ページが参照するファイルは今までどおりコピーする。
- 重ねる型が 0 件のとき（SpecDojo 自身のリポジトリなど）は、ツリーへのコピーを減らすか、なくす。利用リポジトリで package の型を重ねる動き（eject 済みは利用リポジトリ側を採る、消した型が残らない）は今までどおりとし、テストで確かめる。
- `docs:generate` を、ビルド済みの `dist` で流せるようにする（`dist` が古いときの扱いを決め、理由を個票の対応結果に書く）。生成物が新しいときに `docs:generate` を飛ばす選択肢を足す。
- 対象のパスは `packages/docs-site/.vitepress/kata-staging.ts`・`packages/docs-site/.vitepress/config.mts`・`packages/docs-site/bin/` と、その単体テスト。
- 保護された設定（`package.json` の script、`.devcontainer/devcontainer.json` でツリーと cache を named volume に置く案）は変えない。案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。
- 変えた後に、同じ段の時間を測り直し、変える前と並べて個票の対応結果に書く。
- `npm run docs:build` が通ることを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く（`@specdojo/docs-site` の変更として書く）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                                                |
| --- | -------------------------------------------- | ---- | ---- | ------------------------------------------------------------------- |
| 1   | 段ごとの時間を測る                           | DEV  | done | オーケストレーターが全段を測り、5.3 に記載                          |
| 2   | ツリーへのコピーから実行の記録を外す         | DEV  | done | `isStagingSkippedFile` を追加し、単体テストで確認                   |
| 3   | 重ねる型がないときのコピーを減らす           | DEV  | done | 全削除・全コピーをやめ、差分コピーと期待一覧による削除へ変更        |
| 4   | `docs:generate` を `dist` で流せるようにする | DEV  | done | bin に `generate` コマンドを追加                                    |
| 5   | 保護された設定の案と CHANGELOG の文案を書く  | DEV  | done | 下記 5.1・5.2 に記載                                                |
| 6   | 測り直して検証を通す                         | DEV  | done | 5.3 に測り直しを記載。`docs:build` 通過済み。親の検証は runner 実行 |

## 5. 対応結果

### 5.1. CHANGELOG に書く事項

- 区分: `@specdojo/docs-site` の Changed
- 文案: `docs:dev` の起動で、閲覧用ツリーへのコピーを差分更新にし、サイトに出さない `execution/` の log・json・plan・result を複製から外した。`specdojo-docs-site generate` を追加し、`dist` が `src` より新しければ `dist` で生成し、`--skip-if-fresh` で生成物が新しいときは飛ばせる。

### 5.2. 実施内容

- 測り方: `tsx` で `stageBundledKata` を worktree の docs/ に対して実行した時間（ms）。ほかの run が流れていた可能性があり、回数は旧 1 回・新 2 回。
- コピー段の測定: 変更前 1289 ms、変更後 初回 370 ms、2 回目以降 158 ms（実行の記録の除外と差分コピー）。ただし新 2 回は並行実行で、共有フォルダ上の主リポジトリではないため値は参考である。
- `docs:generate`・VitePress の起動・最初のページが開けるまでは、executor の sandbox では測れなかった。オーケストレーターが測り、結果を `### 5.3. 段ごとの時間` に書いた。
- `dist` が古いときは、生成物の実装が古いまま使われる誤りを避けるため、`dist/specdojo.js` が `src` の最新更新より古ければ `tsx` に戻す。
- 重ねる型の動き（eject 済みは利用側採用、消した型が残らない）は既存テストと追加テストで確認した。
- 保護された設定の案（変えていない）: `package.json` の `docs:generate` を `specdojo-docs-site generate --skip-if-fresh` 経由にする案と、`.devcontainer/devcontainer.json` でツリーと `.vitepress/cache` を named volume に置く案。反映は利用者の承認のもと feature ブランチで行う。
- 変更ファイル: `packages/docs-site/.vitepress/kata-staging.ts`、`packages/docs-site/bin/specdojo-docs-site.js`、`tests/packages/docs-site/kata-staging.test.ts`。

### 5.3. 段ごとの時間

オーケストレーターが 2026-11-22 に測った。

- 変える前は、develop の HEAD（5492f6a80）から作った別の worktree で、変えた後は、この項目の worktree で測った。どちらも worktree の置き場（`../worktrees`）で、devcontainer では named volume の上にある（PJR-TATP）。作業ツリー（bind mount）とは条件が違う。
- 測った間は、第 3 波の review の段の run（opus）が 3 本流れており、親の検証も動いていた。
- `docs:generate` は `node --import tsx src/specdojo.ts build` を 1 回流した。`generate` の 2 行は、変えた後に足した `specdojo-docs-site generate`（dist を使う）を 1 回ずつ流した。
- VitePress の起動は `specdojo-docs-site dev` を 2 回流した。`Local` の行が出るまでを起動、`/specdojo/` が 200 を返すまでを最初のページとした。1 回目は worktree に VitePress の cache がない状態である。
- 最初のページは HTML が返るまでで、ブラウザーがページの部品を読み込み終えるまでは含まない。

| 段                                     | 変える前   | 変えた後   |
| -------------------------------------- | ---------- | ---------- |
| `docs:generate`（tsx）                 | 13.2 秒    | 13.0 秒    |
| `generate`（dist）                     | -          | 12.7 秒    |
| `generate --skip-if-fresh`（新しい時） | -          | 0.1 秒     |
| 起動 1 回目（cache なし）              | 72.9 秒    | 72.4 秒    |
| 起動 2 回目（cache あり）              | 10.9 秒    | 8.4 秒     |
| 最初のページ（起動からの差）           | 0.1 秒以下 | 0.1 秒以下 |

読み取れること:

- 閲覧用のツリーへのコピーを差分にした効果は、cache のある 2 回目の起動で約 2.5 秒である。
- dist で流しても `docs:generate` はほぼ速くならない。時間の大半は生成そのものにかかる。生成物が新しいときに飛ばす `--skip-if-fresh` が最も効く（13 秒が 0.1 秒）。`package.json` の `docs:dev` をこの経由にする案（5.2 の保護された設定の案）を反映すると、cache のある起動は約 24 秒から約 8.5 秒になる見込みである。
- cache のない 1 回目の 72 秒は、この項目の変更では変わらない。VitePress の依存の事前の束ね（`optimizeDeps`）と設定の読み込みにかかると見られる。`.vitepress/cache` を named volume に置く案（5.2）は、この 1 回目を減らす候補であり、反映の後に測り直す。
- `npm run docs:build` は、この worktree で通った（126 秒）。
- close の後に、作業ツリー（bind mount）で VitePress の起動だけを 2 回測った（2026-11-22）。1 回目は 32.2 秒、cache のある 2 回目は 25.3 秒で、named volume の worktree の 8.4 秒の約 3 倍だった。このため、`.vitepress/` を named volume に置く案を反映した（e3fde6f28）。効くのは container の作り直しの後である。`docs:dev` の生成を飛ばす案も反映した（42d5b1d9a）。

## 6. 関連ドキュメント

- 影響先: `@specdojo/docs-site` の `kata-staging.ts` と `bin/specdojo-docs-site.js`。
