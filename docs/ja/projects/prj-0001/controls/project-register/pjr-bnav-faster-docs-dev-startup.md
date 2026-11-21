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

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
