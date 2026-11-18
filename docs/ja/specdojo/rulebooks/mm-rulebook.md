---
specdojo:
  id: specdojo:mm-rulebook
  type: rulebook
  deliverable_type: project
  status: draft
  recipe: not-needed
  sample: specdojo:mm-sample
  template: not-needed
---

# 議事録 作成ルール

Meeting Minutes Documentation Rulebook

## 1. 全体方針

- 会議の決定事項とアクションを追跡可能に記録する。
- 誰が、何を、いつまでに行うかを明確化する。
- 議論要旨よりも決定と宿題を優先して残す。
- 共通の運用: Frontmatter の項目（`specdojo.type` は `project`）、`status` の昇格と承認、改訂と廃止は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。

## 2. 位置づけ

- 議事録は会議の公式記録として扱う。
- 進捗報告や課題ログと相互参照する。

## 3. ファイル命名・ID規則

- 推奨: `mm-<yyyy-mm-dd>-<nn>.md`
- 日付はISO形式、連番は2桁ゼロ埋めを推奨する。
- 文書 ID は `<project-id>:mm-<yyyy-mm-dd>-<nn>` 形式とする（例: `prj-0001:mm-2026-03-01-01`）。

## 4. 本文構成（標準テンプレ）

| 番号 | 見出し             | 必須 |
| ---- | ------------------ | ---- |
| 1    | 会議情報           | ○    |
| 2    | 議題               | ○    |
| 3    | 決定事項           | ○    |
| 4    | アクションアイテム | ○    |

## 5. 記述ガイド

- 決定事項には決定者を明記する。
- アクションには担当者と期限を必ず付与する。
- 保留事項は次回確認日を記載する。

## 6. 禁止事項

- 結論不明の議論のみを羅列しない。
- 担当者未記載のアクションを残さない。
- 実装詳細を議事録本文へ過度に記載しない。
