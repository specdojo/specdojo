---
specdojo:
  id: specdojo:pr-rulebook
  type: rulebook
  deliverable_type: project
  status: draft
  recipe: not-needed
  sample: specdojo:pr-sample
  template: not-needed
---

# 進捗報告 作成ルール

Progress Report Documentation Rulebook

## 1. 全体方針

- 報告期間の進捗、リスク、次アクションを定点観測できる形で記録する。
- 完了事項と未完了事項を区別して報告する。
- 判断に必要な数値・根拠を明示する。
- 共通の運用: Frontmatter の項目（`specdojo.type` は `project`）、`status` の昇格と承認、改訂と廃止は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。

## 2. 位置づけ

- 進捗報告は定期レビューの基礎資料として扱う。
- 議事録、課題ログ、変更要求ログと整合を取る。

## 3. ファイル命名・ID規則

- 推奨: `pr-<yyyy-mm-dd>-<nn>.md`
- 日付はISO形式、連番は2桁ゼロ埋めを推奨する。
- 文書 ID は `<project-id>:pr-<yyyy-mm-dd>-<nn>` 形式とする（例: `prj-0001:pr-2026-03-01-01`）。

## 4. 本文構成（標準テンプレ）

| 番号 | 見出し       | 必須 |
| ---- | ------------ | ---- |
| 1    | 報告期間     | ○    |
| 2    | 完了事項     | ○    |
| 3    | 進行中事項   | ○    |
| 4    | リスク・課題 | ○    |
| 5    | 次期予定     | ○    |

## 5. 記述ガイド

- 完了事項は成果物IDまたはタスクIDと紐づける。
- リスク・課題は影響度と対応方針を明記する。
- 次期予定は担当者と期日を設定する。

## 6. 禁止事項

- 進捗率のみで根拠なく報告しない。
- リスクを抽象語のみで記載しない。
- 予定に期限や責任者を欠いたまま確定しない。
