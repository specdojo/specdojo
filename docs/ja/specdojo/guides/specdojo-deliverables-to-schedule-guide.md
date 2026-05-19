---
id: specdojo-deliverables-to-schedule-guide
type: guide
status: draft
---

# 成果物カタログからスケジュールへの展開ガイド

SpecDojo Deliverables Catalog to Schedule Guide

SpecDojo における成果物カタログからスケジュールへの展開ルールとガイドラインを定義します。成果物カタログで定義した管理対象成果物を、Schedule 定義で実行計画に落とし込む一連の流れを示します。

各層の詳細なルールは、それぞれの rulebook を参照してください。

- 成果物カタログ: [dct-rulebook](../rulebooks/dct-rulebook.md)
- Schedule: [sch-rulebook](../rulebooks/sch-rulebook.md)

## 1. 基本方針

- **成果物カタログ** は「**何を管理対象とするか**・**どこに作成し何を満たせば完了か**」
- **Schedule** は「**いつ・誰が・どの順で作業するか**」

を扱います。

## 2. 責務の違い

| 観点               | 成果物カタログ                             | Schedule               |
| ------------------ | ------------------------------------------ | ---------------------- |
| 主目的             | 成果物の論理定義と完了単位の定義           | 実行計画               |
| 問い               | 何がどこに完成すればよいか                 | いつ誰が何をするか     |
| 単位               | 成果物                                     | 実行タスク             |
| 成果物ID           | 定義する                                   | 参照する               |
| 配置先・成果物パス | `kind: work` の `path` で持つ              | 原則持たない           |
| 完了条件           | `kind: work` の `done_criteria` で持つ     | 原則持たない           |
| action             | 持たない                                   | 持つ                   |
| 日付               | 持たない                                   | 持つ                   |
| 担当者             | 原則持たない                               | 持つ                   |
| 依存関係           | 成果物間の根拠程度                         | 実行順序の依存         |
| status             | カタログ定義文書の状態として持つ           | タスクの実行状態を持つ |

## 3. 定義の流れ

成果物カタログから Schedule への定義の流れは次の通りです。

```mermaid
flowchart LR
    START(( )) -->|管理対象成果物・path・<br/>done_criteriaを定義| A["成果物カタログ"]
    A -->|成果物IDを参照し<br/>action・日付・担当を付与| C["Schedule"]
    C --> END(( ))
```
