---
specdojo:
  id: prj-0001:pjr-h988-plan-finding-anchor-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-27T14:12:30Z"
  derived_from:
    - PJR-EVAE
---

# PJR-H988 plan が grade の finding の anchor を Markdown のまま書き出す

## 1. 課題内容

src/exec/plans-core.ts と src/exec/plans-storage.ts は finding の anchor を引用符で囲んで plan に書く。対象の行に Markdown リンクがあると plan が validate:history-links に落ち、npm run check が失敗する。anchor（と message）をインラインコードなどで無害化して書き出す。

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
