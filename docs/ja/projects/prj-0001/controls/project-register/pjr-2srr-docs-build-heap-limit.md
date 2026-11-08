---
specdojo:
  id: prj-0001:pjr-2srr-docs-build-heap-limit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T02:15:46Z"
  derived_from:
    - PJR-HMV6
---

# PJR-2SRR docs:build が既定のメモリの上限で止まらないようにする

## 1. 概要

npm run docs:build が既定の heap では JavaScript heap out of memory で止まる。手元の検査と CI で同じ上限になるよう、docs:build の実行にメモリの上限を設定する

## 2. 入力

- 2026-11-08 の PJR-HMV6 の確認で、既定の heap の docs:build が FATAL ERROR: Ineffective mark-compacts near heap limit で止まり、`NODE_OPTIONS=--max-old-space-size=8192` では 665 秒で通った（環境のメモリは 15GB）。
- CI の .github/workflows/deploy.yml は `NODE_OPTIONS:` --max-old-space-size=4096 を設定している。package.json の scripts には設定がない。
- package.json は保護された設定のため、executor は変更案を個票の対応結果と報告の handoff に書き、反映は利用者の承認のもと feature ブランチで行う。

## 3. 完了条件

- `npm run docs:build` を手元で流したときのメモリの上限の設定の仕方を決めている。候補は `package.json` の scripts で設定するか、`packages/docs-site/bin/specdojo-docs-site.js` が子プロセスを起動するときに設定するかで、executor が選び、理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 上限の値を、今の実測（4GB で足りるか、8GB が要るか）をもとに決め、CI の `.github/workflows/deploy.yml` の値とそろえるか、分ける理由を書いている。
- `package.json` と `.github/workflows/` は executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。反映は利用者の承認のもと feature ブランチで行う。
- `packages/docs-site/` のコードを変える場合は、その変更で `npm run docs:build` が既定の環境で通ることを確かめている。
- CHANGELOG は未公開の版の節にだけ書き、公開済みの版の節を変えていない。
- `npm run lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                 | 担当   | 状態 | メモ |
| --- | ------------------------------------ | ------ | ---- | ---- |
| 1   | 設定の仕方と上限の値を決める         | _TODO_ | open | -    |
| 2   | コードを変えるか、変更案を書く       | _TODO_ | open | -    |
| 3   | 検査を流し、理由と案を対応結果に書く | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-hmv6-rename-cld-to-cdt]]
