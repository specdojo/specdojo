---
specdojo:
  id: prj-0001:pjr-v05d-grade-yaml-deliverables
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-09T20:47:31Z"
  derived_from:
    - PJR-2GD6
---

# PJR-V05D YAML の成果物は grade の対象にならず、review の段が grade を流せないまま止まる

## 1. 課題内容

grade は Markdown の frontmatter を前提とし、YAML の成果物（bdd・ifx-cmd など）は Markdown frontmatter is required で評価できない。review の段は grade の結果を前提にするため、YAML の成果物の review が grade-unavailable から進まない。YAML の成果物を評価する方法を決めて解消する

## 2. 入力

- 2026-11-09、business-specs-reps の review の段で、bdd-register-entry.yaml と ifx-cmd-ai-provider-cli.yaml の review が grade-unavailable になった。runner の grade は「Markdown frontmatter is required」で流れなかった。
- 当面は、この 2 件の review を grade を使わない形で人が確定のときに確かめる（indie が推奨どおりと決定）。

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
