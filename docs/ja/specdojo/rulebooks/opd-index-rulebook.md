---
specdojo:
  id: specdojo:opd-index-rulebook
  type: rulebook
  deliverable_type: operations
  status: draft
  target_format: markdown
  recipe: not-needed
  sample: specdojo:opd-index-sample
  template: not-needed
---

# 運用方針・設計 全体構成 作成ルール

Operations Policy and Design Index Documentation Rules

恒常運用の方針・統制の正本となる `opd-index` の記述基準を定める。

## 1. 全体方針

- SLO/SLA/KPI、責任分界、変更管理、復旧方針を判定可能にする。
- 本文構成と記述ガイドで骨組み・記入基準が定まるため、別の recipe・template は不要とする。
- **共通の運用**: 役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。整形・lint はリポジトリの検証で扱う。

## 2. 位置づけと用語定義

`opd-index` を入口・方針の正本とし、`opd-<term>` は差分（補足・具体化・例外）、`opr-*` は実行手順と証跡を担う。

## 3. ファイル命名・ID規則

- ID は `opd-index`、分冊は `opd-<term>`（kebab-case）とする。
- ファイル名は ID と同名の `.md` を推奨する。
- 配置は [[specdojo:docs-structure-guide|ドキュメント構成ガイド]] の `docs/ja/product/090-operations/` を推奨する。

## 4. 推奨 Frontmatter 項目

共通項目・必須性・型はドキュメントメタ情報標準と `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` に従う。`specdojo.type` は `operations`、`specdojo.rulebook` は `specdojo:opd-index-rulebook` とする。

## 5. 本文構成（標準テンプレ）

| 章  | 内容                                               | 必須 |
| --- | -------------------------------------------------- | ---- |
| 1   | 概要（index）                                      | ○    |
| 2   | 運用の範囲・前提                                   | ○    |
| 3   | SLO・SLA・KPI                                      | ○    |
| 4   | 体制・責任分界（RACI・当番・エスカレーション）     | ○    |
| 5   | 監視・アラート方針（指標・閾値・通知先・初動）     | ○    |
| 6   | 障害対応方針（優先度・停止判断・周知）             | ○    |
| 7   | 変更管理（リリース・設定変更・承認・ロールバック） | ○    |
| 8   | バックアップ・リストア方針（RTO/RPO）              | ○    |
| 9   | 権限・アカウント運用（棚卸し・監査ログ）           | ○    |
| 10  | 定期運用方針（バッチ・点検）                       | ○    |
| 11  | 問い合わせ運用方針（窓口・分類・SLA）              | ○    |
| 12  | 関連ドキュメント導線（`opr-index` 等）             | ○    |

## 6. 記述ガイド

- SLO/SLA/KPI の標準列は「指標・数値目標・測定期間・測定方法・証跡・判定者」とする。
- 体制は RACI・当番・優先度別エスカレーション条件、監視・障害・変更管理は条件・判断者・通知先を示す。
- 復旧は RTO/RPO・検証頻度、関連導線は `opr-index` を含める。

## 7. 禁止事項

- コマンド列・逐次チェックリストを大量記載しない。
- SLO/SLA/KPI を曖昧語だけで定義しない。
- 責任分界・エスカレーション条件を未定義のまま確定せず、変更承認・ロールバック条件を省略しない。
