---
specdojo:
  id: prj-0001:pjr-g1w9-plan-conventions-markdown-link
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-07T01:16:56Z"
  derived_from:
    - PJR-BVS9
---

# PJR-G1W9 新しい配置の plan が規約の版へ Markdown リンクで参照し、履歴リンクの規則に反する

## 1. 課題内容

BVS9 の後の plan.md が共通規約の版を相対パスの Markdown リンクで参照する。履歴蓄積ファイルでは Markdown リンクを書かない規則があり、validate:history-links は新しい配置を検査していない

## 2. 入力

- PJR-JSEY の run（execution/runs/register/PJR-JSEY/pjr-jsey-20261107T010718Z-d209433b/plan.md）の 61 行目に、[共通規約 sha256:…](../../../../conventions/`<hash>.txt`) の形の相対リンクがある（2026-11-07 orchestrator の確認）
- 規則: .github/instructions/markdown.instructions.md の「履歴蓄積ファイルのリンク記法」は、plan・result・個票でリンク先のファイル名の変更に追従が要る Markdown リンクを書かないとする。対象の glob は exec/plans・exec/results で、新しい配置（`execution/runs/**/plan.md`・result.md）は入っていない。validate:history-links（packages/docs-lint/src/validate-history-links.ts）も古い配置だけを見ている（2026-11-07）
- 関連: PJR-JT5J（置き場所の検査）と PJR-9BY9（既存の記録の移動）。移動すると相対リンクの深さが変わる（2026-11-07）

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
