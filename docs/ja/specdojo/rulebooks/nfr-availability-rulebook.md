---
specdojo:
  id: specdojo:nfr-availability-rulebook
  type: rulebook
  status: draft
  recipe: undecided
  sample: specdojo:nfr-availability-sample
  template: undecided
---

# 非機能要件 / 可用性 作成ルール

Non-Functional Requirements Availability Documentation Rules

本ドキュメントは、非機能要件のうち可用性（利用可能性・停止許容・復旧目標）を定義する `nfr-availability` の作成ルールを定義する。
可用性要件は、業務継続に必要な稼働率と復旧目標を定量で記述する。

## 1. 全体方針

- 可用性は稼働率、許容停止時間、RTO/RPO で定義する。
- 対象時間帯と除外条件（計画メンテ等）を必ず明記する。
- 監視・復旧判断と結びつく形で要件化する。

## 2. 位置づけと用語定義（必要に応じて）

### 2.1. 位置づけ

- `nfr-availability`：可用性要求の正本
- `nfr-index`：NFR全体の入口
- `sac-*` / `stc-*`：可用性要件の検証先
- `opd-*` / `opr-*`：障害対応・復旧手順

### 2.2. 用語定義

| 用語   | 定義                                   |
| ------ | -------------------------------------- |
| 稼働率 | 対象時間内でサービス提供可能だった割合 |
| RTO    | 目標復旧時間                           |
| RPO    | 目標復旧時点                           |

## 3. ファイル命名・ID規則

- ルールドキュメントIDは `specdojo:nfr-availability-rulebook`。
- 生成対象ドキュメントIDは `nfr-availability` を推奨する。
- 要件IDは `nfr-avl-<連番>` を推奨する。

## 4. 推奨 Frontmatter 項目

### 4.1. 設定内容

Frontmatter は共通スキーマに従います（参照: [docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml](../../../specdojo/schemas/v1/deliverable-frontmatter.schema.yaml) / [document-metadata-standard.md](../standards/document-metadata-standard.md)）。

| 項目    | 説明                                | 必須 |
| ------- | ----------------------------------- | ---- |
| id      | `nfr-availability`                  | ○    |
| type    | `architecture` など共通スキーマ準拠 | ○    |
| title   | 非機能要件: 可用性                  | ○    |
| status  | `draft` / `ready` / `deprecated`    | ○    |
| part_of | `nfr-index`                         | 任意 |

### 4.2. 推奨ルール

- 重要業務時間帯（営業時間、締め時刻）を `based_on` と本文で整合させる。

## 5. 本文構成（標準テンプレ）

`nfr-availability` は以下の見出し構成を **順序固定** で配置する。

| 番号 | 見出し               | 必須 |
| ---- | -------------------- | ---- |
| 1    | 概要（対象・目的）   | ○    |
| 2    | 適用範囲・除外条件   | ○    |
| 3    | 可用性要件一覧       | ○    |
| 4    | 測定・検証方法       | ○    |
| 5    | 関連ドキュメント導線 | ○    |

## 6. 記述ガイド

### 6.1. 概要（対象・目的）

生成する本文の見出しは **## 1. 概要（対象・目的）**

- 可用性管理の目的と対象業務を記述する。

### 6.2. 適用範囲・除外条件

生成する本文の見出しは **## 2. 適用範囲・除外条件**

- 対象時間帯、計画停止、外部依存停止時の扱いを明記する。

### 6.3. 可用性要件一覧

生成する本文の見出しは **## 3. 可用性要件一覧**

- 表形式（`id` / `内容` / `指標` / `基準` / `備考`）で記述する。
- 指標例：月間稼働率、RTO、RPO。

### 6.4. 測定・検証方法

生成する本文の見出しは **## 4. 測定・検証方法**

- 監視値、障害訓練、復旧試験の判定方法を定義する。

### 6.5. 関連ドキュメント導線

生成する本文の見出しは **## 5. 関連ドキュメント導線**

- `opd-*`、`opr-*`、`sac-*`、`dec-*` を紐づける。

## 7. 禁止事項

| 禁止事項                       | 理由                   |
| ------------------------------ | ---------------------- |
| 稼働率の対象時間を示さない     | 指標比較ができないため |
| RTO/RPOを定義しない            | 復旧判断ができないため |
| 「可能な限り復旧」など曖昧表現 | 検証不能のため         |
