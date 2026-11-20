---
specdojo:
  id: prj-0001:pjr-h1pq-dependency-vulnerabilities
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-19T21:22:21Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-P318
---

# PJR-H1PQ docs-site などの依存の脆弱性を直す

## 1. 課題内容

Dependabot alerts を有効にして見つかった依存の脆弱性を直す。docs-site の配る依存の high（mermaid・lodash-es・puppeteer など）は 0.9.0 の前に npm audit fix で直し、vscode-specdojo・docs-lint・ルートの開発用は 0.9.1 で扱う

## 2. 入力

- 利用者の決定（2026-11-20）: 案 A。0.9.0 の前に docs-site の lockfile だけ npm audit fix で直し、残りは 0.9.1 で扱う
- orchestrator の調べ（2026-11-20）: Dependabot alerts を有効にした直後、main に 101 件（high 35）。develop の npm audit では、配る依存はルート 0 件、docs-lint moderate 9・low 3、docs-site high 11・moderate 5・low 3、vscode-specdojo は開発用に high 10・moderate 4
- orchestrator の調べ（2026-11-20）: docs-site の vite・vitepress・esbuild は直す版が無い（vitepress 1.x が古い vite に依存）。開発サーバーに関する advisory

## 3. 影響範囲

| 観点         | 影響                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| スコープ     | docs-site の lockfile（0.9.0 の前）。vscode-specdojo・docs-lint・ルートの開発用の依存と vite・vitepress（0.9.1）        |
| スケジュール | 0.9.0 のリリース（PJR-PAE3、期限 2026-11-30）の前に docs-site の分を取り込む                                            |
| コスト       | lockfile の更新と、`docs:build`・`npm run check` の確認のやり直し                                                       |
| 品質         | このリポジトリの CI・docs の build と Dependabot alerts の件数。公開する package の利用者の環境には lockfile が入らない |
| 関係者       | DEV（対応）、利用者（GitHub の設定と PR の merge）                                                                      |

## 4. 対応方針

| 項目     | 内容                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 依存の更新を定期に回す仕組みが無く、lockfile が古い版のまま残っていた。PJR-P318 の関門はルートの配る依存だけに掛けている |
| 対応策   | docs-site は lockfile の範囲の中で `npm audit fix` を流す。直す版が無いものと他の package は 0.9.1 で扱う                |
| 依存事項 | vite・vitepress・esbuild は vitepress 1.x が古い vite に依存しており、上流の対応が要る                                   |
| 完了条件 | docs-site の配る依存に直せる high が無い。残りの件を 0.9.1 で直すか、直せない理由と追跡先を記録する                      |

## 5. 対応結果

### 5.1. docs-site（0.9.0 の前、2026-11-20）

- `feature/prj-0001/docs-site-audit-fix` で `packages/docs-site/package-lock.json` に `npm audit fix` を流し、develop へ取り込んだ（bcca5023f、e43095b63）。`package.json` は変えていない。
- 主な更新: mermaid 12.0.0→12.3.0、lodash-es 4.17.23→4.18.1、puppeteer 25.12.0→25.18.1、zod 3.25.76→4.6.7、chevrotain 11.1.2→13.2.0。ほかに dompurify・katex・source-map-js・chromium-bidi などを上げた。
- 配る依存の `npm audit --omit=dev`: high 11・moderate 5・low 3 から high 1・moderate 5 になった。残りは vite（high）と esbuild・vitepress・vitepress-sidebar・glob・minimatch（moderate）で、どれも今の版の範囲で直す版が無い。glob・minimatch は vitepress-sidebar を 1.25.4 へ下げる（major の変更）案しか示されない。
- 確認: `npm run docs:build` と `npm run check`（265 ファイル、4,441 テスト）が通った。
- 公開する package に lockfile は入らないため、利用者が入れる版は今回の更新と同じになる。2026-11-19 の空のリポジトリでの確認でも mermaid 12.3.0・zod 4.6.7・lodash-es 4.18.1・puppeteer 25.18.1 が入り、docs-site の build が通っていた。

### 5.2. 残りの件（0.9.1 で扱う）

- vscode-specdojo の開発用の依存（high 10・moderate 4）。
- docs-lint の配る依存（moderate 9・low 3）。
- ルートの開発用の依存（moderate 17・low 3）。
- docs-site の vite・vitepress・esbuild。vitepress の次の major（vite の新しい版に依存する版）へ移すかを判断する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-p318-security-automation]]: 依存の更新と脆弱性・コードの検査の仕組み（派生元）
- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]]: 「依存とコードのセキュリティ検査」
