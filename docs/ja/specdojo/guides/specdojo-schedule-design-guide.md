---
id: specdojo-schedule-design-guide
type: guide
status: draft
---

# SpecDojo スケジュール設計ガイド

本ドキュメントは SpecDojo における **Schedule（実行計画）の設計原則**を定義する。

Scheduleは

```text
WHEN（いつ）
IN WHAT ORDER（順序）
```

を定義する。

## 1. Scheduleの役割

Scheduleは次を定義する。

| 項目       | 内容           |
| ---------- | -------------- |
| duration   | 作業時間       |
| dependency | 実行順序       |
| milestone  | ゲート         |
| ready      | 実行可能タスク |

Scheduleは **成果物カタログ（dct）を参照する**。

## 2. Task粒度（AI向け）

SpecDojoでは **AI Agent 実行粒度**を採用する。

推奨

| 指標          | 推奨        |
| ------------- | ----------- |
| 作業時間      | 10分〜2時間 |
| duration_days | 0.125〜1    |
| 変更ファイル  | 1〜5        |
| コード量      | 10〜200行   |

## 3. Atomic Execution

Taskは **1回の実行で完了可能**とする。

AI実行

```text
claim
↓
work
↓
complete
```

## 4. Task構造

例

```yaml
tasks:
  - id: T-AUTH-API-010

    name: create login endpoint
    duration_days: 0.25
    depends_on:
      - T-AUTH-DATA-010
    owner: EN
```

## 5. Dependency設計

依存関係は最小化する。

理由

- 並列実行
- ready数増加

例

良い

```text
migration → repository → api
```

悪い

```text
migration → repository → api → test → docs → release
```

## 6. Readyタスク数

理想

```text
5〜20
```

理由

- Agent並列
- CPU効率

## 7. Schedule階層

SpecDojoでは3レベルを使う。

```text
milestones
domain
container
```

## 8. Milestones

例

```text
MVP Release
Production Release
```

## 9. Domain Schedule

例

```text
auth
payment
infra
```

## 10. Container Schedule

より詳細な作業。

例

```text
auth-api
auth-db
auth-ui
```

## 11. Anti-pattern

巨大タスク

```text
implement authentication
```

依存過多

```text
task → task → task → task
```

0日タスク

```text
duration_days = 0
```

## 12. CPM

Scheduleから

```text
ES
EF
LS
LF
Slack
```

を計算する。

## 13. AI実行モデル

AIは次の手順で動く。

```text
read ready.md
↓
claim task
↓
implement deliverables
↓
run tests
↓
complete
```

## 14. まとめ

SpecDojo Scheduleは

```text
Small
Parallel
Executable
CPM-compatible
```

である。

Scheduleは

```text
WHEN / ORDER
```

を定義する。
