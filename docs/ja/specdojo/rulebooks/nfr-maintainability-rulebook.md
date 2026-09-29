---
specdojo:
  id: specdojo:nfr-maintainability-rulebook
  type: rulebook
  status: draft
  recipe: undecided
  sample: specdojo:nfr-maintainability-sample
  template: undecided
---

# 非機能要件 / 保守性 作成ルール

Non-Functional Requirements Maintainability Documentation Rules

本ドキュメントは、非機能要件のうち保守性（変更容易性・障害解析容易性）を定義する `nfr-maintainability` の作成ルールを定義する。
保守性要件は、修正・調査・復旧を継続的に行える運用品質を定量化する。

## 1. 全体方針

- 保守性は変更コストと復旧コストを下げる要求として定義する。
- MTTR、変更リードタイム、診断可能性などの指標を用いる。
- 実装方法ではなく、達成すべき運用可能性を記述する。

## 2. 位置づけと用語定義（必要に応じて）

### 2.1. 位置づけ

- `nfr-maintainability`：保守性要求の正本
- `nfr-index`：NFR全体の入口
- `opd-*` / `opr-*`：運用と変更手順
- `sac-*`：受入時の判定基準

### 2.2. 用語定義

| 用語             | 定義                                     |
| ---------------- | ---------------------------------------- |
| 保守性           | 修正・改修・障害対応を効率よく行える性質 |
| MTTR             | 平均復旧時間                             |
| 変更リードタイム | 要求受領から本番反映までの時間           |

## 3. ファイル命名・ID規則

- ルールドキュメントIDは `specdojo:nfr-maintainability-rulebook`。
- 生成対象ドキュメントIDは `nfr-maintainability` を推奨する。
- 要件IDは `nfr-mnt-<連番>` を推奨する。

## 4. 推奨 Frontmatter 項目

### 4.1. 設定内容

Frontmatter は共通スキーマに従います（参照: [docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml) / [document-metadata-standard.md](../standards/document-metadata-standard.md)）。

| 項目    | 説明                                | 必須 |
| ------- | ----------------------------------- | ---- |
| id      | `nfr-maintainability`               | ○    |
| type    | `architecture` など共通スキーマ準拠 | ○    |
| title   | 非機能要件: 保守性                  | ○    |
| status  | `draft` / `ready` / `deprecated`    | ○    |
| part_of | `nfr-index`                         | 任意 |

### 4.2. 推奨ルール

- 調査ログ、監視、Runbook の整備水準を `based_on` と整合させる。

## 5. 本文構成（標準テンプレ）

`nfr-maintainability` は以下の見出し構成を **順序固定** で配置する。

| 番号 | 見出し               | 必須 |
| ---- | -------------------- | ---- |
| 1    | 概要（対象・目的）   | ○    |
| 2    | 適用範囲・前提条件   | ○    |
| 3    | 保守性要件一覧       | ○    |
| 4    | 測定・検証方法       | ○    |
| 5    | 関連ドキュメント導線 | ○    |

## 6. 記述ガイド

### 6.1. 概要（対象・目的）

生成する本文の見出しは **## 1. 概要（対象・目的）**

- どの変更・障害対応の効率を担保するかを示す。

### 6.2. 適用範囲・前提条件

生成する本文の見出しは **## 2. 適用範囲・前提条件**

- 対象システム、対象運用時間、チーム体制前提を記述する。

### 6.3. 保守性要件一覧

生成する本文の見出しは **## 3. 保守性要件一覧**

- 表形式（`id` / `内容` / `指標` / `基準` / `備考`）で記述する。
- 指標例：MTTR、変更リードタイム、一次切り分け時間。

### 6.4. 測定・検証方法

生成する本文の見出しは **## 4. 測定・検証方法**

- 監視記録、障害レポート、改善サイクルで測定する。

### 6.5. 関連ドキュメント導線

生成する本文の見出しは **## 5. 関連ドキュメント導線**

- `opd-*`、`opr-*`、`dec-*` への導線を必ず置く。

## 7. 禁止事項

| 禁止事項                             | 理由                 |
| ------------------------------------ | -------------------- |
| 「保守しやすい」だけで閾値を示さない | 判定不能のため       |
| 体制依存の一時運用を恒久要件化する   | 再現性がないため     |
| 測定データの取得方法を書かない       | 継続評価できないため |
