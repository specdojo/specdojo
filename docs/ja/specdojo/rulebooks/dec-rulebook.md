---
specdojo:
  id: specdojo:dec-rulebook
  type: rulebook
  deliverable_type: project
  status: draft
  target_format: markdown
  sample: specdojo:dec-sample
---

# 決定記録 作成ルール

Decision Log Documentation Rulebook

本ドキュメントは、決定記録（`dec-<NNNN>-<topic>`）を統一形式で記述するためのルールを定義する。

## 1. 全体方針

- 重要な判断の背景、選択肢、採択理由を追跡可能に残す。
- 決定後の影響範囲とフォローアップを明示する。
- **共通の運用**: 役割はメンバー定義に、`status`・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。

## 2. 位置づけ

- 決定記録はプロジェクト運営・設計判断の証跡であり、課題ログ、変更要求ログと相互参照する。

## 3. ファイル命名・ID規則

- ファイル名は `dec-<NNNN>-<topic>.md` とし、連番は4桁ゼロ埋めとする（例: `dec-0001-auth`）。
- 文書 ID は `<project-id>:dec-<NNNN>-<topic>` 形式とする（例: `prj-0001:dec-0001-auth`）。

## 4. 推奨 Frontmatter 項目

`specdojo.id` は `<project-id>:dec-<NNNN>-<topic>`、`specdojo.type` は `project` とし、その他の項目は共通の運用に従う。

## 5. 本文構成（標準テンプレ）

| 番号 | 見出し         | 必須 |
| ---- | -------------- | ---- |
| 1    | 背景           | ○    |
| 2    | 検討した選択肢 | ○    |
| 3    | 決定内容       | ○    |
| 4    | 採択理由       | ○    |
| 5    | 影響範囲       | ○    |

## 6. 記述ガイド

- 選択肢は少なくとも2案以上を記載する。
- 採択理由は判断軸とともに記載する。
- 影響範囲は仕様・実装・運用の観点で示す。

## 7. 禁止事項

- 根拠なしで結論のみを記載しない。
- 実装断片の貼り付けで説明を代替しない。
