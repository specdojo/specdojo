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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
