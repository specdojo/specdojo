---
id: _PROJECT_ID_:pm-quality-management-plan
type: project
status: ready
rulebook: pm-quality-management-plan-rulebook
based_on:
  - _PROJECT_ID_:pm-plan
supersedes: []
---

# 品質管理計画

_TODO_: 対象プロジェクトにおける品質目標、レビュー方針、品質メトリクス、検査基準、是正プロセスを、PM が計画・進捗・課題・リスク管理へ接続できる粒度で定義する一文を記述する。

## 1. 概要

_TODO_: 計画の目的、適用範囲、上位計画、PM / QE / PO の責務境界、Role code の正本、AI Agent の支援範囲を記述する。

## 2. 品質目標

| 項目   | 目標値 | 期限 / タイミング | 判定方法 | 責任ロール |
| ------ | ------ | ----------------- | -------- | ---------- |
| _TODO_ | _TODO_ | _TODO_            | _TODO_   | _TODO_     |
| _TODO_ | _TODO_ | _TODO_            | _TODO_   | _TODO_     |
| _TODO_ | _TODO_ | _TODO_            | _TODO_   | _TODO_     |

## 3. レビュープロセス

### 3.1. レビュー種別

| 種別           | 主な対象 | 実施ロール | 頻度 / タイミング | 出口条件 |
| -------------- | -------- | ---------- | ----------------- | -------- |
| 構造レビュー   | _TODO_   | _TODO_     | _TODO_            | _TODO_   |
| 内容レビュー   | _TODO_   | _TODO_     | _TODO_            | _TODO_   |
| 整合性レビュー | _TODO_   | _TODO_     | _TODO_            | _TODO_   |
| 公開前レビュー | _TODO_   | _TODO_     | _TODO_            | _TODO_   |

### 3.2. レビュー手順

1. _TODO_: レビュー対象、根拠文書、関連文書、検証方法を確認する。
2. _TODO_: rulebook、sample、成果物カタログ、RACI、Schedule との整合を確認する。
3. _TODO_: 指摘事項の記録先、重大度、対応 Role code を明確にする。
4. _TODO_: 是正後の再判定者と PO 判断へ上げる条件を記述する。

## 4. 品質メトリクス

| 指標               | 算出方法 | 閾値   | 計測頻度 | 報告先 |
| ------------------ | -------- | ------ | -------- | ------ |
| Markdown lint 結果 | _TODO_   | _TODO_ | _TODO_   | _TODO_ |
| schema 検証        | _TODO_   | _TODO_ | _TODO_   | _TODO_ |
| docs build 検証    | _TODO_   | _TODO_ | _TODO_   | _TODO_ |
| 重大レビュー指摘残 | _TODO_   | _TODO_ | _TODO_   | _TODO_ |
| 関連リンク不整合   | _TODO_   | _TODO_ | _TODO_   | _TODO_ |

## 5. 検査基準と是正

### 5.1. 検査基準

| 観点    | 受入基準 |
| ------- | -------- |
| 構造    | _TODO_   |
| 内容    | _TODO_   |
| 整合    | _TODO_   |
| 追跡    | _TODO_   |
| 公開    | _TODO_   |
| AI 利用 | _TODO_   |

### 5.2. 是正プロセス

| 不適合区分 | 例     | 是正方法 | 再判定 |
| ---------- | ------ | -------- | ------ |
| 軽微       | _TODO_ | _TODO_   | _TODO_ |
| 構造不適合 | _TODO_ | _TODO_   | _TODO_ |
| 内容不整合 | _TODO_ | _TODO_   | _TODO_ |
| 公開不適合 | _TODO_ | _TODO_   | _TODO_ |
| 重大       | _TODO_ | _TODO_   | _TODO_ |

### 5.3. 生成物の扱い

- _TODO_: `generated` 配下の成果物と正本の関係を記述する。
- _TODO_: 正本と生成物が矛盾した場合の修正順序を記述する。
- _TODO_: 生成物を手修正した場合の扱いを記述する。
- _TODO_: Schedule、PJR、公開判断へ影響する場合の記録先を記述する。

## 6. 品質上の役割分担

| Role code     | 品質管理上の責務 |
| ------------- | ---------------- |
| `_ROLE_CODE_` | _TODO_           |
| `_ROLE_CODE_` | _TODO_           |
| `_ROLE_CODE_` | _TODO_           |

## 7. 関連ドキュメント

_TODO_: 上位計画、正本、委譲先、管理台帳、生成ビューへの導線を置く。存在する文書は `[[id|title]]`、未作成の文書はバッククォートで記述する。

| ドキュメント | 役割   |
| ------------ | ------ |
| _TODO_       | _TODO_ |
| _TODO_       | _TODO_ |
| _TODO_       | _TODO_ |

## 8. 見直し条件

| 更新トリガー | 見直し内容 | 責任ロール |
| ------------ | ---------- | ---------- |
| _TODO_       | _TODO_     | _TODO_     |
| _TODO_       | _TODO_     | _TODO_     |
| _TODO_       | _TODO_     | _TODO_     |

## 9. 未決事項

| 論点   | 現状   | 対応方針 | 判断者 |
| ------ | ------ | -------- | ------ |
| _TODO_ | _TODO_ | _TODO_   | _TODO_ |
| _TODO_ | _TODO_ | _TODO_   | _TODO_ |
