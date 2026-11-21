---
specdojo:
  id: prj-0001:pjr-bnav-faster-docs-dev-startup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T12:22:43Z"
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

| No  | 作業                                         | 担当 | 状態 | メモ |
| --- | -------------------------------------------- | ---- | ---- | ---- |
| 1   | 段ごとの時間を測る                           | DEV  | open | -    |
| 2   | ツリーへのコピーから実行の記録を外す         | DEV  | open | -    |
| 3   | 重ねる型がないときのコピーを減らす           | DEV  | open | -    |
| 4   | `docs:generate` を `dist` で流せるようにする | DEV  | open | -    |
| 5   | 保護された設定の案と CHANGELOG の文案を書く  | DEV  | open | -    |
| 6   | 測り直して検証を通す                         | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
