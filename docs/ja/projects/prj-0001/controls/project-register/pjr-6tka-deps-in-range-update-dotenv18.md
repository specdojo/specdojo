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
| 1   | `package.json`・lockfile の範囲内の更新        | orchestrator | done | agent が変更できない設定のため orchestrator が行う      |
| 2   | `dotenv` 18 への更新と動作確認                 | orchestrator | done | コードの手直しが要る場合だけ exec run で agent に任せる |
| 3   | `npm run check` と `npm run docs:build` の確認 | orchestrator | done | -                                                       |

## 4. 対応結果

2026-09-30、orchestrator が `feature/prj-0001/deps-update-v0-3-0` で対応し、develop へ merge した（`edd69622`）。

- `931e8866`: `js-yaml` の下限を `^4.3.2`、`dotenv` を `^18.0.4` に上げ、ルート・docs-site・docs-lint で `npm update` と `npm audit fix`（`--force` なし）を行った。ルートの `npm audit --omit=dev` は 0 件になった。
- `dotenv` 18: 使い方は `src/specdojo-config.ts` の `config({ quiet: true })` だけで、コードの変更は不要だった。CLI を実行しても `dotenv` の出力は出ない。
- `a99c7421`: prettier が 3.9.9 に上がり、`src` の 9 ファイルで `for` 文の空白と union 型の改行が変わった。prettier は利用者の環境に入る `dependencies` であり、範囲指定のままでも新規インストールで 3.9 が入るため、利用者の判断（A 案）により 3.9 を受け入れて整形を反映した。挙動の変更はない。
- `npm run check`（1858 件）と `npm run docs:build` が通過した。
- 残課題: docs-site の `extract-zip`・`esbuild` は [[prj-0001:pjr-xmma-docs-site-puppeteer25-mermaid12]]、docs-lint の 9 件は [[prj-0001:pjr-7gak-docs-lint-dependency-vulnerabilities]] で扱う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-xmma-docs-site-puppeteer25-mermaid12]]
- [[prj-0001:pjr-rcvs-js-yaml-5-migration]]
