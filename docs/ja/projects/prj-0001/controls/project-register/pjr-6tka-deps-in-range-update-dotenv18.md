---
specdojo:
  id: prj-0001:pjr-6tka-deps-in-range-update-dotenv18
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-29T22:17:07Z"
---

# PJR-6TKA 範囲内の依存の更新と dotenv 18 への更新

## 1. 概要

js-yaml の下限を 4.3.2 に上げ、ルート・docs-site・docs-lint で npm audit fix（--force なし）と npm update を行い、dotenv を 18 に上げる（v0.3.0）

## 2. 完了条件

- `js-yaml` の下限を `^4.3.2` に上げている。
- ルート・docs-site・docs-lint で `npm audit fix`（`--force` なし）と `npm update` を行い、`npm audit --omit=dev` で `fast-uri` と `js-yaml` の high が報告されない。
- `dotenv` を `^18` に上げ、`.env` の読み込みで stdout に余計な出力が出ない。
- prettier が 3.9 に上がっても、`npm run format` で既存ファイルに差分が出ない。差分が出た場合は差分を示して判断を仰ぐ。
- `npm run check` と `npm run docs:build` が通る。

## 3. 作業内容

| No  | 作業                                           | 担当         | 状態 | メモ                                                    |
| --- | ---------------------------------------------- | ------------ | ---- | ------------------------------------------------------- |
| 1   | `package.json`・lockfile の範囲内の更新        | orchestrator | open | agent が変更できない設定のため orchestrator が行う      |
| 2   | `dotenv` 18 への更新と動作確認                 | orchestrator | open | コードの手直しが要る場合だけ exec run で agent に任せる |
| 3   | `npm run check` と `npm run docs:build` の確認 | orchestrator | open | -                                                       |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-xmma-docs-site-puppeteer25-mermaid12]]
- [[prj-0001:pjr-rcvs-js-yaml-5-migration]]
