---
id: prj-0001-prj-organization
type: project
status: draft
rulebook: prj-organization-rulebook
---

# 組織

本書は、SpecDojo Handbook プロジェクトの推進体制、主要ロール、意思決定構造、エスカレーション経路を定義する。

## 2. 組織体制

| ラベル | 正式名称         | 役割               | 主な責任                                                         |
| ------ | ---------------- | ------------------ | ---------------------------------------------------------------- |
| `PO`   | Project Owner    | 方針決定・推進管理 | 目的・スコープ・優先度の最終判断、計画、進捗、課題、リスクの管理 |
| `BA`   | Business Analyst | 要件・業務整理     | 業務仕様、受入条件、ステークホルダー調整                         |
| `ARC`  | Architect        | 技術設計           | システム設計、構成方針、技術判断                                 |
| `QE`   | Quality Engineer | 品質管理           | レビュー方針、品質基準、検証観点の定義                           |

## 3. 意思決定構造

| 判断対象                   | 決定者           | 相談先           | 記録先                     |
| -------------------------- | ---------------- | ---------------- | -------------------------- |
| プロジェクト目的・スコープ | Project Owner    | Business Analyst | prj-charter / prj-scope    |
| 管理方針                   | Project Owner    | Business Analyst | pm-plan                    |
| 技術方針                   | Architect        | Project Manager  | decision log               |
| 品質方針                   | Quality Engineer | Project Manager  | pm-quality-management-plan |
