---
specdojo:
  id: prj-0001:pjr-svkr-check-release-docs-site-typecheck
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-28T12:46:43Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-VDHC
---

# PJR-SVKR docs-site の型検査が check:release に入っておらず、公開の workflow で初めて止まる

## 1. 課題内容

packages/docs-site の typecheck（tsc -p .vitepress/tsconfig.json）が npm run check と check:release に入っていないため、docs-site-v0.7.0 の公開の workflow の型検査で初めて誤りが見つかった。リリースの前の検査で止まるようにする

## 2. 入力

- 2026-11-28 の docs-site-v0.7.0 の公開の workflow（run 46143988577）が、.vitepress/config.mts(1003,5) の TS2353（specdojoChannel が Config の型にない）で止まった。手元の check:release・docs:build は通っていた
- 公開は版を 0.7.1 に上げて出し直す（indie の決定、2026-11-28）。型の誤りそのものは feature/prj-0001/docs-site-theme-type で直した
- 担当 DEV・期限 2026-12-31 は indie の指示（2026-11-28）

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
