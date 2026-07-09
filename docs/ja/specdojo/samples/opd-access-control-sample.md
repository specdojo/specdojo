---
specdojo:
  id: opd-access-control-sample
  type: operations
  status: draft
  rulebook: opd-rulebook
  based_on: []
  supersedes: []
---

# 運用方針・設計: 権限・アカウント サンプル

- 参照: `../rulebooks/opd-rulebook.md`

## 1. 概要（access-control）

権限付与/剥奪、棚卸し、監査ログ、緊急権限を `opd-index` の差分として定義する。

## 2. 権限・アカウント運用（棚卸し・監査ログ）

- 付与/剥奪はチケット起票を必須とし、承認者はOps Leadとする
- 棚卸しは月次で実施し、結果は監査ログ保管領域に保存する
- ブレークグラスは2名承認 + 24時間で自動失効（原則）

## 3. 関連ドキュメント導線（`opr` 等）

| 種別 | ドキュメントID     | 目的                           | 備考 |
| ---- | ------------------ | ------------------------------ | ---- |
| 手順 | opr-access-control | アカウント付与/剥奪/棚卸し手順 | 必須 |
